'use client';

import { useEffect, useRef } from 'react';
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
    areaHectares: number; // Added for popup details
}

interface OliveMapProps {
    fields: Field[];
    selectedFieldId: string | null;
    onFieldSelect: (id: string) => void;
}

export default function OliveMap({ fields, selectedFieldId, onFieldSelect }: OliveMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const layersRef = useRef<L.LayerGroup[]>([]);
    const hasFittedBounds = useRef(false);

    // Initialize Map and Base Layers
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Tile Layers
        const satelliteImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri, Maxar, Earthstar Geographics',
            maxZoom: 19,
        });

        const satelliteTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19,
        });

        const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        });

        // Initialize Map
        const map = L.map(mapRef.current, {
            center: [35.2, 10.4],
            zoom: 8,
            zoomControl: false, // We'll add custom control or rely on scroll/touch
            attributionControl: false,
            layers: [satelliteImagery], // Default
            layers: [satelliteImagery], // Default
            preferCanvas: false,
        });

        // Controls
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map);

        L.control.attribution({ prefix: false })
            .addAttribution('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>')
            .addAttribution('© Esri')
            .addTo(map);

        const baseLayers = {
            "Satellite Imagery": satelliteImagery,
            "Street Map": satelliteTiles,
            "Dark Theme": darkTiles,
        };

        L.control.layers(baseLayers, undefined, { position: 'bottomright' }).addTo(map);

        // Custom Title Control
        const customControl = new L.Control({ position: 'topleft' });
        customControl.onAdd = function () {
            const div = L.DomUtil.create('div', 'leaflet-control');
            div.innerHTML = `
                <div style="background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px); color: #38bdf8; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-family: 'JetBrains Mono', monospace; border: 1px solid rgba(56, 189, 248, 0.3);">
                    🛰️ ORBITAL VIEW
                </div>
            `;
            return div;
        };
        customControl.addTo(map);

        mapInstanceRef.current = map;

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

        // Helper to create Marker Icon
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
                        animation: ${isSelected ? 'pulse 1.5s infinite' : 'none'};
                        position: relative;
                    ">
                        ${isSelected ? `<div style="position: absolute; inset: -6px; border: 2px solid ${color}; border-radius: 50%; opacity: 0.5; animation: pulse-ring 1.5s infinite;"></div>` : ''}
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

            // Polygon
            const polygon = L.polygon(
                field.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngTuple),
                {
                    color: color,
                    weight: isSelected ? 3 : 2,
                    opacity: isSelected ? 1 : 0.7,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.3 : 0.15,
                    dashArray: isSelected ? '5, 10' : undefined,
                    className: 'transition-all duration-300',
                }
            );

            // Marker
            const marker = L.marker(
                [field.center[0], field.center[1]] as L.LatLngTuple,
                {
                    icon: createIcon(field.healthStatus, isSelected),
                    riseOnHover: true,
                }
            );

            // Popup
            const popupContent = `
                <div style="font-family: 'JetBrains Mono', monospace; min-width: 220px; color: white;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color}; box-shadow: 0 0 8px ${color};"></div>
                        <div style="font-weight: 700; font-size: 14px; text-transform: uppercase; color: #fff;">
                            ${field.name}
                        </div>
                    </div>
                    <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">
                        REGION: ${field.region}<br/>
                        AREA: ${field.areaHectares || 'N/A'} HA
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 11px; color: #94a3b8;">STRESS SCORE</span>
                            <span style="font-size: 14px; font-weight: 700; color: ${color};">${field.stressScore}/100</span>
                        </div>
                    </div>
                    <div style="margin-top: 8px; font-size: 10px; color: #64748b; text-align: center;">
                        CLICK TO VIEW ANALYTICS
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent, {
                className: 'field-popup',
                closeButton: false,
                offset: [0, -10]
            });

            // Interaction
            const layerGroup = L.layerGroup([polygon, marker]).addTo(map);
            layersRef.current.push(layerGroup);

            const clickHandler = () => {
                onFieldSelect(field.id);
            };

            polygon.on('click', clickHandler);
            marker.on('click', clickHandler);

            // Hover effects
            const hoverIn = () => {
                polygon.setStyle({ weight: 3, fillOpacity: 0.4 });
                if (!isSelected) marker.setIcon(createIcon(field.healthStatus, true));
            };
            const hoverOut = () => {
                if (!isSelected) {
                    polygon.setStyle({ weight: 2, fillOpacity: 0.15 });
                    marker.setIcon(createIcon(field.healthStatus, false));
                }
            };

            polygon.on('mouseover', hoverIn);
            polygon.on('mouseout', hoverOut);
            marker.on('mouseover', hoverIn);
            marker.on('mouseout', hoverOut);

            // Handle selection state
            if (isSelected) {
                map.panTo([field.center[0], field.center[1]], { animate: true, duration: 0.8 });
                // We typically verify if popup is open, but safe to reopen
                marker.openPopup();
            }
        });

        // Initial Fit Bounds (only once)
        if (fields.length > 0 && !hasFittedBounds.current) {
            const bounds = L.latLngBounds(
                fields.flatMap(f => f.coordinates.map(c => [c[0], c[1]] as L.LatLngTuple))
            );
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
            hasFittedBounds.current = true;
        }

    }, [fields, selectedFieldId, onFieldSelect]);

    // Inject CSS for animations and popup styling
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
            }
            @keyframes pulse-ring {
                0% { transform: scale(1); opacity: 0.8; }
                100% { transform: scale(2); opacity: 0; }
            }
            .field-popup .leaflet-popup-content-wrapper {
                background: rgba(15, 23, 42, 0.9);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                padding: 0;
            }
            .field-popup .leaflet-popup-tip {
                background: rgba(15, 23, 42, 0.9);
            }
            .field-popup .leaflet-popup-content {
                margin: 12px;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
            <div
                ref={mapRef}
                className="h-[500px] w-full bg-space-950"
            />

            {/* Loading Overlay */}
            {!mapInstanceRef.current && (
                <div className="absolute inset-0 glass flex items-center justify-center z-[50]">
                    <div className="text-cyber-400 animate-pulse flex items-center gap-3 font-mono">
                        <div className="w-3 h-3 rounded-full bg-cyber-400 animate-ping"></div>
                        INITIALIZING SATELLITE FEED...
                    </div>
                </div>
            )}

            {/* Custom Legend */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
                <div className="glass p-3 rounded-lg backdrop-blur-md border border-white/5">
                    <div className="text-[10px] font-bold text-gray-400 mb-2 font-mono tracking-wider">FIELD STATUS</div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-neon-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                            <span className="text-[10px] text-gray-300 font-mono">OPTIMAL</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-harvest-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse"></div>
                            <span className="text-[10px] text-gray-300 font-mono">ATTENTION</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></div>
                            <span className="text-[10px] text-gray-300 font-mono">CRITICAL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}