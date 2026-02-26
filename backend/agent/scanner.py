"""
Multi-Language Scanner — Autonomous Code Analysis Agent
Supports: Python, JavaScript/TypeScript, Go
Runs all scanners in parallel, reports unified issue format.
"""
import os
import re
import subprocess
import asyncio
import json
from collections import Counter

MAX_ISSUES_PER_SCANNER = 30
SKIP_DIRS = {'node_modules', '.git', 'dist', 'build', '.next', 'coverage',
             '__pycache__', 'venv', '.venv', 'env', '.env', 'vendor', 'target'}

LANGUAGE_MAP = {
    '.py': 'python', '.pyw': 'python',
    '.js': 'javascript', '.jsx': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript',
    '.ts': 'typescript', '.tsx': 'typescript',
    '.go': 'go',
    '.java': 'java', '.kt': 'kotlin',
    '.rs': 'rust',
    '.c': 'c', '.cpp': 'cpp', '.h': 'c', '.hpp': 'cpp',
    '.rb': 'ruby',
    '.php': 'php',
    '.css': 'css', '.scss': 'scss',
    '.html': 'html', '.htm': 'html',
    '.json': 'json', '.yaml': 'yaml', '.yml': 'yaml',
    '.md': 'markdown', '.txt': 'text',
    '.sh': 'shell', '.bash': 'shell',
}

# ─── Language Detection ────────────────────────────────────────────────


def detect_languages(repo_path: str) -> dict:
    """Scan repo and return language distribution statistics."""
    file_counts = Counter()
    line_counts = Counter()
    total_files = 0

    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            lang = LANGUAGE_MAP.get(ext)
            if not lang:
                continue
            total_files += 1
            file_counts[lang] += 1
            try:
                fp = os.path.join(root, f)
                with open(fp, 'r', encoding='utf-8', errors='ignore') as fh:
                    line_counts[lang] += sum(1 for _ in fh)
            except Exception:
                pass

    total_lines = max(sum(line_counts.values()), 1)
    distribution = {}
    for lang in sorted(line_counts, key=line_counts.get, reverse=True):
        pct = round((line_counts[lang] / total_lines) * 100, 1)
        distribution[lang] = {
            "files": file_counts[lang],
            "lines": line_counts[lang],
            "percentage": pct,
        }

    return {
        "total_files": total_files,
        "total_lines": total_lines,
        "languages": distribution,
    }


# ─── Python Scanner ───────────────────────────────────────────────────


