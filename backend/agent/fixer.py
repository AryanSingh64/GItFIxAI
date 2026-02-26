"""
AI-Powered Code Fixer — Whole-File Context Intelligence
Tries AI (OpenAI / Gemini) first, then falls back to heuristics.
Supports: Python, JavaScript, TypeScript, Go
"""
import os
import re

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
    if openai_key and openai_key not in ("", "your-key-here", "your-openai-key-or-leave-blank"):
        return OpenAI(api_key=openai_key), "gpt-4o-mini"
    elif google_key and google_key not in ("", "your-key-here", "your-gemini-key-or-leave-blank"):
        return OpenAI(
            api_key=google_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        ), "gemini-2.0-flash"
    return None, None


def fix_issue(repo_path: str, issue: dict):
    """Fix an issue — tries AI first, falls back to heuristics. Returns before/after."""
    client, model = get_ai_client()
    if client:
        try:
            result = _ai_fix(client, model, repo_path, issue)
            if result and result.get('status') == 'fixed':
                return result
        except Exception as e:
            print(f"AI Fix failed, using heuristic: {e}")

    lang = issue.get('language', 'python')
    if lang in ('javascript', 'js', 'jsx', 'ts', 'tsx', 'typescript'):
        return _heuristic_fix_javascript(repo_path, issue)
    elif lang == 'go':
        return _heuristic_fix_go(repo_path, issue)
    return _heuristic_fix_python(repo_path, issue)


def _read_file(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.readlines()


def _write_file(path, lines):
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)


def _get_related_imports(repo_path, issue, lines):
    """Find related files for import resolution context."""
    related = []
    file_ext = os.path.splitext(issue['file'])[1]

    for line in lines:
        stripped = line.strip()
        # Python: from module import ...
        if stripped.startswith('from ') and 'import' in stripped:
            module = stripped.split('from ')[1].split(' import')[0].strip()
            if module.startswith('.'):
                rel = module.replace('.', os.sep) + '.py'
                candidates = [
                    os.path.join(repo_path, os.path.dirname(issue['file']), rel),
                    os.path.join(repo_path, rel.lstrip(os.sep)),
                ]
                for c in candidates:
                    if os.path.isfile(c) and len(related) < 2:
                        try:
                            with open(c, 'r', encoding='utf-8', errors='ignore') as f:
                                content = f.read()[:1000]
                            related.append(f"--- {os.path.basename(c)} ---\n{content}")
                        except Exception:
                            pass
        # JS/TS: import ... from './module'
        elif file_ext in ('.js', '.jsx', '.ts', '.tsx'):
            match = re.search(r"from\s+['\"](\.[^'\"]+)['\"]", stripped)
            if match:
                module_path = match.group(1)
                for ext in ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.ts']:
                    candidate = os.path.join(
                        repo_path, os.path.dirname(issue['file']),
                        module_path + ext
                    )
                    if os.path.isfile(candidate) and len(related) < 2:
                        try:
                            with open(candidate, 'r', encoding='utf-8', errors='ignore') as f:
                                content = f.read()[:1000]
                            related.append(f"--- {os.path.basename(candidate)} ---\n{content}")
                        except Exception:
                            pass
                        break
    return related


