"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function PaymentPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { user, token, login } = useAuth();

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5001/api/payment/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    planId: 'pro_monthly',
                    paymentMethodId: 'pm_card_dummy'
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Payment failed');

            // Update local user state with new role/token if provided
            if (data.newToken && data.user) {
                login(data.newToken, data.user);
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Payment failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Payment Successful!</h2>
                    <p className="text-muted-foreground">Welcome to ZAYTUNA.AI Premium.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">

                {/* Plan Details */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-serif font-bold text-foreground leading-tight">
                        Upgrade to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Precision Farming</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Get unlimited satellite insights and AI recommendations for your fields.
                    </p>

                    <div className="space-y-4">
                        {['Daily Satellite Updates', 'Advanced Yield Prediction', 'Priority Expert Support'].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-foreground">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Form */}
                <div className="bg-card backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <div className="flex gap-2">
                            <div className="w-8 h-5 bg-border rounded"></div>
                            <div className="w-8 h-5 bg-border rounded"></div>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-6">Payment Details</h3>

                    <form onSubmit={handlePayment} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Card Number</label>
                            <div className="relative">
                                <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground font-mono focus:ring-2 focus:ring-primary/50 transition-all" placeholder="0000 0000 0000 0000" />
                                <svg className="w-6 h-6 text-muted-foreground absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Expiry</label>
                                <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground font-mono focus:ring-2 focus:ring-primary/50 transition-all" placeholder="MM/YY" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">CVC</label>
                                <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground font-mono focus:ring-2 focus:ring-primary/50 transition-all" placeholder="123" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] mt-4 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <span>Pay $29.00</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure 256-bit SSL Encrypted Payment
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
