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
            { delay: 800, text: 'CONNECTING TO SENTINEL NETWORK...' },
            { delay: 1600, text: 'ACQUIRING SATELLITE IMAGERY...' },
            { delay: 2400, text: 'LOCATING OLIVE FIELDS...' },
            { delay: 3200, text: `TARGETING: ${targetLocation?.region || 'SFAX REGION'}` },
            { delay: 4000, text: 'ESTABLISHING DATA STREAM...' },
        ];

        stages.forEach(({ delay, text }) => {
            setTimeout(() => {
                setStatusText(text);
                setStage(prev => prev + 1);
            }, delay);
        });

        // Complete animation after 5 seconds
        const timer = setTimeout(() => {
            onComplete();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onComplete, targetLocation]);

    return (
        <div className="fixed inset-0 z-[100] bg-space-950 overflow-hidden">
            {/* Star field background */}
            <div className="absolute inset-0">
                {Array.from({ length: 100 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.8 + 0.2,
                            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Central Earth and zoom effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Outer orbital rings */}
                <div className="absolute" style={{ animation: 'orbit 30s linear infinite' }}>
                    <div className="w-[600px] h-[600px] border border-cyber-500/20 rounded-full" />
                </div>
                <div className="absolute" style={{ animation: 'orbit 25s linear infinite reverse' }}>
                    <div className="w-[500px] h-[500px] border border-leaf-500/20 rounded-full" />
                </div>
                <div className="absolute" style={{ animation: 'orbit 20s linear infinite' }}>
                    <div className="w-[400px] h-[400px] border border-cyber-500/10 rounded-full" />
                </div>

                {/* Earth container with zoom animation */}
                <div
                    className="relative transition-all duration-1000 ease-out"
                    style={{
                        transform: `scale(${1 + stage * 0.5})`,
                        opacity: stage > 4 ? 0 : 1,
                    }}
                >
                    {/* Earth glow */}
                    <div
                        className="absolute -inset-8 rounded-full blur-xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(34, 197, 94, 0.1) 50%, transparent 70%)',
                        }}
                    />

                    {/* Earth sphere */}
                    <div
                        className="relative w-64 h-64 rounded-full overflow-hidden"
                        style={{
                            background: `
                                radial-gradient(circle at 30% 30%, 
                                    rgba(59, 130, 246, 0.8) 0%, 
                                    rgba(34, 197, 94, 0.6) 25%,
                                    rgba(61, 79, 47, 0.8) 50%, 
                                    rgba(15, 23, 42, 1) 100%
                                )
                            `,
                            boxShadow: `
                                inset -20px -20px 60px rgba(0, 0, 0, 0.8),
                                inset 10px 10px 40px rgba(156, 175, 136, 0.2),
                                0 0 60px rgba(14, 165, 233, 0.4),
                                0 0 120px rgba(34, 197, 94, 0.2)
                            `,
                            animation: 'earth-rotate 20s linear infinite',
                        }}
                    >
                        {/* Atmosphere layer */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: 'radial-gradient(circle at 30% 30%, transparent 40%, rgba(14, 165, 233, 0.1) 60%, rgba(14, 165, 233, 0.2) 100%)',
                            }}
                        />

                        {/* Continental shapes (simplified) */}
                        <div
                            className="absolute"
                            style={{
                                top: '35%',
                                left: '45%',
                                width: '40px',
                                height: '50px',
                                background: 'rgba(107, 127, 90, 0.6)',
                                borderRadius: '40% 60% 50% 40%',
                                transform: 'rotate(-10deg)',
                                boxShadow: '0 0 10px rgba(107, 127, 90, 0.3)',
                            }}
                        />
                        <div
                            className="absolute"
                            style={{
                                top: '25%',
                                left: '50%',
                                width: '60px',
                                height: '40px',
                                background: 'rgba(107, 127, 90, 0.5)',
                                borderRadius: '50% 40% 60% 50%',
                                transform: 'rotate(5deg)',
                            }}
                        />

                        {/* Tunisia/Sfax location marker */}
                        <div
                            className="absolute"
                            style={{
                                top: '38%',
                                left: '52%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            {/* Pulse rings */}
                            <div className="absolute -inset-4 rounded-full border-2 border-neon-400/60 animate-ping" />
                            <div className="absolute -inset-2 rounded-full border border-neon-400/40 animate-pulse" />
                            {/* Core marker */}
                            <div
                                className="relative w-4 h-4 rounded-full"
                                style={{
                                    background: 'radial-gradient(circle, #22c55e 0%, #4ade80 50%, transparent 100%)',
                                    boxShadow: '0 0 20px #22c55e, 0 0 40px #22c55e50',
                                }}
                            />
                        </div>
                    </div>

                    {/* Satellite orbiting */}
                    <div
                        className="absolute w-full h-full"
                        style={{ animation: 'orbit 8s linear infinite' }}
                    >
                        <div
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                            style={{
                                fontSize: '16px',
                                textShadow: '0 0 10px rgba(14, 165, 233, 0.8)',
                            }}
                        >
                            🛰️
                        </div>
                    </div>
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