async def scan_python(repo_path: str, log_callback=None):
    """Python Linting Agent — flake8 + bandit security scan."""
    if log_callback:
        await log_callback("[🐍 Python Agent] Initializing comprehensive analysis...", "INFO")

    issues = []
    has_py = any(
        f.endswith('.py')
        for root, _, files in os.walk(repo_path)
        for f in files
        if not any(skip in root for skip in SKIP_DIRS)
    )
    if not has_py:
        if log_callback:
            await log_callback("[🐍 Python Agent] No Python files found. Skipping.", "INFO")
        return issues

    # ── flake8 ──
    try:
        result = await asyncio.to_thread(
            subprocess.run,
            ['flake8', '.', '--format=default', '--max-line-length=120',
             '--statistics', '--count',
             '--exclude=node_modules,.git,__pycache__,venv,dist,.venv,env'],
            capture_output=True, text=True, cwd=repo_path, timeout=60
        )
        for line in result.stdout.splitlines():
            if not line.strip():
                continue
            parts = line.split(':')
            if len(parts) >= 4:
                file_path = parts[0].replace('\\', '/').lstrip('./')
                try:
                    line_num = int(parts[1])
                except ValueError:
                    continue
                message = ':'.join(parts[3:]).strip()
                raw_code = message.split()[0] if message else ''

                issue_type = "LINTING"
                if "E999" in message or "SyntaxError" in message:
                    issue_type = "SYNTAX"
                elif "F401" in message:
                    issue_type = "IMPORT"
                elif "F821" in message or "F811" in message:
                    issue_type = "LOGIC"
                elif "E711" in message or "E712" in message:
                    issue_type = "LOGIC"
                elif "W" in raw_code:
                    issue_type = "WARNING"

                severity = "error" if issue_type in ("SYNTAX", "LOGIC") else "warning"

                issues.append({
                    "file": file_path, "type": issue_type, "line": line_num,
                    "message": message, "raw": line, "severity": severity,
                    "rule_id": raw_code, "tool": "flake8",
                    "language": "python", "agent": "Python Agent"
                })
                if len(issues) >= MAX_ISSUES_PER_SCANNER:
                    break
    except subprocess.TimeoutExpired:
        if log_callback:
            await log_callback("[🐍 Python Agent] flake8 timed out.", "WARNING")
    except FileNotFoundError:
        if log_callback:
            await log_callback("[🐍 Python Agent] flake8 not installed. Skipping.", "WARNING")
    except Exception as e:
        if log_callback:
            await log_callback(f"[🐍 Python Agent] flake8 error: {str(e)[:100]}", "ERROR")

    # ── bandit (security) ──
    try:
        bandit_result = await asyncio.to_thread(
            subprocess.run,
            ['bandit', '-r', '.', '-f', 'json', '-q',
             '--exclude=node_modules,.git,__pycache__,venv,dist'],
            capture_output=True, text=True, cwd=repo_path, timeout=60
        )
        if bandit_result.stdout.strip():
            try:
                bandit_data = json.loads(bandit_result.stdout)
                for result_item in bandit_data.get('results', [])[:10]:
                    fp = result_item.get('filename', '').replace('\\', '/').lstrip('./')
                    issues.append({
                        "file": fp,
                        "type": "SECURITY",
                        "line": result_item.get('line_number', 0),
                        "message": result_item.get('issue_text', 'Security issue'),
                        "raw": result_item.get('test_id', ''),
                        "severity": result_item.get('issue_severity', 'MEDIUM').lower(),
                        "rule_id": result_item.get('test_id', ''),
                        "tool": "bandit",
                        "language": "python", "agent": "Security Agent"
                    })
            except json.JSONDecodeError:
                pass
        if log_callback:
            await log_callback("[🐍 Python Agent] bandit security scan complete.", "INFO")
    except FileNotFoundError:
        pass  # bandit not installed — skip silently
    except Exception:
        pass

    if log_callback:
        await log_callback(f"[🐍 Python Agent] Complete — {len(issues)} issues found.", "INFO")
    return issues


# ─── JavaScript / TypeScript Scanner ──────────────────────────────────


