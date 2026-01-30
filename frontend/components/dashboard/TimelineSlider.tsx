"use client";

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface TimelineSliderProps {
    history: Array<{ date: string; ndvi?: number; moisture_index?: number }>;
    onDateChange: (date: string) => void;
    className?: string;
}

export default function TimelineSlider({ history, onDateChange, className = '' }: TimelineSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(history.length - 1);
    const [isPlaying, setIsPlaying] = useState(false);

    // Auto-play functionality
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
        }, 1000); // 1 second per frame

        return () => clearInterval(interval);
    }, [isPlaying, history.length]);

    // Notify parent of date changes
    useEffect(() => {
        if (history[currentIndex]) {
            onDateChange(history[currentIndex].date);
        }
    }, [currentIndex, history, onDateChange]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentIndex(parseInt(e.target.value));
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (currentIndex >= history.length - 1) {
            setCurrentIndex(0);
        }
        setIsPlaying(!isPlaying);
    };

    const skipBackward = () => {
        setCurrentIndex(Math.max(0, currentIndex - 1));
        setIsPlaying(false);
    };

    const skipForward = () => {
        setCurrentIndex(Math.min(history.length - 1, currentIndex + 1));
        setIsPlaying(false);
    };

    if (!history || history.length === 0) {
        return null;
    }

    const currentDate = history[currentIndex]?.date || '';
    const formattedDate = new Date(currentDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 ${className}`}>
            <div className="bg-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl px-8 py-4 shadow-2xl shadow-emerald-500/20 min-w-[600px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-emerald-400">
                        Temporal Analysis
                    </div>
                    <div className="text-lg font-bold text-white">
                        {formattedDate}
                    </div>
                </div>

                {/* Slider */}
                <div className="mb-4">
                    <input
                        type="range"
                        min="0"
                        max={history.length - 1}
                        value={currentIndex}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                        style={{
                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${(currentIndex / (history.length - 1)) * 100}%, #374151 ${(currentIndex / (history.length - 1)) * 100}%, #374151 100%)`
                        }}
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>{history[0]?.date ? new Date(history[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                        <span>{history[history.length - 1]?.date ? new Date(history[history.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={skipBackward}
                        disabled={currentIndex === 0}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <SkipBack className="w-5 h-5 text-white" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="p-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30"
                    >
                        {isPlaying ? (
                            <Pause className="w-6 h-6 text-black" />
                        ) : (
                            <Play className="w-6 h-6 text-black ml-0.5" />
                        )}
                    </button>

                    <button
                        onClick={skipForward}
                        disabled={currentIndex === history.length - 1}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <SkipForward className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Progress indicator */}
                <div className="mt-3 text-center text-xs text-gray-500">
                    Frame {currentIndex + 1} of {history.length}
                </div>
            </div>

            <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}</style>
        </div>
    );
}
