'use client';

import { useState } from 'react';
import Link from 'next/link';
import DemoNavigation from '@/components/dashboard/DemoNavigation';
import { AlertTriangle, Shield, Bell, MapPin, Activity } from 'lucide-react';

// Mock data for disease monitoring
const mockDiseaseAlerts = [
    {
        id: 1,
        disease: 'Xylella fastidiosa',
        severity: 'Critical',
        location: 'Northern Italy Border',
        distance: '245 km from Tunisia',
        riskLevel: 95,
        status: 'Active Monitoring',
        detectedDate: '2026-01-15'
    },
    {
        id: 2,
        disease: 'Olive Leaf Spot',
        severity: 'Medium',
        location: 'Sfax Region',
        distance: 'Local Detection',
        riskLevel: 42,
        status: 'Contained',
        detectedDate: '2026-01-28'
    },
    {
        id: 3,
        disease: 'Peacock Spot',
        severity: 'Low',
        location: 'Mahdia Coastal',
        distance: 'Local Detection',
        riskLevel: 18,
        status: 'Monitoring',
        detectedDate: '2026-01-22'
    }
];

const mockQuarantineZones = [
    { zone: 'Sfax North - Zone A', fields: 12, status: 'Quarantined', buffer: '5 km radius' },
    { zone: 'Mahdia Coastal - Zone B', fields: 8, status: 'Observation', buffer: '3 km radius' }
];

const mockSpreadPrediction = [
    { week: 'Week 1', probability: 12, affectedFields: 5 },
    { week: 'Week 2', probability: 18, affectedFields: 8 },
    { week: 'Week 3', probability: 25, affectedFields: 12 },
    { week: 'Week 4', probability: 31, affectedFields: 18 }
];

