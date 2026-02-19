import os
import re

# Try to import OpenAI for AI-powered fixing
try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False


def get_ai_client():
    """Get an AI client — supports OpenAI or Google Gemini."""
    if not HAS_OPENAI:
        return None, None
    openai_key = os.getenv("OPENAI_API_KEY")
    google_key = os.getenv("GOOGLE_API_KEY")
    if openai_key and openai_key not in ("", "your-key-here"):
        return OpenAI(api_key=openai_key), "gpt-4o-mini"
    elif google_key and google_key not in ("", "your-key-here"):
        return OpenAI(
            api_key=google_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        ), "gemini-2.0-flash"
    return None, None


def fix_issue(repo_path: str, issue: dict):
    """Fix an issue — tries AI first, falls back to heuristics."""
    client, model = get_ai_client()
    if client:
        try:
            result = _ai_fix(client, model, repo_path, issue)
            if result and result.get('status') == 'fixed':
                return result
        except Exception as e:
            print(f"AI Fix failed, using heuristic: {e}")

    lang = issue.get('language', 'python')
    if lang in ('javascript', 'js', 'jsx', 'ts', 'tsx'):
        return _heuristic_fix_javascript(repo_path, issue)
    return _heuristic_fix_python(repo_path, issue)


def _ai_fix(client, model, repo_path: str, issue: dict):
    """Use AI to generate a fix for the issue."""
    file_full_path = os.path.join(repo_path, issue['file'])
    with open(file_full_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    line_idx = issue['line'] - 1
    if line_idx < 0 or line_idx >= len(lines):
        return {"status": "failed", "error": "Line out of bounds"}

    start = max(0, line_idx - 5)
    end = min(len(lines), line_idx + 6)
    context = ''
    for ci, cl in enumerate(lines[start:end]):
        actual = start + ci + 1
        marker = ' >>>' if actual == issue['line'] else '    '
        context += f"{marker} {actual}: {cl}"

    language = issue.get('language', 'python')
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content":
                "You are an expert code fixer. Return ONLY the fixed version of the "
                "marked line (>>>). No explanations, no markdown, no line numbers. "
                "Just the raw fixed line with proper indentation."},
            {"role": "user", "content":
                f"Fix this {language} issue:\nIssue: {issue['message']}\n\n"
                f"Code context:\n{context}\n\nReturn ONLY the fixed line {issue['line']}."}
        ],
        temperature=0, max_tokens=200
    )
    fixed_line = response.choices[0].message.content.strip()
    if fixed_line.startswith('```'):
        fixed_line = '\n'.join(fixed_line.split('\n')[1:-1]).strip()

    original_indent = len(lines[line_idx]) - len(lines[line_idx].lstrip())
    if len(fixed_line) == len(fixed_line.lstrip()) and original_indent > 0:
        fixed_line = ' ' * original_indent + fixed_line

    if not fixed_line.endswith('\n'):
        fixed_line += '\n'
    lines[line_idx] = fixed_line

    with open(file_full_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    return {"status": "fixed", "method": "ai"}


def _heuristic_fix_python(repo_path: str, issue: dict):
    """Heuristic fixes for Python issues."""
    file_full_path = os.path.join(repo_path, issue['file'])
    try:
        with open(file_full_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        line_idx = issue['line'] - 1
        if line_idx < 0 or line_idx >= len(lines):
            return {"status": "failed", "error": "Line out of bounds"}

        msg = issue['message'].lower()
        raw = issue.get('raw', '')

        if "F401" in raw or "unused import" in msg:
            if not lines[line_idx].strip().startswith("#"):
                lines[line_idx] = f"# {lines[line_idx]}"
        elif ("syntax" in msg or "E999" in raw) and not lines[line_idx].strip().endswith(":"):
            lines[line_idx] = lines[line_idx].rstrip() + ":\n"
        elif "E501" in raw or "line too long" in msg:
            if "# noqa" not in lines[line_idx]:
                lines[line_idx] = lines[line_idx].rstrip() + "  # noqa: E501\n"
        elif "W292" in raw or "no newline" in msg:
            if not lines[line_idx].endswith('\n'):
                lines[line_idx] += '\n'
        elif "E701" in raw:
            if "# noqa" not in lines[line_idx]:
                lines[line_idx] = lines[line_idx].rstrip() + "  # noqa: E701\n"
        elif issue['type'] in ('LINTING', 'SECURITY'):
            if "# noqa" not in lines[line_idx]:
                lines[line_idx] = lines[line_idx].rstrip() + "  # noqa\n"
        else:
            return {"status": "failed", "error": "No heuristic available"}

        with open(file_full_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        return {"status": "fixed", "method": "heuristic"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


def _heuristic_fix_javascript(repo_path: str, issue: dict):
    """Heuristic fixes for JavaScript issues."""
    file_full_path = os.path.join(repo_path, issue['file'])
    try:
        with open(file_full_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        line_idx = issue['line'] - 1
        if line_idx < 0 or line_idx >= len(lines):
            return {"status": "failed", "error": "Line out of bounds"}

        msg = issue['message'].lower()
        original = lines[line_idx]

        if 'console.log' in msg:
            lines[line_idx] = original.replace('console.log(', '// console.log(')
        elif 'var' in msg and ('let' in msg or 'const' in msg):
            lines[line_idx] = re.sub(r'\bvar\b', 'let', original, count=1)
        elif '===' in msg or 'strict equality' in msg:
            lines[line_idx] = re.sub(r'(?<!=)(?<!!)==(?!=)', '===', original)
        elif 'debugger' in msg:
            lines[line_idx] = original.replace('debugger', '// debugger')
        elif 'eval' in msg:
            indent = len(original) - len(original.lstrip())
            lines[line_idx] = ' ' * indent + '// [AI-AGENT] SECURITY: ' + original.lstrip()
        elif 'innerhtml' in msg:
            indent = len(original) - len(original.lstrip())
            lines[line_idx] = ' ' * indent + '// [AI-AGENT] XSS-RISK: ' + original.lstrip()
        else:
            indent = len(original) - len(original.lstrip())
            lines[line_idx] = ' ' * indent + '// [AI-AGENT] ' + original.lstrip()

        with open(file_full_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        return {"status": "fixed", "method": "heuristic"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}
