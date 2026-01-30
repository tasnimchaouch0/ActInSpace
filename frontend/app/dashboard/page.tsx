"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import TimelineSlider from '@/components/dashboard/TimelineSlider';
import FieldFingerprintCard from '@/components/dashboard/FieldFingerprintCard';
import { useAuth } from '@/components/providers/AuthProvider';

// Dynamically import OliveMap to avoid SSR issues with Leaflet
const OliveMap = dynamic(() => import('@/components/dashboard/OliveMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full bg-[#050505] rounded-[2.5rem] flex flex-col items-center justify-center gap-4 border border-white/5 shadow-2xl">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <div className="text-emerald-500/50 font-mono text-xs tracking-widest animate-pulse uppercase">Establishing Satellite Uplink...</div>
        </div>
    ),
});

interface Field {
    id: string;
    name: string;
    region: string;
    coordinates: number[][];
    center: number[];
    healthStatus: 'healthy' | 'warning' | 'critical';
    stressScore: number;
    areaHectares: number;
}

interface SatelliteData {
    field_id: string;
    current: {
        ndvi?: number;
        moisture_index?: number;
        date: string;
    };
    history: Array<{ date: string; ndvi?: number; moisture_index?: number }>;
    risk_level: string;
    confidence: number;
    insight: {
        title: string;
        description: string;
        action: string;
    };
    metrics: {
        ndvi?: number;
        moisture_index?: number;
        ndvi_trend: number;
        moisture_trend: number;
    };
}