export default function DiseaseAlertPage() {
    const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">⚠️</span>
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-rose-500 tracking-tighter italic">
                                DISEASE ALERT
                            </h1>
                            <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
                                Early Warning System
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

                {/* Critical Alert Banner */}
                <div className="bg-gradient-to-r from-rose-500/20 via-red-500/20 to-orange-500/20 border-2 border-rose-500/50 rounded-2xl p-6 mb-8 animate-pulse">
                    <div className="flex items-center gap-4">
                        <AlertTriangle className="w-10 h-10 text-rose-500 flex-shrink-0" />
                        <div className="flex-1">
                            <h2 className="text-xl font-black text-rose-500 uppercase tracking-tight mb-1">
                                Xylella Fastidiosa Detected Near Border
                            </h2>
                            <p className="text-sm text-foreground font-medium">
                                Trans-boundary threat detected 245 km from Tunisia. Enhanced satellite monitoring activated for all olive groves within 500 km radius.
                            </p>
                        </div>
                        <button className="px-6 py-3 bg-rose-500 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-rose-600 transition-colors">
                            View Protocol
                        </button>
                    </div>
                </div>

                {/* Alert Overview Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                            <span className="text-xs font-black text-rose-500 uppercase tracking-widest">Active Alerts</span>
                        </div>
                        <div className="text-4xl font-black text-rose-500 tracking-tighter">3</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">1 Critical, 2 Monitoring</div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-5 h-5 text-amber-500" />
                            <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Quarantine Zones</span>
                        </div>
                        <div className="text-4xl font-black text-amber-500 tracking-tighter">2</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">20 Fields Isolated</div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Monitored Fields</span>
                        </div>
                        <div className="text-4xl font-black text-emerald-500 tracking-tighter">847</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">Daily Satellite Scans</div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Bell className="w-5 h-5 text-cyan-500" />
                            <span className="text-xs font-black text-cyan-500 uppercase tracking-widest">Farmers Notified</span>
                        </div>
                        <div className="text-4xl font-black text-cyan-500 tracking-tighter">156</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">Real-time SMS Alerts</div>
                    </div>
                </div>

                {/* AI Model Attribution */}
                <div className="bg-gradient-to-r from-rose-500/10 via-red-500/10 to-orange-500/10 border border-rose-500/20 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                            <span className="text-xl">🔬</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest">AI Models Powering This Module</h3>
                            <p className="text-xs text-muted-foreground font-mono">Spectral analysis and epidemiological modeling</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4">
                            <div className="text-xs text-rose-500 font-black uppercase tracking-widest mb-1">Disease Detection</div>
                            <div className="text-sm font-bold text-foreground mb-2">ResNet-50 (Transfer Learning)</div>
                            <div className="text-[10px] text-muted-foreground font-mono">Trained on Sentinel-2 satellite spectral anomaly data</div>
                        </div>
                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4">
                            <div className="text-xs text-amber-500 font-black uppercase tracking-widest mb-1">Spread Prediction</div>
                            <div className="text-sm font-bold text-foreground mb-2">SEIR Epidemiological Model</div>
                            <div className="text-[10px] text-muted-foreground font-mono">Trained on satellite-tracked infection spread patterns</div>
                        </div>
                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4">
                            <div className="text-xs text-cyan-500 font-black uppercase tracking-widest mb-1">Risk Assessment</div>
                            <div className="text-sm font-bold text-foreground mb-2">Ensemble Classifier</div>
                            <div className="text-[10px] text-muted-foreground font-mono">Trained on satellite weather + vegetation density data</div>
                        </div>
                    </div>
                </div>

                {/* Active Disease Alerts */}
                <div className="bg-card border border-border rounded-3xl p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                        <div>
                            <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">
                                Active Disease Threats
                            </h2>
                            <p className="text-sm text-muted-foreground font-medium">
                                Real-time satellite detection and spectral analysis
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {mockDiseaseAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                onClick={() => setSelectedAlert(alert.id)}
                                className={`
                  group cursor-pointer bg-card/50 border-2 rounded-2xl p-6 transition-all duration-300
                  ${selectedAlert === alert.id
                                        ? 'border-rose-500 bg-rose-500/5'
                                        : 'border-border hover:border-rose-500/50'
                                    }
                `}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{alert.disease}</h3>
                                            <span className={`
                        px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${alert.severity === 'Critical' ? 'bg-rose-500/20 text-rose-500 animate-pulse' : ''}
                        ${alert.severity === 'Medium' ? 'bg-amber-500/20 text-amber-500' : ''}
                        ${alert.severity === 'Low' ? 'bg-emerald-500/20 text-emerald-500' : ''}
                      `}>
                                                {alert.severity}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <MapPin className="w-4 h-4" />
                                            <span className="font-mono">{alert.location} • {alert.distance}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Risk Level</div>
                                        <div className={`text-3xl font-black ${alert.riskLevel > 80 ? 'text-rose-500' : alert.riskLevel > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                            {alert.riskLevel}%
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Status</div>
                                        <div className="text-sm font-black text-foreground">{alert.status}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">Detected</div>
                                        <div className="text-sm font-black text-foreground">{alert.detectedDate}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quarantine Zones */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-card border border-border rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-6 h-6 text-amber-500" />
                            <div>
                                <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">
                                    Quarantine Zones
                                </h2>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Isolated areas with movement restrictions
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {mockQuarantineZones.map((zone, idx) => (
                                <div
                                    key={idx}
                                    className="bg-card/50 border border-border rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300"
                                >
                                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-4">{zone.zone}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs text-muted-foreground font-mono mb-1">Fields</div>
                                            <div className="text-2xl font-black text-amber-500">{zone.fields}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground font-mono mb-1">Buffer Zone</div>
                                            <div className="text-lg font-black text-rose-500">{zone.buffer}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-xs text-muted-foreground font-mono mb-1">Status</div>
                                            <span className={`
                        px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${zone.status === 'Quarantined' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}
                      `}>
                                                {zone.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Spread Prediction */}
                    <div className="bg-card border border-border rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="w-6 h-6 text-cyan-500" />
                            <div>
                                <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">
                                    Spread Prediction Model
                                </h2>
                                <p className="text-sm text-muted-foreground font-medium">
                                    AI-driven infection probability forecast
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {mockSpreadPrediction.map((pred, idx) => (
                                <div
                                    key={idx}
                                    className="bg-card/50 border border-border rounded-2xl p-6"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-lg font-black text-foreground uppercase tracking-tight">{pred.week}</div>
                                        <div className="text-2xl font-black text-rose-500">{pred.probability}%</div>
                                    </div>
                                    <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-500"
                                            style={{ width: `${pred.probability}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-muted-foreground font-mono mt-2">
                                        Estimated {pred.affectedFields} fields at risk
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-cyan-500" />
                                <div className="text-xs text-muted-foreground font-mono">
                                    Model uses satellite NDVI anomalies, weather patterns, and historical spread data
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification System Simulation */}
                <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10 border border-cyan-500/20 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="w-6 h-6 text-cyan-500" />
                        <div>
                            <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">
                                Farmer Notification System
                            </h2>
                            <p className="text-sm text-muted-foreground font-medium">
                                Automated alerts via SMS, email, and mobile app
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
                            <div className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-widest">SMS Alerts Sent</div>
                            <div className="text-3xl font-black text-cyan-500 tracking-tighter mb-1">156</div>
                            <div className="text-xs text-muted-foreground font-mono">Last 24 hours</div>
                        </div>

                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
                            <div className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-widest">Email Reports</div>
                            <div className="text-3xl font-black text-violet-500 tracking-tighter mb-1">89</div>
                            <div className="text-xs text-muted-foreground font-mono">Detailed analysis</div>
                        </div>

                        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
                            <div className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-widest">Response Rate</div>
                            <div className="text-3xl font-black text-emerald-500 tracking-tighter mb-1">94%</div>
                            <div className="text-xs text-muted-foreground font-mono">Farmer engagement</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
