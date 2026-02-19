import React, { useState, useEffect } from 'react';
import { Terminal, Play, ShieldCheck, Activity, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

import RunSummary from './components/RunSummary';
import FixesTable from './components/FixesTable';
import ScoreCard from './components/ScoreCard';
import CICDTimeline from './components/CICDTimeline';
import AgentLogs from './components/AgentLogs';
import LoginScreen from './components/LoginScreen';
import RepoList from './components/RepoList';
import { useAgentSocket } from './hooks/useAgentSocket';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [repos, setRepos] = useState([]);
  const [repoUrl, setRepoUrl] = useState('');
  const [teamName, setTeamName] = useState('RIFT ORGANISERS');
  const [leaderName, setLeaderName] = useState('Saiyam Kumar');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const { messages, clearMessages } = useAgentSocket();

  // --- OAuth Logic ---
  useEffect(() => {
    const checkAuth = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get('code');

      if (code) {
        // Remove code from URL
        window.history.replaceState({}, document.title, "/");

        try {
          const response = await fetch('http://localhost:8000/auth/github', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });

          const data = await response.json();
          if (data.access_token) {
            setIsAuthenticated(true);
            setRepos(data.repos);
          }
        } catch (error) {
          console.error("Auth Failed", error);
        }
      }
    };

    checkAuth();
  }, []);
  // -------------------

  // Process WebSocket Messages
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.type === 'RESULT') {
      setAnalysisData(lastMsg);
      setLoading(false);
    }
  }, [messages]);

  const startAnalysis = async () => {
    if (!repoUrl) return alert("Please select a repository first!");

    setLoading(true);
    setAnalysisData(null);
    clearMessages();

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo_url: repoUrl,
          team_name: teamName,
          leader_name: leaderName
        })
      });
      if (!response.ok) throw new Error('Failed to start agent');
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Error starting agent. Ensure backend is running.");
    }
  };

  const logs = messages.filter(m => m.type !== 'RESULT');

  return (
    <div className="min-h-screen bg-background text-white font-sans p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AUTO-DEVOPS AGENT</h1>
            <p className="text-secondary text-xs tracking-widest uppercase">Autonomous Healing System</p>
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-4 text-sm text-secondary bg-surface px-4 py-2 rounded-full border border-white/5">
            <span className="flex items-center gap-2 text-green-400"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live</span>
            <button onClick={() => setIsAuthenticated(false)} className="hover:text-white"><LogOut className="w-4 h-4" /></button>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto space-y-8">

        {!isAuthenticated ? (
          <LoginScreen />
        ) : (
          <>
            {/* Repository Selection (Only if not running) */}
            {!loading && !analysisData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  Select a Repository to Heal
                </h2>
                <RepoList repos={repos} onSelect={(url) => setRepoUrl(url)} />
              </motion.div>
            )}

            {/* Agent Control Panel (Visible when repo selected or running) */}
            {(repoUrl || loading || analysisData) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface p-6 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-50"></div>

                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" /> Target Configuration
                </h2>

                <div className="space-y-4">
                  <div className="relative group">
                    <input
                      type="text"
                      className="w-full bg-background border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary transition-all group-hover:border-white/20 font-mono text-sm text-blue-300"
                      value={repoUrl}
                      readOnly
                    />
                    <div className="absolute right-4 top-4 text-xs text-secondary bg-surface px-2 py-1 rounded border border-white/5">
                      SELECTED REPO
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Team Name"
                      className="bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Leader Name"
                      className="bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                    />
                    <button
                      onClick={startAnalysis}
                      disabled={loading}
                      className={`flex items-center justify-center gap-2 font-medium rounded-lg px-6 py-3 transition-all ${loading ? 'bg-secondary cursor-not-allowed' : 'bg-primary hover:bg-blue-600 shadow-lg shadow-blue-500/20 active:scale-95'
                        }`}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Agent Running...</span>
                      ) : (
                        <><Play className="w-4 h-4 fill-current" /> Deploy Agent</>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Live Logs & Results (Same as before) */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AgentLogs logs={logs} />
              </motion.div>
            )}

            {analysisData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RunSummary result={analysisData.summary} />
                  </div>
                  <ScoreCard score={analysisData.score} breakdown={analysisData.scoreBreakdown} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AgentLogs logs={logs} />
                  <CICDTimeline runs={analysisData.timeline || []} />
                </div>
                <FixesTable fixes={analysisData.fixes} />
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