export default function DashboardPage() {
    const { token, isAuthenticated } = useAuth();
    const [fields, setFields] = useState<Field[]>([]);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState<string>('');
    const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch fields from backend
    const hasFetchedRef = useRef(false);
    useEffect(() => {
        if (!token || hasFetchedRef.current) return;

        const fetchFields = async () => {
            try {
                hasFetchedRef.current = true;
                const response = await fetch('http://localhost:5001/api/fields', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.length === 0) throw new Error("No fields found");

                    const transformedFields = data.map((f: any) => {
                        const geojson = JSON.parse(f.geom);
                        const coords = geojson.coordinates[0].map((c: number[]) => [c[1], c[0]]);
                        const lats = coords.map((c: any) => c[0]);
                        const lons = coords.map((c: any) => c[1]);
                        const center = [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lons) + Math.max(...lons)) / 2];

                        return {
                            id: f.id.toString(),
                            name: f.name,
                            region: 'Tunisia',
                            coordinates: coords,
                            center: center,
                            healthStatus: (['healthy', 'warning', 'critical'] as const)[Math.floor(Math.random() * 3)],
                            stressScore: Math.floor(Math.random() * 100),
                            areaHectares: 10 + Math.random() * 20
                        };
                    });
                    setFields(transformedFields);
                } else {
                    throw new Error(`Status: ${response.status}`);
                }
            } catch (err) {
                console.warn("Using fallback fields:", err);
                setFields([
                    { id: 'field-1', name: 'Sfax North Grove', region: 'Sfax', coordinates: [[34.75, 10.76], [34.75, 10.78], [34.73, 10.78], [34.73, 10.76]], center: [34.74, 10.77], healthStatus: 'healthy', stressScore: 25, areaHectares: 12.5 },
                    { id: 'field-2', name: 'Mahdia Coastal', region: 'Mahdia', coordinates: [[35.50, 11.05], [35.50, 11.07], [35.48, 11.07], [35.48, 11.05]], center: [35.49, 11.06], healthStatus: 'warning', stressScore: 58, areaHectares: 8.3 },
                    { id: 'field-3', name: 'Sousse Valley', region: 'Sousse', coordinates: [[35.83, 10.63], [35.83, 10.65], [35.81, 10.65], [35.81, 10.63]], center: [35.82, 10.64], healthStatus: 'critical', stressScore: 82, areaHectares: 15.7 },
                ]);
            }
        };
        fetchFields();
    }, [token]);

    // Fetch satellite data when a field is selected
    useEffect(() => {
        if (!selectedFieldId) {
            setSatelliteData(null);
            return;
        }

        const fetchSatelliteData = async () => {
            setLoading(true);
            setIsScanning(true);
            setError(null);

            try {
                const field = fields.find((f) => f.id === selectedFieldId);
                if (!field) return;

                console.log("🖱️ Fetching satellite data for:", field.name || field.id);

                // Add a timeout to the fetch (GEE is slow, using 30s)
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);

                // Call the AI service
                const response = await fetch('http://localhost:8000/analyze-field', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal,
                    body: JSON.stringify({
                        field_id: field.id,
                        geometry: field.coordinates.map(c => [c[1], c[0]]), // Lon, Lat for GEE
                        days_back: 90,
                    }),
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.detail || `API error: ${response.statusText}`);
                }

                const data = await response.json();

                // Keep the scanning animation for a bit for effect
                setTimeout(() => {
                    setSatelliteData(data);
                    setIsScanning(false);
                    setLoading(false);
                }, 1500);
            } catch (err) {
                console.error('Failed to fetch satellite data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load satellite data');
                setLoading(false);
                setIsScanning(false);
            }
        };

        fetchSatelliteData();
    }, [selectedFieldId]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">🌿</span>
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-emerald-500 tracking-tighter italic">
                                MONGI.AI
                            </h1>
                            <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">Orbital Intelligence Hub</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/payment" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent hover:bg-accent/80 transition-colors">
                            <span className="text-primary text-sm font-semibold">⚡ Upgrade to Pro</span>
                        </Link>

                        <div className="h-6 w-px bg-border mx-2" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-primary font-medium">Verified Farmer</p>
                                <p className="text-[10px] text-muted-foreground">Sfax Region</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('user');
                                        window.location.href = '/login';
                                    }
                                }}
                                className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
                                title="Sign Out"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-6">
                {/* Map Section */}
                {/* Layout Flow: Features then Map */}
                <div className="flex flex-col gap-8">
                    {/* Features (Now above the map, not overlapping) */}
                    {satelliteData && !loading && (
                        <div className="flex flex-col gap-6 animate-in slide-in-from-top-4 duration-700">
                            <FieldFingerprintCard
                                fieldId={satelliteData.field_id}
                                data={satelliteData}
                                onClose={() => setSelectedFieldId(null)}
                                isInline={true}
                            />
                            {satelliteData.history.length > 0 && (
                                <TimelineSlider
                                    history={satelliteData.history}
                                    onDateChange={setCurrentDate}
                                    isInline={true}
                                />
                            )}
                        </div>
                    )}

                    {/* Map Container */}
                    <div className="relative group rounded-[3rem] overflow-hidden border border-white/10 bg-[#050505] shadow-[0_0_100px_rgba(0,0,0,0.8)] h-[550px] z-10 transition-all duration-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-20" />
                        <OliveMap
                            fields={fields}
                            selectedFieldId={selectedFieldId}
                            onFieldSelect={setSelectedFieldId}
                            isScanning={isScanning}
                        />
                    </div>
                </div>

                {/* Instructions Grid - Simplified */}
                {!selectedFieldId && !loading && (
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        {/* Field Fingerprint Card */}
                        <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 cursor-pointer overflow-hidden"
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-500/30">
                                    <span className="text-3xl">📊</span>
                                </div>
                                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-emerald-400 transition-colors">Field Fingerprint</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Click a field to immediately calculate vegetation health (NDVI) and soil moisture indices.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    SENTINEL-2 NDVI • SAR MOISTURE
                                </div>
                            </div>
                        </div>

                        {/* Living Timeline Card */}
                        <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 cursor-pointer overflow-hidden"
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-cyan-500/30">
                                    <span className="text-3xl">⏱️</span>
                                </div>
                                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-cyan-400 transition-colors">Living Timeline</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Visualize how your crop health has evolved over the last 90 days with our time-series engine.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    90-DAY TEMPORAL ANALYSIS
                                </div>
                            </div>
                        </div>

                        {/* AI Decisions Card */}
                        <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 cursor-pointer overflow-hidden"
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-purple-500/30">
                                    <span className="text-3xl">🧠</span>
                                </div>
                                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-purple-400 transition-colors">AI Decisions</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Get distinct, actionable recommendations based on expert agronomy rules and ML predictions.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-purple-400 font-mono">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    EXPERT SYSTEM • ML PREDICTIONS
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Stats Preview */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card/50 border border-border rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-emerald-400">3</div>
                        <div className="text-xs text-muted-foreground font-mono">FIELDS MONITORED</div>
                    </div>
                    <div className="bg-card/50 border border-border rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-cyan-400">36.5 ha</div>
                        <div className="text-xs text-muted-foreground font-mono">TOTAL AREA</div>
                    </div>
                    <div className="bg-card/50 border border-border rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-400">2</div>
                        <div className="text-xs text-muted-foreground font-mono">ALERTS ACTIVE</div>
                    </div>
                    <div className="bg-card/50 border border-border rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-purple-400">90</div>
                        <div className="text-xs text-muted-foreground font-mono">DAYS OF DATA</div>
                    </div>
                </div>
            </main>
        </div>
    );
}

