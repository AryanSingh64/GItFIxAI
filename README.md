# Autonomous CI/CD Healing Agent

**RIFT 2026 Hackathon Entry**

## 🚀 Overview
This agent autonomously heals broken CI/CD pipelines. It connects to GitHub, recursively clones repositories, runs strict analysis (Linters, Test Runners), and generates targeted patches (Code Fixes) to repair bugs automatically. The results are visualized in a futuristic Real-Time Dashboard.

## 🛠️ Architecture
- **Frontend**: React 19, Vite, TailwindCSS v4, Framer Motion, Lucide Icons.
- **Backend**: FastAPI (Python), WebSocket Server, Task Queue.
- **Agentic Core**: 
  - **Scanner**: `flake8` / `eslint` parser.
  - **Fixer**: Heuristic + LLM-based patching engine.
  - **Git Manager**: `GitPython` wrapper for branching and committing.

## 📦 Installation & Usage

1. **Prerequisites**: Python 3.10+, Node.js 18+, Git.
2. **Setup**:
   ```bash
   # Clone this repo
   git clone <repo_url>
   cd <repo_folder>
   ```
3. **One-Click Start**:
   - Double click `start.bat` in the root folder.
   - Or run `./start.bat` in terminal.

4. **Manual Start**:
   - Backend: `cd backend && pip install -r requirements.txt && python main.py`
   - Frontend: `cd frontend && npm install && npm run dev`

## ✨ Features
- **GitHub Integration**: Login with GitHub and import private repositories.
- **Auto-Healing**: Fixes Syntax Errors, Linting Issues (`E501`, `W292`, `F401`), and Basic Logic Bugs.
- **Live Dashboard**: Real-time logs, Score Cards, and Diff Viewer.
- **Sandboxed Execution**: Safe analysis in `temp_repos` directory.

## 📸 Screenshots
*(See linked LinkedIn Video)*

---
**Team**: RIFT ORGANISERS
**Leader**: Saiyam Kumar
