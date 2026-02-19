from git import Repo
import subprocess
import os


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
    # Normalize paths: remove .\ prefix and use forward slashes
    clean_files = [f.replace('\\', '/').lstrip('./') for f in files]
    repo.index.add(clean_files)
    repo.index.commit(message)


def push_changes(path: str, branch_name: str, token: str = None, repo_url: str = None):
    """Push changes using git CLI. Works with cached credentials or token."""
    # If token provided, set the remote URL with embedded token
    if token and repo_url and 'github.com' in repo_url:
        auth_url = repo_url.replace('https://', f'https://x-access-token:{token}@')
        if not auth_url.endswith('.git'):
            auth_url += '.git'
        repo = Repo(path)
        repo.remotes.origin.set_url(auth_url)

    # Use git CLI for push
    result = subprocess.run(
        ['git', 'push', '-u', 'origin', branch_name],
        capture_output=True, text=True, cwd=path, timeout=120
    )

    # Combine stdout + stderr for full output
    output = (result.stdout + '\n' + result.stderr).strip()

    # Git push sends progress info to stderr even on success.
    # Check for actual failure indicators instead of relying on exit code.
    failure_indicators = [
        'remote rejected',
        'failed to push',
        'Permission denied',
        'could not read Username',
        'Authentication failed',
        'fatal:',
    ]

    for indicator in failure_indicators:
        if indicator.lower() in output.lower():
            raise RuntimeError(f"git push failed: {output}")

    # If we see the branch in output or no failure indicators, it worked
    return output
