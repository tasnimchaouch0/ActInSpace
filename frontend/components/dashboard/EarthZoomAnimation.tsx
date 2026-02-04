'use client';

import { useEffect, useState } from 'react';

interface EarthZoomAnimationProps {
    onComplete: () => void;
    targetLocation?: {
        name: string;
        region: string;
    };
}

export default function EarthZoomAnimation({ onComplete, targetLocation }: EarthZoomAnimationProps) {
    const [stage, setStage] = useState(0);
    const [statusText, setStatusText] = useState('INITIALIZING ORBITAL SYSTEMS...');

    // Sfax, Tunisia coordinates for the olive fields
    const SFAX_COORDS = { lat: 34.75, lng: 10.76 };

    useEffect(() => {
        const stages = [
            { delay: 0, text: 'INITIALIZING ORBITAL SYSTEMS...' },
            { delay: 1600, text: 'CONNECTING TO SENTINEL NETWORK...' },
            { delay: 3200, text: 'ACQUIRING SATELLITE IMAGERY...' },
            { delay: 4800, text: 'LOCATING OLIVE FIELDS...' },
            { delay: 6400, text: `TARGETING: ${targetLocation?.region || 'SFAX REGION'}` },
            { delay: 8000, text: 'ESTABLISHING DATA STREAM...' },
        ];

        stages.forEach(({ delay, text }) => {
            setTimeout(() => {
                setStatusText(text);
                setStage(prev => prev + 1);
            }, delay);
        });

        // Complete animation after 10 seconds
        const timer = setTimeout(() => {
            onComplete();
        }, 10000);

        return () => clearTimeout(timer);
    }, [onComplete, targetLocation]);


    return (
        <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
            {/* Star field background */}
            <div className="absolute inset-0 pointer-events-none select-none">
                {Array.from({ length: 120 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: `${Math.random() * 1.5 + 0.5}px`,
                            height: `${Math.random() * 1.5 + 0.5}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.7 + 0.1,
                            filter: 'blur(0.5px)',
                            animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Cinematic Earth zoom */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className="relative"
                    style={{
                        width: '420px',
                        height: '420px',
                        transform: `scale(${1 + stage * 0.22}) rotateX(18deg)`,
                        opacity: stage > 4 ? 0 : 1,
                        transition: 'transform 1.2s cubic-bezier(0.4,0,0.2,1), opacity 1s',
                        filter: 'drop-shadow(0 0 80px #0ea5e9aa) drop-shadow(0 0 120px #22c55e55)'
                    }}
                >
                    {/* Earth sphere with realistic shading */}
                    <div
                        className="absolute w-full h-full rounded-full overflow-hidden"
                        style={{
                            background: `radial-gradient(circle at 60% 35%, #b3e0ff 0%, #3b82f6 30%, #1e293b 70%, #111827 100%)`,
                            boxShadow: 'inset 0 0 80px #000a, 0 0 120px #0ea5e9aa',
                            border: '2px solid #0ea5e9',
                            zIndex: 2,
                        }}
                    >
                        {/* Subtle cloud layer */}
                        <div
                            className="absolute w-full h-full rounded-full"
                            style={{
                                background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)',
                                filter: 'blur(2.5px)',
                                zIndex: 3,
                            }}
                        />
                        {/* Subtle highlight */}
                        <div
                            className="absolute w-2/3 h-1/3 left-1/4 top-1/8 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 80%)',
                                filter: 'blur(8px)',
                                zIndex: 4,
                            }}
                        />
                        {/* Location marker (fades in late) */}
                        <div
                            className="absolute"
                            style={{
                                top: '54%',
                                left: '62%',
                                transform: 'translate(-50%, -50%)',
                                opacity: stage > 3 ? 1 : 0,
                                transition: 'opacity 1s',
                                zIndex: 10,
                            }}
                        >
                            <div className="absolute -inset-4 rounded-full border-2 border-cyan-400/60 animate-ping" />
                            <div className="absolute -inset-2 rounded-full border border-cyan-400/40 animate-pulse" />
                            <div
                                className="relative w-4 h-4 rounded-full"
                                style={{
                                    background: 'radial-gradient(circle, #22c55e 0%, #4ade80 50%, transparent 100%)',
                                    boxShadow: '0 0 20px #22c55e, 0 0 40px #22c55e50',
                                }}
                            />
                        </div>
                    </div>
                    {/* Earth glow */}
                    <div
                        className="absolute -inset-8 rounded-full blur-2xl"
                        style={{
                            background: 'radial-gradient(circle, #0ea5e9 0%, #22c55e 60%, transparent 100%)',
                            zIndex: 1,
                        }}
                    />
                </div>
            </div>

            {/* Map emerging overlay (fade in as Earth fades out) */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-space-950 via-transparent to-space-950 transition-opacity duration-1000"
                style={{ opacity: stage > 4 ? 1 : 0 }}
            />

            {/* Status display */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-xl mx-auto">
                    {/* Progress bar */}
                    <div className="h-1 bg-space-800 rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-gradient-to-r from-cyber-500 via-leaf-500 to-neon-500 transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${(stage / 6) * 100}%` }}
                        />
                    </div>

                    {/* Status text */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyber-400 animate-pulse" />
                        <span className="text-cyber-400 font-mono text-sm tracking-widest animate-pulse">
                            {statusText}
                        </span>
                    </div>

                    {/* Coordinates display */}
                    <div className="text-center mt-4 text-gray-500 font-mono text-xs tracking-wider">
                        TARGET: {SFAX_COORDS.lat.toFixed(4)}°N, {SFAX_COORDS.lng.toFixed(4)}°E
                    </div>
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 text-cyber-500/50 font-mono text-xs">
                <div>SENTINEL-1 ● ONLINE</div>
                <div>SENTINEL-2 ● ONLINE</div>
            </div>
            <div className="absolute top-4 right-4 text-right text-leaf-500/50 font-mono text-xs">
                <div>ZAYTUNA.AI</div>
                <div>ORBITAL MONITOR v2.0</div>
            </div>

            {/* Data stream lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-500 to-transparent animate-data-stream" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-leaf-500 to-transparent animate-data-stream" style={{ animationDelay: '1s' }} />
        </div>
    );
}
