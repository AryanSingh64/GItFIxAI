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
from agent.git_manager import clone_repo, create_branch, commit_changes, push_changes, create_pull_request

load_dotenv()

app = FastAPI(title="Autonomous CI/CD Healing Agent")

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
                self.active_connections.remove(conn)


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
    await manager.broadcast(json.dumps({
        "time": time.strftime("%H:%M:%S"), "type": type, "message": message
    }))


async def send_stage(stage: str, status: str = "active"):
    await manager.broadcast(json.dumps({
        "type": "STAGE", "stage": stage, "status": status
    }))


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


async def run_analysis_task(repo_url: str, team_name: str, leader_name: str, access_token: str = None):
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

    # Parse owner/repo for PR
    url_parts = repo_url.replace('.git', '').rstrip('/').split('/')
    gh_owner = url_parts[-2] if len(url_parts) >= 2 else ""
    gh_repo = url_parts[-1] if len(url_parts) >= 1 else ""

    # ═══ STAGE 1: CLONE ═══
    await send_stage("CLONE", "active")

    if os.path.exists(local_path):
        try:
            # [AI-AGENT] SECURITY: import subprocess as sp
            # [AI-AGENT] SECURITY: # [AI-AGENT] SECURITY: sp.run(['cmd', '/c', 'rmdir', '/s', '/q', local_path],
                   capture_output=True, timeout=15)
        # [AI-AGENT] SECURITY: except Exception:
            pass
        if os.path.exists(local_path):
            shutil.rmtree(local_path, ignore_errors=True)

    await send_log(f"[📦 Clone Agent] Cloning {repo_url}...", "INFO")
    try:
        if "http" in repo_url:
            await asyncio.to_thread(clone_repo, repo_url, local_path, access_token)
        else:
            shutil.copytree(repo_url, local_path)
    except Exception as e:
        await send_log(f"[📦 Clone Agent] Failed: {str(e)}", "ERROR")
        await send_stage("CLONE", "error")
        return

    await send_log("[📦 Clone Agent] Repository cloned successfully.", "SUCCESS")
    await send_stage("CLONE", "done")

    branch_name = f"{team_name.upper().replace(' ', '_')}_{leader_name.upper().replace(' ', '_')}_AI_Fix"
    try:
        await asyncio.to_thread(create_branch, local_path, branch_name)
        await send_log(f"[🌿 Branch Agent] Created branch: {branch_name}", "ACTION")
    except Exception as e:
        await send_log(f"[🌿 Branch Agent] Branch error: {str(e)}", "WARNING")

    # ═══ STAGE 2: SCAN ═══
    await send_stage("SCAN", "active")

    max_retries = 3
    fixes_applied = []
    remaining_issues = []
    all_diffs = []

    for i in range(1, max_retries + 1):
        await send_log(f"═══════════ Scan Iteration {i}/{max_retries} ═══════════", "INFO")
        issues = await scan_repository(local_path, log_callback=send_log)

        if not issues:
            await send_log("✅ All agents report: Repository is clean!", "SUCCESS")
            remaining_issues = []
            break

        if i == 1:
            await send_stage("SCAN", "done")
            # ═══ STAGE 3: FIX ═══
            await send_stage("FIX", "active")

        await send_log(f"⚠️ {len(issues)} issues found. Deploying Fixer Agent...", "WARNING")

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

                    fix_entry = {
                        "file": issue['file'], "type": issue['type'],
                        "line": issue['line'], "commit": commit_msg,
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
                    await manager.broadcast(json.dumps(diff_data))
                    all_diffs.append(diff_data)

                except Exception as e:
                    await send_log(f"[⚠️ Git Agent] Commit failed: {str(e)}", "WARNING")
            else:
                remaining_issues.append(issue)

        if fixed_count == 0:
            await send_log("No more auto-fixable issues.", "INFO")
            break
        await send_log(f"Fixed {fixed_count} issues in iteration {i}.", "INFO")

    await send_stage("FIX", "done")

    # ═══ STAGE 4: PUSH ═══
    await send_stage("PUSH", "active")
    pr_url = None

    if access_token and fixes_applied:
        await send_log(f"[🚀 Push Agent] Pushing '{branch_name}' to GitHub...", "ACTION")
        try:
            await asyncio.to_thread(push_changes, local_path, branch_name, access_token, repo_url)
            await send_log("[🚀 Push Agent] Branch pushed to GitHub!", "SUCCESS")

            # Create PR
            await send_log("[📋 PR Agent] Creating Pull Request...", "ACTION")
            pr_url = await create_pull_request(access_token, gh_owner, gh_repo, branch_name, fixes_applied)
            if pr_url:
                await send_log("[📋 PR Agent] Pull Request created!", "SUCCESS")
                await manager.broadcast(json.dumps({"type": "PR", "url": pr_url}))
            else:
                await send_log("[📋 PR Agent] Could not create PR (may already exist).", "WARNING")

        except Exception as e:
            await send_log(f"[🚀 Push Agent] Push failed: {str(e)}", "WARNING")
    elif not access_token:
        await send_log("[🚀 Push Agent] No access token — local mode.", "WARNING")
    else:
        await send_log("[🚀 Push Agent] No fixes to push.", "INFO")

    await send_stage("PUSH", "done")

    # ═══ STAGE 5: DONE ═══
    elapsed = time.time() - start_time
    duration = f"{int(elapsed // 60)}m {int(elapsed % 60)}s"
    await send_log(f"Analysis complete in {duration}.", "SUCCESS")
    await send_stage("DONE", "done")

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
    await manager.broadcast(json.dumps(final_report))


@app.post("/analyze")
async def start_analysis(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    # Basic URL validation
    if not request.repo_url or 'github.com' not in request.repo_url:
        raise HTTPException(status_code=400, detail="Please provide a valid GitHub repository URL")

    background_tasks.add_task(
        run_analysis_task, request.repo_url, request.team_name,
        request.leader_name, request.access_token
    )
    return {"message": "Analysis started"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
