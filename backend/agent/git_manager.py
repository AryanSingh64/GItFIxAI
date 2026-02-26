from git import Repo
# [AI-AGENT] SECURITY: import subprocess
import os
import httpx


def clone_repo(url: str, path: str, token: str = None):
    """Clone a repository, optionally with an access token."""
    clone_url = url
    if token and 'github.com' in url:
        clone_url = url.replace('https://', f'https://x-access-token:{token}@')
    Repo.clone_from(clone_url, path)


def create_branch(path: str, branch_name: str):
    repo = Repo(path)
    new_branch = repo.create_head(branch_name)
    new_branch.checkout()


def commit_changes(path: str, message: str, files: list):
    repo = Repo(path)
    clean_files = [f.replace('\\', '/').lstrip('./') for f in files]
    repo.index.add(clean_files)
    repo.index.commit(message)


def push_changes(path: str, branch_name: str, token: str = None, repo_url: str = None):
    """Push changes using git CLI. Bypasses credential manager."""
    if token and repo_url and 'github.com' in repo_url:
        auth_url = repo_url.replace('https://', f'https://x-access-token:{token}@')
        if not auth_url.endswith('.git'):
            auth_url += '.git'
        repo = Repo(path)
        repo.remotes.origin.set_url(auth_url)

    env = os.environ.copy()
    env['GIT_TERMINAL_PROMPT'] = '0'

    # [AI-AGENT] SECURITY: result = subprocess.run(
        ['git', '-c', 'credential.helper=', 'push', '-u', 'origin', branch_name],
        capture_output=True, text=True, cwd=path, timeout=120, env=env
    )

    output = (result.stdout + '\n' + result.stderr).strip()
    fail_checks = ['remote rejected', 'failed to push', 'Permission denied',
                   'could not read Username', 'Authentication failed', 'fatal:']
    for check in fail_checks:
        if check.lower() in output.lower():
            raise RuntimeError(f"git push failed: {output}")
    return output


async def create_pull_request(token: str, owner: str, repo: str, branch: str, fixes: list):
    """Create a Pull Request on GitHub with a summary of all fixes."""
    body = "## 🤖 AI Agent — Automated Code Fixes\n\n"
    body += f"**{len(fixes)}** issues were automatically detected and fixed by GitFixAI.\n\n"
    body += "### Fixes Applied\n"
    body += "| File | Type | Line | Fix |\n|---|---|---|---|\n"
    for fix in fixes[:25]:
        msg = fix.get('commit', '')[:60].replace('[AI-AGENT] Fixed ', '')
        body += f"| `{fix['file']}` | {fix['type']} | L{fix['line']} | {msg} |\n"
    if len(fixes) > 25:
        body += f"\n*...and {len(fixes) - 25} more fixes*\n"

    body += "\n### Agents Used\n"
    body += "- 🐍 **Python Linting Agent** (flake8)\n"
    body += "- ⚡ **JavaScript Agent** (pattern analysis)\n"
    body += "- 🔒 **Security Agent** (vulnerability scan)\n"
    body += "- 🔧 **AI Fixer Agent** (heuristic + AI)\n"
    body += "\n---\n*Automated by [GitFixAI](https://github.com/AryanSingh64/GItFIxAI)*"

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"https://api.github.com/repos/{owner}/{repo}/pulls",
            json={
                "title": f"[AI-AGENT] {len(fixes)} automated code fixes",
                "body": body,
                "head": branch,
                "base": "main"
            },
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json"
            },
            timeout=30
        )
        if resp.status_code == 201:
            return resp.json().get("html_url")
        return None
