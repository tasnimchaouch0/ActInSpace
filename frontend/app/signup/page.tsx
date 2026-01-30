"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('farmer');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5001/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            login(data.token, data.user);
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
            </div>

            <div className="relative w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-xl">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4 p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg shadow-primary/20">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Start Your Free Trial</h1>
                    <p className="text-muted-foreground">Join 500+ Tunisian farmers monitoring their groves</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="farmer@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="Create a strong password"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">I am a...</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('farmer')}
                                className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${role === 'farmer'
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-background border border-border text-muted-foreground hover:bg-accent'
                                    }`}
                            >
                                🌾 Farmer
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('expert')}
                                className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${role === 'expert'
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-background border border-border text-muted-foreground hover:bg-accent'
                                    }`}
                            >
                                🔬 Expert
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
