import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function ProtectedRoute() {
    const [hasAccess, setHasAccess] = useState(null);

    useEffect(() => {
        // Check if we have a valid auth session (GitHub Token) from our backend flow
        const token = localStorage.getItem('access_token');
        if (token) {
            setHasAccess(true);
        } else {
            setHasAccess(false);
        }
    }, []);

    if (hasAccess === null) return null; // Loading state

    if (!hasAccess) return <Navigate to="/auth" replace />;

    return (
        <div className="min-h-screen bg-background text-white font-sans animate-fade-in">
            <Navbar />
            <main className="max-w-7xl mx-auto p-6 md:p-12">
                <Outlet />
            </main>
        </div>
    );
}
