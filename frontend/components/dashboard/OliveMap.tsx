'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface OliveMapProps {
    fields: Field[];
    selectedFieldId: string | null;
    isScanning?: boolean;
    onFieldSelect: (id: string) => void;
}

export default function OliveMap({ fields, selectedFieldId, onFieldSelect, isScanning = false }: OliveMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const layersRef = useRef<L.LayerGroup[]>([]);
    const hasFittedBounds = useRef(false);
    const [isMapReady, setIsMapReady] = useState(false);

    // Initialize Map and Base Layers
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Tile Layers
        const satelliteImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri, Maxar, Earthstar Geographics',
            maxZoom: 19,
        });

        const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        });

        // Initialize Map
        const map = L.map(mapRef.current, {
            center: [34.74, 10.77], // Default to Sfax area
            zoom: 12,
            zoomControl: false,
            attributionControl: false,
            layers: [satelliteImagery],
        });

        // Controls
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map);

        const baseLayers = {
            "Satellite": satelliteImagery,
            "Night Vision": darkTiles,
        };
        L.control.layers(baseLayers, undefined, { position: 'bottomright' }).addTo(map);

        // Custom Title Control
        const customControl = new L.Control({ position: 'topleft' });
        customControl.onAdd = function () {
            const div = L.DomUtil.create('div', 'leaflet-control');
            div.innerHTML = `
                <div style="background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px); color: #10b981; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-family: monospace; border: 1px solid rgba(16, 185, 129, 0.3); letter-spacing: 0.1em; font-weight: bold;">
                    🛰️ ORBITAL STREAM ACTIVE
                </div>
            `;
            return div;
        };
        customControl.addTo(map);

        mapInstanceRef.current = map;
        setTimeout(() => {
            map.invalidateSize();
            setIsMapReady(true);
        }, 100);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Handle Fields and Selection
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Clear existing layers
        layersRef.current.forEach(layer => layer.remove());
        layersRef.current = [];

        const createIcon = (status: string, isSelected: boolean) => {
            const size = isSelected ? 24 : 16;
            const color = status === 'healthy' ? '#22c55e' :
                status === 'warning' ? '#fbbf24' : '#ef4444';

            return L.divIcon({
                html: `
                    <div style="
                        width: ${size}px;
                        height: ${size}px;
                        background: ${color};
                        border: 2px solid white;
                        border-radius: 50%;
                        box-shadow: 0 0 ${isSelected ? '20px' : '10px'} ${color};
                        animation: ${isSelected ? 'pulse-high-freq 1s infinite' : 'none'};
                        position: relative;
                    ">
                        ${isSelected ? `<div style="position: absolute; inset: -8px; border: 2px solid ${color}; border-radius: 50%; opacity: 0.5; animation: radar-ping 1.5s infinite;"></div>` : ''}
                    </div>
                `,
                className: 'custom-div-icon',
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
            });
        };

        fields.forEach(field => {
            const isSelected = field.id === selectedFieldId;
            const color = field.healthStatus === 'healthy' ? '#22c55e' :
                field.healthStatus === 'warning' ? '#fbbf24' : '#ef4444';

            const polygon = L.polygon(
                field.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngTuple),
                {
                    color: color,
                    weight: isSelected ? 3 : 2,
                    opacity: isSelected ? 1 : 0.7,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.35 : 0.15,
                    dashArray: isSelected ? '5, 10' : undefined,
                }
            );

            const marker = L.marker(
                [field.center[0], field.center[1]] as L.LatLngTuple,
                { icon: createIcon(field.healthStatus, isSelected) }
            );

            const popupContent = `
                <div style="font-family: monospace; min-width: 220px; color: white; padding: 5px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color}; box-shadow: 0 0 8px ${color};"></div>
                        <div style="font-weight: 700; font-size: 13px; text-transform: uppercase;">${field.name}</div>
                    </div>
                    <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px; line-height: 1.5;">
                        REGION: ${field.region}<br/>
                        AREA: ${field.areaHectares.toFixed(1)} HA<br/>
                        STRESS: <span style="color: ${color}; font-weight: bold;">${field.stressScore}/100</span>
                    </div>
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 6px; border-radius: 4px; border: 1px solid ${color}33; text-align: center;">
                        <span style="font-size: 10px; color: ${color}; font-weight: bold;">CLICK FOR DEEP ANALYSIS</span>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent, {
                className: 'field-popup-premium',
                closeButton: false,
                offset: [0, -10]
            });

            const layerGroup = L.layerGroup([polygon, marker]).addTo(map);
            layersRef.current.push(layerGroup);

            const clickHandler = () => onFieldSelect(field.id);
            polygon.on('click', clickHandler);
            marker.on('click', clickHandler);

            if (isSelected) {
                map.panTo([field.center[0], field.center[1]], { animate: true });
                marker.openPopup();
            }
        });

        if (fields.length > 0 && !hasFittedBounds.current) {
            const bounds = L.latLngBounds(fields.flatMap(f => f.coordinates.map(c => [c[0], c[1]] as L.LatLngTuple)));
            map.fitBounds(bounds, { padding: [50, 50] });
            hasFittedBounds.current = true;
        }

    }, [fields, selectedFieldId, onFieldSelect]);

    return (
        <div className="relative w-full h-full bg-[#050505]">
            <style>{`
                @keyframes pulse-high-freq {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.15); opacity: 0.9; }
                }
                @keyframes radar-ping {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                @keyframes scan-line {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes grid-fade {
                    0%, 100% { opacity: 0.03; }
                    50% { opacity: 0.1; }
                }
                .field-popup-premium .leaflet-popup-content-wrapper {
                    background: rgba(10, 10, 10, 0.85);
                    backdrop-filter: blur(12px);
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                    padding: 0;
                }
                .field-popup-premium .leaflet-popup-tip {
                    background: rgba(10, 10, 10, 0.85);
                }
                .map-grid {
                    background-size: 30px 30px;
                    background-image: 
                        linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
                    animation: grid-fade 4s ease-in-out infinite;
                }
                .leaflet-container {
                    background: #050505 !important;
                }
            `}</style>

            {/* Grid Overlay */}
            <div className="absolute inset-0 z-[400] pointer-events-none map-grid" />

            <div ref={mapRef} className="h-full w-full" />

            {/* Scanning Effect Overlay */}
            {isScanning && (
                <div className="absolute inset-0 z-[450] pointer-events-none overflow-hidden bg-emerald-500/[0.02] backdrop-blur-[1px]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] animate-[scan-line_2.5s_linear_infinite]" />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/80 border border-emerald-500/30 rounded-full text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase backdrop-blur-md">
                        Multispectral Analysis In Progress...
                    </div>
                </div>
            )}

            {/* Premium Legend */}
            <div className="absolute top-4 right-4 z-[500] bg-black/70 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-2xl">
                <div className="text-[10px] font-black text-gray-400 mb-3 tracking-[0.2em] uppercase font-mono">Satellite Feed Status</div>
                <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></div>
                        <span className="text-[10px] text-gray-200 font-mono font-bold uppercase tracking-wider">Optimal</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse"></div>
                        <span className="text-[10px] text-gray-200 font-mono font-bold uppercase tracking-wider">Warning</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></div>
                        <span className="text-[10px] text-gray-200 font-mono font-bold uppercase tracking-wider">Critical</span>
                    </div>
                </div>
            </div>

            {!isMapReady && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[2000]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        <div className="text-emerald-500 animate-pulse font-mono text-xs tracking-[0.3em] font-bold">INITIALIZING ORBITAL FEED</div>
                    </div>
                </div>
            )}
        </div>
    );
}