async def scan_javascript(repo_path: str, log_callback=None):
    """JS/TS Agent — tries ESLint first, falls back to pattern analysis."""
    if log_callback:
        await log_callback("[⚡ JS/TS Agent] Scanning JavaScript/TypeScript files...", "INFO")

    issues = []

    has_js = any(
        f.endswith(('.js', '.jsx', '.ts', '.tsx'))
        for root, _, files in os.walk(repo_path)
        for f in files
        if not any(skip in root for skip in SKIP_DIRS)
    )
    if not has_js:
        if log_callback:
            await log_callback("[⚡ JS/TS Agent] No JS/TS files found. Skipping.", "INFO")
        return issues

    # ── Try ESLint first ──
    eslint_success = False
    try:
        # Check if eslint is available (global or local)
        npx_cmd = 'npx.cmd' if os.name == 'nt' else 'npx'
        eslint_result = await asyncio.to_thread(
            subprocess.run,
            [npx_cmd, '--yes', 'eslint', '.', '-f', 'json', '--no-error-on-unmatched-pattern',
             '--ignore-pattern', 'node_modules', '--ignore-pattern', 'dist', '--ignore-pattern', 'build'],
            capture_output=True, text=True, cwd=repo_path, timeout=90
        )
        stdout = eslint_result.stdout.strip()
        if stdout and stdout.startswith('['):
            try:
                eslint_data = json.loads(stdout)
                for file_result in eslint_data:
                    fp = file_result.get('filePath', '').replace('\\', '/')
                    # Make path relative
                    try:
                        fp = os.path.relpath(fp, repo_path).replace('\\', '/')
                    except ValueError:
                        pass
                    for msg in file_result.get('messages', []):
                        severity = 'error' if msg.get('severity', 1) == 2 else 'warning'
                        rule = msg.get('ruleId', '')
                        issue_type = 'LINTING'
                        if rule and ('no-unused' in rule):
                            issue_type = 'IMPORT'
                        elif rule and ('no-undef' in rule or 'no-redeclare' in rule):
                            issue_type = 'LOGIC'
                        elif msg.get('fatal', False):
                            issue_type = 'SYNTAX'

                        issues.append({
                            "file": fp, "type": issue_type,
                            "line": msg.get('line', 0),
                            "message": msg.get('message', ''),
                            "raw": rule, "severity": severity,
                            "rule_id": rule, "tool": "eslint",
                            "language": "javascript", "agent": "JS/TS Agent"
                        })
                        if len(issues) >= MAX_ISSUES_PER_SCANNER:
                            break
                    if len(issues) >= MAX_ISSUES_PER_SCANNER:
                        break
                eslint_success = True
                if log_callback:
                    await log_callback(f"[⚡ JS/TS Agent] ESLint analysis — {len(issues)} issues.", "INFO")
            except json.JSONDecodeError:
                pass
    except Exception:
        pass

    # ── Fallback: Pattern-based scanning ──
    if not eslint_success:
        if log_callback:
            await log_callback("[⚡ JS/TS Agent] ESLint unavailable. Using pattern analysis...", "INFO")

        def _pattern_scan():
            for root, dirs, files in os.walk(repo_path):
                dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
                for filename in files:
                    if not filename.endswith(('.js', '.jsx', '.ts', '.tsx')):
                        continue
                    if filename.endswith(('.min.js', '.bundle.js', '.config.js', '.config.ts',
                                         '.config.cjs', '.config.mjs')):
                        continue
                    filepath = os.path.join(root, filename)
                    rel_path = os.path.relpath(filepath, repo_path).replace('\\', '/')
                    try:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            lines = f.readlines()
                        for i, line in enumerate(lines, 1):
                            stripped = line.strip()
                            if stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*'):
                                continue
                            if 'console.log(' in stripped:
                                issues.append({
                                    "file": rel_path, "type": "LINTING", "line": i,
                                    "message": "console.log() found — remove for production",
                                    "raw": "no-console", "severity": "warning",
                                    "rule_id": "no-console", "tool": "pattern",
                                    "language": "javascript", "agent": "JS/TS Agent"
                                })
                            if re.match(r'^var\s+', stripped):
                                issues.append({
                                    "file": rel_path, "type": "LINTING", "line": i,
                                    "message": "Use 'let' or 'const' instead of 'var'",
                                    "raw": "no-var", "severity": "warning",
                                    "rule_id": "no-var", "tool": "pattern",
                                    "language": "javascript", "agent": "JS/TS Agent"
                                })
                            if re.search(r'[^=!<>]==[^=]', stripped):
                                issues.append({
                                    "file": rel_path, "type": "LOGIC", "line": i,
                                    "message": "Use strict equality (===) instead of (==)",
                                    "raw": "eqeqeq", "severity": "error",
                                    "rule_id": "eqeqeq", "tool": "pattern",
                                    "language": "javascript", "agent": "JS/TS Agent"
                                })
                            if stripped in ('debugger;', 'debugger'):
                                issues.append({
                                    "file": rel_path, "type": "LINTING", "line": i,
                                    "message": "debugger statement — remove for production",
                                    "raw": "no-debugger", "severity": "error",
                                    "rule_id": "no-debugger", "tool": "pattern",
                                    "language": "javascript", "agent": "JS/TS Agent"
                                })
                            if len(issues) >= MAX_ISSUES_PER_SCANNER:
                                return
                    except Exception:
                        continue

        await asyncio.to_thread(_pattern_scan)

    if log_callback:
        await log_callback(f"[⚡ JS/TS Agent] Complete — {len(issues)} issues found.", "INFO")
    return issues


# ─── Go Scanner ───────────────────────────────────────────────────────


