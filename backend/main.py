from fastapi import FastAPI, HTTPException, WebSocket, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import sys
import time
import shutil
import asyncio
import json
import uuid
import httpx
from collections import defaultdict
from agent.scanner import scan_repository, detect_languages
from agent.fixer import fix_issue
from agent.git_manager import clone_repo, create_branch, commit_changes, push_changes, create_pull_request
from agent.test_runner import discover_and_run_tests
from db import save_analysis_run, save_file_fixes, get_user_runs

load_dotenv()


# ═══ ENV VALIDATION ═══
def validate_env():
    """Check required environment variables at startup."""
    required = {
        "GITHUB_CLIENT_ID": "GitHub OAuth won't work",
        "GITHUB_CLIENT_SECRET": "GitHub OAuth won't work",
    }
    optional_warn = {
        "OPENAI_API_KEY": "AI-powered fixes will be disabled (heuristic-only)",
        "GOOGLE_API_KEY": "Gemini AI fixes will be disabled",
        "SUPABASE_URL": "Database features will be disabled",
        "SUPABASE_SERVICE_KEY": "Database features will be disabled",
    }
    missing = []
    for var, desc in required.items():
        if not os.getenv(var):
            missing.append(f"  ❌ {var} — {desc}")
    for var, desc in optional_warn.items():
        if not os.getenv(var):
            print(f"  ⚠️  {var} not set — {desc}")
    if missing:
        print("\n🚨 MISSING REQUIRED ENV VARIABLES:")
        print("\n".join(missing))
        print("\nSet these in your .env file or environment. Exiting.\n")
        sys.exit(1)
    print("✅ Environment validation passed")

validate_env()


app = FastAPI(title="GitFixAI — Autonomous CI/CD Healing Agent")


# ═══ SECURITY HEADERS MIDDLEWARE ═══
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

app.add_middleware(SecurityHeadersMiddleware)


# ═══ RATE LIMITING ═══
_rate_limit_store: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_MAX = 5          # max requests
RATE_LIMIT_WINDOW = 60      # per 60 seconds

def check_rate_limit(client_ip: str) -> bool:
    """Returns True if request is allowed, False if rate limited."""
    now = time.time()
    # Clean old entries
    _rate_limit_store[client_ip] = [
        t for t in _rate_limit_store[client_ip] if now - t < RATE_LIMIT_WINDOW
    ]
    if len(_rate_limit_store[client_ip]) >= RATE_LIMIT_MAX:
        return False
    _rate_limit_store[client_ip].append(now)
    return True

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://gitfixai.vercel.app",
        "https://gitfixaiiiii.vercel.app",
        "https://gitfixaiiiii-6tgn0d19g-warlords-projects.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    repo_url: str
    session_id: str = None       # links to the WebSocket session
    team_name: str = "GitFixAI"
    leader_name: str = "Agent"
    commit_msg: str = "Fixed {issues_count} issues in {files_changed} files"
    access_token: str = None


class OAuthCode(BaseModel):
    code: str


# ═══ PER-SESSION WEBSOCKET MANAGER ═══
class ConnectionManager:
    def __init__(self):
        self.sessions: dict[str, WebSocket] = {}  # session_id -> websocket

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.sessions[session_id] = websocket
        print(f"WS connected: {session_id} (total: {len(self.sessions)})")

    def disconnect(self, session_id: str):
        self.sessions.pop(session_id, None)
        print(f"WS disconnected: {session_id} (total: {len(self.sessions)})")

    async def send_to_session(self, session_id: str, message: str):
        """Send message to a specific session only."""
        ws = self.sessions.get(session_id)
        if ws:
            try:
                await ws.send_text(message)
            except Exception:
                self.sessions.pop(session_id, None)

    async def broadcast(self, message: str):
        """Fallback: send to all (for backward compat)."""
        for sid in list(self.sessions):
            try:
                await self.sessions[sid].send_text(message)
            except Exception:
                self.sessions.pop(sid, None)


manager = ConnectionManager()


