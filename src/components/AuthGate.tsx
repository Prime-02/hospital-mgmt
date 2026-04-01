'use client';

import { FormEvent, ReactNode, useEffect, useState } from 'react';

type AuthGateProps = {
    children: ReactNode;
};

type AuthMode = 'login' | 'signup';

const AUTH_KEY = 'hospital-mgmt-authenticated';
const AUTH_USER_KEY = 'hospital-mgmt-user';

export function AuthGate({ children }: AuthGateProps) {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [mode, setMode] = useState<AuthMode>('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authKey, setAuthKey] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const stored = window.localStorage.getItem(AUTH_KEY);
        setAuthenticated(stored === 'true');
    }, []);

    const saveSession = (user: Record<string, unknown>) => {
        window.localStorage.setItem(AUTH_KEY, 'true');
        window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        setAuthenticated(true);
    };

    const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setMessage('');

        if (!username.trim() || !password.trim()) {
            setError('Username and password are required.');
            return;
        }

        const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
        const payload: Record<string, string> = {
            username: username.trim(),
            password: password.trim(),
        };

        if (mode === 'signup') {
            if (!authKey.trim()) {
                setError('Auth key is required during signup.');
                return;
            }
            payload.email = email.trim();
            payload.authKey = authKey.trim();
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Authentication failed.');
                return;
            }

            if (data.user) {
                saveSession(data.user);
            } else {
                setError('Unable to authenticate user.');
            }
        } catch (err) {
            setError('Unable to contact authentication server.');
        }
    };

    const switchMode = (nextMode: AuthMode) => {
        setMode(nextMode);
        setError('');
        setMessage('');
    };

    if (authenticated === null) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <p className="text-sm text-slate-500">Checking authentication…</p>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
                <div className="w-full max-w-lg sm:max-w-xl rounded-[32px] border border-white/10 bg-slate-950/95 p-6 sm:p-8 shadow-2xl shadow-slate-950/30">
                    <div className="mb-8 text-center">
                        <p className="text-sm uppercase tracking-[0.35em] text-teal-400">Secure Access</p>
                        <h1 className="mt-4 text-3xl font-semibold text-white">
                            {mode === 'signup' ? 'Create Admin Account' : 'Hospital Management Login'}
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            {mode === 'signup'
                                ? 'Sign up with an auth key to become an admin and access the main UI.'
                                : 'Sign in with your credentials.'}
                        </p>
                    </div>

                    <div className="mb-6 flex gap-2 rounded-2xl bg-slate-900 p-1">
                        <button
                            type="button"
                            onClick={() => switchMode('login')}
                            className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold ${mode === 'login'
                                ? 'bg-slate-100 text-slate-950'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => switchMode('signup')}
                            className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold ${mode === 'signup'
                                ? 'bg-slate-100 text-slate-950'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Sign up
                        </button>
                    </div>

                    <form onSubmit={submitAuth} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-200">
                                Username
                            </label>
                            <input
                                id="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                                placeholder="admin"
                            />
                        </div>

                        {mode === 'signup' ? (
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                                    placeholder="admin@hospital.com"
                                />
                            </div>
                        ) : null}

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                                placeholder="Enter password"
                            />
                        </div>

                        {mode === 'signup' ? (
                            <div>
                                <label htmlFor="authkey" className="block text-sm font-medium text-slate-200">
                                    Admin Auth Key
                                </label>
                                <input
                                    id="authkey"
                                    value={authKey}
                                    onChange={(event) => setAuthKey(event.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                                    placeholder="Enter admin auth key"
                                />
                            </div>
                        ) : null}

                        {error ? (
                            <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                                {error}
                            </p>
                        ) : null}
                        {message ? (
                            <p className="rounded-2xl border border-teal-500/30 bg-teal-500/10 px-4 py-3 text-sm text-teal-100">
                                {message}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-teal-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
                        >
                            {mode === 'signup' ? 'Create account' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-4 text-sm text-slate-400">
                        {mode === 'signup' ? (
                            <p>If you already have an admin account, switch to login.</p>
                        ) : (
                            <p>Signup creates an admin account when a valid auth key is provided.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
