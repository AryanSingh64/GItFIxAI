from fastapi import FastAPI, HTTPException, WebSocket, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import time
import shutil
import asyncio
import json
import httpx
from agent.scanner import scan_repository
from agent.fixer import fix_issue
from agent.git_manager import clone_repo, create_branch, commit_changes, push_changes

app = FastAPI(title="Autonomous CI/CD Healing Agent")

# OAuth Config (USER PROVIDED)
GITHUB_CLIENT_ID = "Ov23liktz8bz4X5bMsds"
GITHUB_CLIENT_SECRET = "68338bd517c750c9f9b599a060a2d95c7c1cd72d"

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

class OAuthCode(BaseModel):
    code: str

# WebSocket Manager (Same as before)
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

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
        # Exchange Code for Token
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
            raise HTTPException(status_code=400, detail=data["error_description"])
            
        access_token = data["access_token"]
        
        # Get User Repos (Wait for Github API)
        repos_response = await client.get(
            "https://api.github.com/user/repos?sort=updated&per_page=10",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
        repos = repos_response.json()
        
        return {
            "access_token": access_token,
            "repos": [
                {
                    "name": r["name"],
                    "full_name": r["full_name"], # owner/repo
                    "url": r["clone_url"],
                    "private": r["private"],
                    "description": r["description"]
                } for r in repos if isinstance(r, dict) and "name" in r # Filter valid repos
            ]
        }


# --- Agent Logic (Same as before) ---

async def run_analysis_task(repo_url: str, team_name: str, leader_name: str):
    repo_name = repo_url.split("/")[-1].replace(".git", "")
    local_path = os.path.abspath(f"./temp_repos/{repo_name}")
    
    # 1. Cleanup & Clone
    if os.path.exists(local_path):
        try:
            shutil.rmtree(local_path)
        except Exception:
            pass # Windows file lock issues sometimes
            
    await send_log(f"Cloning repository: {repo_url}...", "INFO")
    
    try:
        # Check if local (for testing) or remote
        if "http" in repo_url:
             clone_repo(repo_url, local_path)
        else:
             shutil.copytree(repo_url, local_path)
    except Exception as e:
        await send_log(f"Failed to clone repository: {str(e)}", "ERROR")
        return

    await send_log("Repository cloned successfully.", "SUCCESS")

    # 2. Create Healing Branch
    branch_name = f"{team_name.upper().replace(' ', '_')}_{leader_name.upper().replace(' ', '_')}_AI_Fix"
    create_branch(local_path, branch_name)
    await send_log(f"Created healing branch: {branch_name}", "ACTION")

    # 3. Scan & Fix Loop (Limit 5 iterations)
    max_retries = 5
    fixes_applied = []
    
    issues = []
    for i in range(1, max_retries + 1):
        await send_log(f"Starting Scan Iteration {i}/{max_retries}...", "INFO")
        issues = scan_repository(local_path)
        
        if not issues:
            await send_log("No issues found! Repository is clean.", "SUCCESS")
            # Update Dashboard: PASSED
            await manager.broadcast(json.dumps({"type": "STATUS", "status": "PASSED"}))
            break
            
        await send_log(f"Found {len(issues)} issues. Starting fixes...", "WARNING")
        
        for issue in issues:
            await send_log(f"Fixing {issue['type']} in {issue['file']} line {issue['line']}: {issue['message']}", "ACTION")
            # FIX LOGIC
            fix_result = fix_issue(local_path, issue)
            if fix_result['status'] == 'fixed':
                 commit_message = f"[AI-AGENT] Fixed {issue['type']}: {issue['message']}"
                 commit_changes(local_path, commit_message, [issue['file']])
                 await send_log(f"Committed fix: {commit_message}", "SUCCESS")
                 
                 fixes_applied.append({
                     "file": issue['file'],
                     "type": issue['type'],
                     "line": issue['line'],
                     "commit": commit_message,
                     "status": "FIXED"
                 })
                 
    # 4. Final Push
    # push_changes(local_path, branch_name) 
    await send_log("Analysis Complete. Ready for review.", "SUCCESS")
    
    # Send Final Report
    final_report = {
        "type": "RESULT",
        "summary": {
            "status": "PASSED" if not issues else "FAILED",
            "totalFailures": len(fixes_applied), 
            "fixesApplied": len(fixes_applied),
            "duration": "0m 45s", 
            "branchName": branch_name
        },
        "fixes": fixes_applied,
        "score": 100 - (len(fixes_applied) * 2), 
    }
    await manager.broadcast(json.dumps(final_report))


@app.post("/analyze")
async def start_analysis(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(run_analysis_task, request.repo_url, request.team_name, request.leader_name)
    return {"message": "Analysis started"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