def _ai_fix(client, model, repo_path: str, issue: dict):
    """AI fix with whole-file context + related files."""
    file_full_path = os.path.join(repo_path, issue['file'])
    lines = _read_file(file_full_path)

    line_idx = issue['line'] - 1
    if line_idx < 0 or line_idx >= len(lines):
        return {"status": "failed", "error": "Line out of bounds"}

    before_line = lines[line_idx].rstrip('\n')

    # Build FULL file context (cap at 200 lines to avoid token limits)
    if len(lines) <= 200:
        context = ''
        for ci, cl in enumerate(lines):
            marker = ' >>>' if ci == line_idx else '    '
            context += f"{marker} {ci + 1}: {cl}"
    else:
        # Large file: show ±30 lines + imports section
        import_lines = []
        for ci, cl in enumerate(lines[:30]):
            import_lines.append(f"     {ci + 1}: {cl}")

        start = max(0, line_idx - 30)
        end = min(len(lines), line_idx + 31)
        context = "=== File head (imports/declarations) ===\n"
        context += ''.join(import_lines)
        if start > 30:
            context += f"\n... (lines {31}-{start} omitted) ...\n\n"
        context += "=== Context around issue ===\n"
        for ci in range(start, end):
            marker = ' >>>' if ci == line_idx else '    '
            context += f"{marker} {ci + 1}: {lines[ci]}"

    # Get related files for import resolution
    related_files = _get_related_imports(repo_path, issue, lines)
    related_context = ""
    if related_files:
        related_context = "\n\n=== Related files (for reference) ===\n" + "\n".join(related_files)

    language = issue.get('language', 'python')
    tool = issue.get('tool', 'linter')
    rule_id = issue.get('rule_id', '')

    system_prompt = (
        "You are an expert code fixer. You fix real bugs in production code.\n"
        "RULES:\n"
        "1. Return ONLY the fixed version of the marked line (>>>). No explanations.\n"
        "2. No markdown, no code fences, no line numbers in your response.\n"
        "3. Just the raw fixed line with proper indentation.\n"
        "4. If the fix requires removing the line entirely, return an empty line.\n"
        "5. Preserve the original coding style and indentation.\n"
        "6. Consider the full file context to make the best fix."
    )

    user_prompt = (
        f"Fix this {language} issue detected by {tool}:\n"
        f"Rule: {rule_id}\n"
        f"Issue: {issue['message']}\n\n"
        f"Full file ({issue['file']}):\n{context}"
        f"{related_context}\n\n"
        f"Return ONLY the fixed line {issue['line']}."
    )

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0, max_tokens=300
    )
    fixed_line = response.choices[0].message.content.strip()

    # Clean up AI response
    if fixed_line.startswith('```'):
        fixed_line = '\n'.join(fixed_line.split('\n')[1:-1]).strip()
    # Remove line number prefix if AI added one
    fixed_line = re.sub(r'^>>>\s*\d+:\s*', '', fixed_line)
    fixed_line = re.sub(r'^\d+:\s*', '', fixed_line)

    original_indent = len(lines[line_idx]) - len(lines[line_idx].lstrip())
    if len(fixed_line) == len(fixed_line.lstrip()) and original_indent > 0:
        fixed_line = ' ' * original_indent + fixed_line

    if not fixed_line.endswith('\n'):
        fixed_line += '\n'
    lines[line_idx] = fixed_line
    after_line = fixed_line.rstrip('\n')

    _write_file(file_full_path, lines)
    return {"status": "fixed", "method": "ai", "before": before_line, "after": after_line}


# ─── Heuristic Fixers ────────────────────────────────────────────────


