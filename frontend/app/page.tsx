'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
// Dynamically import EarthZoomAnimation to avoid SSR issues
const EarthZoomAnimation = dynamic(() => import('../components/dashboard/EarthZoomAnimation'), { ssr: false });
import Link from 'next/link';
import { Button } from './components/ui/button';

// Simple icon components
const LeafIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4-4-8-7-8-12a8 8 0 0116 0c0 5-4 8-8 12z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11m0 0c-2-2-4-3-6-3m6 3c2-2 4-3 6-3" />
  </svg>
);

const SatelliteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const DropletIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8 8 0 008-8c0-4-4-9-8-12-4 3-8 8-8 12a8 8 0 008 8z" />
  </svg>
);

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M9 17V9m4 8v-5m4 5v-8" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);

  const features = [
    {
      icon: SatelliteIcon,
      title: 'Satellite Monitoring',
      description: 'Daily satellite imagery from Sentinel-2 provides comprehensive coverage of your entire grove.',
      color: 'bg-[hsl(85,35%,35%)]/10 text-[hsl(85,35%,35%)]'
    },
    {
      icon: DropletIcon,
      title: 'Water Stress Detection',
      description: 'AI algorithms analyze NDVI and moisture indices to detect water stress before visible symptoms appear.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: SunIcon,
      title: 'Climate Risk Alerts',
      description: 'Get early warnings for frost, heat waves, and drought conditions that could impact your harvest.',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: ChartIcon,
      title: 'Yield Prediction',
      description: 'Machine learning models predict harvest yields with up to 92% accuracy based on historical data.',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: MapPinIcon,
      title: 'Zone Management',
      description: 'Divide your grove into management zones for targeted irrigation and treatment decisions.',
      color: 'bg-violet-100 text-violet-600'
    },
    {
      icon: ShieldIcon,
      title: 'Disease Prevention',
      description: 'Detect early signs of olive leaf spot, peacock spot, and other diseases through spectral analysis.',
      color: 'bg-rose-100 text-rose-600'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Define Your Grove',
      description: 'Draw your grove boundaries on our interactive map or upload your parcel data.'
    },
    {
      step: '02',
      title: 'AI Analysis',
      description: 'Our AI processes satellite imagery and generates health indices for your trees.'
    },
    {
      step: '03',
      title: 'Get Insights',
      description: 'Receive actionable recommendations and alerts directly to your dashboard or phone.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Hectares Monitored' },
    { value: '500+', label: 'Farmers Using' },
    { value: '92%', label: 'Prediction Accuracy' },
    { value: '24/7', label: 'Monitoring' }
  ];

  return (
    <>
      {showAnimation && (
        <EarthZoomAnimation onComplete={() => setShowAnimation(false)} targetLocation={{ name: 'Sfax', region: 'Tunisia' }} />
      )}
      <div className={`min-h-screen bg-background transition-opacity duration-700 ${showAnimation ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'}`}>
      {/* Announcement Banner */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-2 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-foreground/80">
            Now monitoring over 10,000 hectares of olive groves across Tunisia
          </span>
          <ChevronRightIcon className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <span className="text-xl">🌱</span>
              </div>
              <div>
                <span className="font-black text-xl text-foreground tracking-tighter leading-none block">
                  MONGI<span className="text-emerald-600">.AI</span>
                </span>
                <span className="text-[8px] text-muted-foreground font-mono tracking-[0.2em] uppercase block">Orbital Intelligence</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#pricing" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="font-bold">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 shadow-lg shadow-emerald-100">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Hero Content */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Satellite Link Active
                </div>
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-foreground leading-[0.85] tracking-tighter uppercase italic mb-8">
                  ORBITAL <br />
                  <span className="text-emerald-600">INTELLIGENCE</span> <br />
                  FOR OLIVES
                </h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl mb-12">
                  MONGI.AI uses deep-space satellite analytics to protect Tunisia's olive heritage. Predict yields, detect water stress, and optimize your harvest with sub-10m precision.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black px-10 py-8 rounded-2xl shadow-2xl shadow-emerald-200 gap-3 group">
                      Initialize Dashboard
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto font-black px-10 py-8 rounded-2xl border-slate-200 group">
                    View Demo Unit
                  </Button>
                </div>
              </div>

              {/* Hero Visual - High Tech Satellite */}
              <div className="relative lg:h-[600px] flex items-center justify-center">
                <div className="relative w-full max-w-lg aspect-square">
                  {/* Orbiting Elements */}
                  <div className="absolute inset-0 border border-emerald-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-12 border border-emerald-500/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                  {/* Data Stream Lines */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent rotate-45" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -rotate-45" />

                  {/* Central Hub */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex items-center justify-center group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <SatelliteIcon className="w-20 h-20 text-emerald-600 animate-pulse" />
                  </div>

                  {/* Floating Metric Tags */}
                  <div className="absolute top-10 right-10 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-100 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black text-black uppercase tracking-widest">NDVI: 0.84 Peak</span>
                    </div>
                  </div>
                  <div className="absolute bottom-20 left-0 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-100 shadow-xl animate-bounce" style={{ animationDuration: '4s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span className="text-[10px] font-black text-black uppercase tracking-widest">Soil Moisture +12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 bg-slate-50/50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="font-black text-4xl sm:text-5xl text-foreground tracking-tighter uppercase italic leading-none mb-6">
                ORBITAL <span className="text-emerald-600">CAPABILITIES</span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                Our proprietary AI stack processes multi-spectral satellite data to provide actionable intelligence for every tree in your grove.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white p-10 rounded-[2.5rem] border border-slate-200 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <feature.icon className="w-32 h-32" />
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-8 border border-current/10 shadow-sm group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Strategic Intelligence Modules
              </div>
              <h2 className="font-black text-4xl sm:text-5xl text-foreground tracking-tighter uppercase italic leading-none mb-6">
                EXPLORE <span className="text-emerald-600">USE CASES</span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                MONGI.AI serves farmers, cooperatives, and state agencies with specialized intelligence modules for every stakeholder.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Farm Monitor */}
              <Link href="/dashboard" className="group">
                <div className="bg-white rounded-[2rem] p-8 border-2 border-emerald-500/20 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-emerald-500/30">
                    <span className="text-4xl">🌿</span>
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-4">
                    Farm Monitor
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                    Individual field tracking with real-time NDVI, soil moisture, and AI-driven recommendations.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-black uppercase tracking-widest">
                    Launch Demo
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Water Intelligence */}
              <Link href="/water-intelligence" className="group">
                <div className="bg-white rounded-[2rem] p-8 border-2 border-cyan-500/20 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-cyan-500/30">
                    <span className="text-4xl">💧</span>
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-4">
                    Water Intelligence
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                    State water management with aquifer monitoring, irrigation optimization, and resource forecasting.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-cyan-600 font-black uppercase tracking-widest">
                    Launch Demo
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Export Forecast */}
              <Link href="/export-forecast" className="group">
                <div className="bg-white rounded-[2rem] p-8 border-2 border-violet-500/20 hover:border-violet-500 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-violet-500/30">
                    <span className="text-4xl">📈</span>
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-4">
                    Export Forecast
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                    National food security planning with yield predictions, quality grading, and market timing.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-violet-600 font-black uppercase tracking-widest">
                    Launch Demo
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Disease Alert */}
              <Link href="/disease-alert" className="group">
                <div className="bg-white rounded-[2rem] p-8 border-2 border-rose-500/20 hover:border-rose-500 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-rose-500/30">
                    <span className="text-4xl">⚠️</span>
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-4">
                    Disease Alert
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                    Early warning system for trans-boundary threats like Xylella with quarantine zone management.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-rose-600 font-black uppercase tracking-widest">
                    Launch Demo
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-16">
              {steps.map((item, index) => (
                <div key={index} className="relative group">
                  <div className="text-8xl font-black text-slate-100 absolute -top-10 -left-6 group-hover:text-emerald-500/10 transition-colors z-0">
                    {item.step}
                  </div>
                  <div className="relative z-10 pt-10">
                    <h3 className="text-3xl font-black text-black tracking-tighter uppercase italic mb-6">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-8 w-16 h-[1px] bg-slate-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Overlay */}
        <section className="py-24 bg-black overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-5xl sm:text-6xl font-black text-emerald-500 tracking-tighter italic mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 relative overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="font-black text-4xl sm:text-5xl text-foreground tracking-tighter uppercase italic leading-none mb-6">
                ORBITAL <span className="text-emerald-600">PRICING</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-lg font-medium">
                Select the uplink package that fits your harvest scale. Every plan includes core satellite monitoring and MONGI AI access.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Basic Plan */}
              <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="mb-8">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-2">FARMER LITE</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter text-black">0dt</span>
                    <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">/ Month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10">
                  {['1 Field Monitoring', 'Sentinel-2 Visuals', 'NDVI Basic Analysis', 'Community Support'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                        <ChevronRightIcon className="w-3 h-3 text-slate-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full rounded-2xl py-6 font-black uppercase tracking-widest text-[10px] border-slate-200 hover:bg-slate-50">Deploy Free</Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-[2.5rem] p-12 border-2 border-emerald-500 shadow-2xl shadow-emerald-100 relative transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase whitespace-nowrap">
                  Most Deployed
                </div>
                <div className="mb-10">
                  <h3 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">GROVE PRO</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black tracking-tighter text-black">29dt</span>
                    <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">/ Month</span>
                  </div>
                  <p className="mt-4 text-xs font-bold text-slate-500">Perfect for multi-zone olive grove management.</p>
                </div>
                <ul className="space-y-5 mb-12">
                  {[
                    'Up to 10 Fields',
                    'Daily AI Insights',
                    'Historical Temporal Analysis',
                    'Water Stress Alerts',
                    'Priority Satellite Uplink',
                    'Full MONGI AI Assistant'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-black">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <ChevronRightIcon className="w-4 h-4 text-emerald-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full rounded-2xl py-8 font-black uppercase tracking-widest text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200">Activate Link</Button>
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="mb-8">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-2">COOPERATIVE</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter text-black">Custom</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10">
                  {['Unlimited Fields', 'API Data Access', 'Custom AI Modeling', 'White-label Platform', 'Soil IoT Integration'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                        <ChevronRightIcon className="w-3 h-3 text-slate-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full rounded-2xl py-6 font-black uppercase tracking-widest text-[10px] border-slate-200 hover:bg-slate-50">Contact Operations</Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-black text-4xl sm:text-5xl text-foreground tracking-tighter uppercase leading-none mb-8">
              Ready to Uplink Your Harvest?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg font-medium max-w-2xl mx-auto mb-12">
              Join hundreds of Tunisian farmers who are already using MONGI AI to protect their harvests and increase yields through orbital intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black px-10 py-8 rounded-2xl shadow-xl shadow-emerald-200 gap-3">
                  Start Free Trial
                  <ArrowRightIcon className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-black px-10 py-8 rounded-2xl border-slate-200">
                Download Brochure
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-100">
                  <span className="text-xl">🌱</span>
                </div>
                <span className="font-black text-xl text-foreground tracking-tighter">
                  MONGI<span className="text-emerald-600">.AI</span>
                </span>
              </Link>
              <p className="mt-6 text-sm text-muted-foreground font-medium leading-relaxed">
                Orbital intelligence for Tunisa's olive heritage. Advanced satellite monitoring for a sustainable agricultural future.
              </p>
            </div>
            <div>
              <h4 className="font-black text-[10px] text-black uppercase tracking-[0.3em] mb-6">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-bold">
                <li><Link href="#features" className="hover:text-emerald-600 transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Satellite Specs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[10px] text-black uppercase tracking-[0.3em] mb-6">Resources</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-bold">
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Farmer Guides</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Olive Health API</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Case Studies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[10px] text-black uppercase tracking-[0.3em] mb-6">Connect</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-bold">
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Operations</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Support Desk</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 MONGI.AI • PART OF ACTINSPACE TUNISIA</p>
            <div className="flex gap-8">
              <Link href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-black">Privacy Protocol</Link>
              <Link href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-black">Operator Terms</Link>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
