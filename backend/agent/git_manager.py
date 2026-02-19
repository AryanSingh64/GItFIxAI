from git import Repo
import os

def clone_repo(url: str, path: str):
    Repo.clone_from(url, path)

def create_branch(path: str, branch_name: str):
    repo = Repo(path)
    new_branch = repo.create_head(branch_name)
    new_branch.checkout()

def commit_changes(path: str, message: str, files: list):
    repo = Repo(path)
    repo.index.add(files)
    repo.index.commit(message)

def push_changes(path: str, branch_name: str):
    repo = Repo(path)
    origin = repo.remote(name='origin')
    origin.push(branch_name)
