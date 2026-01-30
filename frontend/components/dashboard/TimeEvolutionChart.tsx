'use client';

import { useState, useEffect } from 'react';

interface TrendData {
    date: string;
    value: number;
}

interface TimeEvolutionChartProps {
    ndviData?: TrendData[];
    moistureData?: TrendData[];
    stressData?: TrendData[];
    selectedPeriod?: '7d' | '30d' | '90d';
}

// Generate mock trend data
function generateMockData(days: number, baseValue: number, variance: number): TrendData[] {
    const data: TrendData[] = [];
    const now = new Date();

    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Create some realistic variation
        const trend = Math.sin(i / 7) * variance * 0.3;
        const noise = (Math.random() - 0.5) * variance;
        const value = Math.max(0, Math.min(100, baseValue + trend + noise));

        data.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(value * 10) / 10,
        });
    }

    return data;
}

export default function TimeEvolutionChart({
    ndviData,
    moistureData,
    stressData,
    selectedPeriod = '30d'
}: TimeEvolutionChartProps) {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>(selectedPeriod);
    const [activeChart, setActiveChart] = useState<'ndvi' | 'moisture' | 'stress'>('ndvi');
    const [isAnimated, setIsAnimated] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number; date: string } | null>(null);

    // Generate mock data based on period
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;

    const data = {
        ndvi: ndviData || generateMockData(days, 72, 15),
        moisture: moistureData || generateMockData(days, 58, 20),
        stress: stressData || generateMockData(days, 35, 25),
    };

    const chartConfig = {
        ndvi: {
            label: 'NDVI INDEX',
            color: '#22c55e',
            gradient: 'from-neon-500/30 to-neon-500/5',
            icon: '🌿',
            unit: '',
            description: 'Vegetation Health',
        },
        moisture: {
            label: 'MOISTURE LEVEL',
            color: '#0ea5e9',
            gradient: 'from-cyber-500/30 to-cyber-500/5',
            icon: '💧',
            unit: '%',
            description: 'Soil Water Content',
        },
        stress: {
            label: 'STRESS INDEX',
            color: '#fbbf24',
            gradient: 'from-harvest-500/30 to-harvest-500/5',
            icon: '⚠️',
            unit: '',
            description: 'Combined Stress Level',
        },
    };

    const currentConfig = chartConfig[activeChart];
    const currentData = data[activeChart];

    // Trigger animation on mount and data change
    useEffect(() => {
        setIsAnimated(false);
        const timer = setTimeout(() => setIsAnimated(true), 100);
        return () => clearTimeout(timer);
    }, [activeChart, period]);

    // Calculate chart dimensions
    const chartWidth = 100; // percentage
    const chartHeight = 120;
    const padding = { top: 10, right: 10, bottom: 20, left: 10 };

    // Calculate min/max for scaling
    const values = currentData.map(d => d.value);
    const minValue = Math.min(...values) - 5;
    const maxValue = Math.max(...values) + 5;
    const valueRange = maxValue - minValue;

    // Generate SVG path
    const pathPoints = currentData.map((d, i) => {
        const x = (i / (currentData.length - 1)) * 100;
        const y = ((maxValue - d.value) / valueRange) * (chartHeight - padding.top - padding.bottom) + padding.top;
        return { x, y, value: d.value, date: d.date };
    });

    const linePath = pathPoints.map((p, i) =>
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');

    const areaPath = `${linePath} L 100 ${chartHeight - padding.bottom} L 0 ${chartHeight - padding.bottom} Z`;

    // Get current value (latest)
    const currentValue = currentData[currentData.length - 1]?.value || 0;
    const previousValue = currentData[currentData.length - 2]?.value || currentValue;
    const change = currentValue - previousValue;
    const changePercent = previousValue ? ((change / previousValue) * 100).toFixed(1) : '0';

    return (
        <div className="glass p-6 rounded-2xl relative overflow-hidden">
            {/* Data stream effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-500 to-transparent animate-data-stream" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border"
                            style={{
                                background: `linear-gradient(135deg, ${currentConfig.color}20, ${currentConfig.color}05)`,
                                borderColor: `${currentConfig.color}30`,
                            }}
                        >
                            <span className="text-lg">{currentConfig.icon}</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white font-mono">{currentConfig.label}</h3>
                            <p className="text-xs text-gray-500">{currentConfig.description}</p>
                        </div>
                    </div>

                    {/* Period selector */}
                    <div className="flex gap-1 bg-space-900/50 rounded-lg p-1">
                        {(['7d', '30d', '90d'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${period === p
                                        ? 'bg-cyber-500/20 text-cyber-400 border border-cyber-500/30'
                                        : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {p.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart type selector */}
                <div className="flex gap-2 mb-4">
                    {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveChart(type)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${activeChart === type
                                    ? 'bg-white/10 text-white border border-white/20'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ background: chartConfig[type].color }}
                            />
                            {type.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Current value display */}
                <div className="flex items-end gap-4 mb-4">
                    <div className="text-4xl font-bold font-mono" style={{ color: currentConfig.color }}>
                        {currentValue.toFixed(1)}{currentConfig.unit}
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-mono ${change >= 0 ? 'text-neon-400' : 'text-red-400'
                        }`}>
                        <span>{change >= 0 ? '↑' : '↓'}</span>
                        <span>{Math.abs(change).toFixed(1)}</span>
                        <span className="text-gray-500">({changePercent}%)</span>
                    </div>
                </div>

                {/* Chart */}
                <div
                    className="relative h-32 w-full"
                    onMouseLeave={() => setHoveredPoint(null)}
                >
                    <svg
                        viewBox={`0 0 100 ${chartHeight}`}
                        className="w-full h-full"
                        preserveAspectRatio="none"
                    >
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((y) => (
                            <line
                                key={y}
                                x1="0"
                                y1={padding.top + (y / 100) * (chartHeight - padding.top - padding.bottom)}
                                x2="100"
                                y2={padding.top + (y / 100) * (chartHeight - padding.top - padding.bottom)}
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="0.5"
                            />
                        ))}

                        {/* Gradient area */}
                        <defs>
                            <linearGradient id={`gradient-${activeChart}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={currentConfig.color} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={currentConfig.color} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <path
                            d={areaPath}
                            fill={`url(#gradient-${activeChart})`}
                            className="transition-all duration-700"
                            style={{
                                opacity: isAnimated ? 1 : 0,
                            }}
                        />

                        {/* Line */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke={currentConfig.color}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-all duration-700"
                            style={{
                                strokeDasharray: isAnimated ? 'none' : '1000',
                                strokeDashoffset: isAnimated ? 0 : 1000,
                                filter: `drop-shadow(0 0 4px ${currentConfig.color})`,
                            }}
                        />

                        {/* Data points (interactive) */}
                        {pathPoints.map((point, i) => (
                            <g key={i}>
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="6"
                                    fill="transparent"
                                    className="cursor-pointer"
                                    onMouseEnter={() => setHoveredPoint(point)}
                                />
                                {(i === pathPoints.length - 1 || hoveredPoint?.date === point.date) && (
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r="3"
                                        fill={currentConfig.color}
                                        className="transition-all duration-300"
                                        style={{
                                            filter: `drop-shadow(0 0 4px ${currentConfig.color})`,
                                        }}
                                    />
                                )}
                            </g>
                        ))}
                    </svg>

                    {/* Tooltip */}
                    {hoveredPoint && (
                        <div
                            className="absolute z-20 glass px-3 py-2 rounded-lg text-xs font-mono pointer-events-none transform -translate-x-1/2"
                            style={{
                                left: `${hoveredPoint.x}%`,
                                top: '0',
                            }}
                        >
                            <div className="text-gray-400">{hoveredPoint.date}</div>
                            <div className="font-semibold" style={{ color: currentConfig.color }}>
                                {hoveredPoint.value.toFixed(1)}{currentConfig.unit}
                            </div>
                        </div>
                    )}
                </div>

                {/* Time labels */}
                <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                    <span>{currentData[0]?.date}</span>
                    <span>{currentData[Math.floor(currentData.length / 2)]?.date}</span>
                    <span>{currentData[currentData.length - 1]?.date}</span>
                </div>

                {/* Footer note */}
                <div className="mt-4 pt-3 border-t border-white/5 text-xs text-gray-500 font-mono">
                    DATA SOURCE: SENTINEL-1 SAR + SENTINEL-2 OPTICAL
                </div>
            </div>
        </div>
    );
}
