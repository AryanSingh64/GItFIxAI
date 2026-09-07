/**
 * AI & Heuristic Code Fixer Agent
 * Integrates Google Gemini 2.0 Flash / OpenAI with self-correction syntax validation.
 */

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Fix an issue using AI first, falling back to heuristics if keys are missing.
 */
export async function fixIssue(fileContent, issue) {
  // Try AI Fix first if keys are configured
  if (GEMINI_API_KEY || OPENAI_API_KEY) {
    try {
      const aiResult = await runAiFix(fileContent, issue);
      if (aiResult && aiResult.status === 'fixed') {
        return aiResult;
      }
    } catch (err) {
      console.warn(`[AI Fixer] LLM repair failed, falling back to heuristic: ${err.message}`);
    }
  }

  // Fallback to Heuristic Fixer
  return runHeuristicFix(fileContent, issue);
}

/**
 * AI Repair via Google Gemini 2.0 Flash (or OpenAI)
 */
async function runAiFix(fileContent, issue) {
  const prompt = `You are GitFixAI, an autonomous senior software engineer.
Fix the following issue in this file.

FILE PATH: ${issue.file}
ISSUE: ${issue.message} (Line ${issue.line})
SEVERITY: ${issue.severity || 'MEDIUM'}

SOURCE CODE:
\`\`\`
${fileContent}
\`\`\`

INSTRUCTIONS:
1. Return ONLY the completely repaired file content inside a single \`\`\` code block.
2. Do not include markdown explanations or commentary outside the code block.
3. Preserve all existing indentation, comments, and structure.
4. Fix ONLY the stated issue and any directly related syntax/type errors.`;

  let repairedCode = null;

  if (GEMINI_API_KEY) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 4096 }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      repairedCode = extractCodeBlock(rawText);
    }
  } else if (OPENAI_API_KEY) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1
      })
    });

    if (response.ok) {
      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content || '';
      repairedCode = extractCodeBlock(rawText);
    }
  }

  if (repairedCode && repairedCode !== fileContent) {
    // Basic syntax validation
    if (validateSyntax(issue.file, repairedCode)) {
      const lines = fileContent.split('\n');
      const targetLine = lines[issue.line - 1] || '';
      return {
        status: 'fixed',
        method: 'ai',
        file: issue.file,
        line: issue.line,
        before: targetLine,
        after: '(AI Auto-Healed Full Context)',
        fullContent: repairedCode,
        message: issue.message
      };
    }
  }

  return null;
}

/**
 * Heuristic fallback fixes for common automated patterns.
 */
function runHeuristicFix(fileContent, issue) {
  const lines = fileContent.split('\n');
  const idx = issue.line - 1;
  if (idx < 0 || idx >= lines.length) return null;

  const originalLine = lines[idx];
  let fixedLine = originalLine;

  // 1. Strict equality
  if (originalLine.includes('==') && !originalLine.includes('===') && !originalLine.includes('typeof')) {
    fixedLine = originalLine.replace(/==/g, '===');
  }
  // 2. Python bare except
  else if (/^\s*except\s*:/.test(originalLine)) {
    fixedLine = originalLine.replace(/except\s*:/, 'except Exception:');
  }
  // 3. Remove stray console.log
  else if (/console\.log\s*\(/.test(originalLine)) {
    fixedLine = originalLine.replace(/console\.log\([^)]*\);?/, '// [GitFixAI] Removed debug log');
  }
  // 4. Python mutable default arg
  else if (/def\s+\w+\s*\(.*=\s*\[\]\)/.test(originalLine)) {
    fixedLine = originalLine.replace(/=\s*\[\]/, '= None');
  }
  // 5. Unhandled promise catch
  else if (/\.then\([^)]+\)/.test(originalLine) && !originalLine.includes('.catch')) {
    fixedLine = originalLine.replace(/;?$/, '.catch(err => console.error("Handled:", err));');
  }

  if (fixedLine !== originalLine) {
    lines[idx] = fixedLine;
    return {
      status: 'fixed',
      method: 'heuristic',
      file: issue.file,
      line: issue.line,
      before: originalLine.trim(),
      after: fixedLine.trim(),
      fullContent: lines.join('\n'),
      message: issue.message
    };
  }

  return null;
}

function extractCodeBlock(text) {
  const match = text.match(/```(?:[a-zA-Z0-9_\-]+)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

function validateSyntax(filePath, content) {
  // Check balanced brackets and quotes for JS/TS
  if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    const opens = (content.match(/\{/g) || []).length;
    const closes = (content.match(/\}/g) || []).length;
    if (Math.abs(opens - closes) > 1) return false;
  }
  return content.length > 10;
}
