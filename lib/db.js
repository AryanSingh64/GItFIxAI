import { db, isConfigured } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit as firestoreLimit } from 'firebase/firestore';

/**
 * Save an analysis run record to Firestore 'analysis_runs' collection.
 */
export async function saveAnalysisRun(runData) {
  const record = {
    repo_url: runData.repo_url || '',
    team_name: runData.team_name || 'GitFixAI',
    leader_name: runData.leader_name || 'Agent',
    branch_name: runData.branch_name || '',
    status: runData.status || 'PASSED',
    total_failures: runData.total_failures || 0,
    fixes_applied: runData.fixes_applied || 0,
    remaining_issues: runData.remaining_issues || 0,
    duration: runData.duration || '0m 0s',
    score: runData.score || 100,
    pr_url: runData.pr_url || null,
    created_at: new Date().toISOString()
  };

  if (!isConfigured) {
    if (typeof window !== 'undefined') {
      try {
        const runs = JSON.parse(localStorage.getItem('gitfixai_runs') || '[]');
        const localRecord = { id: `local_${Date.now()}`, ...record };
        runs.unshift(localRecord);
        localStorage.setItem('gitfixai_runs', JSON.stringify(runs.slice(0, 50)));
        return localRecord.id;
      } catch (e) {
        console.warn('Local storage save failed:', e);
      }
    }
    return `mock_${Date.now()}`;
  }

  try {
    const docRef = await addDoc(collection(db, 'analysis_runs'), record);
    return docRef.id;
  } catch (error) {
    console.error('Failed to save analysis run to Firestore:', error);
    return null;
  }
}

/**
 * Save individual file fixes for a specific run.
 */
export async function saveFileFixes(runId, fixes) {
  if (!fixes || fixes.length === 0) return;

  const records = fixes.map(fix => ({
    run_id: runId,
    file_path: fix.file || '',
    fix_type: fix.type || '',
    line_number: fix.line || 0,
    commit_message: fix.commit || '',
    status: fix.status || 'FIXED',
    method: fix.method || 'ai',
    agent: fix.agent || 'AI Fixer',
    created_at: new Date().toISOString()
  }));

  if (!isConfigured) {
    if (typeof window !== 'undefined') {
      try {
        const allFixes = JSON.parse(localStorage.getItem('gitfixai_fixes') || '[]');
        allFixes.unshift(...records);
        localStorage.setItem('gitfixai_fixes', JSON.stringify(allFixes.slice(0, 100)));
      } catch (e) {
        console.warn('Local storage fix save failed:', e);
      }
    }
    return;
  }

  try {
    const promises = records.map(r => addDoc(collection(db, 'file_fixes'), r));
    await Promise.all(promises);
  } catch (error) {
    console.error('Failed to save file fixes to Firestore:', error);
  }
}

/**
 * Get recent analysis runs, sorted newest first.
 */
export async function getUserRuns(maxCount = 20) {
  if (!isConfigured) {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('gitfixai_runs');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return [
      {
        id: 'sample-1',
        repo_url: 'https://github.com/AryanSingh64/GItFIxAI',
        team_name: 'Core Team',
        leader_name: 'Lead Agent',
        branch_name: 'CORE_TEAM_AI_Fix',
        status: 'PASSED',
        total_failures: 12,
        fixes_applied: 12,
        remaining_issues: 0,
        duration: '0m 18s',
        score: 100,
        pr_url: 'https://github.com/AryanSingh64/GItFIxAI/pull/1',
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'sample-2',
        repo_url: 'https://github.com/facebook/react',
        team_name: 'HealthCheck',
        leader_name: 'Fixer',
        branch_name: 'HEALTHCHECK_AI_Fix',
        status: 'PARTIAL',
        total_failures: 8,
        fixes_applied: 7,
        remaining_issues: 1,
        duration: '0m 25s',
        score: 88,
        pr_url: null,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  try {
    const q = query(
      collection(db, 'analysis_runs'),
      orderBy('created_at', 'desc'),
      firestoreLimit(maxCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Failed to fetch runs from Firestore:', error);
    return [];
  }
}
