# Autonomous CI/CD Healing Agent

**RIFT 2026 Hackathon Entry**

## 🚀 Overview
This agent autonomously heals broken CI/CD pipelines. It connects to GitHub, recursively clones repositories, runs strict analysis (Linters, Test Runners), and generates targeted patches (Code Fixes) to repair bugs automatically. The results are visualized in a futuristic Real-Time Dashboard.

## 🌐 Live Demo
🔗 **[https://gitfixai.up.railway.app](https://gitfixai.up.railway.app)**

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

## 🚢 Deployment

This project is Dockerized and deployed on **Railway** as a single full-stack service.

### Docker (Self-hosted)
```bash
docker build -t gitfixai .
docker run -p 8000:8000 \
  -e GITHUB_CLIENT_ID=your_id \
  -e GITHUB_CLIENT_SECRET=your_secret \
  -e OPENAI_API_KEY=your_key \
  gitfixai
```

### Environment Variables
| Variable | Description |
|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `OPENAI_API_KEY` | OpenAI API Key (optional) |
| `GOOGLE_API_KEY` | Google Gemini API Key (optional) |

## ✨ Features
- **GitHub Integration**: Login with GitHub and import private repositories.
- **Auto-Healing**: Fixes Syntax Errors, Linting Issues (`E501`, `W292`, `F401`), and Basic Logic Bugs.
- **Live Dashboard**: Real-time logs, Score Cards, and Diff Viewer.
- **Sandboxed Execution**: Safe analysis in `temp_repos` directory.

## ⚠️ Known Issues (Live Demo)

> **GitHub OAuth Login (`/auth`) is currently not fully functional on the live deployment.**
>
> **Reason**: The GitHub OAuth App's callback URL is registered for a different deployment URL (Vercel). Since the live demo runs on Railway (`gitfixai.up.railway.app`), GitHub rejects the redirect and shows a 404.
>
> **Workaround**: Run locally using the manual start instructions above, and set up your own GitHub OAuth App with `http://localhost:5173/dashboard` as the callback URL.

## 📸 Screenshots
*(See linked LinkedIn Video)*

---
**Team**: CODINGGEEKS 
**Leader**: Aryan Kumar
