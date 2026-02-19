from git import Repo
import os


def clone_repo(url: str, path: str, token: str = None):
    """Clone a repository, optionally with an access token for private repos."""
    if token and 'github.com' in url:
        url = url.replace('https://', f'https://x-access-token:{token}@')
    Repo.clone_from(url, path)


def create_branch(path: str, branch_name: str):
    repo = Repo(path)
    new_branch = repo.create_head(branch_name)
    new_branch.checkout()


def commit_changes(path: str, message: str, files: list):
    repo = Repo(path)
    repo.index.add(files)
    repo.index.commit(message)


def push_changes(path: str, branch_name: str, token: str = None, repo_url: str = None):
    """Push changes to GitHub using access token for authentication."""
    repo = Repo(path)
    origin = repo.remote(name='origin')
    # Update remote URL with token for authentication
    if token and repo_url and 'github.com' in repo_url:
        auth_url = repo_url.replace('https://', f'https://x-access-token:{token}@')
        if not auth_url.endswith('.git'):
            auth_url += '.git'
        origin.set_url(auth_url)
    origin.push(branch_name)