@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        manager.disconnect(session_id)


# Legacy route for backward compat
@app.websocket("/ws")
async def websocket_endpoint_legacy(websocket: WebSocket):
    fallback_id = f"legacy_{uuid.uuid4().hex[:8]}"
    await manager.connect(websocket, fallback_id)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        manager.disconnect(fallback_id)


async def send_log(message: str, type: str = "INFO", session_id: str = None):
    msg = json.dumps({
        "time": time.strftime("%H:%M:%S"), "type": type, "message": message
    })
    if session_id:
        await manager.send_to_session(session_id, msg)
    else:
        await manager.broadcast(msg)


async def send_stage(stage: str, status: str = "active", session_id: str = None):
    msg = json.dumps({
        "type": "STAGE", "stage": stage, "status": status
    })
    if session_id:
        await manager.send_to_session(session_id, msg)
    else:
        await manager.broadcast(msg)


# --- OAuth ---

@app.post("/auth/github")
async def github_auth(payload: OAuthCode):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": payload.code
            },
            headers={"Accept": "application/json"}
        )
        data = response.json()
        if "error" in data:
            raise HTTPException(status_code=400, detail=data.get("error_description", "Auth Error"))

        access_token = data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token returned")

        user_resp = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}",
                     "Accept": "application/vnd.github.v3+json"}
        )
        user_data = user_resp.json()

        repos_resp = await client.get(
            "https://api.github.com/user/repos?sort=updated&per_page=100",
            headers={"Authorization": f"Bearer {access_token}",
                     "Accept": "application/vnd.github.v3+json"}
        )
        repos = repos_resp.json()

        return {
            "access_token": access_token,
            "user": {
                "name": user_data.get("name", user_data.get("login", "GitHub User")),
                "login": user_data.get("login", ""),
                "avatar": user_data.get("avatar_url", ""),
            },
            "repos": [
                {"name": r["name"], "full_name": r["full_name"], "url": r["clone_url"],
                 "private": r["private"], "description": r["description"]}
                for r in repos if isinstance(r, dict) and "name" in r
            ]
        }


# --- Agent Logic ---

_running_tasks = set()


async def run_analysis_task(repo_url: str, team_name: str, leader_name: str, access_token: str = None, commit_msg: str = None, session_id: str = None):
    task_key = f"{repo_url}_{team_name}"
    if task_key in _running_tasks:
        return
    _running_tasks.add(task_key)
    try:
        await _run_analysis(repo_url, team_name, leader_name, access_token, commit_msg, session_id)
    finally:
        _running_tasks.discard(task_key)


