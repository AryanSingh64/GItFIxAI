import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-secondary text-sm">Verifying session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans animate-fade-in">
            <Navbar />
            <main className="max-w-7xl mx-auto p-6 md:p-12">
                <Outlet />
            </main>
        </div>
    );
}
