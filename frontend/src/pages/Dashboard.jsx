import React, { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../lib/api';
import {
    ArrowRight, Terminal, Github, Link as LinkIcon,
    Loader2, User, RefreshCw, Unplug, CheckCircle2, AlertCircle,
    MessageSquare, Eye, Pencil, Package, Palette, Lock, Bot,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RepoList from '../components/RepoList';

export default function Dashboard() {
    const [repos, setRepos] = useState([]);
    const [repoUrl, setRepoUrl] = useState('');
    const [commitMsg, setCommitMsg] = useState('Fixed {issues_count} issues in {files_changed} files — score {score}/100');
    const [autoFix, setAutoFix] = useState({ syntax: true, imports: true, formatting: true, security: false });
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    const [githubConnected, setGithubConnected] = useState(false);
    const [githubUser, setGithubUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { userName, userAvatar, authProvider } = useAuth();
    const oauthProcessed = useRef(false);

    // ─── On mount: check for GitHub OAuth callback code OR existing token ───
    useEffect(() => {
        const processGithubCallback = async () => {
            const queryParams = new URLSearchParams(location.search);
            const code = queryParams.get('code');

            // If there's an OAuth code in the URL, exchange it for a token
            if (code && !oauthProcessed.current) {
                oauthProcessed.current = true;
                window.history.replaceState({}, document.title, '/dashboard');
                setLoading(true);
                setStatusMsg('Connecting GitHub account...');

                try {
                    const API_URL = getApiUrl();
                    const response = await fetch(`${API_URL}/auth/github`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code }),
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
                }
                return;
            }

            // No code in URL — check if we already have a stored GitHub token
            const storedToken = localStorage.getItem('github_access_token');
            const storedUser = localStorage.getItem('github_user');

            if (storedToken) {
                setGithubConnected(true);
                if (storedUser) {
                    try { setGithubUser(JSON.parse(storedUser)); } catch { /* ignore */ }
                }
                // Auto-fetch repos
                await fetchRepos(storedToken);
            }
        };

        processGithubCallback();
    }, [location.search]);

    // ─── Fetch repos using a GitHub token ───
    const fetchRepos = async (token) => {
        if (!token) return;
        setLoading(true);
        setStatusMsg('Loading repositories...');
        try {
            const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
            if (!res.ok) throw new Error('Failed to fetch repositories');
            const data = await res.json();
            setRepos(
                data
                    .filter((r) => r && r.name)
                    .map((r) => ({
                        name: r.name,
                        full_name: r.full_name,
                        url: r.clone_url,
                        private: r.private,
                        description: r.description,
                    }))
            );
        } catch (err) {
            console.error('Repo fetch error:', err);
        } finally {
            setLoading(false);
            setStatusMsg('');
        }
    };

    // ─── Connect GitHub (separate from login) ───
    const handleConnectGithub = () => {
        const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
        if (!CLIENT_ID) {
            alert('GitHub Client ID is not configured. Please set VITE_GITHUB_CLIENT_ID in your .env file.');
            return;
        }
        // Redirect to GitHub OAuth — callback comes back to /dashboard?code=xxx
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard')}`;
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
        navigate('/agent', {
            state: {
                repoUrl,
                commitMsg,
                autoFix,
                accessToken: token,
            },
        });
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-4 md:pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-0.5 text-white">Mission Control</h1>
                    <p className="text-secondary text-xs md:text-sm">Select a target for autonomous remediation.</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Auth info badge — icon-only on mobile */}
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

                    {/* GitHub connection — icon + green dot on mobile */}
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
                        <p className="text-white text-lg font-medium">{statusMsg}</p>
                    </div>
                </div>
            )}

            {/* GitHub Connection Card - shown for all users when GitHub is NOT connected */}
            {!githubConnected && (
                <div className="bg-surface p-1 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="bg-black/50 p-8 rounded-xl text-center">
                        <div className="inline-flex p-4 bg-white/5 rounded-2xl mb-5 border border-white/5">
                            <Github className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Connect Your GitHub Account</h2>
                        <p className="text-secondary text-sm max-w-lg mx-auto mb-6">
                            Connect your GitHub account to import repositories and enable the AI agent to push automated fixes.
                            This is separate from your login method — you can be logged in with {authProvider === 'google' ? 'Google' : authProvider === 'email' ? 'email' : 'any provider'} and still connect GitHub.
                        </p>
                        <button
                            onClick={handleConnectGithub}
                            className="inline-flex items-center gap-3 bg-white text-black font-bold px-8 py-3.5 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.97] shadow-lg shadow-white/10"
                        >
                            <Github className="w-5 h-5" />
                            Connect GitHub Account
                        </button>
                        <p className="text-xs text-zinc-600 mt-4">
                            Grants read/write access to your selected repositories.
                        </p>
                    </div>
                </div>
            )}

            {/* OR: Manual URL entry for users who don't want to connect GitHub */}
            {!githubConnected && (
                <div className="flex items-center gap-4 my-2">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-secondary uppercase tracking-widest">or enter a url manually</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>
            )}

            {/* Input Configuration Panel */}
            <div className="bg-surface p-0.5 md:p-1 rounded-xl md:rounded-2xl border border-white/5 shadow-2xl">
                <div className="bg-black/50 p-3 md:p-5 rounded-lg md:rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Terminal className="w-4 h-4 text-primary" />
                            </div>
                            <h2 className="text-sm md:text-base font-semibold text-white">Target Configuration</h2>
                        </div>

                        {/* GitHub actions (when connected) */}
                        {githubConnected && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleRefreshRepos}
                                    disabled={loading}
                                    className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-secondary hover:text-white p-1.5 md:px-2.5 md:py-1 rounded-md border border-white/10 transition-colors text-[11px]"
                                    title="Refresh Repos"
                                >
                                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                                    <span className="hidden md:inline">Refresh</span>
                                </button>
                                <button
                                    onClick={handleDisconnectGithub}
                                    className="flex items-center gap-1 text-secondary hover:text-red-400 p-1.5 md:px-2.5 md:py-1 rounded-md hover:bg-white/5 transition-colors text-[11px]"
                                    title="Disconnect GitHub"
                                >
                                    <Unplug className="w-3 h-3" />
                                    <span className="hidden md:inline">Disconnect</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/5 pt-3">
                        <div className="space-y-3">
                            <div className="relative group">
                                <label className="text-[10px] md:text-xs font-mono text-secondary uppercase mb-1 block pl-1">
                                    Git Repository URL
                                </label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-secondary/50 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="https://github.com/username/repository"
                                        className="w-full bg-background border border-white/10 rounded-lg pl-9 pr-3 py-2 md:py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-mono text-xs md:text-sm"
                                        value={repoUrl}
                                        onChange={(e) => setRepoUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Commit Message Template */}
                            <div className="relative group">
                                <label className="text-[10px] md:text-xs font-mono text-secondary uppercase mb-1 pl-1 flex items-center gap-1.5">
                                    <MessageSquare className="w-3 h-3" /> Auto-Commit Message
                                </label>
                                <input
                                    type="text"
                                    placeholder="Fixed {issues_count} issues by GitFixAI"
                                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 md:py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-xs md:text-sm"
                                    value={commitMsg}
                                    onChange={(e) => setCommitMsg(e.target.value)}
                                />
                                <div className="flex items-center gap-1 mt-1 text-[10px] text-white/20">
                                    <Eye className="w-2.5 h-2.5" />
                                    <span className="truncate">Preview: {commitMsg.replace('{issues_count}', '12').replace('{files_changed}', '5').replace('{score}', '94')}</span>
                                </div>
                            </div>

                            {/* Auto-Fix Preferences */}
                            <div>
                                <label className="text-[10px] md:text-xs font-mono text-secondary uppercase mb-1.5 block pl-1">Auto-Fix Preferences</label>
                                <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                                    {[
                                        { key: 'syntax', label: 'Syntax', icon: <Pencil className="w-3.5 h-3.5" /> },
                                        { key: 'imports', label: 'Imports', icon: <Package className="w-3.5 h-3.5" /> },
                                        { key: 'formatting', label: 'Formatting', icon: <Palette className="w-3.5 h-3.5" /> },
                                        { key: 'security', label: 'Security', icon: <Lock className="w-3.5 h-3.5" /> },
                                    ].map(({ key, label, icon }) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setAutoFix(prev => ({ ...prev, [key]: !prev[key] }))}
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 md:py-2 rounded-lg border text-[11px] md:text-xs font-medium transition-all cursor-pointer ${autoFix[key]
                                                ? 'bg-primary/10 border-primary/30 text-white'
                                                : 'bg-white/2 border-white/10 text-white/40 hover:bg-white/5'
                                                }`}
                                        >
                                            <span className="opacity-70">{icon}</span>
                                            <span>{label}</span>
                                            <div className={`ml-auto w-3 h-3 rounded-full transition-colors ${autoFix[key] ? 'bg-primary' : 'bg-white/10'
                                                }`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                        <button
                            onClick={startAnalysis}
                            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-lg py-2.5 md:py-3 transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 group text-xs md:text-sm"
                        >
                            Initialize Agent{' '}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {!githubConnected && (
                            <div className="flex items-center gap-2 justify-center mt-3">
                                <AlertCircle className="w-3.5 h-3.5 text-yellow-500/70" />
                                <span className="text-xs text-yellow-500/70">
                                    GitHub not connected — the agent won't be able to push fixes. You can still scan public repos.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User Repositories Grid */}
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
                    <RepoList repos={repos} onSelect={(url) => setRepoUrl(url)} />
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
    );
}
