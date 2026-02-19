import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Terminal, Github, Link as LinkIcon, Loader2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RepoList from '../components/RepoList';

export default function Dashboard() {
    const [repos, setRepos] = useState([]);
    const [repoUrl, setRepoUrl] = useState('');
    const [teamName, setTeamName] = useState('RIFT ORGANISERS');
    const [leaderName, setLeaderName] = useState('Saiyam Kumar');
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();
    const oauthProcessed = useRef(false);

    useEffect(() => {
        // Check local storage for session
        const storedToken = localStorage.getItem('access_token');
        const storedProfile = localStorage.getItem('user_profile');
        if (storedProfile) {
            setUserProfile(JSON.parse(storedProfile));
        }

        const checkAuthCode = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const code = queryParams.get('code');

            if (code && !oauthProcessed.current) {
                oauthProcessed.current = true;
                window.history.replaceState({}, document.title, "/dashboard");
                setLoading(true);
                setStatusMsg('Verifying GitHub Credentials...');

                try {
                    const response = await fetch('http://localhost:8000/auth/github', {
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
                        localStorage.setItem('access_token', data.access_token);
                    }

                    if (data.repos) {
                        setRepos(data.repos);
                        if (data.repos.length > 0) {
                            // Mock profile from first repo owner if API doesn't return user
                            const owner = data.repos[0].owner || {}; // Need to ensure backend sends owner
                            const profile = { name: "GitHub User", avatar: "" }; // Placeholder
                            localStorage.setItem('user_profile', JSON.stringify(profile));
                            setUserProfile(profile);
                        }
                    } else {
                        alert('Authenticated, but no repositories were found. Make sure you have public repos.');
                    }
                } catch (error) {
                    console.error("Repo Fetch Failed", error);
                    alert(`Authentication Failed: ${error.message}`);
                } finally {
                    setLoading(false);
                    setStatusMsg('');
                }
            }
        };

        checkAuthCode();
    }, []);

    const handleConnectGithub = () => {
        // Use the updated Client ID from User
        const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const REDIRECT_URI = "http://localhost:5173/dashboard";
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
    };

    const startAnalysis = () => {
        if (!repoUrl) return alert("Please select a repository or enter a URL!");
        navigate('/agent', { state: { repoUrl, teamName, leaderName, accessToken: localStorage.getItem('access_token') } });
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Mission Control</h1>
                    <p className="text-secondary">Select a target for autonomous remediation.</p>
                </div>

                <div className="flex items-center gap-4">
                    {userProfile && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs text-white">
                            <User className="w-3 h-3" /> Logged In
                        </div>
                    )}
                    {repos.length === 0 && !loading && (
                        <button
                            onClick={handleConnectGithub}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/10 transition-colors text-sm font-medium"
                        >
                            <Github className="w-4 h-4" /> Import from GitHub
                        </button>
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

            {/* Input Configuration Panel */}
            <div className="bg-surface p-1 rounded-2xl border border-white/5 shadow-2xl">
                <div className="bg-black/50 p-6 rounded-xl space-y-6">

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Terminal className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Target Configuration</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="relative group">
                            <label className="text-xs font-mono text-secondary uppercase mb-1 block pl-1">Git Repository URL</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-4 top-3.5 w-4 h-4 text-secondary/50 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="https://github.com/username/repository"
                                    className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all font-mono text-sm shadow-inner"
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-mono text-secondary uppercase mb-1 block pl-1">Team Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-mono text-secondary uppercase mb-1 block pl-1">Team Leader</label>
                                <input
                                    type="text"
                                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                    value={leaderName}
                                    onChange={(e) => setLeaderName(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={startAnalysis}
                            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-lg py-4 transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 group"
                        >
                            Initialize Agent <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* User Repositories Grid */}
            {repos.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-secondary uppercase font-mono tracking-wider">
                        <Github className="w-4 h-4" /> Available Targets
                    </div>
                    <RepoList repos={repos} onSelect={(url) => setRepoUrl(url)} />
                </div>
            ) : (
                <>
                    {localStorage.getItem('access_token') && !loading && (
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
                            <Github className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-white mb-2">No Repositories Found</h3>
                            <p className="text-secondary text-sm max-w-md mx-auto">
                                We couldn't find any public repositories linked to your account.
                                You can still manually enter a Git URL above.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
