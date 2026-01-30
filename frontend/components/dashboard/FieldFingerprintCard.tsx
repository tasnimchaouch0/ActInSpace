"use client";

import React from 'react';
import { X, TrendingUp, TrendingDown, Droplet, Leaf, AlertTriangle } from 'lucide-react';

interface FieldFingerprintCardProps {
    fieldId: string;
    data: {
        current: {
            ndvi?: number;
            moisture_index?: number;
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
    };
    onClose: () => void;
}

export default function FieldFingerprintCard({ fieldId, data, onClose }: FieldFingerprintCardProps) {
    const { current, insight, metrics, risk_level, confidence } = data;

    // Risk color mapping
    const getRiskColor = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'critical':
                return 'text-red-500 bg-red-500/10 border-red-500/30';
            case 'high':
                return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
            case 'medium':
                return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
            case 'low':
                return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
            default:
                return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
        }
    };

    // NDVI gauge visualization
    const getNDVIStatus = (ndvi?: number) => {
        if (!ndvi) return { label: 'Unknown', color: 'gray' };
        if (ndvi > 0.6) return { label: 'Healthy', color: 'emerald' };
        if (ndvi > 0.4) return { label: 'Moderate', color: 'yellow' };
        return { label: 'Stressed', color: 'red' };
    };

    const ndviStatus = getNDVIStatus(current.ndvi);

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[500px]">
            <div className="bg-black/90 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/20 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-6 border-b border-emerald-500/20">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Field Fingerprint</h3>
                            <p className="text-sm text-gray-400">ID: {fieldId}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Risk Badge */}
                    <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border ${getRiskColor(risk_level)}`}>
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-semibold">{risk_level} Risk</span>
                        <span className="text-xs opacity-70">({Math.round(confidence * 100)}% confidence)</span>
                    </div>
                </div>

                {/* Vital Signs */}
                <div className="p-6 space-y-6">
                    {/* NDVI Gauge */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-medium text-gray-300">Vegetation Health (NDVI)</span>
                            </div>
                            <span className={`text-lg font-bold text-${ndviStatus.color}-500`}>
                                {current.ndvi ? current.ndvi.toFixed(3) : 'N/A'}
                            </span>
                        </div>
                        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500`}
                                style={{ width: `${(current.ndvi || 0) * 100}%` }}
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs text-${ndviStatus.color}-400`}>{ndviStatus.label}</span>
                            {metrics.ndvi_trend !== 0 && (
                                <span className={`flex items-center text-xs ${metrics.ndvi_trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {metrics.ndvi_trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {Math.abs(metrics.ndvi_trend).toFixed(3)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Moisture Gauge */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Droplet className="w-5 h-5 text-cyan-400" />
                                <span className="text-sm font-medium text-gray-300">Soil Moisture Index</span>
                            </div>
                            <span className="text-lg font-bold text-cyan-400">
                                {current.moisture_index ? `${Math.round(current.moisture_index * 100)}%` : 'N/A'}
                            </span>
                        </div>
                        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                                style={{ width: `${(current.moisture_index || 0) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Fingerprint Sparkline */}
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                        <div className="text-xs font-medium text-gray-400 mb-3">90-Day Signature</div>
                        <div className="h-16 flex items-end gap-1">
                            {data.history.slice(-20).map((point, i) => {
                                const height = (point.ndvi || 0) * 100;
                                return (
                                    <div
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                                        style={{ height: `${height}%` }}
                                        title={`${point.date}: ${point.ndvi?.toFixed(3)}`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* AI Insight */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            <span className="text-sm font-semibold text-purple-300">AI Recommendation</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{insight.title}</h4>
                        <p className="text-sm text-gray-300 mb-3">{insight.description}</p>
                        <div className="bg-black/30 rounded-lg p-3 border-l-4 border-emerald-500">
                            <p className="text-sm font-medium text-emerald-400">{insight.action}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
