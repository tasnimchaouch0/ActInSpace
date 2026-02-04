// @ts-nocheck
'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import {
    Droplets, Satellite, Brain, TrendingUp,
    ArrowRight, AlertTriangle, ShieldCheck, Zap, Globe,
    Target, Sparkles, ChevronDown,
    CloudLightning, Activity, Bug, ListChecks, CheckCircle, MessageSquare
} from 'lucide-react';
import dynamic from 'next/dynamic';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Html, Center } from '@react-three/drei';
import { Suspense } from 'react';

// Dynamic import for the Map component to reuse its visual impact
const OliveMap = dynamic(() => import('@/components/dashboard/OliveMap'), { ssr: false });
const MongiCharacter = dynamic(() => import('@/components/3d/MongiCharacter'), { ssr: false });
const MongiChat = dynamic(() => import('@/components/dashboard/MongiChat'), { ssr: false });

const sections = [
    { id: 'hook', label: 'The Hook' },
    { id: 'problem', label: 'The Problem' },
    { id: 'persona', label: 'Farmer Story' },
    { id: 'innovation', label: 'Innovation' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'The Machine' },
    { id: 'solution', label: 'Solution' },
    { id: 'impact', label: 'Impact' },
    { id: 'canvas', label: 'The Canvas' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'state', label: 'State' },
    { id: 'team', label: 'Team' },
    { id: 'vision', label: 'Vision' },
];

