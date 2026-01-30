"use client";

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Calendar, Radio, Activity } from 'lucide-react';

interface TimelineSliderProps {
    history: Array<{ date: string; ndvi?: number; moisture_index?: number }>;
    onDateChange: (date: string) => void;
    className?: string;
    isInline?: boolean;
}

export default function TimelineSlider({ history, onDateChange, className = '', isInline = false }: TimelineSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(history.length - 1);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                if (prev >= history.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 800);
        return () => clearInterval(interval);
    }, [isPlaying, history.length]);

    useEffect(() => {
        if (history[currentIndex]) {
            onDateChange(history[currentIndex].date);
        }
    }, [currentIndex, history, onDateChange]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentIndex(parseInt(e.target.value));
        setIsPlaying(false);
    };

    if (!history || history.length === 0) return null;

    const currentData = history[currentIndex];
    const formattedDate = new Date(currentData?.date || '').toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const containerClass = isInline
        ? `w-full ${className} animate-in fade-in duration-1000`
        : `fixed bottom-8 left-1/2 -translate-x-1/2 z-[600] ${className} animate-in slide-in-from-bottom-8 duration-1000`;

    return (
        <div className={containerClass}>
            <div className="relative group">
                <div className="absolute -inset-1 bg-slate-200/50 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000" />

                <div className="relative bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                    {/* Industrial Header - Light */}
                    <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-cyan-600" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase mb-0.5">Time Dimension</h4>
                                <div className="text-xl font-black text-black italic tracking-tighter uppercase leading-none">TEMPORAL ANALYZER</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-black font-mono tracking-tighter leading-none">{formattedDate}</div>
                            <div className="text-[9px] font-bold text-cyan-600 tracking-[0.2em] uppercase mt-1">Satellite Pass: #{(currentIndex + 1).toString().padStart(2, '0')}</div>
                        </div>
                    </div>

                    <div className="p-10">
                        {/* Histogram Visual - Light Mode */}
                        <div className="h-24 flex items-end gap-1 mb-10 bg-slate-50 rounded-[2rem] p-5 border border-slate-100 relative overflow-hidden">
                            {history.map((point, i) => {
                                const isActive = i === currentIndex;
                                const height = (point.ndvi || 0) * 100;
                                const pointColor = (point.ndvi || 0) > 0.6 ? '#059669' : (point.ndvi || 0) > 0.4 ? '#d97706' : '#dc2626';
                                return (
                                    <div
                                        key={i}
                                        className="flex-1 rounded-t-sm transition-all duration-300 relative"
                                        style={{
                                            height: `${Math.max(height * 0.8, 10)}%`,
                                            backgroundColor: isActive ? pointColor : '#e2e8f0',
                                            transform: isActive ? 'scaleY(1.1) translateY(-2px)' : 'none'
                                        }}
                                        onClick={() => setCurrentIndex(i)}
                                    >
                                        {isActive && <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full" />}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Control Deck */}
                        <div className="flex items-center justify-between gap-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                                    <SkipBack className="w-5 h-5 text-slate-600" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (currentIndex >= history.length - 1) setCurrentIndex(0);
                                        setIsPlaying(!isPlaying);
                                    }}
                                    className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all transform active:scale-95 shadow-lg shadow-cyan-200 ${isPlaying ? 'bg-rose-500 hover:bg-rose-600' : 'bg-cyan-600 hover:bg-cyan-700'}`}
                                >
                                    {isPlaying ? <Pause className="w-8 h-8 text-white fill-current" /> : <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />}
                                </button>
                                <button onClick={() => setCurrentIndex(Math.min(history.length - 1, currentIndex + 1))} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                                    <SkipForward className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>

                            {/* Slider Rail - Light Mode */}
                            <div className="flex-1 px-4">
                                <input
                                    type="range" width="100%" min="0" max={history.length - 1} value={currentIndex}
                                    onChange={handleSliderChange}
                                    className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer premium-scrubber-light"
                                    style={{
                                        background: `linear-gradient(to right, #0891b2 0%, #0891b2 ${(currentIndex / (history.length - 1)) * 100}%, rgba(0,0,0,0.05) ${(currentIndex / (history.length - 1)) * 100}%)`
                                    }}
                                />
                            </div>

                            <div className="hidden lg:flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-[9px] font-black text-slate-400 tracking-widest uppercase mb-1">Status Protocol</div>
                                    <div className={`text-[10px] font-black tracking-widest uppercase ${isPlaying ? 'text-emerald-600' : 'text-slate-400'}`}>{isPlaying ? 'SCANNING' : 'STANDBY'}</div>
                                </div>
                                <div className="h-10 w-px bg-slate-200" />
                                <div className="text-right">
                                    <div className="text-[9px] font-black text-slate-400 tracking-widest uppercase mb-1">Pass Index</div>
                                    <div className="text-xl font-black text-black font-mono tracking-tighter">{(currentIndex + 1).toString().padStart(2, '0')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .premium-scrubber-light::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border: 4px solid #0891b2;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(8, 145, 178, 0.2);
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
