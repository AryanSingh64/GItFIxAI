import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LogOut, ArrowLeft, Terminal, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/');
    };

    const isLanding = location.pathname === '/';
    const isAuth = location.pathname === '/auth';

    if (isLanding || isAuth) return null;

    return (
        <div className="border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                        <div className="bg-white/5 p-1.5 rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold tracking-tight text-white">AUTO-DEVOPS AGENT</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 text-sm font-medium text-secondary">
                        <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:text-white transition-colors ${location.pathname === '/dashboard' ? 'text-white bg-white/5' : ''}`}>
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>

                        {location.pathname === '/agent' && (
                            <>
                                <span className="text-white/10">/</span>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-primary bg-primary/10 border border-primary/20">
                                    <Terminal className="w-3 h-3" /> Active Session
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {location.pathname === '/agent' && (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-secondary hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </button>
                    )}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-red-400 transition-colors px-3 py-1.5 rounded hover:bg-white/5"
                    >
                        <LogOut className="w-4 h-4" />
                        Disconnect
                    </button>
                </div>
            </div>
        </div>
    );
}
