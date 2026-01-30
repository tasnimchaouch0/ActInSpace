'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import for Leaflet (client-side only)
const OliveMap = dynamic(() => import('@/components/dashboard/OliveMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] glass rounded-2xl flex items-center justify-center">
            <div className="text-leaf-400 animate-pulse">Loading map...</div>
        </div>
    )
});

// Types
interface Field {
    id: string;
    name: string;
    region: string;
    coordinates: number[][];
    center: number[];
    areaHectares: number;
    treesCount: number;
    stressScore: number;
    moistureLevel: number;
    temperatureAnomaly: number;
    healthStatus: 'healthy' | 'warning' | 'critical';
    yieldRisk: 'low' | 'medium' | 'high';
    trend: 'stable' | 'improving' | 'worsening';
    lastUpdated: string;
    sentinelData: {
        ndvi: number;
        ndwi: number;
        sentinel1Date: string;
        sentinel2Date: string;
    };
}

interface AIInsights {
    summary: string;
    recommendations: string[];
    confidence: number;
    analysisMethod: string;
    lastAnalysis: string;
}

interface SatelliteStatus {
    lastSentinel1Pass: string;
    lastSentinel2Pass: string;
    nextUpdate: string;
    coverageArea: string;
}

interface DashboardData {
    fields: Field[];
    aiInsights: AIInsights;
    satelliteStatus: SatelliteStatus;
    generatedAt: string;
}

// Status Badge Component
function StatusBadge({ status }: { status: 'healthy' | 'warning' | 'critical' }) {
    const styles = {
        healthy: 'bg-leaf-500/20 text-leaf-400 border-leaf-500/30',
        warning: 'bg-harvest-500/20 text-harvest-400 border-harvest-500/30',
        critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    const labels = {
        healthy: '● Healthy',
        warning: '● Warning',
        critical: '● Critical',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

// Stress Gauge Component
function StressGauge({ score, size = 70 }: { score: number; size?: number }) {
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (score: number) => {
        if (score <= 30) return '#4d7c0f'; // leaf-500
        if (score <= 60) return '#daa520'; // harvest-400
        return '#dc2626'; // red-600
    };

    const getLabel = (score: number) => {
        if (score <= 30) return 'Low';
        if (score <= 60) return 'Moderate';
        return 'High';
    };

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#2d2416"
                    strokeWidth="6"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor(score)}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="gauge-fill"
                    style={{ filter: `drop-shadow(0 0 4px ${getColor(score)}40)` }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">{score}</span>
                <span className="text-[9px] text-gray-400">{getLabel(score)}</span>
            </div>
        </div>
    );
}

// Trend Indicator
function TrendIndicator({ trend }: { trend: 'stable' | 'improving' | 'worsening' }) {
    const config = {
        stable: { icon: '→', color: 'text-gray-400', label: 'Stable' },
        improving: { icon: '↑', color: 'text-leaf-400', label: 'Improving' },
        worsening: { icon: '↓', color: 'text-red-400', label: 'Worsening' },
    };
    const { icon, color, label } = config[trend];
    return (
        <span className={`inline-flex items-center gap-0.5 text-[10px] ${color}`}>
            <span className="text-xs">{icon}</span>
            {label}
        </span>
    );
}

// Yield Risk Badge
function YieldRiskBadge({ risk }: { risk: 'low' | 'medium' | 'high' }) {
    const config = {
        low: { bg: 'bg-leaf-500/15', text: 'text-leaf-400', label: 'Low' },
        medium: { bg: 'bg-harvest-500/15', text: 'text-harvest-400', label: 'Medium' },
        high: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'High' },
    };
    const { bg, text, label } = config[risk];
    return (
        <div className={`${bg} px-2 py-1 rounded-md`}>
            <div className="text-[9px] text-gray-500">Yield</div>
            <div className={`text-[10px] font-semibold ${text}`}>{label}</div>
        </div>
    );
}

// Field Card Component
function FieldCard({ field, isSelected, onSelect }: { field: Field; isSelected: boolean; onSelect: () => void }) {
    return (
        <div
            className={`glass p-4 card-hover cursor-pointer rounded-xl transition-all ${isSelected ? 'ring-2 ring-harvest-400 harvest-glow' : ''}`}
            onClick={onSelect}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-bold text-white text-base mb-0.5 font-serif">{field.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <span className="text-[10px]">📍</span>
                        <span>{field.region}</span>
                        <span>•</span>
                        <span>{field.areaHectares} ha</span>
                    </p>
                </div>
                <StatusBadge status={field.healthStatus} />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Stress Gauge */}
                <div className="flex flex-col items-center justify-center">
                    <StressGauge score={field.stressScore} size={70} />
                    <span className="text-[10px] text-gray-500 mt-1">Water Stress</span>
                </div>

                {/* Metrics */}
                <div className="flex flex-col justify-center space-y-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md bg-leaf-500/10 flex items-center justify-center">
                            <span className="text-[10px]">💧</span>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500">Moisture</div>
                            <div className="text-xs font-semibold text-white">{field.moistureLevel}%</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md bg-harvest-500/10 flex items-center justify-center">
                            <span className="text-[10px]">🌡️</span>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500">Temp</div>
                            <div className={`text-xs font-semibold ${field.temperatureAnomaly > 0 ? 'text-harvest-400' : 'text-leaf-500'}`}>
                                {field.temperatureAnomaly > 0 ? '+' : ''}{field.temperatureAnomaly}°C
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <TrendIndicator trend={field.trend} />
                    <span className="text-[10px] text-gray-500">🌳 {field.treesCount.toLocaleString()}</span>
                </div>
                <YieldRiskBadge risk={field.yieldRisk} />
            </div>
        </div>
    );
}