async def scan_go(repo_path: str, log_callback=None):
    """Go Agent — uses go vet + staticcheck if available."""
    if log_callback:
        await log_callback("[🔵 Go Agent] Scanning Go files...", "INFO")

    issues = []
    has_go = any(
        f.endswith('.go')
        for root, _, files in os.walk(repo_path)
        for f in files
        if not any(skip in root for skip in SKIP_DIRS)
    )
    if not has_go:
        if log_callback:
            await log_callback("[🔵 Go Agent] No Go files found. Skipping.", "INFO")
        return issues

    # ── go vet ──
    try:
        vet_result = await asyncio.to_thread(
            subprocess.run,
            ['go', 'vet', './...'],
            capture_output=True, text=True, cwd=repo_path, timeout=60
        )
        output = vet_result.stderr + '\n' + vet_result.stdout
        for line in output.splitlines():
            if not line.strip() or line.startswith('#'):
                continue
            # Format: path/file.go:line:col: message
            match = re.match(r'^(.+\.go):(\d+):(\d+)?:?\s*(.*)', line)
            if match:
                fp = match.group(1).replace('\\', '/').lstrip('./')
                issues.append({
                    "file": fp, "type": "LOGIC", "line": int(match.group(2)),
                    "message": match.group(4).strip(),
                    "raw": line, "severity": "error",
                    "rule_id": "go-vet", "tool": "go vet",
                    "language": "go", "agent": "Go Agent"
                })
                if len(issues) >= MAX_ISSUES_PER_SCANNER:
                    break
        if log_callback:
            await log_callback(f"[🔵 Go Agent] go vet — {len(issues)} issues.", "INFO")
    except FileNotFoundError:
        if log_callback:
            await log_callback("[🔵 Go Agent] Go not installed. Skipping.", "WARNING")
        return issues
    except Exception as e:
        if log_callback:
            await log_callback(f"[🔵 Go Agent] go vet error: {str(e)[:80]}", "WARNING")

    # ── staticcheck (if available) ──
    try:
        sc_result = await asyncio.to_thread(
            subprocess.run,
            ['staticcheck', './...'],
            capture_output=True, text=True, cwd=repo_path, timeout=60
        )
        for line in sc_result.stdout.splitlines():
            match = re.match(r'^(.+\.go):(\d+):(\d+)?:?\s*(.*)', line)
            if match:
                fp = match.group(1).replace('\\', '/').lstrip('./')
                issues.append({
                    "file": fp, "type": "LINTING", "line": int(match.group(2)),
                    "message": match.group(4).strip(),
                    "raw": line, "severity": "warning",
                    "rule_id": "staticcheck", "tool": "staticcheck",
                    "language": "go", "agent": "Go Agent"
                })
                if len(issues) >= MAX_ISSUES_PER_SCANNER:
                    break
    except FileNotFoundError:
        pass  # staticcheck not installed — skip silently
    except Exception:
        pass

    if log_callback:
        await log_callback(f"[🔵 Go Agent] Complete — {len(issues)} issues found.", "INFO")
    return issues


# ─── Security Scanner ─────────────────────────────────────────────────


