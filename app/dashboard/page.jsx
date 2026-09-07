'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight, Terminal, Github, Link as LinkIcon,
  Loader2, User, RefreshCw, Unplug, CheckCircle2,
  MessageSquare, Eye, Pencil, Package, Palette, Lock, Bot, Activity,
  Search, Globe, Check, Sparkles, FolderGit2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('custom'); // 'custom' | 'import'
  const [repos, setRepos] = useState([]);
  const [repoSearch, setRepoSearch] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [commitMsg, setCommitMsg] = useState('Fixed {issues_count} issues in {files_changed} files — score {score}/100');
  const [autoFix, setAutoFix] = useState({ syntax: true, imports: true, formatting: true, security: false });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUser, setGithubUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userName, userAvatar, signInWithGithub } = useAuth();
  const oauthProcessed = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !oauthProcessed.current) {
      oauthProcessed.current = true;
      setLoading(true);
      setStatusMsg('Connecting GitHub account...');

      fetch('/api/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            localStorage.setItem('github_access_token', data.access_token);
            setGithubConnected(true);
          }
          if (data.user) {
            localStorage.setItem('github_user', JSON.stringify(data.user));
            setGithubUser(data.user);
          }
          if (data.repos) {
            setRepos(data.repos);
            setActiveTab('import');
          }
        })
        .catch(err => {
          console.error('GitHub connection failed:', err);
        })
        .finally(() => {
          setLoading(false);
          setStatusMsg('');
          router.replace('/dashboard');
        });
      return;
    }

    const storedToken = localStorage.getItem('github_access_token');
    const storedUser = localStorage.getItem('github_user');
    if (storedToken) {
      setGithubConnected(true);
      if (storedUser) {
        try { setGithubUser(JSON.parse(storedUser)); } catch (e) {}
      }
      fetchRepos(storedToken);
    }
  }, [searchParams, router]);

  const fetchRepos = async (token) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setRepos(data.map(r => ({
            name: r.name,
            full_name: r.full_name,
            url: r.clone_url || `https://github.com/${r.full_name}`,
            private: r.private,
            description: r.description
          })));
        }
      }
    } catch (err) {
      console.warn('Could not fetch repos directly:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGithub = async () => {
    setLoading(true);
    setStatusMsg('Connecting GitHub...');
    try {
      const res = await signInWithGithub();
      if (res.token) {
        localStorage.setItem('github_access_token', res.token);
        setGithubConnected(true);
        setActiveTab('import');
        fetchRepos(res.token);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  const handleDisconnectGithub = () => {
    localStorage.removeItem('github_access_token');
    localStorage.removeItem('github_user');
    setGithubConnected(false);
    setGithubUser(null);
    setRepos([]);
    setActiveTab('custom');
  };

  const filteredRepos = repos.filter(r =>
    r.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(repoSearch.toLowerCase()))
  );

  const startAnalysis = () => {
    if (!repoUrl) return alert('Please enter or select a GitHub repository URL!');
    if (!repoUrl.includes('github.com')) return alert('Please enter a valid GitHub repository URL!');

    const token = localStorage.getItem('github_access_token');
    sessionStorage.setItem('gitfixai_session', JSON.stringify({
      repoUrl,
      commitMsg,
      autoFix,
      accessToken: token
    }));

    router.push('/agent');
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8 pb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-4 md:pb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-0.5 text-white flex items-center gap-2.5">
                <Terminal className="w-6 h-6 text-primary" /> Mission Control
              </h1>
              <p className="text-secondary text-xs md:text-sm">
                Target any repository for autonomous CI/CD inspection and self-healing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {userName && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs text-white">
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="w-5 h-5 rounded-full ring-1 ring-white/20" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                  <span className="truncate max-w-[120px]">{userName}</span>
                </div>
              )}

              {githubConnected ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-xs text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>GitHub Connected</span>
                  {githubUser?.login && (
                    <span className="text-emerald-500/60 hidden sm:inline">@{githubUser.login}</span>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleConnectGithub}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full border border-white/15 text-xs text-white font-medium transition-colors cursor-pointer"
                >
                  <Github className="w-3.5 h-3.5" /> Connect GitHub
                </button>
              )}
            </div>
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-white text-lg font-medium">{statusMsg || 'Loading...'}</p>
              </div>
            </div>
          )}

          {/* Mode Selector Tabs */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface p-1.5 rounded-2xl border border-white/5">
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('custom')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'custom'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" /> Custom Repository URL
              </button>

              <button
                onClick={() => {
                  setActiveTab('import');
                  if (!githubConnected) handleConnectGithub();
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'import'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <Github className="w-3.5 h-3.5" /> Choose from My Repositories ({repos.length})
              </button>
            </div>

            {githubConnected && activeTab === 'import' && (
              <div className="flex items-center gap-2 w-full sm:w-auto px-2">
                <button
                  onClick={() => fetchRepos(localStorage.getItem('github_access_token'))}
                  className="flex items-center gap-1 text-xs text-secondary hover:text-white cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
                <button
                  onClick={handleDisconnectGithub}
                  className="flex items-center gap-1 text-xs text-red-400/80 hover:text-red-400 cursor-pointer"
                >
                  <Unplug className="w-3 h-3" /> Disconnect
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: Custom Repo URL Entry */}
          {activeTab === 'custom' && (
            <div className="bg-surface p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div>
                <label className="text-xs font-mono text-secondary uppercase mb-2 block flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary" /> Target GitHub Repository URL
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary/50" />
                  <input
                    type="text"
                    placeholder="https://github.com/username/my-project"
                    className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary font-mono text-sm"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-secondary mt-2">
                  Works with any public repository (or private repository if your GitHub is connected above).
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Choose from Imported Repos */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary" />
                <input
                  type="text"
                  placeholder="Search repository by name or description..."
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              {filteredRepos.length === 0 ? (
                <div className="bg-surface p-12 rounded-2xl border border-white/5 text-center">
                  <FolderGit2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/50">No repositories found matching "{repoSearch}".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredRepos.slice(0, 30).map((r, i) => {
                    const isSelected = repoUrl === r.url;
                    return (
                      <div
                        key={i}
                        onClick={() => setRepoUrl(r.url)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10'
                            : 'bg-surface border-white/5 hover:border-white/15 hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-white truncate max-w-[200px]" title={r.name}>
                            {r.name}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            r.private ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {r.private ? 'Private' : 'Public'}
                          </span>
                        </div>
                        <p className="text-xs text-secondary line-clamp-2 h-8 mb-3">
                          {r.description || 'No description provided.'}
                        </p>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                          <span className={isSelected ? 'text-primary font-bold flex items-center gap-1' : 'text-secondary'}>
                            {isSelected ? <><Check className="w-3.5 h-3.5" /> Selected Target</> : 'Click to Select'}
                          </span>
                          <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : 'text-secondary/40'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Target Selected Confirmation Badge */}
          {repoUrl && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Ready for Healing</div>
                  <div className="text-sm font-mono text-white truncate max-w-xl">{repoUrl}</div>
                </div>
              </div>
              <button
                onClick={() => setRepoUrl('')}
                className="text-xs text-secondary hover:text-white transition-colors cursor-pointer"
              >
                Clear Target
              </button>
            </div>
          )}

          {/* Autonomous Configuration Panel */}
          <div className="bg-surface p-6 rounded-2xl border border-white/5 space-y-5 shadow-2xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" /> Remediation Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-secondary uppercase mb-1.5 block">
                  Auto-Commit Message Template
                </label>
                <input
                  type="text"
                  value={commitMsg}
                  onChange={(e) => setCommitMsg(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-secondary uppercase mb-2 block">
                  Remediation Preferences
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { key: 'syntax', label: 'Syntax Errors', icon: <Pencil className="w-3.5 h-3.5" /> },
                    { key: 'imports', label: 'Import Resolution', icon: <Package className="w-3.5 h-3.5" /> },
                    { key: 'formatting', label: 'Code Quality', icon: <Palette className="w-3.5 h-3.5" /> },
                    { key: 'security', label: 'Security Secrets', icon: <Lock className="w-3.5 h-3.5" /> },
                  ].map(({ key, label, icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAutoFix(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        autoFix[key]
                          ? 'bg-primary/10 border-primary/40 text-white'
                          : 'bg-white/5 border-white/10 text-secondary hover:bg-white/10'
                      }`}
                    >
                      {icon}
                      <span>{label}</span>
                      <div className={`ml-auto w-2.5 h-2.5 rounded-full ${autoFix[key] ? 'bg-primary' : 'bg-white/10'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={startAnalysis}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-base"
                >
                  <Bot className="w-5 h-5" /> Launch Autonomous CI/CD Agent <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
