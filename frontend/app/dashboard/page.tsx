"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import TimelineSlider from '@/components/dashboard/TimelineSlider';
import FieldFingerprintCard from '@/components/dashboard/FieldFingerprintCard';

// Dynamically import OliveMap to avoid SSR issues with Leaflet
const OliveMap = dynamic(() => import('@/components/dashboard/OliveMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[500px] w-full bg-muted rounded-2xl flex items-center justify-center">
            <div className="text-primary animate-pulse">Loading map...</div>
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
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState<string>('');
    const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sample fields in Tunisia (Sfax region - olive grove areas)
    const fields: Field[] = [
        {
            id: 'field-1',
            name: 'Sfax North Grove',
            region: 'Sfax',
            coordinates: [
                [34.75, 10.76],
                [34.75, 10.78],
                [34.73, 10.78],
                [34.73, 10.76],
            ],
            center: [34.74, 10.77],
            healthStatus: 'healthy',
            stressScore: 25,
            areaHectares: 12.5,
        },
        {
            id: 'field-2',
            name: 'Mahdia Coastal',
            region: 'Mahdia',
            coordinates: [
                [35.50, 11.05],
                [35.50, 11.07],
                [35.48, 11.07],
                [35.48, 11.05],
            ],
            center: [35.49, 11.06],
            healthStatus: 'warning',
            stressScore: 58,
            areaHectares: 8.3,
        },
        {
            id: 'field-3',
            name: 'Sousse Valley',
            region: 'Sousse',
            coordinates: [
                [35.83, 10.63],
                [35.83, 10.65],
                [35.81, 10.65],
                [35.81, 10.63],
            ],
            center: [35.82, 10.64],
            healthStatus: 'critical',
            stressScore: 82,
            areaHectares: 15.7,
        },
    ];

    // Fetch satellite data when a field is selected
    useEffect(() => {
        if (!selectedFieldId) {
            setSatelliteData(null);
            return;
        }

        const fetchSatelliteData = async () => {
            setLoading(true);
            setError(null);

            try {
                const field = fields.find((f) => f.id === selectedFieldId);
                if (!field) return;

                // Call the AI service
                const response = await fetch('http://localhost:8000/analyze-field', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        field_id: field.id,
                        geometry: field.coordinates,
                        days_back: 90,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }

                const data = await response.json();
                setSatelliteData(data);
            } catch (err) {
                console.error('Failed to fetch satellite data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load satellite data');
            } finally {
                setLoading(false);
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
                        <Link href="/" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-2xl">🌿</span>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-primary">
                                ZAYTUNA.AI
                            </h1>
                            <p className="text-xs text-muted-foreground">Satellite Intelligence Dashboard</p>
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
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Map Section */}
                <div className="mb-8 relative">
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-1">Orbital View</h2>
                            <p className="text-muted-foreground text-sm">
                                Select a field to view detailed satellite analysis and temporal evolution
                            </p>
                        </div>
                    </div>

                    <div className="relative group rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
                        <OliveMap
                            fields={fields}
                            selectedFieldId={selectedFieldId}
                            onFieldSelect={setSelectedFieldId}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-sm mx-4 shadow-xl">
                            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-foreground mb-2">Analyzing Satellite Data</h3>
                            <p className="text-primary text-sm mb-4">Fetching Sentinel-2 NDVI & Sentinel-1 SAR...</p>
                            <div className="text-xs text-muted-foreground font-mono">
                                Processing {fields.find(f => f.id === selectedFieldId)?.name}...
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="fixed bottom-8 right-8 z-50 bg-destructive border border-destructive/30 rounded-xl p-4 shadow-xl max-w-md animate-in slide-in-from-right text-destructive-foreground">
                        <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                            <span>⚠️</span> Analysis Failed
                        </h3>
                        <p className="text-white/90 text-sm">{error}</p>
                    </div>
                )}

                {/* Field Fingerprint Card */}
                {satelliteData && !loading && (
                    <FieldFingerprintCard
                        fieldId={satelliteData.field_id}
                        data={satelliteData}
                        onClose={() => setSelectedFieldId(null)}
                    />
                )}

                {/* Timeline Slider */}
                {satelliteData && satelliteData.history.length > 0 && !loading && (
                    <TimelineSlider
                        history={satelliteData.history}
                        onDateChange={setCurrentDate}
                    />
                )}

                {/* Instructions / Empty State */}
                {!selectedFieldId && !loading && (
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group cursor-default shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="font-bold text-foreground mb-2">Field Fingerprint</h3>
                            <p className="text-sm text-muted-foreground">
                                Click a field to immediately calculate vegetation health (NDVI) and soil moisture indices.
                            </p>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group cursor-default shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⏱️</span>
                            </div>
                            <h3 className="font-bold text-foreground mb-2">Living Timeline</h3>
                            <p className="text-sm text-muted-foreground">
                                Visualize how your crop health has evolved over the last 90 days with our time-series engine.
                            </p>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group cursor-default shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">🧠</span>
                            </div>
                            <h3 className="font-bold text-foreground mb-2">AI Decisions</h3>
                            <p className="text-sm text-muted-foreground">
                                Get distinct, actionable recommendations based on expert agronomy rules and ML predictions.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