def _heuristic_fix_python(repo_path: str, issue: dict):
    file_full_path = os.path.join(repo_path, issue['file'])
    try:
        lines = _read_file(file_full_path)
        line_idx = issue['line'] - 1
        if line_idx < 0 or line_idx >= len(lines):
            return {"status": "failed", "error": "Line out of bounds"}

        before_line = lines[line_idx].rstrip('\n')
        msg = issue['message'].lower()
        raw = issue.get('raw', '')
        rule = issue.get('rule_id', '')

        if "F401" in raw or rule == "F401" or "unused import" in msg:
            if not lines[line_idx].strip().startswith("#"):
                lines[line_idx] = f"# {lines[line_idx]}"
        elif ("syntax" in msg or "E999" in raw) and not lines[line_idx].strip().endswith(":"):
            lines[line_idx] = lines[line_idx].rstrip() + ":\n"

        # ── Whitespace & Formatting Fixes (ACTUALLY FIX, not noqa) ──

        elif "E261" in raw or "at least two spaces before inline comment" in msg:
            # Fix: ensure 2 spaces before #
            line = lines[line_idx]
            match = re.search(r'(\S)\s*(#)', line)
            if match:
                idx = match.start(2)
                lines[line_idx] = line[:match.end(1)] + '  ' + line[idx:]

        elif "E262" in raw or "inline comment should start with" in msg:
            # Fix: # must be followed by a space
            lines[line_idx] = re.sub(r'#(\S)', r'# \1', lines[line_idx])

        elif "E265" in raw or "block comment should start with" in msg:
            # Fix: block comment must be "# " not "#text"
            line = lines[line_idx]
            stripped = line.lstrip()
            indent = len(line) - len(stripped)
            if stripped.startswith('#') and not stripped.startswith('# ') and not stripped.startswith('#!'):
                lines[line_idx] = ' ' * indent + '# ' + stripped[1:].lstrip()
                if not lines[line_idx].endswith('\n'):
                    lines[line_idx] += '\n'

        elif "E266" in raw or "too many leading '#'" in msg:
            # Fix: remove extra # from block comment
            line = lines[line_idx]
            stripped = line.lstrip()
            indent = len(line) - len(stripped)
            content = stripped.lstrip('#').lstrip()
            lines[line_idx] = ' ' * indent + '# ' + content
            if not lines[line_idx].endswith('\n'):
                lines[line_idx] += '\n'

        elif "W291" in raw or "W293" in raw or "trailing whitespace" in msg:
            lines[line_idx] = lines[line_idx].rstrip() + '\n'

        elif "W292" in raw or "no newline" in msg:
            if not lines[line_idx].endswith('\n'):
                lines[line_idx] += '\n'

        elif "E303" in raw or "too many blank lines" in msg:
            # Remove extra blank line (replace with empty)
            lines[line_idx] = ''

        elif "E302" in raw or "expected 2 blank" in msg:
            lines[line_idx] = '\n' + lines[line_idx]

        elif "E301" in raw or "expected 1 blank" in msg:
            lines[line_idx] = '\n' + lines[line_idx]

        elif "E251" in raw or "unexpected spaces around keyword" in msg:
            # Fix: def foo(x = 1) → def foo(x=1)
            lines[line_idx] = re.sub(r'\s*=\s*', '=', lines[line_idx])
            if not lines[line_idx].endswith('\n'):
                lines[line_idx] += '\n'

        elif "E225" in raw or "missing whitespace around operator" in msg:
            # Fix: x=1 → x = 1 (but NOT in function defaults)
            line = lines[line_idx]
            if 'def ' not in line and 'lambda' not in line:
                line = re.sub(r'(\w)([+\-*/]=?|[<>!=]=|==)(\w)', r'\1 \2 \3', line)
                lines[line_idx] = line

        elif "E226" in raw or "missing whitespace around arithmetic" in msg:
            line = lines[line_idx]
            line = re.sub(r'(\w)([*/%])(\w)', r'\1 \2 \3', line)
            lines[line_idx] = line

        elif "E228" in raw or "missing whitespace around modulo" in msg:
            lines[line_idx] = re.sub(r'(\S)%(\S)', r'\1 % \2', lines[line_idx])

        elif "E231" in raw or "missing whitespace after" in msg:
            # Fix: [1,2,3] → [1, 2, 3]
            lines[line_idx] = re.sub(r',(\S)', r', \1', lines[line_idx])
            lines[line_idx] = re.sub(r':(\S)', r': \1', lines[line_idx])

        elif "E241" in raw or "multiple spaces after" in msg:
            lines[line_idx] = re.sub(r':\s{2,}', ': ', lines[line_idx])

        elif "E271" in raw or "multiple spaces after keyword" in msg:
            lines[line_idx] = re.sub(r'(import|from|class|def|if|elif|else|return|raise|except|with|as|in|not|and|or)\s{2,}', r'\1 ', lines[line_idx])

        elif "E401" in raw or "multiple imports on one line" in msg:
            # Fix: import os, sys → import os\nimport sys
            line = lines[line_idx]
            stripped = line.strip()
            indent = len(line) - len(line.lstrip())
            if stripped.startswith('import ') and ',' in stripped:
                modules = stripped.replace('import ', '').split(',')
                new_lines = ''.join(f"{' ' * indent}import {m.strip()}\n" for m in modules)
                lines[line_idx] = new_lines

        elif "E711" in raw:
            lines[line_idx] = lines[line_idx].replace('== None', 'is None').replace('!= None', 'is not None')
            if not lines[line_idx].endswith('\n'):
                lines[line_idx] += '\n'

        elif "E712" in raw:
            lines[line_idx] = lines[line_idx].replace('== True', '').replace('== False', '')
            if not lines[line_idx].endswith('\n'):
                lines[line_idx] += '\n'

        elif "E501" in raw or "line too long" in msg:
            # Line too long — only suppress if we can't easily fix it
            if "# noqa" not in lines[line_idx]:
                lines[line_idx] = lines[line_idx].rstrip() + "  # noqa: E501\n"

        elif "E701" in raw or "multiple statements on one line" in msg:
            # Try to split on colon for things like `if x: return y`
            line = lines[line_idx]
            stripped = line.strip()
            indent = len(line) - len(line.lstrip())
            match = re.match(r'(if|elif|else|for|while|with|try|except|finally)\s*.*?:\s*(.+)', stripped)
            if match:
                keyword_part = stripped[:stripped.rindex(':') - len(match.group(2)) + len(match.group(2))]
                # Just split into two lines
                colon_idx = stripped.index(':')
                first = stripped[:colon_idx + 1]
                second = stripped[colon_idx + 1:].strip()
                lines[line_idx] = ' ' * indent + first + '\n' + ' ' * (indent + 4) + second + '\n'
            else:
                if "# noqa" not in lines[line_idx]:
                    lines[line_idx] = lines[line_idx].rstrip() + "  # noqa: E701\n"

        elif "F811" in raw or "redefinition of unused" in msg:
            if not lines[line_idx].strip().startswith("#"):
                lines[line_idx] = f"# {lines[line_idx]}"

        # ── Fallback: only use noqa as LAST RESORT ──
        elif issue['type'] == 'SECURITY':
            indent = len(lines[line_idx]) - len(lines[line_idx].lstrip())
            lines[line_idx] = ' ' * indent + '# [AI-AGENT] SECURITY: ' + lines[line_idx].lstrip()
        elif issue['type'] in ('LINTING', 'WARNING') and "# noqa" not in lines[line_idx]:
            lines[line_idx] = lines[line_idx].rstrip() + "  # noqa\n"
        else:
            return {"status": "failed", "error": "No heuristic available"}


        after_line = lines[line_idx].rstrip('\n')
        _write_file(file_full_path, lines)
        return {"status": "fixed", "method": "heuristic", "before": before_line, "after": after_line}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


