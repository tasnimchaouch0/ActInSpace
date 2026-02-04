'use client';

import { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Html } from '@react-three/drei';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { Send, Mic, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Dynamic import to avoid SSR issues with Three.js
const MongiModel = dynamic(() => import('@/components/3d/MongiCharacter').then(mod => mod.MongiModel), { ssr: false });
const FarmBackground = dynamic(() => import('@/components/3d/MongiCharacter').then(mod => mod.FarmBackground), { ssr: false });

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function MongiPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Greetings! I'm Mongi, your AI agricultural advisor. How can I help with your olive groves today?",
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentMessage = messages[messages.length - 1];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const simulateSpeaking = async (text: string) => {
        setIsSpeaking(true);

        // Use browser TTS if available (strip markdown for TTS)
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/[#*`_~\[\]]/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
            // Fallback duration based on text length
            const cleanText = text.replace(/[#*`_~\[\]]/g, '');
            const duration = Math.min(cleanText.length * 50, 6000);
            await new Promise(resolve => setTimeout(resolve, duration));
            setIsSpeaking(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: inputText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        setIsLoading(true);

        try {
            // Call the chatbot backend
            const response = await fetch('http://localhost:8001/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: inputText,
                    image: null
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.reply,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Trigger speaking animation and TTS
            await simulateSpeaking(data.reply);

        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: "I'm having trouble connecting to my knowledge base. Please make sure the chatbot service is running on port 8001, or I can still help with general agricultural advice!",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            await simulateSpeaking(errorMessage.content);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-cyan-50/30 text-gray-900 flex flex-col overflow-hidden relative">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
                <Link href="/dashboard" className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl border border-slate-200 font-bold hover:scale-105 transition-transform text-sm">
                    <span>←</span> Dashboard
                </Link>
                <div className="pointer-events-auto bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-emerald-200 font-black text-[10px] tracking-widest uppercase flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Mongi AI
                </div>
            </header>

            {/* 3D Scene */}
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
                    {/* Farm Scenery */}
                    <FarmBackground />
                    <Environment preset="city" />

                    <Suspense fallback={<Html center><div className="text-emerald-600 font-bold">Summoning Mongi...</div></Html>}>
                        <MongiModel isSpeaking={isSpeaking} />

                        <ContactShadows
                            position={[0, -2, 0]}
                            opacity={0.3}
                            scale={10}
                            blur={2.5}
                            far={10}
                        />

                        {/* Speech Bubble */}
                        <Html position={[0.4, 0.2, 0]} className="pointer-events-none" zIndexRange={[100, 0]}>
                            <div className={`
                                w-80 max-h-[400px] overflow-y-auto bg-white/95 backdrop-blur-2xl p-6 rounded-[2rem] rounded-bl-none border shadow-2xl
                                transition-all duration-500 ease-in-out transform
                                ${isSpeaking ? 'scale-105 border-emerald-500 shadow-emerald-200' : 'scale-100 border-slate-200'}
                            `}>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                                        {currentMessage.role === 'assistant' ? 'Mongi Says' : 'You Asked'}
                                    </span>
                                    {isSpeaking && (
                                        <div className="flex gap-1 items-end h-3">
                                            <div className="w-1 h-full bg-emerald-500 animate-[sound_0.5s_infinite]" />
                                            <div className="w-1 h-1/2 bg-emerald-500 animate-[sound_0.7s_infinite]" />
                                            <div className="w-1 h-3/4 bg-emerald-500 animate-[sound_0.4s_infinite]" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-gray-800 text-sm leading-relaxed font-medium prose prose-sm prose-slate max-w-none">
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-pulse">Thinking...</span>
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </span>
                                    ) : (
                                        <div className={isSpeaking ? 'animate-pulse' : ''}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {currentMessage.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
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

            {/* Chat Input */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-40">
                <form onSubmit={handleSendMessage} className="relative group">
                    <div className="relative flex gap-2 p-2 bg-white/90 backdrop-blur-xl border-2 border-slate-200 rounded-[2rem] shadow-2xl focus-within:border-emerald-400 transition-colors">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask Mongi about your crops..."
                            disabled={isLoading}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-slate-400 px-6 py-4 font-medium text-base disabled:opacity-50"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() || isLoading}
                            className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-[1.5rem] font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-200"
                        >
                            <Send className="w-5 h-5" />
                            ASK
                        </button>
                    </div>
                </form>

                {/* Chat History Indicator */}
                {messages.length > 2 && (
                    <div className="mt-4 text-center">
                        <p className="text-xs text-slate-500 font-mono">
                            {messages.length - 1} messages • Scroll up in speech bubble to see history
                        </p>
                    </div>
                )}
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
