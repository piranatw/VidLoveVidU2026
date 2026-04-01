import React, { useState, useEffect, type JSX } from 'react';
import { Lock } from 'lucide-react';

interface ProtectedAdminRouteProps {
    children: JSX.Element;
}

const ADMIN_TOKEN_KEY = 'vlvu69_admin_token';
const TOKEN_VALIDITY_MS = 12 * 60 * 60 * 1000; // 12 hours

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const tokenStr = localStorage.getItem(ADMIN_TOKEN_KEY);
        if (!tokenStr) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const token = JSON.parse(tokenStr);
            const now = Date.now();
            if (now - token.timestamp < TOKEN_VALIDITY_MS) {
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem(ADMIN_TOKEN_KEY);
                setIsAuthenticated(false);
            }
        } catch {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            setIsAuthenticated(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        if (passwordInput === adminPassword) {
            localStorage.setItem(ADMIN_TOKEN_KEY, JSON.stringify({ timestamp: Date.now() }));
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password');
        }
    };

    if (isAuthenticated === null) {
        return <div className="p-10 text-center text-nostalgia-500">Checking auth...</div>;
    }

    if (isAuthenticated) {
        return children;
    }

    return (
        <div className="max-w-md mx-auto py-20 px-4">
            <div className="bg-white rounded-3xl shadow-xl border border-nostalgia-100 p-8 text-center">
                <div className="w-16 h-16 bg-nostalgia-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-nostalgia-600" />
                </div>
                <h2 className="text-2xl font-bold text-nostalgia-900 mb-2">Admin Access Required</h2>
                <p className="text-nostalgia-500 mb-8">Please enter the administrator password to continue.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-nostalgia-200 focus:outline-none focus:ring-2 focus:ring-retro-pink/50 text-center font-mono placeholder:font-sans"
                        placeholder="Enter Password"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 bg-retro-pink text-white rounded-xl font-bold hover:bg-retro-pink/90 transition-colors"
                    >
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    );
}