async def scan_security(repo_path: str, log_callback=None):
    """Security Agent — Scans all languages for common vulnerabilities."""
    if log_callback:
        await log_callback("[🔒 Security Agent] Scanning for vulnerabilities...", "INFO")
    issues = []

    secret_patterns = [
        (r'(?i)(api[_-]?key|apikey)\s*[=:]\s*["\'][A-Za-z0-9_\-]{16,}', "Potential hardcoded API key"),
        (r'(?i)(secret|password|passwd)\s*[=:]\s*["\'][^"\']{8,}', "Potential hardcoded secret"),
        (r'(?i)(access[_-]?token|auth[_-]?token)\s*[=:]\s*["\'][A-Za-z0-9_\-]{16,}', "Hardcoded access token"),
        (r'(?i)(private[_-]?key)\s*[=:]\s*["\']', "Potential private key exposure"),
    ]
    code_patterns = [
        (r'\beval\s*\(', "eval() usage — code injection risk", ['.js', '.jsx', '.ts', '.tsx', '.py']),
        (r'\.innerHTML\s*=', "innerHTML assignment — XSS risk", ['.js', '.jsx', '.ts', '.tsx']),
        (r'(?i)exec\s*\(', "exec() usage — potential injection risk", ['.py']),
        (r'subprocess\.call\(.+shell\s*=\s*True', "Shell injection risk (shell=True)", ['.py']),
    ]

    def _scan():
        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
            for filename in files:
                ext = os.path.splitext(filename)[1].lower()
                if ext not in ['.py', '.js', '.jsx', '.ts', '.tsx', '.go', '.env', '.rb', '.php']:
                    continue
                if filename in ('package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'):
                    continue
                filepath = os.path.join(root, filename)
                rel_path = os.path.relpath(filepath, repo_path).replace('\\', '/')
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                    for i, line in enumerate(lines, 1):
                        stripped = line.strip()
                        if stripped.startswith('//') or stripped.startswith('#'):
                            continue
                        if "r'" in stripped or 'r"' in stripped or '\\b' in stripped:
                            continue
                        if stripped.startswith('import ') or stripped.startswith('from '):
                            continue
                        if '# noqa' in stripped or '# [AI-AGENT]' in stripped:
                            continue
                        for pattern, message in secret_patterns:
                            if re.search(pattern, stripped):
                                if any(p in stripped.lower() for p in
                                       ['placeholder', 'example', 'your_', 'xxx', 'test', 'mock', 'sample']):
                                    continue
                                issues.append({
                                    "file": rel_path, "type": "SECURITY", "line": i,
                                    "message": message, "raw": "security", "severity": "high",
                                    "rule_id": "hardcoded-secret", "tool": "security-scanner",
                                    "language": ext.lstrip('.'), "agent": "Security Agent"
                                })
                        for pattern, message, valid_exts in code_patterns:
                            if ext in valid_exts and re.search(pattern, stripped):
                                issues.append({
                                    "file": rel_path, "type": "SECURITY", "line": i,
                                    "message": message, "raw": "security", "severity": "medium",
                                    "rule_id": "dangerous-function", "tool": "security-scanner",
                                    "language": ext.lstrip('.'), "agent": "Security Agent"
                                })
                        if len(issues) >= MAX_ISSUES_PER_SCANNER:
                            return
                except Exception:
                    continue

    await asyncio.to_thread(_scan)
    if log_callback:
        await log_callback(f"[🔒 Security Agent] Complete — {len(issues)} potential issues.", "INFO")
    return issues


# ─── Master Scanner ───────────────────────────────────────────────────


async def scan_repository(repo_path: str, log_callback=None):
    """Run all scanning agents in parallel. Returns (issues, language_stats)."""
    # First, detect languages
    lang_stats = await asyncio.to_thread(detect_languages, repo_path)

    if log_callback:
        langs = lang_stats.get("languages", {})
        lang_summary = ", ".join(
            f"{k.capitalize()}: {v['percentage']}%"
            for k, v in list(langs.items())[:5]
        )
        await log_callback(
            f"[📊 Scanner] Repository: {lang_stats['total_files']} files, "
            f"{lang_stats['total_lines']} lines ({lang_summary})", "INFO"
        )

    # Determine which scanners to run based on detected languages
    detected = set(lang_stats.get("languages", {}).keys())
    tasks = []
    agent_names = []

    # Always run security scanner
    tasks.append(scan_security(repo_path, log_callback))
    agent_names.append("Security")

    if detected & {'python'}:
        tasks.append(scan_python(repo_path, log_callback))
        agent_names.append("Python")

    if detected & {'javascript', 'typescript'}:
        tasks.append(scan_javascript(repo_path, log_callback))
        agent_names.append("JS/TS")

    if detected & {'go'}:
        tasks.append(scan_go(repo_path, log_callback))
        agent_names.append("Go")

    if log_callback:
        await log_callback(
            f"Deploying {len(tasks)} parallel scanning agents: {', '.join(agent_names)}...", "INFO"
        )

    results = await asyncio.gather(*tasks)
    all_issues = []
    for r in results:
        all_issues.extend(r)

    if log_callback:
        # Build a breakdown
        by_type = Counter(i["type"] for i in all_issues)
        breakdown = ", ".join(f"{k}: {v}" for k, v in by_type.most_common())
        await log_callback(
            f"All agents complete. Total: {len(all_issues)} issues ({breakdown})", "INFO"
        )

    return all_issues
