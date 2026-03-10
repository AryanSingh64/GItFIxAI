"""
Test Runner Agent — Auto-discovers and runs test frameworks.
Supports: pytest (Python), jest/vitest/mocha (JS/TS), go test (Go)
"""
import os
import re
import subprocess
import asyncio
import json


SKIP_DIRS = {'node_modules', '.git', 'dist', 'build', '.next',
             'coverage', '__pycache__', 'venv', '.venv', 'vendor'}


def detect_test_framework(repo_path: str) -> list:
    """Detect which test frameworks are available in the repo."""
    frameworks = []

    # ── Python ──
    has_py_tests = any(
        f.startswith('test_') or f.endswith('_test.py')
        for root, _, files in os.walk(repo_path)
        for f in files
        if f.endswith('.py') and not any(s in root for s in SKIP_DIRS)
    )
    if has_py_tests:
        # Check for pytest
        req_file = os.path.join(repo_path, 'requirements.txt')
        pyproject = os.path.join(repo_path, 'pyproject.toml')
        setup_py = os.path.join(repo_path, 'setup.py')

        is_pytest = False
        for f in [req_file, pyproject, setup_py]:
            if os.path.isfile(f):
                try:
                    with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
                        if 'pytest' in fh.read():
                            is_pytest = True
                            break
                except Exception:
                    pass

        # Default to pytest for Python
        frameworks.append({
            "name": "pytest",
            "language": "python",
            "command": ["python", "-m", "pytest", "--tb=short", "-q", "--no-header"],
            "icon": "🐍",
        })

    # ── JavaScript/TypeScript ──
    pkg_json_path = os.path.join(repo_path, 'package.json')
    if os.path.isfile(pkg_json_path):
        try:
            with open(pkg_json_path, 'r', encoding='utf-8') as f:
                pkg = json.load(f)
            deps = {}
            deps.update(pkg.get('dependencies', {}))
            deps.update(pkg.get('devDependencies', {}))
            scripts = pkg.get('scripts', {})

            npx_cmd = 'npx.cmd' if os.name == 'nt' else 'npx'

            if 'vitest' in deps or 'vitest' in scripts.get('test', ''):
                frameworks.append({
                    "name": "vitest",
                    "language": "javascript",
                    "command": [npx_cmd, "vitest", "run", "--reporter=json"],
                    "icon": "⚡",
                })
            elif 'jest' in deps or 'jest' in scripts.get('test', ''):
                frameworks.append({
                    "name": "jest",
                    "language": "javascript",
                    "command": [npx_cmd, "jest", "--json", "--no-coverage"],
                    "icon": "🃏",
                })
            elif 'mocha' in deps:
                frameworks.append({
                    "name": "mocha",
                    "language": "javascript",
                    "command": [npx_cmd, "mocha", "--reporter", "json"],
                    "icon": "☕",
                })
            elif 'test' in scripts:
                # Generic npm test
                npm_cmd = 'npm.cmd' if os.name == 'nt' else 'npm'
                frameworks.append({
                    "name": "npm test",
                    "language": "javascript",
                    "command": [npm_cmd, "test", "--", "--no-coverage"],
                    "icon": "📦",
                })
        except Exception:
            pass

    # ── Go ──
    has_go_tests = any(
        f.endswith('_test.go')
        for root, _, files in os.walk(repo_path)
        for f in files
        if not any(s in root for s in SKIP_DIRS)
    )
    if has_go_tests:
        frameworks.append({
            "name": "go test",
            "language": "go",
            "command": ["go", "test", "-json", "./..."],
            "icon": "🔵",
        })

    return frameworks


