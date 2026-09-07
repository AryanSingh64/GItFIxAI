/**
 * CI Failure & Log Diagnostic Agent
 * Inspects GitHub Actions workflow runs, downloads failed job logs,
 * and extracts root-cause compiler, test, and lint errors.
 */

export async function getLatestFailedWorkflowRun(octokit, owner, repo) {
  try {
    const { data } = await octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 10,
      status: 'completed'
    });

    const failedRuns = (data.workflow_runs || []).filter(r => r.conclusion === 'failure');
    return failedRuns.length > 0 ? failedRuns[0] : null;
  } catch (error) {
    console.warn(`[CI Diagnostics] Could not fetch workflow runs: ${error.message}`);
    return null;
  }
}

export async function extractCiFailureLogs(octokit, owner, repo, runId) {
  try {
    const { data } = await octokit.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId
    });

    const failedJobs = (data.jobs || []).filter(j => j.conclusion === 'failure');
    if (failedJobs.length === 0) return null;

    const issues = [];
    for (const job of failedJobs.slice(0, 3)) {
      try {
        const logResponse = await octokit.actions.downloadJobLogsForWorkflowRun({
          owner,
          repo,
          job_id: job.id
        });

        const logText = typeof logResponse.data === 'string'
          ? logResponse.data
          : String(logResponse.data || '');

        const parsed = parseCiLogErrors(logText);
        issues.push(...parsed.map(item => ({ ...item, jobName: job.name })));
      } catch (logErr) {
        console.warn(`[CI Diagnostics] Could not fetch logs for job ${job.id}: ${logErr.message}`);
      }
    }

    return {
      runId,
      failedJobsCount: failedJobs.length,
      issues
    };
  } catch (error) {
    console.warn(`[CI Diagnostics] Job log inspection failed: ${error.message}`);
    return null;
  }
}

/**
 * Regex parser for common CI log errors:
 * - TypeScript compiler errors: path/to/file.ts(line,col): error TS...
 * - Jest/Vitest test failure: FAIL path/to/file.test.js
 * - Python tracebacks: File "path/to/file.py", line 42, in ...
 * - ESLint output: path/to/file.js: line 12, col 5, Error - ...
 * - Go compiler: path/to/file.go:12:3: ...
 */
export function parseCiLogErrors(logText) {
  const issues = [];
  const lines = logText.split('\n');

  // 1. TypeScript errors: src/index.ts(45,10): error TS2322: Type 'string' is not assignable to type 'number'.
  const tsRegex = /([a-zA-Z0-9_\-./\\]+\.(?:ts|tsx))\s*\((\d+),\d+\):\s*error\s*(TS\d+):\s*(.+)/;

  // 2. Python traceback: File "app/main.py", line 87, in run
  const pyTraceRegex = /File\s+"([^"]+\.py)",\s+line\s+(\d+)/;

  // 3. ESLint: /path/file.js: line 23, col 5, Error - ...
  const eslintRegex = /([a-zA-Z0-9_\-./\\]+\.(?:js|jsx|ts|tsx)):(\d+):(\d+):\s+(.+)/;

  // 4. Jest/Vitest: FAIL src/components/Button.test.tsx
  const jestFailRegex = /FAIL\s+([a-zA-Z0-9_\-./\\]+\.(?:test|spec)\.(?:js|jsx|ts|tsx))/;

  // 5. Go build error: main.go:14:2: undefined: myFunc
  const goRegex = /([a-zA-Z0-9_\-./\\]+\.go):(\d+):(?:\d+:)?\s*(.+)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check TS
    const tsMatch = line.match(tsRegex);
    if (tsMatch) {
      issues.push({
        type: 'BUILD_ERROR',
        file: tsMatch[1].replace(/\\/g, '/'),
        line: parseInt(tsMatch[2], 10),
        code: tsMatch[3],
        message: tsMatch[4].trim(),
        source: 'GitHub Actions TypeScript CI'
      });
      continue;
    }

    // Check Python Traceback
    const pyMatch = line.match(pyTraceRegex);
    if (pyMatch) {
      const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
      const errorMsgLine = lines[i + 2] ? lines[i + 2].trim() : nextLine;
      issues.push({
        type: 'TEST_FAILURE',
        file: pyMatch[1].replace(/\\/g, '/'),
        line: parseInt(pyMatch[2], 10),
        message: errorMsgLine || 'Exception in test runner',
        source: 'GitHub Actions Pytest/Python CI'
      });
      continue;
    }

    // Check Jest/Vitest FAIL
    const jestMatch = line.match(jestFailRegex);
    if (jestMatch) {
      issues.push({
        type: 'TEST_FAILURE',
        file: jestMatch[1].replace(/\\/g, '/'),
        line: 1,
        message: 'Test suite failed in GitHub Actions runner',
        source: 'GitHub Actions Jest/Vitest CI'
      });
      continue;
    }

    // Check Go
    const goMatch = line.match(goRegex);
    if (goMatch && !line.includes('warning:')) {
      issues.push({
        type: 'BUILD_ERROR',
        file: goMatch[1].replace(/\\/g, '/'),
        line: parseInt(goMatch[2], 10),
        message: goMatch[3].trim(),
        source: 'GitHub Actions Go CI'
      });
      continue;
    }

    // Check ESLint
    const esMatch = line.match(eslintRegex);
    if (esMatch && (line.toLowerCase().includes('error') || line.toLowerCase().includes('warning'))) {
      issues.push({
        type: 'LINT_ERROR',
        file: esMatch[1].replace(/\\/g, '/'),
        line: parseInt(esMatch[2], 10),
        message: esMatch[4].trim(),
        source: 'GitHub Actions ESLint CI'
      });
    }
  }

  // Deduplicate issues by file and line
  const seen = new Set();
  return issues.filter(issue => {
    const key = `${issue.file}:${issue.line}:${issue.message.slice(0, 30)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 15);
}
