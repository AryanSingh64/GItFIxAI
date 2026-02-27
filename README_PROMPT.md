# README Generator Prompt

> Copy everything below the line and paste it to any AI assistant along with your project details.

---

## PROMPT START

Create a professional, developer-focused README.md for my project. Follow these exact rules:

### Style Rules
1. **NO emojis anywhere** — use custom SVG icons from `assets/icons/` instead
2. **Short and crisp** — max 3 sentences per section, no marketing fluff
3. **Code blocks** with syntax highlighting for all commands
4. **shields.io badges** for tech stack, status, and metadata
5. **Collapsible sections** (`<details>`) for long content like installation
6. **Tables** for structured data (config, features, security)
7. **Mobile-friendly** — renders clean on GitHub mobile

### File Structure to Create

```
assets/
├── icons/           (SVG icons, 24x24, colored strokes, no fill)
│   ├── info.svg         #7c3aed (purple)
│   ├── languages.svg    #0066ff (blue)
│   ├── ai.svg           #7c3aed (purple)
│   ├── test.svg         #10b981 (green)
│   ├── github.svg       #f5f5f5 (white)
│   ├── dashboard.svg    #0066ff (blue)
│   ├── rocket.svg       #f97316 (orange)
│   ├── camera.svg       #7c3aed (purple)
│   ├── stack.svg        #3b82f6 (blue)
│   ├── download.svg     #10b981 (green)
│   ├── settings.svg     #94a3b8 (gray)
│   ├── terminal.svg     #22d3ee (cyan)
│   ├── contribute.svg   #a78bfa (light purple)
│   ├── license.svg      #f59e0b (amber)
│   ├── security.svg     #7c3aed (purple)
│   └── heart.svg        #ef4444 (red, filled)
└── demo/
    └── (screenshot placeholders)

README.md
```

### Section Order (follow exactly)

#### 1. Header (centered)
```html
<div align="center">
  <img src="./path/to/logo.svg" alt="Logo" width="120"/>
  <h1>Project Name</h1>
  <p><strong>One-line tagline</strong></p>
  <p>Three. Word. Punch.</p>

  <!-- Live demo badge (if deployed) -->
  <a href="URL"><img src="https://img.shields.io/badge/..." /></a>

  <!-- Status badges row -->
  status | license | PRs welcome | last commit | CI
</div>
```

#### 2. What is [Project]?
- 2-3 sentences max
- Section title has `<img src="./assets/icons/info.svg" width="20"/>` before it
- No bullet points, just a paragraph

#### 3. Key Features
- Each feature: `### <img src="icon" width="20"/> Feature Title`
- One sentence description under each
- 5-6 features max

#### 4. Quick Start
- Minimal code block to get running
- Max 5 commands
- End with "Open [URL] in your browser"

#### 5. Screenshots
- Use HTML table layout (2x2 grid)
- Reference `assets/demo/` images
- Add a blockquote note about adding screenshots

#### 6. Tech Stack
- Use shields.io badges with logos
- Group: Frontend | Backend | AI & Tools | Deployment
- Format: `![Name](https://img.shields.io/badge/Name-Version-COLOR?style=flat-square&logo=LOGO&logoColor=white)`

#### 7. Installation (collapsible)
- Wrap in `<details><summary>...</summary></details>`
- Include: Prerequisites, Clone, Install, Env vars, Start

#### 8. Configuration
- Use a markdown table: Setting | Default | Description
- Keep it to 5-7 rows max

#### 9. How It Works / Usage
- Short pipeline description in a code block (numbered steps)
- One sentence explanation below

#### 10. Security & Production (if applicable)
- Table: Feature | Status
- List production hardening features

#### 11. Contributing
- 5 numbered steps (fork, branch, commit, push, PR)
- One line intro

#### 12. License
- One line + link to LICENSE file

#### 13. Footer (centered)
```html
<div align="center">
  <img src="logo" width="40"/>
  <p>Made with <img src="heart.svg" width="14"/> by Name</p>
  <p>Link · Link · Link</p>
</div>
```

### SVG Icon Template
All icons should follow this template (Lucide-style):
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  width="24" height="24" fill="none"
  stroke="COLOR" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round">
  <!-- paths here -->
</svg>
```

### Badge Color Palette
| Use | Color |
|-----|-------|
| Primary | `7c3aed` |
| Blue | `0066ff` |
| Success | `10b981` |
| Warning | `f59e0b` |
| Error | `ef4444` |
| Neutral | `94a3b8` |

### What NOT to do
- NO emojis (use SVG icons)
- NO long paragraphs (max 3 sentences)
- NO placeholder text like "Lorem ipsum"
- NO excessive badges (max 5 in header)
- NO raw URLs (always use markdown links)
- NO nested bullet points deeper than 2 levels

---

## HOW TO USE THIS PROMPT

1. Copy everything from "PROMPT START" to the end
2. Add this at the bottom:

```
My project details:
- Name: [your project name]
- Tagline: [one line description]
- Repo URL: https://github.com/[user]/[repo]
- Live URL: [if deployed]
- Tech: [frontend], [backend], [database], [AI]
- Features: [list your 5-6 key features]
- Author: [your name]
- License: [MIT/Apache/etc]
```

3. Paste into any AI assistant (ChatGPT, Claude, Gemini, Antigravity)
4. It will generate the full README.md + all SVG icon files