async def run_tests(repo_path: str, framework: dict, log_callback=None) -> dict:
    """Run a specific test framework and parse results."""
    name = framework['name']
    icon = framework['icon']
    cmd = framework['command']

    if log_callback:
        await log_callback(f"[{icon} Test Agent] Running {name}...", "ACTION")

    try:
        result = await asyncio.to_thread(
            subprocess.run,
            cmd,
            capture_output=True, text=True, cwd=repo_path,
            timeout=300,  # 5 minute timeout
            env={**os.environ, 'CI': 'true', 'FORCE_COLOR': '0'}
        )

        stdout = result.stdout
        stderr = result.stderr
        exit_code = result.returncode
        output = stdout + '\n' + stderr

        # Parse results based on framework
        test_result = {
            "framework": name,
            "language": framework['language'],
            "exit_code": exit_code,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "total": 0,
            "duration_ms": 0,
            "failures": [],
            "raw_output": output[:5000],  # Cap output
        }

        if name == "pytest":
            test_result = _parse_pytest(output, test_result)
        elif name in ("jest", "vitest"):
            test_result = _parse_jest(stdout, test_result)
        elif name == "go test":
            test_result = _parse_go_test(stdout, test_result)
        else:
            # Generic: just check exit code
            test_result["passed"] = 1 if exit_code == 0 else 0
            test_result["failed"] = 0 if exit_code == 0 else 1
            test_result["total"] = 1

        if log_callback:
            status = "SUCCESS" if test_result['failed'] == 0 else "WARNING"
            await log_callback(
                f"[{icon} Test Agent] {name}: {test_result['passed']} passed, "
                f"{test_result['failed']} failed, {test_result['skipped']} skipped",
                status
            )

        return test_result

    except subprocess.TimeoutExpired:
        if log_callback:
            await log_callback(f"[{icon} Test Agent] {name} timed out (5 min limit).", "ERROR")
        return {
            "framework": name, "language": framework['language'],
            "exit_code": -1, "passed": 0, "failed": 0, "skipped": 0,
            "total": 0, "failures": [], "raw_output": "TIMEOUT",
            "error": "Test execution timed out"
        }
    except FileNotFoundError:
        if log_callback:
            await log_callback(f"[{icon} Test Agent] {name} not installed. Skipping.", "WARNING")
        return {
            "framework": name, "language": framework['language'],
            "exit_code": -1, "passed": 0, "failed": 0, "skipped": 0,
            "total": 0, "failures": [], "raw_output": "NOT_INSTALLED",
            "error": f"{name} not installed"
        }
    except Exception as e:
        if log_callback:
            await log_callback(f"[{icon} Test Agent] {name} error: {str(e)[:100]}", "ERROR")
        return {
            "framework": name, "language": framework['language'],
            "exit_code": -1, "passed": 0, "failed": 0, "skipped": 0,
            "total": 0, "failures": [], "raw_output": str(e)[:2000],
            "error": str(e)
        }


def _parse_pytest(output: str, result: dict) -> dict:
    """Parse pytest output."""
    # Look for summary line: "5 passed, 2 failed, 1 skipped in 3.45s"
    summary_match = re.search(
        r'(\d+)\s+passed.*?(?:(\d+)\s+failed)?.*?(?:(\d+)\s+skipped)?.*?in\s+([\d.]+)s',
        output
    )
    if summary_match:
        result['passed'] = int(summary_match.group(1) or 0)
        result['failed'] = int(summary_match.group(2) or 0)
        result['skipped'] = int(summary_match.group(3) or 0)
        result['duration_ms'] = int(float(summary_match.group(4)) * 1000)
    else:
        # Alternative patterns
        passed = re.findall(r'(\d+)\s+passed', output)
        failed = re.findall(r'(\d+)\s+failed', output)
        skipped = re.findall(r'(\d+)\s+skipped', output)
        if passed:
            result['passed'] = int(passed[-1])
        if failed:
            result['failed'] = int(failed[-1])
        if skipped:
            result['skipped'] = int(skipped[-1])

    result['total'] = result['passed'] + result['failed'] + result['skipped']

    # Extract failure details
    failure_blocks = re.findall(
        r'FAILED\s+([\w/\\.:]+)\s*-\s*(.*?)(?=FAILED|$)',
        output, re.DOTALL
    )
    for test_name, details in failure_blocks[:10]:
        result['failures'].append({
            "test": test_name.strip(),
            "message": details.strip()[:500],
        })

    # Also try to capture error lines
    if not result['failures']:
        error_lines = re.findall(r'(test_\S+.*?(?:Error|Exception|Assert).*)', output, re.IGNORECASE)
        for err in error_lines[:5]:
            result['failures'].append({"test": "unknown", "message": err[:300]})

    return result


