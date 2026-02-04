"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { Shield, Lock, CreditCard, ChevronLeft, Sparkles, Orbit, Zap } from 'lucide-react';

export default function PaymentPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
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
            }, 3000);
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Access Denied: ' + (err instanceof Error ? err.message : 'Uplink Failed'));
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-cyan-600/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />

                <div className="relative text-center z-10 animate-in fade-in zoom-in duration-700">
                    <div className="w-32 h-32 bg-emerald-500/20 rounded-[2.5rem] border border-emerald-500/30 flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                        <Zap className="w-16 h-16 text-emerald-400 fill-emerald-400/20" />
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter italic uppercase mb-4 leading-none">
                        UPLINK <span className="text-emerald-500">ESTABLISHED</span>
                    </h2>
                    <p className="text-emerald-500/60 font-mono text-sm tracking-[0.2em] uppercase">Mongi AI Pro Activated • Redirecting to Command Center</p>

                    <div className="mt-12 flex justify-center gap-1">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="w-12 h-1 bg-emerald-500/20 overflow-hidden rounded-full">
                                <div className="w-full h-full bg-emerald-400 animate-[loading_1.5s_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
                            </div>
                        ))}
                    </div>
                </div>
                <style jsx>{`
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans selection:text-emerald-200">
            {/* Header / Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8 flex justify-between items-center pointer-events-none">
                <Link href="/dashboard" className="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all font-bold text-sm tracking-tight group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Orbit</span>
                </Link>
                <div className="pointer-events-auto flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-mono tracking-widest text-white/40 uppercase">Secure Link Protocol 2.0</span>
                </div>
            </header>

            <main className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6">
                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center">

                    {/* Visual / Info Column */}
                    <div className="space-y-12 order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase">
                            <Sparkles className="w-3 h-3" />
                            Premium Activation
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black text-white leading-[0.85] tracking-tighter uppercase italic">
                            UNLEASH THE <br />
                            <span className="text-emerald-500">POWER</span> OF AI
                        </h1>

                        <p className="text-xl text-white/40 font-medium leading-relaxed max-w-lg">
                            Upgrade your grove to Pro for unlimited satellite temporal analysis, AI disease detection, and direct priority links to Mongi AI.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: 'Daily Sentinel-2 Uplinks', desc: 'Continuous sub-10m monitoring' },
                                { title: 'Advanced Agro-AI rules', desc: 'Expert system logic for every field' },
                                { title: 'Infinite Temporal Data', desc: 'No limits on historical comparisons' },
                                { title: 'Mongi AI Priority', desc: 'Fastest response times and VLM access' }
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-wider text-white group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
                                        <p className="text-xs text-white/40 font-mono uppercase tracking-widest mt-1">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                    <Orbit className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Selected Tier</p>
                                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Grove Pro Link</h4>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-white tracking-tighter">$29<span className="text-xs text-white/40">/MO</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 md:p-14 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                            {/* Scanning effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent animate-[scan_4s_linear_infinite]" />

                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Checkout Console</h3>
                                    <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-1">Uplink Encryption Active</p>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-8 h-5 rounded bg-white/10" />
                                    <div className="w-8 h-5 rounded bg-white/10" />
                                    <div className="w-8 h-5 rounded bg-white/10" />
                                </div>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] ml-1">Card Frequency Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                                            maxLength={19}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-white/10 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-lg tracking-widest"
                                            placeholder="XXXX XXXX XXXX XXXX"
                                        />
                                        <CreditCard className="w-6 h-6 text-white/20 absolute right-6 top-5" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] ml-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-white/10 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-center tracking-widest"
                                            placeholder="MM / YY"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] ml-1">Secure CVC</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-white/10 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-center tracking-widest"
                                                placeholder="***"
                                                maxLength={3}
                                            />
                                            <Lock className="w-4 h-4 text-white/20 absolute right-6 top-6" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full group/btn relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_40px_rgba(5,150,105,0.2)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/20 to-emerald-400/0 -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]" />
                                    <div className="relative flex items-center justify-center gap-3 italic uppercase tracking-[0.1em] text-lg">
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Initialize $29 Uplink</span>
                                                <Zap className="w-5 h-5 fill-current" />
                                            </>
                                        )}
                                    </div>
                                </button>

                                <div className="flex items-center justify-center gap-6 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">256-Bit Link</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Sentinel-Certified</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