// AI Insights Panel
function AIInsightsPanel({ insights }: { insights: AIInsights }) {
    return (
        <div className="glass p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-leaf-500 to-leaf-600 flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                </div>
                <div>
                    <h3 className="font-semibold text-white font-serif">AI Analysis</h3>
                    <p className="text-xs text-gray-400">Confidence: {insights.confidence}%</p>
                </div>
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed text-sm">{insights.summary}</p>

            <div className="space-y-2">
                <h4 className="text-sm font-medium text-leaf-400">Recommendations:</h4>
                {insights.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="text-leaf-400 mt-0.5">•</span>
                        <span>{rec}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500">
                Analysis: {insights.analysisMethod}
            </div>
        </div>
    );
}

// Satellite Status Panel  
function SatellitePanel({ status }: { status: SatelliteStatus }) {
    return (
        <div className="glass p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-olive-500 to-olive-600 flex items-center justify-center">
                    <span className="text-xl">🛰️</span>
                </div>
                <div>
                    <h3 className="font-semibold text-white font-serif">Satellite Data</h3>
                    <p className="text-xs text-gray-400">ESA Copernicus Sentinels</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-olive-400"></span>
                        <span className="text-sm text-gray-300">Sentinel-1 (Radar)</span>
                    </div>
                    <span className="text-sm text-white">{status.lastSentinel1Pass}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-leaf-400"></span>
                        <span className="text-sm text-gray-300">Sentinel-2 (Optical)</span>
                    </div>
                    <span className="text-sm text-white">{status.lastSentinel2Pass}</span>
                </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-olive-500/10 border border-olive-500/20">
                <div className="text-xs text-gray-400 mb-1">Next Update</div>
                <div className="text-sm text-olive-400 font-medium">
                    {new Date(status.nextUpdate).toLocaleString()}
                </div>
            </div>

            <div className="mt-3 text-xs text-gray-500">
                Coverage: {status.coverageArea}
            </div>
        </div>
    );
}

// Main Dashboard Component
export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch from Next.js API route which handles fallback
                const response = await fetch('/api/dashboard');
                if (!response.ok) throw new Error('Failed to fetch');
                const json = await response.json();
                setData(json);
                if (json.fields.length > 0) {
                    setSelectedFieldId(json.fields[0].id);
                }
            } catch (err) {
                // Use mock data if API is unavailable
                setData(getMockData());
                setSelectedFieldId('sfax-north-001');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const selectedField = data?.fields.find(f => f.id === selectedFieldId);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-leaf-500 border-t-transparent animate-spin mx-auto mb-4"></div>
                    <p className="text-leaf-400">Loading satellite data...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">Failed to load dashboard data</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass border-b border-earth-700/30 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl">🫒</span>
                            <span className="text-base font-bold bg-gradient-to-r from-leaf-400 to-harvest-300 bg-clip-text text-transparent italic tracking-wide">
                                ZAYTUNA.AI
                            </span>
                        </Link>
                        <span className="text-gray-500 text-sm">|</span>
                        <span className="text-gray-300 text-sm">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-leaf-400 animate-pulse"></span>
                            Live
                        </div>
                        <button className="glass px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white transition-colors">
                            Settings
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="glass p-3 text-center rounded-xl">
                        <div className="text-2xl font-bold text-white mb-0.5">{data.fields.length}</div>
                        <div className="text-[10px] text-gray-400">Fields Monitored</div>
                    </div>
                    <div className="glass p-3 text-center rounded-xl">
                        <div className="text-2xl font-bold text-leaf-400 mb-0.5">
                            {data.fields.filter(f => f.healthStatus === 'healthy').length}
                        </div>
                        <div className="text-[10px] text-gray-400">Healthy</div>
                    </div>
                    <div className="glass p-3 text-center rounded-xl">
                        <div className="text-2xl font-bold text-harvest-400 mb-0.5">
                            {data.fields.filter(f => f.healthStatus === 'warning').length}
                        </div>
                        <div className="text-[10px] text-gray-400">Need Attention</div>
                    </div>
                    <div className="glass p-3 text-center rounded-xl">
                        <div className="text-2xl font-bold text-red-400 mb-0.5">
                            {data.fields.filter(f => f.healthStatus === 'critical').length}
                        </div>
                        <div className="text-[10px] text-gray-400">Critical</div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Field Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold text-white font-serif">Your Olive Fields</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {data.fields.map(field => (
                                <FieldCard
                                    key={field.id}
                                    field={field}
                                    isSelected={field.id === selectedFieldId}
                                    onSelect={() => setSelectedFieldId(field.id)}
                                />
                            ))}
                        </div>

                        {/* Map */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold text-white mb-4 font-serif">Field Map</h2>
                            <OliveMap
                                fields={data.fields}
                                selectedFieldId={selectedFieldId}
                                onFieldSelect={setSelectedFieldId}
                            />
                        </div>
                    </div>

                    {/* Right Column - AI & Satellite */}
                    <div className="space-y-6">
                        <AIInsightsPanel insights={data.aiInsights} />
                        <SatellitePanel status={data.satelliteStatus} />

                        {/* Selected Field Details */}
                        {selectedField && (
                            <div className="glass p-6">
                                <h3 className="font-semibold text-white mb-4 font-serif">📍 {selectedField.name} Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Region</span>
                                        <span className="text-white">{selectedField.region}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Area</span>
                                        <span className="text-white">{selectedField.areaHectares} hectares</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Trees</span>
                                        <span className="text-white">{selectedField.treesCount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Stress Score</span>
                                        <span className={`font-medium ${selectedField.stressScore <= 30 ? 'text-leaf-400' :
                                            selectedField.stressScore <= 60 ? 'text-harvest-400' : 'text-red-400'
                                            }`}>
                                            {selectedField.stressScore}/100
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Vegetation Index</span>
                                        <span className="text-white">{selectedField.sentinelData.ndvi.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Water Index</span>
                                        <span className="text-white">{selectedField.sentinelData.ndwi.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-earth-700/30 py-6 px-6 mt-12">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-500">
                    <span>ZAYTUNA.AI • ActInSpace 2026</span>
                    <span>Data: ESA Copernicus Sentinel-1 & Sentinel-2</span>
                </div>
            </footer>
        </div>
    );
}

// Mock data fallback
function getMockData(): DashboardData {
    return {
        fields: [
            {
                id: 'sfax-north-001',
                name: 'Sfax Northern Grove',
                region: 'Sfax',
                coordinates: [[34.8234, 10.7012], [34.8298, 10.7012], [34.8298, 10.7156], [34.8234, 10.7156], [34.8234, 10.7012]],
                center: [34.8266, 10.7084],
                areaHectares: 45.2,
                treesCount: 1800,
                stressScore: 23,
                moistureLevel: 68,
                temperatureAnomaly: 1.2,
                healthStatus: 'healthy',
                yieldRisk: 'low',
                trend: 'stable',
                lastUpdated: new Date().toISOString(),
                sentinelData: { ndvi: 0.72, ndwi: 0.15, sentinel1Date: '2026-01-28', sentinel2Date: '2026-01-27' }
            },
            {
                id: 'sousse-coastal-002',
                name: 'Sousse Coastal Olives',
                region: 'Sousse',
                coordinates: [[35.8012, 10.5934], [35.8089, 10.5934], [35.8089, 10.6078], [35.8012, 10.6078], [35.8012, 10.5934]],
                center: [35.8051, 10.6006],
                areaHectares: 32.8,
                treesCount: 1200,
                stressScore: 45,
                moistureLevel: 52,
                temperatureAnomaly: 2.1,
                healthStatus: 'warning',
                yieldRisk: 'medium',
                trend: 'worsening',
                lastUpdated: new Date().toISOString(),
                sentinelData: { ndvi: 0.58, ndwi: 0.08, sentinel1Date: '2026-01-28', sentinel2Date: '2026-01-27' }
            },
            {
                id: 'kairouan-inland-003',
                name: 'Kairouan Heritage Field',
                region: 'Kairouan',
                coordinates: [[35.6756, 10.0912], [35.6834, 10.0912], [35.6834, 10.1023], [35.6756, 10.1023], [35.6756, 10.0912]],
                center: [35.6795, 10.0968],
                areaHectares: 28.5,
                treesCount: 950,
                stressScore: 67,
                moistureLevel: 38,
                temperatureAnomaly: 3.2,
                healthStatus: 'critical',
                yieldRisk: 'high',
                trend: 'worsening',
                lastUpdated: new Date().toISOString(),
                sentinelData: { ndvi: 0.42, ndwi: -0.05, sentinel1Date: '2026-01-28', sentinel2Date: '2026-01-27' }
            }
        ],
        aiInsights: {
            summary: "⚠️ Attention needed: 1 field showing high water stress. Average stress level: 45/100.",
            recommendations: [
                "🚨 Kairouan Heritage Field: Consider immediate irrigation - stress level is critical (67/100)",
                "⚡ Sousse Coastal Olives: Monitor closely and plan irrigation within 3-5 days",
                "🌿 Sfax Northern Grove looks healthy - continue current irrigation schedule"
            ],
            confidence: 87,
            analysisMethod: "Sentinel-1 SAR + Sentinel-2 Multispectral fusion",
            lastAnalysis: new Date().toISOString()
        },
        satelliteStatus: {
            lastSentinel1Pass: '2026-01-28',
            lastSentinel2Pass: '2026-01-27',
            nextUpdate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            coverageArea: 'Northern Tunisia (Sfax, Sousse, Kairouan regions)'
        },
        generatedAt: new Date().toISOString()
    };
}
