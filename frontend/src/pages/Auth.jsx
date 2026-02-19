import React from 'react';
import { Github, ShieldCheck } from 'lucide-react';

export default function Auth() {
    const handleGithubLogin = () => {
        // Direct Redirect Flow (bypassing Supabase for Simplicity)
        const CLIENT_ID = "Ov23liMwKc65dOyh7pna";
        const REDIRECT_URI = "http://localhost:5173/dashboard";
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Aesthetic Background Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="w-full max-w-md bg-surface border border-white/10 p-10 rounded-2xl shadow-2xl relative z-10 backdrop-blur-sm">

                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-white/5 rounded-2xl mb-6 border border-white/5 shadow-inner">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                        Identify Yourself
                    </h1>
                    <p className="text-secondary">
                        Connect your GitHub account to grant the agent access to your repositories.
                    </p>
                </div>

                <button
                    onClick={handleGithubLogin}
                    className="w-full bg-white text-black font-bold h-14 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-[0.98] shadow-lg shadow-white/10 group"
                >
                    <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Continue with GitHub</span>
                </button>

                <p className="mt-8 text-center text-xs text-zinc-600">
                    By connecting, you authorize the agent to read and push to selected public repositories.
                </p>

            </div>
        </div>
    );
}
