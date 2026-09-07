'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight, Terminal, Github, Link as LinkIcon,
  Loader2, User, RefreshCw, Unplug, CheckCircle2, AlertCircle,
  MessageSquare, Eye, Pencil, Package, Palette, Lock, Bot
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
  const { userName, userAvatar, authProvider, signInWithGithub } = useAuth();
  const oauthProcessed = useRef(false);

  // ─── On mount: check for GitHub OAuth callback code OR existing token ───
  useEffect(() => {
    const processGithubCallback = async () => {
      const code = searchParams.get('code');

      // If there's an OAuth code in the URL, exchange it for a token
      if (code && !oauthProcessed.current) {
        oauthProcessed.current = true;
        setLoading(true);
        setStatusMsg('Connecting GitHub account...');

        try {
          const response = await fetch('/api/auth/github', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });

          if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Server Error: ${response.status} - ${errText}`);
          }

          const data = await response.json();

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
        } catch (error) {
          console.error('GitHub connection failed:', error);
          alert(`GitHub connection failed: ${error.message}`);
        } finally {
          setLoading(false);
          setStatusMsg('');
          router.replace('/dashboard');
        }
        return;
      }

      // No code in URL — check if we already have a stored GitHub token
      const storedToken = localStorage.getItem('github_access_token');
      const storedUser = localStorage.getItem('github_user');

      if (storedToken) {
        setGithubConnected(true);
        if (storedUser) {
          try { setGithubUser(JSON.parse(storedUser)); } catch (e) { /* ignore */ }
        }
        await fetchRepos(storedToken);
      }
    };

    processGithubCallback();
  }, [searchParams, router]);

  // ─── Fetch repos using a GitHub token ───
  const fetchRepos = async (token) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
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

  // ─── Connect GitHub ───
  const handleConnectGithub = async () => {
    setLoading(true);
    setStatusMsg('Connecting GitHub...');
    try {
      const res = await signInWithGithub();
      if (res.token) {
        localStorage.setItem('github_access_token', res.token);
        setGithubConnected(true);
        await fetchRepos(res.token);
      }
    } catch (err) {
      console.error(err);
      alert(`GitHub connection failed: ${err.message}`);
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  // ─── Disconnect GitHub ───
  const handleDisconnectGithub = () => {
    localStorage.removeItem('github_access_token');
    localStorage.removeItem('github_user');
    setGithubConnected(false);
    setGithubUser(null);
    setRepos([]);
  };

  // ─── Refresh repos ───
  const handleRefreshRepos = async () => {
    const token = localStorage.getItem('github_access_token');
    if (!token) {
      alert('No GitHub connection. Please connect your GitHub account first.');
      return;
    }
    await fetchRepos(token);
  };

  // ─── Start Analysis ───
  const startAnalysis = () => {
    if (!repoUrl) return alert('Please select a repository or enter a URL!');
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
              <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-0.5 text-white">Mission Control</h1>
              <p className="text-secondary text-xs md:text-sm">Select a target for autonomous remediation.</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Auth info badge */}
              {userName && (
                <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-white/5 rounded-full border border-white/10 text-xs text-white" title={userName}>
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="w-5 h-5 rounded-full ring-1 ring-white/20" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden md:inline truncate max-w-[100px]">{userName}</span>
                </div>
              )}

              {/* GitHub connection */}
              {githubConnected && (
                <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-green-500/10 rounded-full border border-green-500/20 text-xs text-green-400" title={githubUser?.login ? `@${githubUser.login}` : 'GitHub Connected'}>
                  <div className="relative">
                    <Github className="w-3.5 h-3.5" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <span className="hidden md:inline">Connected</span>
                  {githubUser?.login && (
                    <span className="hidden lg:inline text-green-500/60">@{githubUser.login}</span>
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

          {/* GitHub Connection Card - shown when GitHub is NOT connected */}
          {!githubConnected && (
            <div className="rounded-2xl bg-[#0c0e17] border border-white/[0.08] p-8 text-center shadow-2xl">
              <div className="inline-flex p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl mb-4">
                <Github className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Connect GitHub Account</h2>
              <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto mb-6 leading-relaxed">
                Connect your GitHub account to import repositories and enable automated remediation PRs.
                Works seamlessly whether signed in with {authProvider === 'google' ? 'Google' : 'email'}.
              </p>
              <button
                onClick={handleConnectGithub}
                className="inline-flex items-center gap-2.5 bg-white text-black font-semibold text-xs md:text-sm px-6 py-3 rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Github className="w-4 h-4" />
                Connect GitHub
              </button>
            </div>
          )}

          {/* OR divider when not connected */}
          {!githubConnected && (
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">or specify repository url</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
          )}

          {/* Input Configuration Panel */}
          <div className="rounded-2xl bg-[#0c0e17] border border-white/[0.08] p-5 md:p-6 shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white/[0.04] border border-white/10 rounded-lg">
                    <Terminal className="w-4 h-4 text-lime-400" />
                  </div>
                  <h2 className="text-sm md:text-base font-semibold text-white">Target Configuration</h2>
                </div>

                {/* GitHub actions (when connected) */}
                {githubConnected && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleRefreshRepos}
                      disabled={loading}
                      className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/[0.08] transition-colors text-xs cursor-pointer font-mono"
                      title="Refresh Repos"
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={handleDisconnectGithub}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors text-xs cursor-pointer font-mono"
                      title="Disconnect GitHub"
                    >
                      <Unplug className="w-3 h-3" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <label className="text-[10px] md:text-xs font-mono text-slate-400 uppercase mb-1.5 block">
                    Git Repository URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-500 group-focus-within:text-white transition-colors" />
                    <input
                      type="text"
                      placeholder="https://github.com/username/repository"
                      className="w-full bg-[#131622] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-white/25 transition-all font-mono text-xs md:text-sm"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                    />
                  </div>
                </div>

                {/* Commit Message Template */}
                <div className="relative group">
                  <label className="text-[10px] md:text-xs font-mono text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" /> Automated PR Commit Message
                  </label>
                  <input
                    type="text"
                    placeholder="Fixed {issues_count} issues by GitFixAI"
                    className="w-full bg-[#131622] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/25 transition-all text-xs md:text-sm font-mono"
                    value={commitMsg}
                    onChange={(e) => setCommitMsg(e.target.value)}
                  />
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-mono text-slate-500">
                    <Eye className="w-3 h-3" />
                    <span className="truncate">Preview: {commitMsg.replace('{issues_count}', '12').replace('{files_changed}', '5').replace('{score}', '94')}</span>
                  </div>
                </div>

                {/* Auto-Fix Preferences */}
                <div>
                  <label className="text-[10px] md:text-xs font-mono text-slate-400 uppercase mb-2 block">
                    Remediation Passes
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'syntax', label: 'Syntax AST', icon: <Pencil className="w-3.5 h-3.5" /> },
                      { key: 'imports', label: 'Imports', icon: <Package className="w-3.5 h-3.5" /> },
                      { key: 'formatting', label: 'Formatting', icon: <Palette className="w-3.5 h-3.5" /> },
                      { key: 'security', label: 'Security', icon: <Lock className="w-3.5 h-3.5" /> },
                    ].map(({ key, label, icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setAutoFix(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          autoFix[key]
                            ? 'bg-lime-400/10 border-lime-400/30 text-lime-300'
                            : 'bg-white/[0.02] border-white/[0.07] text-slate-400 hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="opacity-80">{icon}</span>
                        <span>{label}</span>
                        <div className={`ml-auto w-2.5 h-2.5 rounded-full transition-colors ${autoFix[key] ? 'bg-lime-400' : 'bg-white/10'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-4">
                <button
                  onClick={startAnalysis}
                  className="w-full bg-white text-black hover:bg-slate-200 font-semibold rounded-xl py-3 transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-xs md:text-sm cursor-pointer shadow-lg"
                >
                  <span>Launch Remediation Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!githubConnected && (
                  <div className="flex items-center gap-2 justify-center mt-3 text-[11px] font-mono text-amber-400/80">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>GitHub not connected — scan is read-only unless account is authenticated.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Repositories Grid (Previous UI Restored) */}
          {repos.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-secondary uppercase font-mono tracking-wider">
                  <Github className="w-4 h-4" /> Available Targets ({repos.length})
                </div>
                {githubUser?.login && (
                  <span className="text-xs text-secondary">
                    from <span className="text-white">@{githubUser.login}</span>
                  </span>
                )}
              </div>
              <RepoList
                repos={repos}
                onSelect={(url) => {
                  setRepoUrl(url);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          ) : (
            <>
              {githubConnected && !loading && (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
                  <Github className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">No Repositories Found</h3>
                  <p className="text-secondary text-sm max-w-md mx-auto">
                    We couldn't find any repositories. Try refreshing or enter a Git URL manually above.
                  </p>
                </div>
              )}
            </>
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
