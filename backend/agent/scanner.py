import os
import re
import subprocess
import asyncio

MAX_ISSUES_PER_SCANNER = 20


async def scan_python(repo_path: str, log_callback=None):
    """Python Linting Agent - Uses flake8."""
    if log_callback:
        await log_callback("[🐍 Python Agent] Initializing flake8 analysis...", "INFO")
    issues = []
    has_py = any(
        f.endswith('.py')
        for root, _, files in os.walk(repo_path)
        for f in files
        if '.git' not in root and 'node_modules' not in root
    )
    if not has_py:
        if log_callback:
            await log_callback("[🐍 Python Agent] No Python files found. Skipping.", "INFO")
        return issues
    try:
        result = await asyncio.to_thread(
            subprocess.run,
            ['flake8', '.', '--format=default', '--max-line-length=120',
             '--exclude=node_modules,.git,__pycache__,venv,dist'],
            capture_output=True, text=True, cwd=repo_path, timeout=30
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
                issue_type = "LINTING"
                if "E999" in message or "SyntaxError" in message:
                    issue_type = "SYNTAX"
                elif "F401" in message:
                    issue_type = "UNUSED_IMPORT"
                elif "F821" in message:
                    issue_type = "LOGIC"
                issues.append({
                    "file": file_path, "type": issue_type, "line": line_num,
                    "message": message, "raw": line,
                    "language": "python", "agent": "Python Agent"
                })
                if len(issues) >= MAX_ISSUES_PER_SCANNER:
                    break
    except subprocess.TimeoutExpired:
        if log_callback:
            await log_callback("[🐍 Python Agent] Analysis timed out.", "WARNING")
    except FileNotFoundError:
        if log_callback:
            await log_callback("[🐍 Python Agent] flake8 not installed. Skipping.", "WARNING")
    except Exception as e:
        if log_callback:
            await log_callback(f"[🐍 Python Agent] Error: {str(e)}", "ERROR")
    if log_callback:
        await log_callback(f"[🐍 Python Agent] Complete — {len(issues)} issues found.", "INFO")
    return issues


async def scan_javascript(repo_path: str, log_callback=None):
    """JavaScript Agent - Pattern-based analysis."""
    if log_callback:
        await log_callback("[⚡ JS Agent] Scanning JavaScript/TypeScript files...", "INFO")
    issues = []
    skip_dirs = {'node_modules', '.git', 'dist', 'build', '.next', 'coverage', '__pycache__', 'venv'}

    def _scan():
        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if d not in skip_dirs]
            for filename in files:
                if not filename.endswith(('.js', '.jsx', '.ts', '.tsx')):
                    continue
                if filename.endswith(('.min.js', '.bundle.js', '.config.js', '.config.ts', '.config.cjs', '.config.mjs')):  # noqa: E501
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
                            issues.append({"file": rel_path, "type": "LINTING", "line": i,
                                "message": "console.log() found — remove for production",  # noqa
                                "raw": "console-log", "language": "javascript", "agent": "JS Agent"})  # noqa
                        if re.match(r'^var\s+', stripped):
                            issues.append({"file": rel_path, "type": "LINTING", "line": i,
                                "message": "Use 'let' or 'const' instead of 'var'",  # noqa
                                "raw": "no-var", "language": "javascript", "agent": "JS Agent"})  # noqa
                        if re.search(r'[^=!<>]==[^=]', stripped):
                            issues.append({"file": rel_path, "type": "LOGIC", "line": i,
                                "message": "Use strict equality (===) instead of (==)",  # noqa
                                "raw": "eqeqeq", "language": "javascript", "agent": "JS Agent"})  # noqa
                        if stripped in ('debugger;', 'debugger'):
                            issues.append({"file": rel_path, "type": "LINTING", "line": i,
                                "message": "debugger statement — remove for production",  # noqa
                                "raw": "no-debugger", "language": "javascript", "agent": "JS Agent"})  # noqa
                        if len(issues) >= MAX_ISSUES_PER_SCANNER:
                            return
                except Exception:
                    continue
    await asyncio.to_thread(_scan)
    if log_callback:
        await log_callback(f"[⚡ JS Agent] Complete — {len(issues)} issues found.", "INFO")
    return issues


async def scan_security(repo_path: str, log_callback=None):
    """Security Agent - Checks for common vulnerabilities."""
    if log_callback:
        await log_callback("[🔒 Security Agent] Scanning for vulnerabilities...", "INFO")
    issues = []
    skip_dirs = {'node_modules', '.git', 'dist', 'build', '__pycache__', 'venv', '.next'}
    secret_patterns = [
        (r'(?i)(api[_-]?key|apikey)\s*[=:]\s*["\'][A-Za-z0-9_\-]{16,}', "Potential hardcoded API key"),
        (r'(?i)(secret|password|passwd)\s*[=:]\s*["\'][^"\']{8,}', "Potential hardcoded secret"),
        (r'(?i)(access[_-]?token|auth[_-]?token)\s*[=:]\s*["\'][A-Za-z0-9_\-]{16,}', "Hardcoded access token"),
    ]
    code_patterns = [
        (r'\beval\s*\(', "eval() usage — code injection risk", ['.js', '.jsx', '.ts', '.tsx', '.py']),
        (r'\.innerHTML\s*=', "innerHTML assignment — XSS risk", ['.js', '.jsx', '.ts', '.tsx']),
    ]

    def _scan():
        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if d not in skip_dirs]
            for filename in files:
                ext = os.path.splitext(filename)[1]
                if ext not in ['.py', '.js', '.jsx', '.ts', '.tsx', '.env']:
                    continue
                if filename in ['package-lock.json', 'yarn.lock']:
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
                        # Skip regex patterns, string definitions, and comments
                        if "r'" in stripped or 'r"' in stripped or '\\b' in stripped:
                            continue
                        if stripped.startswith('import ') or stripped.startswith('from '):
                            continue
                        if '# noqa' in stripped or '# [AI-AGENT]' in stripped:
                            continue
                        for pattern, message in secret_patterns:
                            if re.search(pattern, stripped):
                                if any(p in stripped.lower() for p in ['placeholder', 'example', 'your_', 'xxx']):
                                    continue
                                issues.append({"file": rel_path, "type": "SECURITY", "line": i,
                                    "message": message, "raw": "security",  # noqa
                                    "language": ext.lstrip('.'), "agent": "Security Agent"})
                        for pattern, message, valid_exts in code_patterns:
                            if ext in valid_exts and re.search(pattern, stripped):
                                issues.append({"file": rel_path, "type": "SECURITY", "line": i,
                                    "message": message, "raw": "security",
                                    "language": ext.lstrip('.'), "agent": "Security Agent"})
                        if len(issues) >= MAX_ISSUES_PER_SCANNER:
                            return
                except Exception:
                    continue
    await asyncio.to_thread(_scan)
    if log_callback:
        await log_callback(f"[🔒 Security Agent] Complete — {len(issues)} potential issues.", "INFO")
    return issues


async def scan_repository(repo_path: str, log_callback=None):
    """Run all scanning agents in parallel."""
    if log_callback:
        await log_callback("Deploying 3 parallel scanning agents...", "INFO")
    py, js, sec = await asyncio.gather(
        scan_python(repo_path, log_callback),
        scan_javascript(repo_path, log_callback),
        scan_security(repo_path, log_callback)
    )
    all_issues = py + js + sec
    if log_callback:
        await log_callback(
            f"All agents complete. Total: {len(all_issues)} issues "
            f"(Python: {len(py)}, JS: {len(js)}, Security: {len(sec)})", "INFO")
    return all_issues
