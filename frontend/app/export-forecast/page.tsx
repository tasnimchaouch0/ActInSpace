'use client';

import { useState } from 'react';
import Link from 'next/link';
import DemoNavigation from '@/components/dashboard/DemoNavigation';
import { TrendingUp, DollarSign, Award, MapPin, BarChart3 } from 'lucide-react';

// Mock data for export forecasting
const mockNationalForecast = {
    totalProduction: 285000, // tons
    exportPotential: 195000, // tons
    domesticConsumption: 90000, // tons
    estimatedRevenue: 1.2, // billion USD
    extraVirginPercentage: 68,
    harvestWindow: 'Oct 15 - Dec 20, 2026'
};

const mockRegionalYields = [
    { region: 'Sfax', production: 95000, quality: 'Extra Virgin', exportReady: 72000, revenue: 0.42 },
    { region: 'Mahdia', production: 62000, quality: 'Virgin', exportReady: 48000, revenue: 0.28 },
    { region: 'Sousse', production: 78000, quality: 'Extra Virgin', exportReady: 58000, revenue: 0.34 },
    { region: 'Monastir', production: 50000, quality: 'Virgin', exportReady: 37000, revenue: 0.21 }
];

const mockHistoricalAccuracy = [
    { year: '2022', predicted: 245, actual: 238, accuracy: 97 },
    { year: '2023', predicted: 268, actual: 271, accuracy: 99 },
    { year: '2024', predicted: 252, actual: 249, accuracy: 99 },
    { year: '2025', predicted: 279, actual: 275, accuracy: 98 },
    { year: '2026', predicted: 285, actual: null, accuracy: null }
];