export default function BusinessModelPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState('hook');
    const [isMongiSpeaking, setIsMongiSpeaking] = useState(false);

    // Scroll progress for global indicator
    const { scrollYProgress } = useScroll({
        container: containerRef,
    });
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Update active section on scroll
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollPosition = container.scrollTop;
            const windowHeight = window.innerHeight;
            const index = Math.round(scrollPosition / windowHeight);
            if (sections[index]) {
                setActiveSection(sections[index].id);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950 text-white font-sans overflow-hidden">
            {/* Global Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 origin-left z-50"
                style={{ scaleX }}
            />

            {/* Navigation Dots */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="group flex items-center gap-4 justify-end"
                    >
                        <span className={`text-[10px] uppercase font-bold tracking-widest transition-all duration-300 ${activeSection === section.id ? 'text-emerald-400 opacity-100 translate-x-0' : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
                            }`}>
                            {section.label}
                        </span>
                        <div className={`w-3 h-3 rounded-full border border-emerald-500 transition-all duration-500 ${activeSection === section.id ? 'bg-emerald-500 scale-125 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-transparent hover:bg-emerald-500/30'
                            }`} />
                    </button>
                ))}
            </div>

            {/* Main Scroll Container */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
            >

                {/* 1. THE HOOK */}
                <section id="hook" className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-bf791df7f524?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-30 animate-pulse-slow" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-emerald-950/50 to-slate-950" />

                    <div className="relative z-10 max-w-5xl px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-sm">
                                The Future of Agriculture
                            </span>
                            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-2xl">
                                40% of the World's Food <br />
                                <span className="text-white">Depends on Irrigation.</span>
                            </h1>
                            <p className="text-xl md:text-3xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
                                But <span className="text-emerald-400 font-bold">70%</span> of that water is wasted. <br />
                                We are running out of time. And water.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce"
                        >
                            <ChevronDown className="w-8 h-8 text-emerald-500/50" />
                        </motion.div>
                    </div>
                </section>


                {/* 2. THE PROBLEM */}
                <section id="problem" className="h-screen w-full snap-start relative flex items-center bg-slate-950 overflow-hidden">
                    {/* Abstract Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                    <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <AlertTriangle className="w-8 h-8 text-rose-500" />
                                <span className="text-rose-500 font-bold uppercase tracking-widest text-sm">The Challenge</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                                Farmers are Flying <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Blind.</span>
                            </h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                Traditional farming relies on guesswork, outdated weather reports, and intuition.
                                In a changing climate, this leads to:
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "Catastrophic Water Waste", icon: Droplets, desc: "Over-irrigation depletes aquifers and costs millions." },
                                    { title: "Unpredictable Yields", icon: TrendingUp, desc: "Diseases and pests destroy crops before they are detected." },
                                    { title: "Environmental Collapse", icon: Globe, desc: "Soil degradation ensures future generations will starve." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-rose-500/30 transition-colors">
                                        <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400 h-fit">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                            <p className="text-sm text-slate-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="relative h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-rose-900/10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-950/20 to-slate-950 z-0" />
                            {/* Visual representation of dry cracked earth vs lush green via CSS masking or text overlay */}
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549491187-57303c932147?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-125 opacity-40 mix-blend-overlay" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
                                <span className="text-[120px] font-black text-rose-500/20 leading-none">CRISIS</span>
                            </div>
                        </motion.div>
                    </div>
                </section>



                {/* 2.5 THE PERSONA (AHMED'S STORY) */}
                <section id="persona" className="h-screen w-full snap-start relative flex items-center bg-[#0a0f18] overflow-hidden border-y border-emerald-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-slate-900/50 to-rose-950/10" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8 }}
                                className="relative text-left z-20"
                            >
                                <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
                                <div className="relative z-10 space-y-6">
                                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-sm">A Human Perspective</span>
                                    <h2 className="text-5xl md:text-6xl font-black leading-tight">
                                        Meet Ahmed. <br />
                                        <span className="text-slate-400">A Farmer on the Edge.</span>
                                    </h2>
                                    <p className="text-xl text-slate-300 leading-relaxed">
                                        Ahmed manages a 10-hectare olive grove in Sfax. For 20 years, he's followed his father's lead. But today, the old ways are leading him into a trap.
                                    </p>

                                    <div className="space-y-6 pt-4">
                                        {[
                                            { problem: "The Invisible Plague", desc: "A fungal infection wiped out 25% of his harvest last year. He didn't see the signs until it was too late to save the trees." },
                                            { problem: "The Water Debt", desc: "He pumps water blindly based on tradition. His bills are skyrocketing while his local well is running dry." },
                                            { problem: "The Quality Gap", desc: "Without precision data, his yield quality fluctuates. He's losing out on premium export contracts every single year." }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 items-start group text-left">
                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#ef4444] group-hover:scale-150 transition-transform" />
                                                <div>
                                                    <h4 className="text-white font-bold">{item.problem}</h4>
                                                    <p className="text-slate-400 text-sm leading-snug">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="relative h-[500px] w-full z-20"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-60" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                                            <p className="text-lg italic text-slate-200">
                                                "I love my land, but the uncertainty is exhausting. I'm fighting a losing battle against the heat and the bills. I need eyes that can see what I can't."
                                            </p>
                                            <div className="mt-4 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">A</div>
                                                <div className="text-left">
                                                    <div className="text-sm font-bold text-white">Ahmed B.</div>
                                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">3rd Generation Olive Farmer • Sfax, Tunisia</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>


                {/* 3. THE INNOVATION */}
                <section id="innovation" className="h-screen w-full snap-start relative flex items-center bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-950/20" />

                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            className="text-center max-w-4xl mx-auto mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <Sparkles className="w-6 h-6 text-emerald-400" />
                                <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">The New Idea</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black mb-6">
                                Precision from <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Outer Space.</span>
                            </h2>
                            <p className="text-xl text-slate-300">
                                We don't just guess. We see everything. <br />
                                Combining <span className="text-white font-bold">Satellite Imagery</span> with <span className="text-white font-bold">Generative AI</span>.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Satellite Vision", icon: Satellite, desc: "Real-time spectral analysis of every single tree.", color: "from-cyan-500 to-blue-600" },
                                { title: "AI Cognition", icon: Brain, desc: "Deep learning predicts needs before they happen.", color: "from-purple-500 to-pink-600" },
                                { title: "Farmer Action", icon: Zap, desc: "Instant, actionable alerts via WhatsApp & Dashboard.", color: "from-emerald-500 to-lime-600" },
                            ].map((card, i) => (
                                <motion.div
                                    key={i}
                                    className="relative group p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-white/20 transition-all duration-300 hover:-translate-y-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2, duration: 0.5 }}
                                >
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${card.color} rounded-3xl transition-opacity duration-500 blur-xl`} />
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 shadow-lg`}>
                                        <card.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{card.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>



                {/* 3.5 FEATURES DEEP DIVE */}
                <section id="features" className="h-screen w-full snap-start relative flex items-center bg-slate-950 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-6xl font-black mb-6">
                                Everything You Need to <br />
                                <span className="text-emerald-500">Master Your Yield.</span>
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                A complete operating system for modern agriculture.
                                From satellite to soil, we have you covered.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Hyper-Local Weather", icon: CloudLightning, desc: "Micro-climate forecasts precise to your specific field coordinates." },
                                { title: "Irrigation Scheduler", icon: Droplets, desc: "AI-generated watering plans that save up to 30% water usage." },
                                { title: "Health Indexing", icon: Activity, desc: "NDVI & EVI analysis to spot vegetation stress instantly." },
                                { title: "Pest Prediction", icon: Bug, desc: "Early warning systems based on humidity and temperature models." },
                                { title: "Yield Forecasting", icon: TrendingUp, desc: "Predict harvest volume weeks in advance with 90% accuracy." },
                                { title: "Task Management", icon: ListChecks, desc: "Assign scout missions and track farm labor efficiency." },
                                { title: "Export Quality", icon: CheckCircle, desc: "Ensure your produce meets EU & International standards." },
                                { title: "Mongi Assistant", icon: MessageSquare, desc: "24/7 AI Agronomist ready to answer any question." },
                                { title: "Character Sync", icon: MessageSquare, desc: "Real-time speaking synchronization between Chatbot and 3D model." },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all group"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 text-slate-200">{feature.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. THE MACHINE (HOW IT WORKS) */}
                <section id="how-it-works" className="h-screen w-full snap-start relative flex flex-col justify-center bg-black overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                        {/* Reusing the OliveMap for visual impact, rendered nicely */}
                        <div className="w-full h-full scale-105 blur-sm opacity-50 grayscale hover:grayscale-0 transition-all duration-1000">
                            <OliveMap />
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

                    <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-6xl font-black mb-8">
                                The <span className="text-emerald-500">Engine</span>
                            </h2>
                            <div className="space-y-0 relative pl-8 border-l-2 border-slate-800">
                                {[
                                    { step: "01", title: "Data Ingest", text: "Sentinel-2 & Landsat satellites scan the field every 5 days." },
                                    { step: "02", title: "Spectral Analysis", text: "NDVI, NDWI, and EVI indices are calculated instantly." },
                                    { step: "03", title: "AI Processing", text: "Mongi AI interprets the data: 'Tree #45 is thirsty'." },
                                    { step: "04", title: "Delivery", text: "Farmer gets a notification: 'Water Sector B now'." },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="relative mb-12 last:mb-0 group"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.15 }}
                                    >
                                        <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-slate-900 border-2 border-emerald-500 group-hover:bg-emerald-500 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                        <div className="text-xs font-mono text-emerald-500 mb-1">STEP {item.step}</div>
                                        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-slate-400">{item.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="h-full flex items-center justify-center">
                            {/* 3D Model Integration */}
                            <div className="relative w-full h-[600px] max-w-lg">
                                <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse blur-3xl" />
                                <div className="absolute -inset-4 border border-emerald-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                                <div className="absolute -inset-12 border border-cyan-500/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

                                <div className="absolute inset-0 z-10 w-full h-full">
                                    <MongiCharacter isSpeaking={isMongiSpeaking} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* 5. THE SOLUTION (ACTION) */}
                <section id="solution" className="h-screen w-full snap-start relative flex items-center bg-slate-950 overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-5xl md:text-7xl font-bold mb-12">
                                Stop Guessing. <span className="text-emerald-500">Start Knowing.</span>
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            <motion.div
                                className="p-10 rounded-3xl bg-slate-900/50 border border-white/5 grayscale opacity-50 relative overflow-hidden"
                                whileHover={{ filter: 'grayscale(0%)', opacity: 1 }}
                            >
                                <div className="absolute top-4 right-4 text-xs font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full">THE OLD WAY</div>
                                <h3 className="text-3xl font-bold mb-4 text-slate-300">Reactive</h3>
                                <ul className="text-left space-y-4 text-slate-400">
                                    <li className="flex gap-2">❌ "Is the soil dry?" (Guesswork)</li>
                                    <li className="flex gap-2">❌ "I think it might rain." (Hope)</li>
                                    <li className="flex gap-2">❌ "The leaves look yellow." (Too Late)</li>
                                </ul>
                            </motion.div>

                            <motion.div
                                className="p-10 rounded-3xl bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-500/30 relative overflow-hidden shadow-2xl shadow-emerald-900/20"
                                initial={{ y: 20 }}
                                whileInView={{ y: 0 }}
                            >
                                <div className="absolute top-4 right-4 text-xs font-bold bg-emerald-500 text-white px-3 py-1 rounded-full shadow-lg shadow-emerald-500/30">MONGI WAY</div>
                                <h3 className="text-3xl font-bold mb-4 text-white">Proactive</h3>
                                <ul className="text-left space-y-4 text-emerald-100">
                                    <li className="flex gap-2"><ShieldCheck className="w-5 h-5 text-emerald-400" /> "Moisture is at 12%. Irrigate now."</li>
                                    <li className="flex gap-2"><Target className="w-5 h-5 text-emerald-400" /> "Yield forecast: +15% vs last year."</li>
                                    <li className="flex gap-2"><Zap className="w-5 h-5 text-emerald-400" /> "Disease risk detected in Sector 4."</li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>


                {/* 6. THE IMPACT (RESULT) */}
                <section id="impact" className="h-screen w-full snap-start relative flex items-center bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-slate-950" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
                                    Results That <br />
                                    <span className="text-emerald-400">Change Lives.</span>
                                </h2>
                                <p className="text-xl text-slate-300 mb-8">
                                    When farmers use MONGI.AI, the impact is immediate and measurable. We don't just save water; we save businesses.
                                </p>
                                <Link href="/dashboard" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 group">
                                    Explore the Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { value: "-30%", label: "Water Usage", sub: "Optimized Irrigation", color: "text-blue-400" },
                                    { value: "+20%", label: "Crop Yield", sub: "Healthier Trees", color: "text-emerald-400" },
                                    { value: "-25%", label: "Input Costs", sub: "Less Fertilizer Waste", color: "text-orange-400" },
                                    { value: "100%", label: "Peace of Mind", sub: "Data-Driven Decisions", color: "text-purple-400" },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-center hover:bg-white/10 transition-colors"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: i * 0.1, type: "spring" }}
                                    >
                                        <div className={`text-5xl font-black mb-2 ${stat.color}`}>{stat.value}</div>
                                        <div className="text-lg font-bold text-white">{stat.label}</div>
                                        <div className="text-sm text-slate-400 mt-1">{stat.sub}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>



                {/* 6.25 BUSINESS MODEL CANVAS (STORY BRIDGE) */}
                <section id="canvas" className="min-h-screen w-full snap-start relative flex flex-col items-center justify-center bg-[#020617] overflow-hidden py-12">
                    {/* Space background elements */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] animate-pulse" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 uppercase italic">Our Business Model <span className="text-emerald-500">Canvas</span></h2>
                            <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.3em]">Mongi.ai • ActInSpace 2026</p>
                        </motion.div>

                        {/* The Canvas Grid */}
                        <div className="grid grid-cols-10 grid-rows-3 gap-3 w-full max-w-7xl mx-auto h-auto lg:h-[650px]">
                            {/* Key Partners */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                                className="col-span-2 row-span-2 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col group hover:border-emerald-500/50 transition-all"
                            >
                                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Key Partners</h3>
                                <ul className="space-y-3 text-xs text-slate-300">
                                    <li className="flex gap-2">🔹 ESA/Copernicus</li>
                                    <li className="flex gap-2">🔹 INSAT Laboratories</li>
                                    <li className="flex gap-2">🔹 Agri-Cooperatives</li>
                                    <li className="flex gap-2">🔹 IoT Providers</li>
                                </ul>
                                <Satellite className="absolute bottom-4 right-4 w-12 h-12 text-white/5 group-hover:text-emerald-500/10 transition-colors" />
                            </motion.div>

                            {/* Key Activities */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                                className="col-span-2 row-span-1 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col hover:border-blue-500/50 transition-all"
                            >
                                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Key Activities</h3>
                                <ul className="space-y-2 text-[10px] text-slate-300">
                                    <li>• Satellite Data Processing</li>
                                    <li>• AI Engine Refinement</li>
                                    <li>• Farmer Education & Support</li>
                                </ul>
                            </motion.div>

                            {/* Value Propositions */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                                className="col-span-2 row-span-2 p-4 rounded-2xl bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 flex flex-col shadow-2xl shadow-emerald-900/10"
                            >
                                <h3 className="text-xs font-black text-emerald-300 uppercase tracking-widest mb-4 border-b border-emerald-500/10 pb-2">Value Propositions</h3>
                                <div className="space-y-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        <div className="font-bold text-emerald-400 text-xs mb-1">Precision Efficiency</div>
                                        <p className="text-[10px] text-slate-400 leading-tight">-30% Water Waste via Satellite Control</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        <div className="font-bold text-blue-400 text-xs mb-1">Risk Immunity</div>
                                        <p className="text-[10px] text-slate-400 leading-tight">Disease & Yield Prediction powered by AI</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        <div className="font-bold text-emerald-400 text-xs mb-1">Global Access</div>
                                        <p className="text-[10px] text-slate-400 leading-tight">Export Compliance Certificates</p>
                                    </div>
                                </div>
                                <Zap className="absolute bottom-4 right-4 w-12 h-12 text-emerald-500/10 animate-pulse" />
                            </motion.div>

                            {/* Customer Relationships */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                                className="col-span-2 row-span-1 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col hover:border-emerald-500/50 transition-all"
                            >
                                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Customer Relationships</h3>
                                <ul className="space-y-2 text-[10px] text-slate-300">
                                    <li>• Personal AI Advisor (Mongi)</li>
                                    <li>• Automated Yield Alerts</li>
                                    <li>• Farmer Community Hub</li>
                                </ul>
                            </motion.div>

                            {/* Customer Segments */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                                className="col-span-2 row-span-2 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col group hover:border-blue-500/50 transition-all"
                            >
                                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Customer Segments</h3>
                                <ul className="space-y-3 text-xs text-slate-300">
                                    <li className="flex gap-2">👨‍🌾 Individual Olive Farmers</li>
                                    <li className="flex gap-2">🏢 Industrial Ag Enterprises</li>
                                    <li className="flex gap-2">🛡️ National Ministries (Gov)</li>
                                    <li className="flex gap-2">🌍 Intl. Food Security Orgs</li>
                                </ul>
                                <Globe className="absolute bottom-4 right-4 w-12 h-12 text-white/5 group-hover:text-blue-500/10 transition-colors" />
                            </motion.div>

                            {/* Key Resources (Row 2 partial) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                                className="col-span-2 row-span-1 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col hover:border-emerald-500/50 transition-all"
                            >
                                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Key Resources</h3>
                                <ul className="space-y-2 text-[10px] text-slate-300">
                                    <li>• Sentinel-2 Spectral Data</li>
                                    <li>• Mongi's RAG Architecture</li>
                                    <li>• Core Engineering Labs</li>
                                </ul>
                            </motion.div>

                            {/* Channels (Row 2 partial) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                                className="col-span-2 row-span-1 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col hover:border-emerald-500/50 transition-all"
                            >
                                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Channels</h3>
                                <ul className="space-y-2 text-[10px] text-slate-300">
                                    <li>• Mongi.ai Mobile Dashboard</li>
                                    <li>• SMS/WhatsApp Smart Alerts</li>
                                    <li>• Regional Agri-Delegations</li>
                                </ul>
                            </motion.div>

                            {/* Cost Structure */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                                className="col-span-5 row-span-1 p-6 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-2xl hover:border-rose-500/30 transition-all"
                            >
                                <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-4 border-b border-rose-500/10 pb-2">Cost Structure</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-2 rounded-lg bg-white/5">
                                        <div className="text-white font-bold text-xs">Sat-Data API</div>
                                        <div className="text-[10px] text-slate-500">Cloud & Telemetry</div>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-white/5">
                                        <div className="text-white font-bold text-xs">AI Research</div>
                                        <div className="text-[10px] text-slate-500">Engineers & R&D</div>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-white/5">
                                        <div className="text-white font-bold text-xs">Infrastructure</div>
                                        <div className="text-[10px] text-slate-500">GPU & Hosting</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Revenue Streams */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                                className="col-span-5 row-span-1 p-6 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-2xl hover:border-emerald-500/30 transition-all shadow-[0_0_30px_rgba(16,185,129,0.05)]"
                            >
                                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mb-4 border-b border-emerald-500/10 pb-2">Revenue Streams</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <div className="text-white font-bold text-xs">SaaS Subscriptions</div>
                                        <div className="text-[10px] text-emerald-500/70">Farmers & Estates</div>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <div className="text-white font-bold text-xs">Certifications</div>
                                        <div className="text-[10px] text-emerald-500/70">Export Approval Fees</div>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <div className="text-white font-bold text-xs">Gov Licenses</div>
                                        <div className="text-[10px] text-emerald-500/70">Sovereign Data Access</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Decorative Saturn/Asteroids icons using Lucide or similar if available */}
                    <div className="absolute top-10 right-10 opacity-20 transform rotate-12">
                        <Satellite className="w-32 h-32 text-white" />
                    </div>
                </section>


                {/* 6.5 PRICING & TRUST */}
                <section id="pricing" className="min-h-screen w-full snap-start relative flex flex-col items-center justify-center bg-slate-900 overflow-hidden py-24">
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#80808012_1px,transparent_1px),linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm mb-4 block">Flexible Plans</span>
                            <h2 className="text-5xl font-black mb-6">Choose Your <span className="text-white">Growth Engine.</span></h2>
                            <p className="text-slate-400">Scale your farm with intelligence. Cancel anytime.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* STARTER */}
                            <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm flex flex-col">
                                <h3 className="text-xl font-bold mb-2">Seedling</h3>
                                <div className="text-4xl font-black mb-6">Free<span className="text-lg font-medium text-slate-500">/forever</span></div>
                                <p className="text-slate-400 text-sm mb-8">Essential tools for small family farms.</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['Weekly Satellite Scans', 'Basic Weather Alerts', '5 Hectare Limit', 'Community Support'].map(f => (
                                        <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-slate-500" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-bold uppercase tracking-wider text-sm">Start Free</button>
                            </div>

                            {/* PRO */}
                            <div className="p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-900/10 to-transparent backdrop-blur-sm flex flex-col relative transform scale-105 shadow-2xl shadow-emerald-900/20">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-black font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
                                <h3 className="text-xl font-bold mb-2 text-emerald-400">Grove Pro</h3>
                                <div className="text-4xl font-black mb-6">$29<span className="text-lg font-medium text-slate-500">/mo</span></div>
                                <p className="text-slate-400 text-sm mb-8">Full autonomy for professional growers.</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['Daily Satellite Uplink', 'Real-time AI Agronomist', 'Unlimited Acreage', 'Disease Prediction Model', 'Yield Forecasting', 'Priority 24/7 Support'].map(f => (
                                        <li key={f} className="flex items-center gap-3 text-sm text-white font-medium">
                                            <CheckCircle className="w-4 h-4 text-emerald-500" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/payment" className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black transition-colors font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                                    <Zap className="w-4 h-4" /> Activate Pro
                                </Link>
                            </div>

                            {/* ENTERPRISE */}
                            <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm flex flex-col">
                                <h3 className="text-xl font-bold mb-2">Estate</h3>
                                <div className="text-4xl font-black mb-6">Custom</div>
                                <p className="text-slate-400 text-sm mb-8">For agricultural corporations & govs.</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['API Access', 'White-label Dashboard', 'Dedicated Agronomist', 'Multi-User Teams', 'Custom Integrations', 'SLA Guarantee'].map(f => (
                                        <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-slate-500" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-bold uppercase tracking-wider text-sm">Contact Sales</button>
                            </div>
                        </div>

                        {/* TRUST SECTION */}
                        <div className="mt-24 pt-12 border-t border-white/5 max-w-5xl mx-auto text-center w-full">
                            <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-8">Trusted by 500+ Innovative Farms</p>
                            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale">
                                {/* Pseudologos */}
                                <div className="text-xl font-black font-serif">AGRO<span className="text-emerald-500">CORP</span></div>
                                <div className="text-xl font-bold tracking-tight">Sfax<span className="font-light">Olives</span></div>
                                <div className="text-xl font-black italic">TERRA<span className="text-emerald-500">FIRMA</span></div>
                                <div className="text-xl font-bold font-mono">GREEN<span className="text-emerald-500">SIGNAL</span></div>
                            </div>
                        </div>
                    </div>
                </section>



                {/* 6.7 STATE IMPACT (GOV) */}
                <section id="state" className="min-h-screen w-full snap-start relative flex items-center bg-black overflow-hidden">
                    {/* Futuristic Globe/Grid Background */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/80 to-transparent" />

                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm mb-6">
                                <Globe className="w-4 h-4" /> Sovereign Intelligence
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black mb-6">
                                A Guardian for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">Nation.</span>
                            </h2>
                            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                                Beyond the farm, Mongi empowers the State with orbital oversight.
                                Monitor natural resources, detect illegal activities, and secure the future.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            {/* Visual Side */}
                            <motion.div
                                className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.2)] bg-slate-900/50 backdrop-blur-sm group"
                                initial={{ x: -50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:40px_40px]" />
                                {/* Radar scanning effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent w-1/2 h-full skew-x-12 animate-[shimmer_3s_infinite]" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="w-64 h-64 rounded-full border-2 border-blue-500/30 flex items-center justify-center relative animate-[spin_10s_linear_infinite]">
                                        <div className="absolute w-2 h-2 bg-blue-500 rounded-full top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#3b82f6]" />
                                    </div>
                                    <div className="absolute w-48 h-48 rounded-full border border-purple-500/30 flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]" />
                                    <div className="mt-8 font-mono text-blue-400 text-sm tracking-widest text-center">
                                        SENTINEL-1 SAR: ACTIVE<br />
                                        SENTINEL-2 MSI: ACTIVE
                                    </div>
                                </div>
                            </motion.div>

                            {/* Features Side */}
                            <div className="space-y-8">
                                <motion.div
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-colors group"
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-3 rounded-lg bg-red-500/20 text-red-500">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Deforestation Tracker</h3>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        Detect illegal logging in real-time using <span className="text-white font-bold">Sentinel-2</span> change detection algorithms.
                                        Preserve national forests with automated alerts sent directly to authorities.
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group"
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-3 rounded-lg bg-blue-500/20 text-blue-500">
                                            <CloudLightning className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Disaster Response</h3>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        See through clouds and storms with <span className="text-white font-bold">Sentinel-1 Radar (SAR)</span>.
                                        Map flood extent and drought severity instantly to coordinate emergency relief.
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors group"
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-500">
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Strategic Autonomy</h3>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        Monitor national crop production to predict food security risks.
                                        Data sovereignty ensures that the state's agricultural intelligence remains in state hands.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="team" className="min-h-screen w-full snap-start relative flex flex-col items-center justify-center bg-slate-950 overflow-hidden py-24">
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#80808012_1px,transparent_1px),linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:20px_20px] opacity-10" />

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-16"
                        >
                            <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm mb-4 block">The Minds Behind Mongi</span>
                            <h2 className="text-5xl font-black mb-6">Meet the <span className="text-white">Innovators.</span></h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Engineering the future of agriculture from INSAT & beyond.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    name: "Tasnim Chaouch",
                                    role: "Software Engineer",
                                    desc: "3rd Year Student @ INSAT. Software Engineer and AI Enthusiast.",
                                    links: [
                                        { label: "Portfolio", url: "https://tasnimchaouch0.github.io/PersonalPortfolio/" },
                                        { label: "GitHub", url: "https://github.com/tasnimchaouch0" }
                                    ]
                                },
                                {
                                    name: "Amal Bahri",
                                    role: "Software Engineer",
                                    desc: "3rd Year Student @ INSAT. Software Engineer and AI Enthusiast.",
                                    links: []
                                },
                                {
                                    name: "Med Mehdi Khlifa",
                                    role: "BI & Big Data Engineer",
                                    desc: "3rd Year Student. Data scientist unlocking patterns in satellite imagery.",
                                    links: []
                                }
                            ].map((member, i) => (
                                <motion.div
                                    key={i}
                                    className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm flex flex-col items-center hover:bg-white/5 transition-colors group"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                >
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 mb-6 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                        {member.name.charAt(0)}
                                    </div>
                                    <h3 className="text-xl font-bold mb-1 text-white">{member.name}</h3>
                                    <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">{member.role}</div>
                                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">{member.desc}</p>

                                    <div className="flex gap-3 mt-auto">
                                        {member.links.map((link, j) => (
                                            <a key={j} href={link.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors">
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. VISION (CONCLUSION) */}
                <section id="vision" className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden bg-slate-950">
                    <div className="text-center relative z-10 px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <h2 className="text-6xl md:text-9xl font-black mb-8 text-white tracking-tight">
                                MONGI.AI
                            </h2>
                            <p className="text-2xl md:text-3xl text-emerald-400 font-light mb-12 max-w-4xl mx-auto">
                                Democratizing Precision Agriculture for the World.
                            </p>

                            <div className="flex flex-col md:flex-row gap-6 justify-center">
                                <Link href="/business-plan" className="px-10 py-5 rounded-full bg-white text-slate-950 font-black text-lg hover:scale-105 transition-transform">
                                    View Full Plan
                                </Link>
                                <Link href="/dashboard" className="px-10 py-5 rounded-full bg-emerald-600 text-white font-black text-lg hover:bg-emerald-500 hover:scale-105 transition-transform shadow-xl shadow-emerald-500/20">
                                    Launch App
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Atmospheric particles or video bg */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-screen" />
                </section>

            </div>

            {/* Mongi Chatbot */}
            <MongiChat onSpeakingChange={setIsMongiSpeaking} />
        </div>
    );
}
