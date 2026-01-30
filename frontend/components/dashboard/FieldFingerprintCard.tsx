"use client";

import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Target, Activity, Flame, Radio, Brain, Zap } from 'lucide-react';

interface FieldFingerprintCardProps {
    fieldId: string;
    data: {
        current: {
            ndvi?: number;
            moisture_index?: number;
            date?: string;
        };
        history: Array<{ date: string; ndvi?: number; moisture_index?: number }>;
        risk_level: string;
        confidence: number;
        insight: {
            title: string;
            description: string;
            action: string;
        };
        metrics: {
            ndvi_trend: number;
            moisture_trend: number;
        };
    };
    onClose: () => void;
    isInline?: boolean;
}

export default function FieldFingerprintCard({ fieldId, data, onClose, isInline = false }: FieldFingerprintCardProps) {
    const { current, insight, metrics, risk_level, confidence } = data;
    const [animateIn, setAnimateIn] = useState(false);
    const [activeTab, setActiveTab] = useState<'fingerprint' | 'timeline' | 'ai'>('fingerprint');

    useEffect(() => {
        setTimeout(() => setAnimateIn(true), 50);
    }, []);

    const getNDVIStatus = (ndvi?: number) => {
        if (!ndvi) return { label: 'OFFLINE', color: '#64748b' };
        if (ndvi > 0.6) return { label: 'OPTIMAL VEGETATION', color: '#16a34a' }; // Slightly darker for light mode
        if (ndvi > 0.4) return { label: 'STUNTED GROWTH', color: '#d97706' };
        return { label: 'CRITICAL STRESS', color: '#dc2626' };
    };

    const status = getNDVIStatus(current.ndvi);

    const containerClass = isInline
        ? `w-full transition-all duration-1000 transform ${animateIn ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`
        : `fixed top-24 right-6 w-96 z-[600] transition-all duration-1000 transform ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`;

    return (
        <div className={containerClass}>
            <div className="relative">
                {/* Subtle outer glow for light mode */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent rounded-[2.5rem] blur-2xl opacity-50" />

                <div className="relative bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                    {/* Brand Accent Line */}
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#16a34a] to-transparent" />

                    {/* Header */}
                    <div className="p-8 border-b border-slate-100 relative bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                    <Target className="w-6 h-6 text-[#16a34a]" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-black text-black tracking-tighter uppercase italic leading-none">FIELD DATA <span className="text-[#16a34a]">#{fieldId.split('-')[1]}</span></h3>
                                        <div className="px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-200 text-[8px] font-black text-emerald-700 tracking-widest">LIVE</div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className={`w-1 h-3 rounded-full ${i === 3 ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-200'}`} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-mono font-bold tracking-[0.2em] uppercase">Multi-Spectral Uplink</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-slate-400 hover:text-black" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs - Light Mode */}
                    <div className="flex px-4 py-2 bg-slate-50 border-b border-slate-100 gap-2">
                        {(['fingerprint', 'timeline', 'ai'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-[10px] font-black tracking-widest rounded-xl transition-all uppercase relative overflow-hidden ${activeTab === tab ? 'text-black bg-white shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab === 'ai' ? 'COGNITIVE' : tab}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-8 min-h-[380px]">
                        {activeTab === 'fingerprint' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div className="grid grid-cols-2 gap-6">
                                    {/* NDVI Metric */}
                                    <div className="relative group p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-4">
                                        <div className="text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase">Indices: NDVI</div>
                                        <div className="relative inline-block">
                                            <svg className="w-24 h-24 transform -rotate-90">
                                                <circle cx="48" cy="48" r="42" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                                                <circle cx="48" cy="48" r="42" stroke="#16a34a" strokeWidth="6" fill="transparent" strokeDasharray={264} strokeDashoffset={264 * (1 - (current.ndvi || 0))} strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-black text-black font-mono tracking-tighter">{current.ndvi?.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{status.label}</div>
                                    </div>

                                    {/* Moisture Metric */}
                                    <div className="relative group p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-4">
                                        <div className="text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase">Soil: Moisture</div>
                                        <div className="relative inline-block">
                                            <svg className="w-24 h-24 transform -rotate-90">
                                                <circle cx="48" cy="48" r="42" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                                                <circle cx="48" cy="48" r="42" stroke="#0891b2" strokeWidth="6" fill="transparent" strokeDasharray={264} strokeDashoffset={264 * (1 - (current.moisture_index || 0))} strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-black text-black font-mono tracking-tighter">{Math.round((current.moisture_index || 0) * 100)}%</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-cyan-600 uppercase tracking-tighter">HYDRATION LEVEL</div>
                                    </div>
                                </div>

                                {/* Trends Section */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">NDVI Trend</div>
                                            <div className={`text-xl font-black font-mono tracking-tighter ${metrics.ndvi_trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {metrics.ndvi_trend > 0 ? '+' : ''}{metrics.ndvi_trend.toFixed(3)}
                                            </div>
                                        </div>
                                        {metrics.ndvi_trend > 0 ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Moisture Var</div>
                                            <div className={`text-xl font-black font-mono tracking-tighter ${metrics.moisture_trend > 0 ? 'text-cyan-600' : 'text-red-500'}`}>
                                                {metrics.moisture_trend > 0 ? '+' : ''}{Math.round(metrics.moisture_trend * 100)}%
                                            </div>
                                        </div>
                                        <Radio className={`w-5 h-5 ${metrics.moisture_trend > 0 ? 'text-cyan-500' : 'text-red-300'}`} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
                                    <h4 className="text-[10px] font-black text-emerald-600 tracking-[0.4em] uppercase mb-4">TEMPORAL SIGNATURE</h4>
                                    <div className="space-y-6 relative z-10">
                                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
                                            <p className="text-xs text-slate-600 font-mono leading-relaxed">
                                                Detecting cyclic fluctuations in vegetation density across the 90-day window. Stability index is current within expected threshold.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                            <div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Analysis Conf.</div>
                                                <div className="text-2xl font-black text-black font-mono tracking-tighter">{Math.round(confidence * 100)}%</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Risk Index</div>
                                                <div className={`text-2xl font-black uppercase tracking-tighter ${risk_level === 'Low' ? 'text-emerald-600' : 'text-red-500'}`}>{risk_level}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div className="animate-in slide-in-from-right-4 duration-700 relative h-full flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                            <Brain className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-indigo-500 tracking-widest uppercase">SYNPATIC PREDICTION</div>
                                            <div className="text-black font-black uppercase tracking-tighter italic leading-none">NEURAL ENGINE v2.0</div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                            <Zap className="w-32 h-32 text-indigo-500" />
                                        </div>
                                        <h5 className="text-xl font-black text-black uppercase tracking-tighter leading-none mb-4">{insight.title}</h5>
                                        <p className="text-base text-slate-600 leading-relaxed font-serif italic">"{insight.description}"</p>
                                    </div>
                                </div>

                                <div className="bg-emerald-600 rounded-2xl p-6 shadow-lg shadow-emerald-200 mt-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Flame className="w-4 h-4 text-white" />
                                        <span className="text-[9px] font-black text-emerald-100 uppercase tracking-widest">Actionable Command</span>
                                    </div>
                                    <p className="text-white text-base font-black uppercase leading-tight tracking-tighter">
                                        {insight.action}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer - Light */}
                    <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-[8px] text-slate-400 font-black tracking-[0.3em] uppercase">SYSTEM.L2A / SATELLITE ARRAY</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Secure Link Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
