'use client';

import { useState } from 'react';
import Link from 'next/link';
import DemoNavigation from '@/components/dashboard/DemoNavigation';
import { Droplet, TrendingDown, Calendar, Zap } from 'lucide-react';

// Mock data for water intelligence
const mockRegionalData = [
    { region: 'Sfax', stressLevel: 'High', efficiency: 62, savings: 2.4, aquiferLevel: -12 },
    { region: 'Mahdia', stressLevel: 'Medium', efficiency: 78, savings: 1.8, aquiferLevel: -8 },
    { region: 'Sousse', stressLevel: 'Low', efficiency: 85, savings: 3.2, aquiferLevel: -4 },
    { region: 'Monastir', stressLevel: 'Medium', efficiency: 71, savings: 2.1, aquiferLevel: -9 }
];

const mockIrrigationSchedule = [
    { field: 'Sfax North Grove', nextIrrigation: '2026-02-02', waterNeeded: '12,500 L', savings: '3,200 L' },
    { field: 'Mahdia Coastal', nextIrrigation: '2026-02-04', waterNeeded: '8,300 L', savings: '2,100 L' },
    { field: 'Sousse Valley', nextIrrigation: '2026-02-01', waterNeeded: '15,700 L', savings: '4,800 L' }
];

export default function WaterIntelligencePage() {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">💧</span>
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-cyan-500 tracking-tighter italic">
                                WATER INTELLIGENCE
                            </h1>
                            <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
                                Resource Optimization Hub
                            </p>
                        </div>
                    </div>
                    <Link href="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                        ← Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-6">
                {/* Demo Navigation */}
                <DemoNavigation />

                {/* Hero Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Droplet className="w-5 h-5 text-cyan-500" />
                            <span className="text-xs font-black text-cyan-500 uppercase tracking-widest">Total Savings</span>
                        </div>
                        <div className="text-4xl font-black text-cyan-500 tracking-tighter">9.5M L</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">This Season</div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingDown className="w-5 h-5 text-emerald-500" />
                            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Avg Efficiency</span>
                        </div>
                        <div className="text-4xl font-black text-emerald-500 tracking-tighter">74%</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">+12% vs Last Year</div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <span className="text-xs font-black text-amber-500 uppercase tracking-widest">High Stress</span>
                        </div>
                        <div className="text-4xl font-black text-amber-500 tracking-tighter">1</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">Region Flagged</div>
                    </div>

                    <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-violet-500" />
                            <span className="text-xs font-black text-violet-500 uppercase tracking-widest">Cost Saved</span>
                        </div>
                        <div className="text-4xl font-black text-violet-500 tracking-tighter">$47K</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">Operational Savings</div>
                    </div>
                </div>

                {/* AI Model Attribution */}
                <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 border border-cyan-500/20 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <span className="text-xl">🤖</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-cyan-500 uppercase tracking-widest">AI Models Powering This Module</h3>
                            <p className="text-xs text-muted-foreground font-mono">Trained on satellite imagery and hydrological data</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4">
                            <div className="text-xs text-cyan-500 font-black uppercase tracking-widest mb-1">Water Stress Detection</div>
                            <div className="text-sm font-bold text-foreground mb-2">Random Forest Classifier</div>
                            <div className="text-[10px] text-muted-foreground font-mono">Trained on Sentinel-2 satellite NDMI imagery (2018-2025)</div>
                        </div>
                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4">
                            <div className="text-xs text-emerald-500 font-black uppercase tracking-widest mb-1">Irrigation Optimization</div>
                            <div className="text-sm font-bold text-foreground mb-2">LSTM Neural Network</div>
                            <div className="text-[10px] text-muted-foreground font-mono">Trained on satellite soil moisture time-series data</div>
                        </div>
                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4">
                            <div className="text-xs text-violet-500 font-black uppercase tracking-widest mb-1">Aquifer Forecasting</div>
                            <div className="text-sm font-bold text-foreground mb-2">XGBoost Regressor</div>
                            <div className="text-[10px] text-muted-foreground font-mono">Trained on GRACE satellite groundwater data (95% accuracy)</div>
                        </div>
                    </div>
                </div>

                {/* Regional Water Stress Map */}
                <div className="bg-card border border-border rounded-3xl p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic mb-2">
                                Regional Water Stress Heatmap
                            </h2>
                            <p className="text-sm text-muted-foreground font-medium">
                                Real-time aquifer depletion and irrigation efficiency across Tunisia
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                            <span className="text-xs font-black text-cyan-500 uppercase tracking-widest">Live Data</span>
                        </div>
                    </div>

                    {/* Mock Heatmap Table */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {mockRegionalData.map((region) => (
                            <div
                                key={region.region}
                                onClick={() => setSelectedRegion(region.region)}
                                className={`
                  group cursor-pointer bg-card/50 border-2 rounded-2xl p-6 transition-all duration-300
                  ${selectedRegion === region.region
                                        ? 'border-cyan-500 bg-cyan-500/5'
                                        : 'border-border hover:border-cyan-500/50'
                                    }
                `}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{region.region}</h3>
                                    <span className={`
                    px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                    ${region.stressLevel === 'High' ? 'bg-rose-500/20 text-rose-500' : ''}
                    ${region.stressLevel === 'Medium' ? 'bg-amber-500/20 text-amber-500' : ''}
                    ${region.stressLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-500' : ''}
                  `}>
                                        {region.stressLevel} Stress
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Efficiency</div>
                                        <div className="text-2xl font-black text-cyan-500">{region.efficiency}%</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Savings</div>
                                        <div className="text-2xl font-black text-emerald-500">{region.savings}M L</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Aquifer Level Change</div>
                                        <div className="text-2xl font-black text-rose-500">{region.aquiferLevel}%</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Smart Irrigation Schedule */}
                <div className="bg-card border border-border rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="w-6 h-6 text-emerald-500" />
                        <div>
                            <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">
                                AI-Optimized Irrigation Schedule
                            </h2>
                            <p className="text-sm text-muted-foreground font-medium">
                                Satellite-driven recommendations to minimize water waste
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {mockIrrigationSchedule.map((schedule, idx) => (
                            <div
                                key={idx}
                                className="group bg-card/50 border border-border rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{schedule.field}</h3>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                        Optimized
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Next Irrigation</div>
                                        <div className="text-lg font-black text-cyan-500">{schedule.nextIrrigation}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Water Needed</div>
                                        <div className="text-lg font-black text-blue-500">{schedule.waterNeeded}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">AI Savings</div>
                                        <div className="text-lg font-black text-emerald-500">{schedule.savings}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

function AlertTriangle({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    );
}
