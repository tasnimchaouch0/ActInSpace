'use client';

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Html } from '@react-three/drei';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import * as THREE from 'three';

// Dynamic import to avoid SSR issues with Three.js
const MongiCharacter = dynamic(() => import('@/components/3d/MongiCharacter'), { ssr: false });

export default function MongiPage() {
    const [text, setText] = useState("Greetings! I'm Mongi, your green advisor. How can I help today?");
    const [inputText, setInputText] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = (e: React.FormEvent) => {
        e.preventDefault();
        const speechText = inputText.trim() || text;
        if (!speechText) return;

        setText(speechText);
        setInputText("");
        setIsSpeaking(true);

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(speechText);
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
            setTimeout(() => setIsSpeaking(false), 3000);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#fafafa] text-gray-900 flex flex-col overflow-hidden relative">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
                <Link href="/dashboard" className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white shadow-xl border border-gray-100 font-bold hover:scale-105 transition-transform text-sm">
                    <span>←</span> Dashboard
                </Link>
                <div className="pointer-events-auto bg-green-600 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-green-100 font-black text-[10px] tracking-widest uppercase">
                    Mongi Advisor
                </div>
            </header>

            {/* 3D Scene - Strict h-full container for centering */}
            <div className="flex-1 w-full h-full relative">
                <Canvas
                    shadows
                    camera={{ position: [0, 0, 7], fov: 35 }}
                    gl={{
                        antialias: true,
                        outputColorSpace: THREE.SRGBColorSpace,
                        toneMapping: THREE.NoToneMapping
                    }}
                >
                    <color attach="background" args={['#fafafa']} />

                    {/* Neutral Lighting for Raw Model Colors */}
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
                    <Environment preset="city" />

                    <Suspense fallback={<Html center><div className="text-green-600 font-bold">Summoning Mongi...</div></Html>}>
                        <MongiCharacter isSpeaking={isSpeaking} />

                        <ContactShadows
                            position={[0, -2, 0]}
                            opacity={0.3}
                            scale={10}
                            blur={2.5}
                            far={10}
                        />

                        {/* Speech Bubble - Adjusted for 0.2 scale */}
                        <Html position={[0.4, 0.2, 0]} className="pointer-events-none" zIndexRange={[100, 0]}>
                            <div className={`
                    w-72 bg-white/95 backdrop-blur-2xl p-6 rounded-[2rem] rounded-bl-none border border-green-200 shadow-2xl
                    transition-all duration-500 ease-in-out transform
                    ${isSpeaking ? 'scale-105 border-green-500' : 'scale-100'}
                `}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Advice</span>
                                    {isSpeaking && (
                                        <div className="flex gap-1 items-end h-3">
                                            <div className="w-1 h-full bg-green-500 animate-[sound_0.5s_infinite]" />
                                            <div className="w-1 h-1/2 bg-green-500 animate-[sound_0.7s_infinite]" />
                                            <div className="w-1 h-3/4 bg-green-500 animate-[sound_0.4s_infinite]" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-800 text-sm font-bold">
                                    {isSpeaking ? <span className="animate-pulse">{text}</span> : text}
                                </p>
                            </div>
                        </Html>
                    </Suspense>

                    <OrbitControls
                        enableZoom={false}
                        maxPolarAngle={Math.PI / 2}
                        minPolarAngle={Math.PI / 2.5}
                    />
                </Canvas>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6">
                <form onSubmit={handleSpeak} className="relative group">
                    <div className="relative flex gap-2 p-2 bg-white border-2 border-gray-100 rounded-[2rem] shadow-2xl focus-within:border-green-400 transition-colors">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask Mongi something..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 px-5 py-4 font-bold text-lg"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-[1.5rem] font-bold transition-transform active:scale-95"
                        >
                            TALK
                        </button>
                    </div>
                </form>
            </div>

            <style jsx global>{`
        @keyframes sound {
            0%, 100% { height: 4px; }
            50% { height: 12px; }
        }
      `}</style>
        </div>
    );
}
