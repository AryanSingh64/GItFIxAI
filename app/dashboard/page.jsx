'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight, Terminal, Github, Link as LinkIcon,
  Loader2, User, RefreshCw, Unplug, CheckCircle2,
  MessageSquare, Eye, Pencil, Package, Palette, Lock, Bot, Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import RepoList from '@/components/RepoList';

function DashboardContent() {
  const [repos, setRepos] = useState([]);
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
      setStatusMsg('Exchanging GitHub authorization code...');

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
          }
        })
        .catch(err => {
          console.error('GitHub exchange failed:', err);
        })
        .finally(() => {
          setLoading(false);
          setStatusMsg('');
          router.replace('/dashboard');
        });
      return;
    }

    // Check localStorage
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
      const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(data.map(r => ({
          name: r.name,
          full_name: r.full_name,
          url: r.clone_url || `https://github.com/${r.full_name}`,
          private: r.private,
          description: r.description
        })));
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
        setGithubConnected(true);
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
  };

  const startAnalysis = () => {
    if (!repoUrl) return alert('Please select a repository or enter a GitHub URL!');
    if (!repoUrl.includes('github.com')) return alert('Please enter a valid GitHub repository URL!');

    // Store settings in sessionStorage for the active session
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
              <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-0.5 text-white">Mission Control</h1>
              <p className="text-secondary text-xs md:text-sm">Select a target repository for autonomous CI/CD remediation.</p>
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

              {githubConnected && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20 text-xs text-green-400">
                  <div className="relative">
                    <Github className="w-3.5 h-3.5" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <span>Connected</span>
                  {githubUser?.login && (
                    <span className="text-green-500/60 hidden sm:inline">@{githubUser.login}</span>
                  )}
                </div>
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

          {/* GitHub Connection Card */}
          {!githubConnected && (
            <div className="bg-surface p-1 rounded-2xl border border-white/5 shadow-2xl">
              <div className="bg-black/50 p-8 rounded-xl text-center">
                <div className="inline-flex p-4 bg-white/5 rounded-2xl mb-5 border border-white/5">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Connect Your GitHub Account</h2>
                <p className="text-secondary text-sm max-w-lg mx-auto mb-6">
                  Connect GitHub to list your repositories, inspect broken CI logs, and allow the AI agent to push commits and open Pull Requests.
                </p>
                <button
                  onClick={handleConnectGithub}
                  className="inline-flex items-center gap-3 bg-white text-black font-bold px-8 py-3.5 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.97] shadow-lg shadow-white/10 cursor-pointer"
                >
                  <Github className="w-5 h-5" />
                  Connect GitHub Account
                </button>
              </div>
            </div>
          )}

          {!githubConnected && (
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-secondary uppercase tracking-widest">or enter a repository url manually</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          )}

          {/* Target Configuration Panel */}
          <div className="bg-surface p-1 rounded-xl md:rounded-2xl border border-white/5 shadow-2xl">
            <div className="bg-black/50 p-4 md:p-6 rounded-lg md:rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Terminal className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-sm md:text-base font-semibold text-white">Target Configuration</h2>
                </div>

                {githubConnected && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchRepos(localStorage.getItem('github_access_token'))}
                      className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-secondary hover:text-white px-2.5 py-1 rounded-md border border-white/10 text-xs cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                    <button
                      onClick={handleDisconnectGithub}
                      className="flex items-center gap-1.5 text-secondary hover:text-red-400 px-2.5 py-1 rounded-md text-xs cursor-pointer"
                    >
                      <Unplug className="w-3 h-3" /> Disconnect
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-4">
                <div>
                  <label className="text-xs font-mono text-secondary uppercase mb-1.5 block">
                    Git Repository URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-3 w-4 h-4 text-secondary/50" />
                    <input
                      type="text"
                      placeholder="https://github.com/username/repository"
                      className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary font-mono text-sm"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-secondary uppercase mb-1.5 block">
                    Auto-Commit Message
                  </label>
                  <input
                    type="text"
                    value={commitMsg}
                    onChange={(e) => setCommitMsg(e.target.value)}
                    placeholder="Fixed issues by GitFixAI"
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
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
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

                <div className="pt-2">
                  <button
                    onClick={startAnalysis}
                    className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
                  >
                    <Bot className="w-5 h-5" /> Launch Autonomous CI/CD Agent <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Repositories Grid */}
          {githubConnected && repos.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">
                  Your GitHub Repositories ({repos.length})
                </h3>
              </div>
              <RepoList repos={repos} onSelect={(url) => { setRepoUrl(url); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </div>
          )}
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