export default function ExportForecastPage() {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">📈</span>
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-violet-500 tracking-tighter italic">
                                EXPORT FORECAST
                            </h1>
                            <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
                                National Food Security Hub
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

                {/* National Forecast Overview */}
                <div className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-3xl p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-8 h-8 text-violet-500" />
                        <div>
                            <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">
                                Tunisia 2026 Olive Oil Forecast
                            </h2>
                            <p className="text-sm text-muted-foreground font-medium">
                                Satellite-driven production estimates • Updated daily
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
                            <div className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-widest">Total Production</div>
                            <div className="text-4xl font-black text-violet-500 tracking-tighter mb-1">
                                {mockNationalForecast.totalProduction.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">tons of olive oil</div>
                        </div>

                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
                            <div className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-widest">Export Potential</div>
                            <div className="text-4xl font-black text-emerald-500 tracking-tighter mb-1">
                                {mockNationalForecast.exportPotential.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">tons ready for export</div>
                        </div>

                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
                            <div className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-widest">Est. Revenue</div>
                            <div className="text-4xl font-black text-amber-500 tracking-tighter mb-1">
                                ${mockNationalForecast.estimatedRevenue}B
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">USD export value</div>
                        </div>

                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
                            <div className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-widest">Extra Virgin %</div>
                            <div className="text-4xl font-black text-cyan-500 tracking-tighter mb-1">
                                {mockNationalForecast.extraVirginPercentage}%
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">premium quality</div>
                        </div>

                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
                            <div className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-widest">Domestic Use</div>
                            <div className="text-4xl font-black text-blue-500 tracking-tighter mb-1">
                                {mockNationalForecast.domesticConsumption.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">tons for local market</div>
                        </div>

                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
                            <div className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-widest">Harvest Window</div>
                            <div className="text-lg font-black text-rose-500 tracking-tighter mb-1">
                                Oct 15 - Dec 20
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">optimal timing</div>
                        </div>
                    </div>
                </div>

                {/* AI Model Attribution */}
                <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                            <span className="text-xl">🧠</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-violet-500 uppercase tracking-widest">AI Models Powering This Module</h3>
                            <p className="text-xs text-muted-foreground font-mono">Satellite-driven yield prediction pipeline</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4">
                            <div className="text-xs text-violet-500 font-black uppercase tracking-widest mb-1">Yield Prediction</div>
                            <div className="text-sm font-bold text-foreground mb-2">Gradient Boosting (XGBoost)</div>
                            <div className="text-[10px] text-muted-foreground font-mono">Trained on Sentinel-2 NDVI satellite time-series (98% accuracy)</div>
                        </div>
                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4">
                            <div className="text-xs text-emerald-500 font-black uppercase tracking-widest mb-1">Quality Grading</div>
                            <div className="text-sm font-bold text-foreground mb-2">Convolutional Neural Network</div>
                            <div className="text-[10px] text-muted-foreground font-mono">Trained on satellite multi-spectral imagery (Extra Virgin detection)</div>
                        </div>
                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4">
                            <div className="text-xs text-amber-500 font-black uppercase tracking-widest mb-1">Market Timing</div>
                            <div className="text-sm font-bold text-foreground mb-2">Prophet Time Series</div>
                            <div className="text-[10px] text-muted-foreground font-mono">Trained on satellite-derived harvest window patterns</div>
                        </div>
                    </div>
                </div>

                {/* Regional Breakdown */}
                <div className="bg-card border border-border rounded-3xl p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <MapPin className="w-6 h-6 text-violet-500" />
                        <div>
                            <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">
                                Regional Production Breakdown
                            </h2>
                            <p className="text-sm text-muted-foreground font-medium">
                                Export-ready volumes and quality grades by governorate
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {mockRegionalYields.map((region) => (
                            <div
                                key={region.region}
                                onClick={() => setSelectedRegion(region.region)}
                                className={`
                  group cursor-pointer bg-card/50 border-2 rounded-2xl p-6 transition-all duration-300
                  ${selectedRegion === region.region
                                        ? 'border-violet-500 bg-violet-500/5'
                                        : 'border-border hover:border-violet-500/50'
                                    }
                `}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{region.region}</h3>
                                    <span className={`
                    px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                    ${region.quality === 'Extra Virgin' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'}
                  `}>
                                        {region.quality}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Production</div>
                                        <div className="text-2xl font-black text-violet-500">{region.production.toLocaleString()} t</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Export Ready</div>
                                        <div className="text-2xl font-black text-emerald-500">{region.exportReady.toLocaleString()} t</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Est. Revenue</div>
                                        <div className="text-2xl font-black text-amber-500">${region.revenue}B USD</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Historical Accuracy */}
                <div className="bg-card border border-border rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className="w-6 h-6 text-cyan-500" />
                        <div>
                            <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">
                                Prediction Accuracy Track Record
                            </h2>
                            <p className="text-sm text-muted-foreground font-medium">
                                Historical satellite predictions vs. actual harvest yields
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {mockHistoricalAccuracy.map((year) => (
                            <div
                                key={year.year}
                                className="bg-card/50 border border-border rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300"
                            >
                                <div className="grid grid-cols-4 gap-4 items-center">
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Year</div>
                                        <div className="text-2xl font-black text-foreground">{year.year}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Predicted</div>
                                        <div className="text-xl font-black text-violet-500">{year.predicted}K tons</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Actual</div>
                                        <div className="text-xl font-black text-emerald-500">
                                            {year.actual ? `${year.actual}K tons` : 'Pending'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Accuracy</div>
                                        {year.accuracy ? (
                                            <div className="flex items-center gap-2">
                                                <div className="text-xl font-black text-cyan-500">{year.accuracy}%</div>
                                                <Award className="w-5 h-5 text-cyan-500" />
                                            </div>
                                        ) : (
                                            <div className="text-xl font-black text-muted-foreground">—</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Award className="w-6 h-6 text-cyan-500" />
                            <div>
                                <div className="text-sm font-black text-cyan-500 uppercase tracking-tight">5-Year Average Accuracy</div>
                                <div className="text-xs text-muted-foreground font-mono">98.25% prediction accuracy using satellite NDVI + ML models</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
