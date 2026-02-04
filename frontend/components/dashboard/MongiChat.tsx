"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Camera, X, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface MongiChatProps {
    onSpeakingChange: (isSpeaking: boolean) => void;
    isInline?: boolean;
}

export default function MongiChat({ onSpeakingChange, isInline = false }: MongiChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! I'm Mongi, your AI agricultural assistant. How can I help you with your olive groves today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const simulateSpeaking = async (text: string) => {
        onSpeakingChange(true);
        // Simulate speaking duration based on text length (ignoring markdown tags for duration calc)
        const cleanText = text.replace(/[#*`_~\[\]]/g, '');
        const duration = Math.min(cleanText.length * 50, 5000); // Max 5 seconds
        await new Promise(resolve => setTimeout(resolve, duration));
        onSpeakingChange(false);
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Call the chatbot backend
            const response = await fetch('http://localhost:8001/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: input,
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

            // Trigger speaking animation
            await simulateSpeaking(data.reply);

        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: "I'm having trouble connecting to my knowledge base. Please make sure the chatbot service is running on port 8001.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (isMinimized && !isInline) {
        return (
            <button
                onClick={() => setIsMinimized(false)}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-lg shadow-emerald-200 flex items-center justify-center hover:scale-110 transition-transform"
            >
                <span className="text-3xl">🌿</span>
            </button>
        );
    }

    return (
        <div className={`
            ${isInline
                ? 'w-full h-full bg-white/50'
                : 'fixed bottom-8 right-8 z-50 w-96 h-[600px] bg-white/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]'} 
            border border-slate-200 rounded-[2.5rem] flex flex-col overflow-hidden transition-all duration-500
        `}>
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-2xl">🌿</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-black uppercase tracking-tight">Mongi AI</h3>
                        <p className="text-[10px] text-slate-500 font-mono tracking-wide">Agricultural Assistant</p>
                    </div>
                </div>
                {!isInline && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <Minimize2 className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>
                )}
            </div>

            {/* Messages */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-black border border-slate-200'
                                }`}
                        >
                            <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-slate">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                            <p className={`text-[10px] mt-1 ${message.role === 'user' ? 'text-emerald-100' : 'text-slate-400'
                                }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-xs text-slate-500 font-mono">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about your crops..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 rounded-xl transition-colors"
                    >
                        <Send className="w-5 h-5 text-white" />
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center font-mono">
                    Powered by AI • Press Enter to send
                </p>
            </div>
        </div>
    );
}
