import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen, ArrowLeft, Search, Zap, Code2, Shield,
    GitBranch, FlaskConical, Settings, Terminal, ChevronRight,
    ChevronDown, ExternalLink, Copy, CheckCircle, Database,
    Globe, Webhook,
} from 'lucide-react';

const SECTIONS = [
    {
        id: 'getting-started',
        icon: <Zap className="w-4 h-4" />,
        title: 'Getting Started',
        content: [
            {
                title: 'Quick Start',
                body: `GitFixAI is an autonomous code analysis and healing agent. It clones your GitHub repository, scans for issues across multiple languages, uses AI to fix them, runs tests, and creates a Pull Request with all fixes.

**Prerequisites:**
- Node.js 18+ and Python 3.9+
- A GitHub account
- (Optional) An OpenAI or Google Gemini API key for AI-powered fixes`,
            },
            {
                title: 'Installation',
                code: `# Clone the repository
git clone https://github.com/AryanSingh64/GItFIxAI.git
cd GItFIxAI

# Install dependencies (Windows)
.\\start.bat

# Or manually:
cd frontend && npm install
cd ../backend && pip install -r requirements.txt`,
            },
            {
                title: 'Environment Variables',
                code: `# Frontend (.env)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend (.env)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key  # or GOOGLE_API_KEY`,
            },
        ],
    },
    {
        id: 'multi-language',
        icon: <Code2 className="w-4 h-4" />,
        title: 'Multi-Language Support',
        content: [
            {
                title: 'Supported Languages',
                body: `GitFixAI automatically detects the languages in your repository and runs the appropriate scanners:

| Language | Linters | Rules |
|----------|---------|-------|
| **Python** | flake8, bandit | 50+ style + security rules |
| **JavaScript** | ESLint (with fallback pattern scanner) | Airbnb/Standard configs |
| **TypeScript** | ESLint with TS parser | Type checking + style |
| **Go** | go vet, staticcheck | 30+ analyzers |

The scanner auto-detects all file types and generates a language distribution chart showing the percentage breakdown of your codebase.`,
            },
            {
                title: 'Language Detection',
                body: `When you run an analysis, GitFixAI first scans the entire repository to detect:
- **File count** per language
- **Line count** per language
- **Percentage distribution** (e.g., "45% Python, 35% TypeScript, 20% Go")

This information is displayed as a stacked bar chart in the dashboard.`,
            },
            {
                title: 'Custom Configs',
                body: `GitFixAI respects existing configuration files in your repo:
- \`.eslintrc.js\` / \`.eslintrc.json\` — ESLint
- \`setup.cfg\` / \`.flake8\` — flake8
- \`.golangci.yml\` — golangci-lint

If no config exists, sensible defaults are used.`,
            },
        ],
    },
    {
        id: 'ai-fixer',
        icon: <Zap className="w-4 h-4" />,
        title: 'AI-Powered Fixes',
        content: [
            {
                title: 'How AI Fixes Work',
                body: `Unlike simple auto-formatters, GitFixAI uses AI to understand the **full context** of your code:

1. **Whole File Context** — The AI reads the entire file (up to 200 lines), not just a snippet
2. **Import Resolution** — If the issue involves imports, the AI also reads the imported files
3. **Language Awareness** — The AI knows the difference between Python, JavaScript, TypeScript, and Go idioms

The AI fix engine tries OpenAI (gpt-4o-mini) or Google Gemini first, then falls back to heuristic fixes for common patterns.`,
            },
            {
                title: 'Heuristic Fixes',
                body: `When AI is unavailable, GitFixAI uses smart heuristic fixes:

**Python:**
- E261: Add proper spacing before inline comments
- E265: Fix block comment format (\`#text\` → \`# text\`)
- E231: Add whitespace after commas (\`[1,2,3]\` → \`[1, 2, 3]\`)
- E711: Use \`is None\` instead of \`== None\`
- F401: Comment out unused imports
- E401: Split multi-imports into separate lines

**JavaScript/TypeScript:**
- Remove \`console.log()\` calls
- Replace \`var\` with \`let\`/\`const\`
- Fix loose equality (\`==\` → \`===\`)
- Remove \`debugger\` statements

**Go:**
- Comment out unused variables/imports
- Add doc comments for exported functions`,
            },
            {
                title: 'Fix Categories',
                body: `Each fix is categorized:

| Category | Action | Example |
|----------|--------|---------|
| **Auto-Fix** | Applied immediately | Formatting, whitespace, unused imports |
| **AI Fix** | AI generates the fix | Logic errors, type mismatches, security |
| **Manual Review** | Flagged for human | Complex refactoring, architecture |`,
            },
        ],
    },
    {
        id: 'test-runner',
        icon: <FlaskConical className="w-4 h-4" />,
        title: 'Test Runner',
        content: [
            {
                title: 'Automatic Test Discovery',
                body: `GitFixAI automatically detects test frameworks in your repository:

**Python:**
- Looks for \`pytest\`, \`unittest\` in requirements.txt / pyproject.toml
- Scans for \`test_*.py\` and \`*_test.py\` files

**JavaScript/TypeScript:**
- Checks package.json for \`jest\`, \`vitest\`, \`mocha\`, \`ava\`
- Detects \`*.test.js\`, \`*.spec.ts\` files

**Go:**
- Finds \`*_test.go\` files
- Uses \`go test ./...\``,
            },
            {
                title: 'Test Execution',
                body: `After scanning and fixing, GitFixAI runs all detected tests:

1. Tests run in the cloned repository directory
2. Results are parsed (JSON where available)
3. Pass/fail/skip counts are extracted
4. Failure details (test name, error message, stack trace) are captured
5. Results are displayed in the dashboard

**Timeout:** 5 minutes per test framework
**CI mode:** Tests run with \`CI=true\` environment variable`,
            },
        ],
    },
    {
        id: 'github-integration',
        icon: <GitBranch className="w-4 h-4" />,
        title: 'GitHub Integration',
        content: [
            {
                title: 'Authentication',
                body: `GitFixAI supports multiple authentication methods:

1. **Email/Password** — Traditional sign up via Supabase Auth
2. **Google OAuth** — One-click Google sign in
3. **GitHub OAuth** — Sign in with GitHub (via Supabase)

**Important:** GitHub login and GitHub repo access are separate. You can log in with Google and still connect your GitHub account for repository access.`,
            },
            {
                title: 'Connecting GitHub',
                body: `After logging in (with any method), you can connect your GitHub account:

1. Click **"Connect GitHub Account"** on the Dashboard
2. Authorize the OAuth app
3. Your repositories will be listed
4. Select a repo to analyze

The GitHub access token is stored in localStorage and used for:
- Cloning private repositories
- Pushing fix branches
- Creating Pull Requests`,
            },
            {
                title: 'Pull Request Format',
                code: `## AI Agent — Automated Code Fixes

**12** issues were automatically detected and fixed by GitFixAI.

### Fixes Applied
| File | Type | Line | Fix |
|------|------|------|-----|
| src/api.py | LINTING | L42 | Fixed comment spacing |
| utils/helper.ts | LOGIC | L18 | Strict equality |

### Agents Used
- [Python] Linting Agent (flake8 + bandit)
- [JS/TS] Agent (ESLint + patterns)
- [Security] Agent (vulnerability scan)
- [Go] Agent (go vet + staticcheck)
- [Test] Agent (pytest + jest)`,
            },
        ],
    },
    {
        id: 'security',
        icon: <Shield className="w-4 h-4" />,
        title: 'Security Scanning',
        content: [
            {
                title: 'What We Detect',
                body: `GitFixAI scans for common security vulnerabilities:

- **Hardcoded Secrets** — API keys, passwords, tokens in source code
- **eval() Usage** — Code injection risk in Python and JavaScript
- **innerHTML Assignment** — XSS vulnerability in JavaScript
- **exec() Usage** — Python code injection
- **shell=True** — Shell injection in subprocess calls
- **Private Key Exposure** — Private keys committed to source

**Python-specific (via bandit):**
- SQL injection patterns
- Insecure hash functions (MD5, SHA1)
- Hardcoded temp file usage
- Insecure deserialization`,
            },
        ],
    },
    {
        id: 'database',
        icon: <Database className="w-4 h-4" />,
        title: 'Database & Storage',
        content: [
            {
                title: 'Supabase Setup',
                body: `GitFixAI uses Supabase (PostgreSQL) for:
- **User authentication** (email, Google, GitHub OAuth)
- **Analysis run history** (scores, fixes, timestamps)
- **File fix records** (per-file changes)
- **User profiles** (auto-created on signup)

**Setup Steps:**
1. Create a free Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema in the SQL Editor (see \`backend/supabase_schema.sql\`)
3. Configure the environment variables
4. Enable Google and GitHub OAuth providers in Authentication settings`,
            },
            {
                title: 'Schema',
                code: `-- Key tables:
CREATE TABLE analysis_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  repo_url TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'running',
  total_failures INTEGER DEFAULT 0,
  fixes_applied INTEGER DEFAULT 0,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE file_fixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES analysis_runs(id),
  file_path TEXT,
  issue_type TEXT,
  line_number INTEGER,
  before_content TEXT,
  after_content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);`,
            },
        ],
    },
    {
        id: 'api',
        icon: <Globe className="w-4 h-4" />,
        title: 'API Reference',
        content: [
            {
                title: 'Endpoints',
                body: `**Base URL:** \`http://localhost:8000\` (local) or your deployed backend URL

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/analyze\` | Start a new analysis run |
| GET | \`/history\` | Get past analysis runs |
| POST | \`/auth/github\` | Exchange GitHub OAuth code for token |
| WS | \`/ws\` | WebSocket for real-time analysis updates |`,
            },
            {
                title: 'POST /analyze',
                code: `// Request
{
  "repo_url": "https://github.com/user/repo",
  "team_name": "MyTeam",
  "leader_name": "John",
  "access_token": "ghp_..."  // optional
}

// Response
{ "message": "Analysis started" }

// Real-time updates via WebSocket /ws:
{ "type": "STAGE", "stage": "CLONE", "status": "active" }
{ "type": "LOG", "message": "...", "level": "INFO" }
{ "type": "DIFF", "file": "...", "before": "...", "after": "..." }
{ "type": "LANG_STATS", "data": {...} }
{ "type": "TEST_RESULTS", "data": {...} }
{ "type": "RESULT", "score": 94, "summary": {...} }`,
            },
        ],
    },
    {
        id: 'deployment',
        icon: <Globe className="w-4 h-4" />,
        title: 'Deployment',
        content: [
            {
                title: 'Deploy Frontend (Vercel)',
                body: `1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo → set Root Directory to \`frontend\`
4. Add environment variables:
   - \`VITE_SUPABASE_URL\`
   - \`VITE_SUPABASE_ANON_KEY\`
5. Deploy!`,
            },
            {
                title: 'Deploy Backend (Render)',
                body: `1. Go to [render.com](https://render.com) → New Web Service
2. Connect your repo → set Root Directory to \`backend\`
3. Build Command: \`pip install -r requirements.txt\`
4. Start Command: \`uvicorn main:app --host 0.0.0.0 --port $PORT\`
5. Add environment variables (all backend .env vars)
6. Deploy!

**Important:** Update \`VITE_API_URL\` in your frontend to point to the Render URL.`,
            },
        ],
    },
];

