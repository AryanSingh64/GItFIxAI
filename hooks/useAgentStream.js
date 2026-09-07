'use client';

import { useState, useRef, useCallback } from 'react';

export function useAgentStream() {
  const [logs, setLogs] = useState([]);
  const [stages, setStages] = useState({});
  const [diffs, setDiffs] = useState([]);
  const [result, setResult] = useState(null);
  const [prUrl, setPrUrl] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [langStats, setLangStats] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const clearAll = useCallback(() => {
    setLogs([]);
    setStages({});
    setDiffs([]);
    setResult(null);
    setPrUrl(null);
    setTestResults(null);
    setLangStats(null);
    setError(null);
  }, []);

  const startAnalysis = useCallback(async ({ repoUrl, commitMsg, autoFix, accessToken, teamName, leaderName }) => {
    clearAll();
    setIsConnected(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo_url: repoUrl,
          commit_msg: commitMsg,
          access_token: accessToken,
          team_name: teamName || 'GitFixAI',
          leader_name: leaderName || 'Agent'
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server returned status ${response.status}: ${errText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep last incomplete line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(trimmed.slice(6));

            if (data.type === 'STAGE') {
              setStages(prev => ({ ...prev, [data.stage]: data.status }));
            } else if (data.type === 'DIFF') {
              setDiffs(prev => [...prev, data]);
            } else if (data.type === 'RESULT') {
              setResult(data);
            } else if (data.type === 'PR') {
              setPrUrl(data.url);
            } else if (data.type === 'TEST_RESULTS') {
              setTestResults(data.data);
            } else if (data.type === 'LANG_STATS') {
              setLangStats(data.data);
            } else {
              setLogs(prev => [...prev, data]);
            }
          } catch (jsonErr) {
            console.warn('SSE Parse error:', jsonErr, trimmed);
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Agent Stream Error:', err);
        setError(err.message);
        setLogs(prev => [
          ...prev,
          { time: new Date().toTimeString().split(' ')[0], type: 'ERROR', message: err.message }
        ]);
      }
    } finally {
      setIsConnected(false);
    }
  }, [clearAll]);

  const stopAnalysis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsConnected(false);
    }
  }, []);

  return {
    logs,
    stages,
    diffs,
    result,
    prUrl,
    testResults,
    langStats,
    isConnected,
    error,
    startAnalysis,
    stopAnalysis,
    clearAll
  };
}