def _parse_jest(stdout: str, result: dict) -> dict:
    """Parse Jest/Vitest JSON output."""
    try:
        data = json.loads(stdout)
        result['passed'] = data.get('numPassedTests', 0)
        result['failed'] = data.get('numFailedTests', 0)
        result['skipped'] = data.get('numPendingTests', 0)
        result['total'] = data.get('numTotalTests', 0)

        for suite in data.get('testResults', []):
            for test in suite.get('testResults', []):
                if test.get('status') == 'failed':
                    result['failures'].append({
                        "test": test.get('fullName', test.get('title', 'unknown')),
                        "message": '\n'.join(test.get('failureMessages', []))[:500],
                        "file": suite.get('name', ''),
                    })
    except json.JSONDecodeError:
        # Fallback: parse text output
        passed = re.findall(r'Tests:\s+(\d+)\s+passed', stdout)
        failed = re.findall(r'Tests:\s+(\d+)\s+failed', stdout)
        if passed:
            result['passed'] = int(passed[-1])
        if failed:
            result['failed'] = int(failed[-1])
        result['total'] = result['passed'] + result['failed']

    return result


def _parse_go_test(stdout: str, result: dict) -> dict:
    """Parse Go test JSON output."""
    passed = 0
    failed = 0
    failures = []

    for line in stdout.splitlines():
        if not line.strip():
            continue
        try:
            event = json.loads(line)
            action = event.get('Action', '')
            if action == 'pass':
                if event.get('Test'):
                    passed += 1
            elif action == 'fail':
                if event.get('Test'):
                    failed += 1
                    failures.append({
                        "test": event.get('Test', 'unknown'),
                        "message": event.get('Output', '')[:300],
                        "file": event.get('Package', ''),
                    })
        except json.JSONDecodeError:
            # Non-JSON line
            if 'FAIL' in line:
                failed += 1
            elif 'PASS' in line or 'ok' in line:
                passed += 1

    result['passed'] = passed
    result['failed'] = failed
    result['total'] = passed + failed
    result['failures'] = failures[:10]
    return result


async def discover_and_run_tests(repo_path: str, log_callback=None) -> dict:
    """Main entry: discover all test frameworks and run them."""
    if log_callback:
        await log_callback("[🧪 Test Agent] Discovering test frameworks...", "INFO")

    frameworks = await asyncio.to_thread(detect_test_framework, repo_path)

    if not frameworks:
        if log_callback:
            await log_callback("[🧪 Test Agent] No test frameworks detected. Skipping tests.", "INFO")
        return {
            "detected": False,
            "frameworks": [],
            "results": [],
            "summary": {"total": 0, "passed": 0, "failed": 0, "skipped": 0},
        }

    framework_names = [f"{f['icon']} {f['name']}" for f in frameworks]
    if log_callback:
        await log_callback(
            f"[🧪 Test Agent] Detected: {', '.join(framework_names)}", "INFO"
        )

    # Run all test frameworks
    results = []
    for fw in frameworks:
        r = await run_tests(repo_path, fw, log_callback)
        results.append(r)

    # Aggregate results
    total_passed = sum(r['passed'] for r in results)
    total_failed = sum(r['failed'] for r in results)
    total_skipped = sum(r['skipped'] for r in results)
    total_tests = sum(r['total'] for r in results)

    if log_callback:
        status = "SUCCESS" if total_failed == 0 else "WARNING"
        await log_callback(
            f"[🧪 Test Agent] Complete — {total_tests} tests: "
            f"✅ {total_passed} passed, ❌ {total_failed} failed, ⏭️ {total_skipped} skipped",
            status
        )

    return {
        "detected": True,
        "frameworks": [f['name'] for f in frameworks],
        "results": results,
        "summary": {
            "total": total_tests,
            "passed": total_passed,
            "failed": total_failed,
            "skipped": total_skipped,
        },
    }
