<div align="center">

  <img src="./frontend/public/favicon.svg" alt="GitFixAI" width="120"/>

  <h1>GitFixAI</h1>

  <p><strong>Autonomous code healing powered by AI</strong></p>
  <p>Scan. Fix. Test. Ship.</p>

  <br/>

  <a href="https://gitfixai.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-gitfixai.vercel.app-7c3aed?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/></a>

  <br/><br/>

  <img src="https://img.shields.io/badge/status-active-success?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/github/license/AryanSingh64/GItFIxAI?style=flat-square&color=blue" alt="License"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>
  <img src="https://img.shields.io/github/last-commit/AryanSingh64/GItFIxAI?style=flat-square&color=orange" alt="Last Commit"/>
  <img src="https://img.shields.io/github/actions/workflow/status/AryanSingh64/GItFIxAI/ci.yml?style=flat-square&label=CI" alt="CI"/>

</div>

<br/>

---

## <img src="./assets/icons/info.svg" width="20"/> What is GitFixAI?

GitFixAI is an autonomous code analysis agent that detects issues across Python, JavaScript, TypeScript, and Go codebases. It uses AI to fix bugs, runs tests, and creates Pull Requests automatically — all from a single click.

---

## <img src="./assets/icons/languages.svg" width="22"/> Key Features

### <img src="./assets/icons/languages.svg" width="20"/> Multi-Language Support
Analyzes Python, JavaScript, TypeScript, Go with unified linting (flake8, ESLint, go vet, and more).

### <img src="./assets/icons/ai.svg" width="20"/> AI-Powered Fixes
Uses OpenAI/Gemini to understand full file context and fix multi-line bugs automatically.

### <img src="./assets/icons/test.svg" width="20"/> Autonomous Test Healing
Discovers test frameworks, runs tests, and loops until all issues are resolved.

### <img src="./assets/icons/github.svg" width="20"/> GitHub Integration
Connects via OAuth, creates feature branches, commits fixes, and opens Pull Requests.

### <img src="./assets/icons/dashboard.svg" width="20"/> Live Dashboard
Real-time WebSocket-powered analysis with animated score gauge, live logs, and diff viewer.

### <img src="./assets/icons/security.svg" width="20"/> Production Hardened
Per-user WebSocket sessions, rate limiting, security headers, and environment validation.

---

## <img src="./assets/icons/rocket.svg" width="22"/> Quick Start

```bash
# Clone the repository
git clone https://github.com/AryanSingh64/GItFIxAI.git
cd GItFIxAI

# One-click start (Windows)
.\start.bat

# Or manually:
cd frontend && npm install && npm run dev
cd ../backend && pip install -r requirements.txt && python main.py
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## <img src="./assets/icons/camera.svg" width="22"/> Demo

<div align="center">

### Landing Page
<img src="./assets/demo/landing1-ezgif.com-video-to-gif-converter.gif" alt="Landing Page" width="720"/>

### Dashboard
<img src="./assets/demo/dashboard-ezgif.com-video-to-gif-converter.gif" alt="Dashboard" width="720"/>

### Live Analysis
<img src="./assets/demo/analysis-ezgif.com-video-to-gif-converter.gif" alt="Live Analysis" width="720"/>

### Results
<img src="./assets/demo/result-ezgif.com-video-to-gif-converter.gif" alt="Results" width="720"/>

</div>

---

## <img src="./assets/icons/stack.svg" width="22"/> Tech Stack

**Frontend:**

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-FF0055?style=flat-square)
![CSS](https://img.shields.io/badge/Vanilla_CSS-Custom-1572B6?style=flat-square&logo=css3&logoColor=white)

**Backend:**

![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Real_Time-010101?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase&logoColor=white)

**AI & Tools:**

![OpenAI](https://img.shields.io/badge/OpenAI-GPT-412991?style=flat-square&logo=openai&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=flat-square&logo=google&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=flat-square&logo=githubactions&logoColor=white)

**Deployment:**

![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render&logoColor=white)

---

## <img src="./assets/icons/download.svg" width="22"/> Installation

<details>
<summary><strong>Click to expand full installation steps</strong></summary>

### Prerequisites
- Node.js 18+
- Python 3.9+
- A GitHub account
- (Optional) OpenAI or Google Gemini API key

### 1. Clone the repo

```bash
git clone https://github.com/AryanSingh64/GItFIxAI.git
cd GItFIxAI
```

### 2. Frontend setup

```bash
cd frontend
npm install
```

### 3. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

### 4. Environment variables

Create `frontend/.env`:
```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GITHUB_CLIENT_ID=your-github-client-id
VITE_API_URL=http://localhost:8000
```

Create `backend/.env`:
```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
OPENAI_API_KEY=your-openai-key          # optional
GOOGLE_API_KEY=your-gemini-key          # optional
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
```

### 5. Start

```bash
# Windows (one-click):
.\start.bat

# Or manually:
# Terminal 1 (backend):
cd backend && python main.py

# Terminal 2 (frontend):
cd frontend && npm run dev
```

</details>

---

## <img src="./assets/icons/settings.svg" width="22"/> Configuration

The dashboard provides a UI for all configuration. You can also customize defaults:

| Setting | Default | Description |
|---------|---------|-------------|
| `Auto-Fix: Syntax` | On | Fix syntax errors automatically |
| `Auto-Fix: Imports` | On | Fix import issues |
| `Auto-Fix: Formatting` | On | Apply code formatting |
| `Auto-Fix: Security` | Off | Fix security vulnerabilities |
| `Commit Message` | `Fixed {issues_count} issues...` | Template with variables |

---

## <img src="./assets/icons/terminal.svg" width="22"/> How It Works

```
1. CLONE     → Clones repository to temp directory
2. SCAN      → Runs language-specific linters (flake8, ESLint, go vet)
3. FIX       → AI agent applies targeted fixes per issue
4. TEST      → Discovers and runs test suites
5. PUSH      → Creates branch, commits fixes, opens Pull Request
```

The agent loops SCAN → FIX up to 3 iterations to catch cascading issues.

---

## <img src="./assets/icons/security.svg" width="22"/> Security & Production

| Feature | Status |
|---------|--------|
| Per-user WebSocket sessions | Active |
| Rate limiting (5 req/min) | Active |
| Security headers (XSS, Clickjack, HSTS) | Active |
| Environment validation | Active |
| CI/CD pipeline (GitHub Actions) | Active |
| OAuth 2.0 (Google + GitHub) | Active |

---

## <img src="./assets/icons/contribute.svg" width="22"/> Contributing

Contributions are welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## <img src="./assets/icons/license.svg" width="22"/> License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

  <img src="./frontend/public/favicon.svg" alt="GitFixAI" width="40"/>

  <p>Made with <img src="./assets/icons/heart.svg" width="14"/> by <a href="https://github.com/AryanSingh64">Aryan Singh</a></p>

  <a href="https://gitfixai.vercel.app">Live Demo</a> ·
  <a href="https://github.com/AryanSingh64/GItFIxAI">GitHub</a> ·
  <a href="https://gitfixai.vercel.app/docs">Documentation</a>

</div>