function CodeBlock({ code }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <button onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white cursor-pointer">
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="bg-[#0d1117] border border-white/5 rounded-xl p-4 overflow-x-auto text-sm font-mono text-white/70 leading-relaxed">
                {code.trim()}
            </pre>
        </div>
    );
}

function DocSection({ section, isOpen, onToggle }) {
    return (
        <div id={section.id} className="scroll-mt-24">
            {section.content.map((block, bi) => (
                <motion.div
                    key={bi}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: bi * 0.05 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <h3 className="text-xl font-bold text-white mb-4">{block.title}</h3>
                    {block.body && (
                        <div className="prose prose-invert prose-sm max-w-none text-white/60 leading-relaxed space-y-3">
                            {block.body.split('\n\n').map((para, pi) => {
                                // Simple markdown-like rendering
                                if (para.startsWith('|')) {
                                    // Table
                                    const rows = para.split('\n').filter(r => r.trim() && !r.match(/^\|[-\s|]+\|$/));
                                    if (rows.length === 0) return null;
                                    const headers = rows[0].split('|').filter(Boolean).map(h => h.trim());
                                    const dataRows = rows.slice(1);
                                    return (
                                        <div key={pi} className="overflow-x-auto">
                                            <table className="w-full text-sm border-collapse">
                                                <thead>
                                                    <tr>{headers.map((h, hi) => (
                                                        <th key={hi} className="text-left py-2 px-3 text-white/40 border-b border-white/5 font-medium">{h.replace(/\*\*/g, '')}</th>
                                                    ))}</tr>
                                                </thead>
                                                <tbody>
                                                    {dataRows.map((row, ri) => (
                                                        <tr key={ri}>
                                                            {row.split('|').filter(Boolean).map((cell, ci) => (
                                                                <td key={ci} className="py-2 px-3 text-white/50 border-b border-white/5">
                                                                    <span dangerouslySetInnerHTML={{
                                                                        __html: cell.trim()
                                                                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white/80">$1</strong>')
                                                                            .replace(/`(.*?)`/g, '<code class="text-[#7c3aed] bg-white/5 px-1 rounded text-xs">$1</code>')
                                                                    }} />
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                }

                                if (para.startsWith('- ') || para.startsWith('1. ')) {
                                    const items = para.split('\n').filter(Boolean);
                                    return (
                                        <ul key={pi} className="space-y-1.5 ml-1">
                                            {items.map((item, ii) => (
                                                <li key={ii} className="flex items-start gap-2 text-white/50">
                                                    <span className="text-[#7c3aed] mt-0.5">•</span>
                                                    <span dangerouslySetInnerHTML={{
                                                        __html: item.replace(/^[-\d.]+\s*/, '')
                                                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white/80">$1</strong>')
                                                            .replace(/`(.*?)`/g, '<code class="text-[#7c3aed] bg-white/5 px-1 rounded text-xs">$1</code>')
                                                            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-[#0066ff] hover:underline">$1</a>')
                                                    }} />
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }

                                return (
                                    <p key={pi} dangerouslySetInnerHTML={{
                                        __html: para
                                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white/80">$1</strong>')
                                            .replace(/`(.*?)`/g, '<code class="text-[#7c3aed] bg-white/5 px-1 rounded text-xs">$1</code>')
                                            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-[#0066ff] hover:underline">$1</a>')
                                    }} />
                                );
                            })}
                        </div>
                    )}
                    {block.code && <CodeBlock code={block.code} />}
                </motion.div>
            ))}
        </div>
    );
}

export default function DocsPage() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('getting-started');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSections = searchQuery
        ? SECTIONS.filter(s =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.content.some(c =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.body && c.body.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        )
        : SECTIONS;

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Top bar */}
            <div className="border-b border-white/5 bg-[#0a0c10]/90 backdrop-blur-xl sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 md:py-0 md:h-14 flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4">
                    <button onClick={() => navigate(-1)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#7c3aed]" />
                        <span className="font-bold text-white text-sm md:text-base">
                            <span className="font-normal">Git</span>Fix<span className="bg-gradient-to-r from-[#0066ff] to-[#7c3aed] bg-clip-text text-transparent">AI</span>
                        </span>
                        <span className="text-white/20 mx-0.5 hidden md:inline">·</span>
                        <span className="text-white/40 text-xs md:text-sm hidden md:inline">Documentation</span>
                    </div>
                    <div className="w-full md:w-auto md:ml-auto order-last md:order-none relative">
                        <Search className="w-4 h-4 text-white/20 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search docs..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder-white/20 focus:border-[#7c3aed] focus:outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex">
                {/* Sidebar */}
                <aside className="hidden md:block w-64 flex-shrink-0 border-r border-white/5 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto py-6 pl-6 pr-4">
                    <nav className="space-y-1">
                        {SECTIONS.map(section => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${activeSection === section.id
                                    ? 'bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                {section.icon}
                                {section.title}
                            </a>
                        ))}
                    </nav>

                    <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-[#0066ff]/10 to-[#7c3aed]/10 border border-white/5">
                        <h4 className="text-xs font-semibold text-white/60 mb-2">Need Help?</h4>
                        <p className="text-xs text-white/30 mb-3">Check our GitHub for issues and discussions.</p>
                        <a href="https://github.com/AryanSingh64/GItFIxAI" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[#0066ff] hover:underline">
                            <ExternalLink className="w-3 h-3" /> Open on GitHub
                        </a>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0 py-6 md:py-8 px-4 md:px-12 overflow-hidden" style={{ wordBreak: 'break-word' }}>
                    {filteredSections.length === 0 ? (
                        <div className="text-center py-20 text-white/30">
                            <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                            <p>No results for "{searchQuery}"</p>
                        </div>
                    ) : (
                        filteredSections.map((section, si) => (
                            <div key={section.id} className="mb-16">
                                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                                    <div className="p-2 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed]">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                                </div>
                                <DocSection section={section} />
                            </div>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
}
