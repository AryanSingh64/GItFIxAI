from fastapi import FastAPI, HTTPException, WebSocket, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import time
import shutil
import asyncio
import json
import httpx
from agent.scanner import scan_repository
from agent.fixer import fix_issue
from agent.git_manager import clone_repo, create_branch, commit_changes, push_changes

load_dotenv()

app = FastAPI(title="Autonomous CI/CD Healing Agent")

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    repo_url: str
    team_name: str
    leader_name: str
    access_token: str = None


class OAuthCode(BaseModel):
    code: str


# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for conn in list(self.active_connections):
            try:
                await conn.send_text(message)
            except Exception:
                pass


manager = ConnectionManager()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        manager.disconnect(websocket)


async def send_log(message: str, type: str = "INFO"):
    log_entry = {
        "time": time.strftime("%H:%M:%S"),
        "type": type,
        "message": message
    }
    await manager.broadcast(json.dumps(log_entry))


# --- OAuth Routes ---

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

        # Get User Info
        user_resp = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}",
                     "Accept": "application/vnd.github.v3+json"}
        )
        user_data = user_resp.json()

        # Get User Repos
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

# Dedup lock to prevent double runs from React StrictMode
_running_tasks = set()

async def run_analysis_task(repo_url: str, team_name: str, leader_name: str, access_token: str = None):  # noqa
    # Prevent duplicate runs
    task_key = f"{repo_url}_{team_name}"
    if task_key in _running_tasks:
        return
    _running_tasks.add(task_key)

    try:
        await _run_analysis(repo_url, team_name, leader_name, access_token)
    finally:
        _running_tasks.discard(task_key)

async def _run_analysis(repo_url: str, team_name: str, leader_name: str, access_token: str = None):
    start_time = time.time()
    repo_name = repo_url.split("/")[-1].replace(".git", "")
    local_path = os.path.abspath(f"./temp_repos/{repo_name}")

    # 1. Cleanup — robust Windows-compatible removal
    if os.path.exists(local_path):
        try:
            # On Windows, git files can be read-only; force remove
            import subprocess as sp
            sp.run(['cmd', '/c', 'rmdir', '/s', '/q', local_path],
                   capture_output=True, timeout=15)
        except Exception:
            pass
        # Double-check
        if os.path.exists(local_path):
            try:
                shutil.rmtree(local_path, ignore_errors=True)
            except Exception:
                pass

    await send_log(f"[📦 Clone Agent] Cloning repository: {repo_url}...", "INFO")
    try:
        if "http" in repo_url:
            await asyncio.to_thread(clone_repo, repo_url, local_path, access_token)
        else:
            shutil.copytree(repo_url, local_path)
    except Exception as e:
        await send_log(f"[📦 Clone Agent] Failed to clone: {str(e)}", "ERROR")
        return

    await send_log("[📦 Clone Agent] Repository cloned successfully.", "SUCCESS")

    # 2. Create Healing Branch
    branch_name = f"{team_name.upper().replace(' ', '_')}_{leader_name.upper().replace(' ', '_')}_AI_Fix"
    try:
        await asyncio.to_thread(create_branch, local_path, branch_name)
        await send_log(f"[🌿 Branch Agent] Created healing branch: {branch_name}", "ACTION")
    except Exception as e:
        await send_log(f"[🌿 Branch Agent] Branch error: {str(e)}", "WARNING")

    # 3. Parallel Scan with Multiple Agents
    max_retries = 3
    fixes_applied = []
    remaining_issues = []

    for i in range(1, max_retries + 1):
        await send_log(f"═══════════ Scan Iteration {i}/{max_retries} ═══════════", "INFO")
        issues = await scan_repository(local_path, log_callback=send_log)

        if not issues:
            await send_log("✅ All agents report: Repository is clean!", "SUCCESS")
            await manager.broadcast(json.dumps({"type": "STATUS", "status": "PASSED"}))
            remaining_issues = []
            break

        await send_log(f"⚠️ {len(issues)} issues found. Deploying AI Fixer Agent...", "WARNING")

        fixed_count = 0
        for issue in issues:
            agent = issue.get('agent', 'Fixer')
            await send_log(
                f"[🔧 AI Fixer] {issue['type']} in {issue['file']} "
                f"L{issue['line']}: {issue['message']}", "ACTION")

            fix_result = await asyncio.to_thread(fix_issue, local_path, issue)

            if fix_result.get('status') == 'fixed':
                method = fix_result.get('method', 'heuristic')
                commit_msg = f"[AI-AGENT] Fixed {issue['type']}: {issue['message']}"
                try:
                    await asyncio.to_thread(commit_changes, local_path, commit_msg, [issue['file']])
                    await send_log(f"[✅ {agent}] Committed ({method}): {commit_msg[:80]}", "SUCCESS")
                    fixed_count += 1
                    fixes_applied.append({
                        "file": issue['file'], "type": issue['type'],
                        "line": issue['line'], "commit": commit_msg,
                        "status": "FIXED", "method": method, "agent": agent
                    })
                except Exception as e:
                    await send_log(f"[⚠️ Git Agent] Commit failed: {str(e)}", "WARNING")
            else:
                remaining_issues.append(issue)

        if fixed_count == 0:
            await send_log("No more auto-fixable issues. Finishing up.", "INFO")
            break
        await send_log(f"Fixed {fixed_count} issues in iteration {i}. Re-scanning...", "INFO")

    # 4. Push to GitHub
    if access_token and fixes_applied:
        await send_log(f"[🚀 Push Agent] Pushing '{branch_name}' to GitHub...", "ACTION")
        try:
            await asyncio.to_thread(push_changes, local_path, branch_name, access_token, repo_url)
            await send_log("[🚀 Push Agent] Successfully pushed branch to GitHub!", "SUCCESS")
        except Exception as e:
            await send_log(f"[🚀 Push Agent] Push failed: {str(e)}", "WARNING")
    elif not access_token:
        await send_log("[🚀 Push Agent] No access token — skipping push.", "WARNING")

    # 5. Duration
    elapsed = time.time() - start_time
    duration = f"{int(elapsed // 60)}m {int(elapsed % 60)}s"
    await send_log(f"Analysis Complete in {duration}.", "SUCCESS")

    # 6. Score
    total = len(fixes_applied) + len(remaining_issues)
    score = 100 if total == 0 else max(0, int((len(fixes_applied) / max(total, 1)) * 100))

    # 7. Final Report
    final_report = {
        "type": "RESULT",
        "summary": {
            "status": "PASSED" if not remaining_issues else "PARTIAL",
            "totalFailures": total,
            "fixesApplied": len(fixes_applied),
            "remainingIssues": len(remaining_issues),
            "duration": duration,
            "branchName": branch_name
        },
        "fixes": fixes_applied,
        "score": score,
    }
    await manager.broadcast(json.dumps(final_report))


@app.post("/analyze")
async def start_analysis(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(
        run_analysis_task, request.repo_url, request.team_name,
        request.leader_name, request.access_token
    )
    return {"message": "Analysis started"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