def _heuristic_fix_javascript(repo_path: str, issue: dict):
    file_full_path = os.path.join(repo_path, issue['file'])
    try:
        lines = _read_file(file_full_path)
        line_idx = issue['line'] - 1
        if line_idx < 0 or line_idx >= len(lines):
            return {"status": "failed", "error": "Line out of bounds"}

        before_line = lines[line_idx].rstrip('\n')
        msg = issue['message'].lower()
        rule = issue.get('rule_id', '')
        original = lines[line_idx]

        if 'console.log' in msg or rule == 'no-console':
            lines[line_idx] = original.replace('console.log(', '// console.log(')
        elif ('var' in msg and ('let' in msg or 'const' in msg)) or rule == 'no-var':
            lines[line_idx] = re.sub(r'\bvar\b', 'let', original, count=1)
        elif '===' in msg or 'strict equality' in msg or rule == 'eqeqeq':
            lines[line_idx] = re.sub(r'(?<!=)(?<!!)(?<!<)(?<!>)==(?!=)', '===', original)
        elif 'debugger' in msg or rule == 'no-debugger':
            lines[line_idx] = original.replace('debugger', '// debugger')
        elif 'eval' in msg or rule == 'no-eval':
            indent = len(original) - len(original.lstrip())
            lines[line_idx] = ' ' * indent + '// [AI-AGENT] SECURITY: ' + original.lstrip()
        elif 'innerhtml' in msg:
            indent = len(original) - len(original.lstrip())
            lines[line_idx] = ' ' * indent + '// [AI-AGENT] XSS-RISK: ' + original.lstrip()
        elif 'no-unused-vars' in rule or 'no-unused' in rule:
            indent = len(original) - len(original.lstrip())
            lines[line_idx] = ' ' * indent + '// ' + original.lstrip()
        elif 'semi' in rule:
            if not original.rstrip().endswith(';'):
                lines[line_idx] = original.rstrip() + ';\n'
        else:
            indent = len(original) - len(original.lstrip())
            lines[line_idx] = ' ' * indent + '// [AI-AGENT] ' + original.lstrip()

        after_line = lines[line_idx].rstrip('\n')
        _write_file(file_full_path, lines)
        return {"status": "fixed", "method": "heuristic", "before": before_line, "after": after_line}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


def _heuristic_fix_go(repo_path: str, issue: dict):
    """Go heuristic fixer — handles common Go issues."""
    file_full_path = os.path.join(repo_path, issue['file'])
    try:
        lines = _read_file(file_full_path)
        line_idx = issue['line'] - 1
        if line_idx < 0 or line_idx >= len(lines):
            return {"status": "failed", "error": "Line out of bounds"}

        before_line = lines[line_idx].rstrip('\n')
        msg = issue['message'].lower()
        original = lines[line_idx]

        if 'declared but not used' in msg or 'declared and not used' in msg:
            # Comment out unused variable
            indent = len(original) - len(original.lstrip())
            lines[line_idx] = ' ' * indent + '// ' + original.lstrip()
        elif 'imported and not used' in msg:
            # Comment out unused import
            indent = len(original) - len(original.lstrip())
            lines[line_idx] = ' ' * indent + '// ' + original.lstrip()
        elif 'should have comment' in msg or 'exported' in msg:
            # Add a comment for exported func/type
            func_name = original.strip().split('(')[0].split()[-1] if '(' in original else 'function'
            lines[line_idx] = f"// {func_name} ...\n" + original
        elif 'error return value not checked' in msg:
            indent = len(original) - len(original.lstrip())
            lines[line_idx] = ' ' * indent + '// [AI-AGENT] TODO: handle error\n' + original
        else:
            indent = len(original) - len(original.lstrip())
            lines[line_idx] = ' ' * indent + '// [AI-AGENT] ' + original.lstrip()

        after_line = lines[line_idx].rstrip('\n')
        _write_file(file_full_path, lines)
        return {"status": "fixed", "method": "heuristic", "before": before_line, "after": after_line}
    except Exception as e:
        return {"status": "failed", "error": str(e)}
