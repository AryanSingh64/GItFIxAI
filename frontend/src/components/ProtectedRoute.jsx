import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function ProtectedRoute() {
    const [hasAccess, setHasAccess] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Check if we have a valid auth session (GitHub Token) from our backend flow
        const token = localStorage.getItem('access_token');
        // Also allow access if this is an OAuth callback with a ?code= parameter
        const queryParams = new URLSearchParams(location.search);
        const oauthCode = queryParams.get('code');

        if (token || oauthCode) {
            setHasAccess(true);
        } else {
            setHasAccess(false);
        }
    }, [location.search]);

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
