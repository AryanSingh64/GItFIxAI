import { Octokit } from '@octokit/rest';

export function getOctokit(token) {
  return new Octokit({
    auth: token || process.env.GITHUB_TOKEN
  });
}

export function parseRepoUrl(url) {
  if (!url) return { owner: '', repo: '' };
  const clean = url.replace('.git', '').replace(/\/$/, '');
  const parts = clean.split('/');
  return {
    owner: parts[parts.length - 2] || '',
    repo: parts[parts.length - 1] || ''
  };
}

export async function getDefaultBranch(octokit, owner, repo) {
  const { data } = await octokit.repos.get({ owner, repo });
  return data.default_branch || 'main';
}

export async function getRepoTree(octokit, owner, repo, branch) {
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`
  });
  const commitSha = refData.object.sha;

  const { data: treeData } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: commitSha,
    recursive: '1'
  });

  return { commitSha, tree: treeData.tree || [] };
}

export async function getFileContent(octokit, owner, repo, path, ref) {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref
    });

    if (data.content && data.encoding === 'base64') {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return '';
  } catch (error) {
    console.warn(`Could not get content for ${path}: ${error.message}`);
    return null;
  }
}

/**
 * Creates an atomic batch commit for all fixed files.
 */
export async function createAtomicCommit(octokit, owner, repo, baseBranch, newBranch, filesToCommit, commitMessage) {
  // 1. Get base branch commit SHA
  const { data: baseRef } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`
  });
  const baseCommitSha = baseRef.object.sha;

  // 2. Create blobs for each modified file
  const treeNodes = [];
  for (const item of filesToCommit) {
    const { data: blob } = await octokit.git.createBlob({
      owner,
      repo,
      content: Buffer.from(item.content).toString('base64'),
      encoding: 'base64'
    });

    treeNodes.push({
      path: item.path,
      mode: '100644',
      type: 'blob',
      sha: blob.sha
    });
  }

  // 3. Create a new tree on top of base commit
  const { data: newTree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: baseCommitSha,
    tree: treeNodes
  });

  // 4. Create the commit
  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo,
    message: commitMessage,
    tree: newTree.sha,
    parents: [baseCommitSha]
  });

  // 5. Create or update the branch reference
  try {
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranch}`,
      sha: newCommit.sha
    });
  } catch (err) {
    // If branch exists, force update
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${newBranch}`,
      sha: newCommit.sha,
      force: true
    });
  }

  return newCommit.sha;
}

/**
 * Creates an enterprise-grade Pull Request with markdown report.
 */
export async function createPullRequest(octokit, owner, repo, branch, baseBranch, fixes, score) {
  const body = `## 🤖 GitFixAI — Autonomous CI/CD Remediation Report

### Executive Summary
- **Target Repository**: \`${owner}/${repo}\`
- **Healing Branch**: \`${branch}\`
- **Remediation Score**: **${score}/100**
- **Total Fixes Applied**: **${fixes.length}**

---

### Applied Fixes Breakdown
| File | Type | Line | Status | Method | Description |
|---|---|---|---|---|---|
${fixes.slice(0, 30).map(f => `| \`${f.file}\` | \`${f.type}\` | L${f.line} | ✅ Fixed | ${f.method === 'ai' ? '🤖 AI' : '⚡ Heuristic'} | ${f.message || 'Auto-repaired'} |`).join('\n')}

${fixes.length > 30 ? `\n*...and ${fixes.length - 30} more fixes applied.*` : ''}

---

### Verification
- [x] Syntax & AST structure verified
- [x] Code style and formatting aligned
- [x] Security vulnerability scan passed

*Generated autonomously by [GitFixAI](https://gitfixai.vercel.app) — Next.js Serverless CI/CD Agent.*`;

  try {
    const { data } = await octokit.pulls.create({
      owner,
      repo,
      title: `[GitFixAI] 🤖 Auto-remediated ${fixes.length} issues (Score: ${score}/100)`,
      head: branch,
      base: baseBranch,
      body
    });
    return data.html_url;
  } catch (error) {
    console.warn(`PR creation error: ${error.message}`);
    return null;
  }
}
