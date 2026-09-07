/**
 * Multi-Language Static & Security Scanner
 * Fast, AST & pattern-based analysis for Python, JavaScript, TypeScript, Go, and Security.
 */

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', 'coverage',
  '__pycache__', 'venv', '.venv', 'vendor', 'target', '.vscode'
]);

const LANGUAGE_MAP = {
  '.py': 'python',
  '.js': 'javascript', '.jsx': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript',
  '.ts': 'typescript', '.tsx': 'typescript',
  '.go': 'go',
  '.json': 'json', '.yaml': 'yaml', '.yml': 'yaml',
  '.html': 'html', '.css': 'css',
  '.md': 'markdown'
};

export function detectLanguagesFromTree(tree) {
  const fileCounts = {};
  let totalFiles = 0;

  for (const item of tree) {
    if (item.type !== 'blob') continue;
    const parts = item.path.split('/');
    if (parts.some(p => SKIP_DIRS.has(p))) continue;

    const ext = '.' + (item.path.split('.').pop() || '').toLowerCase();
    const lang = LANGUAGE_MAP[ext];
    if (!lang) continue;

    fileCounts[lang] = (fileCounts[lang] || 0) + 1;
    totalFiles += 1;
  }

  const distribution = {};
  for (const [lang, count] of Object.entries(fileCounts)) {
    distribution[lang] = {
      files: count,
      percentage: Math.round((count / Math.max(totalFiles, 1)) * 100)
    };
  }

  return {
    total_files: totalFiles,
    total_lines: totalFiles * 120, // Estimated line count for quick stats
    languages: distribution
  };
}

/**
 * Scan a single file's content for issues.
 */
export function scanFileContent(filePath, content) {
  const issues = [];
  const lines = content.split('\n');
  const ext = '.' + (filePath.split('.').pop() || '').toLowerCase();
  const lang = LANGUAGE_MAP[ext] || 'unknown';

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines or whole-line comments
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) continue;

    // ═══ 1. SECURITY & SECRET LEAKS (All Languages) ═══
    if (/(?:api_?key|secret|token|password|auth_token)\s*=\s*['"][a-zA-Z0-9_\-]{16,}['"]/i.test(line)) {
      issues.push({
        type: 'SECURITY_VULNERABILITY',
        category: 'Security',
        severity: 'HIGH',
        file: filePath,
        line: lineNum,
        message: 'Hardcoded secret or credential token detected. Store in environment variables.',
        language: lang,
        agent: 'Security Agent'
      });
    }

    if (/\b(?:eval|exec)\s*\(/i.test(line)) {
      issues.push({
        type: 'SECURITY_VULNERABILITY',
        category: 'Security',
        severity: 'HIGH',
        file: filePath,
        line: lineNum,
        message: 'Dangerous dynamic code execution (eval/exec) can lead to remote code injection.',
        language: lang,
        agent: 'Security Agent'
      });
    }

    // ═══ 2. JAVASCRIPT / TYPESCRIPT ISSUES ═══
    if (lang === 'javascript' || lang === 'typescript') {
      // Loose equality == or !=
      if (/[^!=><]==[^=]/.test(line) && !line.includes('===') && !line.includes('typeof')) {
        issues.push({
          type: 'STYLE_VIOLATION',
          category: 'Code Quality',
          severity: 'LOW',
          file: filePath,
          line: lineNum,
          message: 'Use strict equality (===) instead of loose equality (==).',
          language: lang,
          agent: 'JavaScript Agent'
        });
      }

      // Console logs in production code
      if (/console\.log\s*\(/.test(line) && !filePath.includes('test') && !filePath.includes('spec')) {
        issues.push({
          type: 'CODE_SMELL',
          category: 'Cleanliness',
          severity: 'LOW',
          file: filePath,
          line: lineNum,
          message: 'Unexpected console.log statement found in production file.',
          language: lang,
          agent: 'Cleanliness Agent'
        });
      }

      // Missing catch in promise or unhandled async
      if (/\.then\([^)]+\)(?!\.catch)/.test(line) && !line.includes('catch')) {
        issues.push({
          type: 'UNHANDLED_EXCEPTION',
          category: 'Reliability',
          severity: 'MEDIUM',
          file: filePath,
          line: lineNum,
          message: 'Unhandled Promise rejection: .then() chain is missing a .catch() handler.',
          language: lang,
          agent: 'Async Agent'
        });
      }
    }

    // ═══ 3. PYTHON ISSUES ═══
    if (lang === 'python') {
      // Bare except
      if (/^\s*except\s*:/.test(line)) {
        issues.push({
          type: 'CODE_SMELL',
          category: 'Reliability',
          severity: 'MEDIUM',
          file: filePath,
          line: lineNum,
          message: 'Bare except clause catches SystemExit and KeyboardInterrupt. Use except Exception:',
          language: lang,
          agent: 'Python Agent'
        });
      }

      // Mutable default arguments: def fn(items=[])
      if (/def\s+\w+\s*\(.*=\s*(\[\]|\{\})/i.test(line)) {
        issues.push({
          type: 'BUG_RISK',
          category: 'Bug Risk',
          severity: 'HIGH',
          file: filePath,
          line: lineNum,
          message: 'Mutable default argument (list/dict) retains state across calls. Default to None.',
          language: lang,
          agent: 'Python Agent'
        });
      }

      // Insecure SQL concatenation
      if (/(?:SELECT|INSERT|UPDATE|DELETE)\s+.*f["']|["'].*format\(/.test(line)) {
        issues.push({
          type: 'SECURITY_VULNERABILITY',
          category: 'Security',
          severity: 'HIGH',
          file: filePath,
          line: lineNum,
          message: 'Potential SQL Injection: Use parameterized queries instead of string formatting.',
          language: lang,
          agent: 'Security Agent'
        });
      }
    }

    // ═══ 4. GO ISSUES ═══
    if (lang === 'go') {
      if (/_\s*,\s*_\s*=\s*\w+\(/.test(line)) {
        issues.push({
          type: 'CODE_SMELL',
          category: 'Reliability',
          severity: 'MEDIUM',
          file: filePath,
          line: lineNum,
          message: 'Ignored error return in Go function call. Handle returned error properly.',
          language: lang,
          agent: 'Go Agent'
        });
      }
    }
  }

  return issues;
}
