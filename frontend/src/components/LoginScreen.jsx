import { Github } from 'lucide-react';
import React from 'react';

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || "Ov23liktz8bz4X5bMsds";

export default function LoginScreen() {
    const handleLogin = () => {
        const REDIRECT_URI = `${window.location.origin}/dashboard`;
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Welcome to Auto-DevOps Agent</h2>
                <p className="text-secondary max-w-md mx-auto">
                    Transform your broken code into production-ready software with our autonomous AI agent.
                </p>
            </div>

            <button
                onClick={handleLogin}
                className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all shadow-xl hover:shadow-white/20 active:scale-95"
            >
                <Github className="w-6 h-6" />
                Connect with GitHub
            </button>

            <div className="text-xs text-secondary mt-8">
                By connecting, you authorize the agent to read your repositories.
            </div>
        </div>
    );
}
