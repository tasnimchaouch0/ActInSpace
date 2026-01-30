'use client';

import { useState } from 'react';
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
    <div className="min-h-screen bg-background">
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
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <LeafIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">
                ZAYTUNA.AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
              <Link href="/dashboard">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-4">
                <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
                <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1">
                    Log in
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Hero Content */}
              <div className="text-center lg:text-left">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight text-balance">
                  Satellite Intelligence for Your Olive Groves
                </h1>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Protect your harvest with AI-powered satellite monitoring. Get real-time insights on water stress, climate risks, and yield predictions for your Tunisian olive groves.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                      Start Monitoring
                      <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Demo
                  </Button>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative">
                <div className="aspect-square max-w-lg mx-auto rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary p-8 lg:p-12">
                  {/* Stats Cards */}
                  <div className="absolute -top-4 -left-4 bg-card rounded-2xl shadow-lg p-4 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <TrendingUpIcon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-foreground">+23%</p>
                        <p className="text-xs text-muted-foreground">Yield Increase</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -right-4 bg-card rounded-2xl shadow-lg p-4 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <DropletIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-foreground">-35%</p>
                        <p className="text-xs text-muted-foreground">Water Usage</p>
                      </div>
                    </div>
                  </div>

                  {/* Center Visual */}
                  <div className="h-full flex items-center justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-primary/30 flex items-center justify-center">
                          <SatelliteIcon className="w-16 h-16 text-primary" />
                        </div>
                      </div>
                      {/* Orbiting dots */}
                      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
                      </div>
                      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                        <div className="absolute bottom-4 right-4 w-2 h-2 bg-primary/60 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                Everything You Need to Protect Your Harvest
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Our AI-powered platform combines satellite imagery with advanced analytics to give you complete visibility over your olive groves.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                Simple Setup, Powerful Results
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Get started in minutes and receive your first insights within 24 hours.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-6xl font-serif font-bold text-primary/10 mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 right-0 w-1/2 border-t-2 border-dashed border-primary/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl sm:text-5xl font-serif font-bold">{stat.value}</div>
                  <div className="mt-2 text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
              Ready to Transform Your Olive Grove?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Join hundreds of Tunisian farmers who are already using AI to protect their harvests and increase yields.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  Start Free Trial
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <LeafIcon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-serif text-xl font-semibold text-foreground">
                  ZAYTUNA.AI
                </span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Satellite-powered AI for healthier olive groves across Tunisia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>2026 ZAYTUNA.AI. All rights reserved. ActInSpace Challenge - Satellite data by ESA Copernicus</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