async def _run_analysis(repo_url: str, team_name: str, leader_name: str, access_token: str = None, commit_msg: str = None, session_id: str = None):
    start_time = time.time()
    repo_name = repo_url.split("/")[-1].replace(".git", "")
    local_path = os.path.abspath(f"./temp_repos/{repo_name}")

    # Parse owner/repo for PR
    url_parts = repo_url.replace('.git', '').rstrip('/').split('/')
    gh_owner = url_parts[-2] if len(url_parts) >= 2 else ""
    gh_repo = url_parts[-1] if len(url_parts) >= 1 else ""

    # Helper to send to this session only
    async def log(msg, level="INFO"):
        await send_log(msg, level, session_id)

    async def stage(name, status="active"):
        await send_stage(name, status, session_id)

    async def send_json(data):
        msg = json.dumps(data)
        if session_id:
            await manager.send_to_session(session_id, msg)
        else:
            await manager.broadcast(msg)

    # ═══ STAGE 1: CLONE ═══
    await stage("CLONE", "active")

    if os.path.exists(local_path):
        try:
            import subprocess as sp
            sp.run(['cmd', '/c', 'rmdir', '/s', '/q', local_path],
                   capture_output=True, timeout=15)
        except Exception:
            pass
        if os.path.exists(local_path):
            shutil.rmtree(local_path, ignore_errors=True)

    await log(f"[📦 Clone Agent] Cloning {repo_url}...", "INFO")
    try:
        if "http" in repo_url:
            await asyncio.to_thread(clone_repo, repo_url, local_path, access_token)
        else:
            shutil.copytree(repo_url, local_path)
    except Exception as e:
        await log(f"[📦 Clone Agent] Failed: {str(e)}", "ERROR")
        await stage("CLONE", "error")
        return

    await log("[📦 Clone Agent] Repository cloned successfully.", "SUCCESS")
    await stage("CLONE", "done")

    branch_name = f"{team_name.upper().replace(' ', '_')}_{leader_name.upper().replace(' ', '_')}_AI_Fix"
    try:
        await asyncio.to_thread(create_branch, local_path, branch_name)
        await log(f"[🌿 Branch Agent] Created branch: {branch_name}", "ACTION")
    except Exception as e:
        await log(f"[🌿 Branch Agent] Branch error: {str(e)}", "WARNING")

    # ═══ STAGE 2: SCAN ═══
    await stage("SCAN", "active")

    max_retries = 3
    fixes_applied = []
    remaining_issues = []
    all_diffs = []

    for i in range(1, max_retries + 1):
        await log(f"═══════════ Scan Iteration {i}/{max_retries} ═══════════", "INFO")
        issues = await scan_repository(local_path, log_callback=send_log)

        if not issues:
            await log("✅ All agents report: Repository is clean!", "SUCCESS")
            remaining_issues = []
            break

        if i == 1:
            await stage("SCAN", "done")
            # ═══ STAGE 3: FIX ═══
            await stage("FIX", "active")

        await log(f"⚠️ {len(issues)} issues found. Deploying Fixer Agent...", "WARNING")

        fixed_count = 0
        for issue in issues:
            agent = issue.get('agent', 'Fixer')
            await log(
                f"[🔧 AI Fixer] {issue['type']} in {issue['file']} "
                f"L{issue['line']}: {issue['message']}", "ACTION")

            fix_result = await asyncio.to_thread(fix_issue, local_path, issue)

            if fix_result.get('status') == 'fixed':
                method = fix_result.get('method', 'heuristic')
                fix_commit_msg = f"[AI-AGENT] Fixed {issue['type']}: {issue['message']}"
                try:
                    await asyncio.to_thread(commit_changes, local_path, fix_commit_msg, [issue['file']])
                    await log(f"[✅ {agent}] Committed ({method}): {fix_commit_msg[:80]}", "SUCCESS")
                    fixed_count += 1

                    fix_entry = {
                        "file": issue['file'], "type": issue['type'],
                        "line": issue['line'], "commit": fix_commit_msg,
                        "status": "FIXED", "method": method, "agent": agent
                    }
                    fixes_applied.append(fix_entry)

                    # Send diff for live viewer
                    diff_data = {
                        "type": "DIFF",
                        "file": issue['file'], "line": issue['line'],
                        "before": fix_result.get('before', ''),
                        "after": fix_result.get('after', ''),
                        "message": issue['message'],
                        "method": method
                    }
                    await send_json(diff_data)
                    all_diffs.append(diff_data)

                except Exception as e:
                    await log(f"[⚠️ Git Agent] Commit failed: {str(e)}", "WARNING")
            else:
                remaining_issues.append(issue)

        if fixed_count == 0:
            await log("No more auto-fixable issues.", "INFO")
            break
        await log(f"Fixed {fixed_count} issues in iteration {i}.", "INFO")

    await stage("FIX", "done")

    # ═══ STAGE 3.5: TEST ═══
    await stage("TEST", "active")
    test_results = None
    try:
        test_results = await discover_and_run_tests(local_path, log_callback=send_log)
        if test_results.get('detected'):
            await send_json({
                "type": "TEST_RESULTS",
                "data": test_results
            })
        else:
            await log("[🧪 Test Agent] No test frameworks found.", "INFO")
    except Exception as e:
        await log(f"[🧪 Test Agent] Error: {str(e)[:100]}", "WARNING")
    await stage("TEST", "done")

    # ═══ STAGE 4: PUSH ═══
    await stage("PUSH", "active")
    pr_url = None

    if access_token and fixes_applied:
        await log(f"[🚀 Push Agent] Pushing '{branch_name}' to GitHub...", "ACTION")
        try:
            await asyncio.to_thread(push_changes, local_path, branch_name, access_token, repo_url)
            await log("[🚀 Push Agent] Branch pushed to GitHub!", "SUCCESS")

            # Create PR
            await log("[📋 PR Agent] Creating Pull Request...", "ACTION")
            pr_url = await create_pull_request(access_token, gh_owner, gh_repo, branch_name, fixes_applied)
            if pr_url:
                await log(f"[📋 PR Agent] Pull Request created!", "SUCCESS")
                await send_json({"type": "PR", "url": pr_url})
            else:
                await log("[📋 PR Agent] Could not create PR (may already exist).", "WARNING")

        except Exception as e:
            await log(f"[🚀 Push Agent] Push failed: {str(e)}", "WARNING")
    elif not access_token:
        await log("[🚀 Push Agent] No access token — local mode.", "WARNING")
    else:
        await log("[🚀 Push Agent] No fixes to push.", "INFO")

    await stage("PUSH", "done")

    # ═══ Broadcast language stats ═══
    try:
        lang_stats = await asyncio.to_thread(detect_languages, local_path)
        await send_json({
            "type": "LANG_STATS",
            "data": lang_stats
        })
    except Exception:
        pass

    # ═══ STAGE 5: DONE ═══
    elapsed = time.time() - start_time
    duration = f"{int(elapsed // 60)}m {int(elapsed % 60)}s"
    await log(f"Analysis complete in {duration}.", "SUCCESS")
    await stage("DONE", "done")

    total = len(fixes_applied) + len(remaining_issues)
    score = 100 if total == 0 else max(0, int((len(fixes_applied) / max(total, 1)) * 100))

    final_report = {
        "type": "RESULT",
        "summary": {
            "status": "PASSED" if not remaining_issues else "PARTIAL",
            "totalFailures": total,
            "fixesApplied": len(fixes_applied),
            "remainingIssues": len(remaining_issues),
            "duration": duration,
            "branchName": branch_name,
            "prUrl": pr_url
        },
        "fixes": fixes_applied,
        "score": score,
    }
    await send_json(final_report)

    # ═══ Save to Database ═══
    try:
        run_id = await save_analysis_run({
            "repo_url": repo_url,
            "team_name": team_name,
            "leader_name": leader_name,
            "branch_name": branch_name,
            "status": "PASSED" if not remaining_issues else "PARTIAL",
            "total_failures": total,
            "fixes_applied": len(fixes_applied),
            "remaining_issues": len(remaining_issues),
            "duration": duration,
            "score": score,
            "pr_url": pr_url,
        })
        if run_id:
            await save_file_fixes(run_id, fixes_applied)
            await log("[💾 DB Agent] Results saved to database.", "SUCCESS")
    except Exception as e:
        await log(f"[💾 DB Agent] DB save skipped: {str(e)}", "WARNING")


@app.post("/analyze")
async def start_analysis(request: AnalyzeRequest, req: Request, background_tasks: BackgroundTasks):
    # Rate limiting
    client_ip = req.client.host if req.client else "unknown"
    if not check_rate_limit(client_ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please wait 60 seconds before trying again.")

    # Basic URL validation
    if not request.repo_url or 'github.com' not in request.repo_url:
        raise HTTPException(status_code=400, detail="Please provide a valid GitHub repository URL")

    background_tasks.add_task(
        run_analysis_task, request.repo_url, request.team_name,
        request.leader_name, request.access_token, request.commit_msg,
        request.session_id
    )
    return {"message": "Analysis started", "session_id": request.session_id}


@app.get("/history")
async def get_history(limit: int = 20):
    """Get past analysis runs from the database."""
    runs = await get_user_runs(limit=limit)
    return {"runs": runs}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
