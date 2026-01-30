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
}

interface OliveMapProps {
    fields: Field[];
    selectedFieldId: string | null;
    onFieldSelect: (id: string) => void;
}

export default function OliveMap({ fields, selectedFieldId, onFieldSelect }: OliveMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map centered on Tunisia
        const map = L.map(mapRef.current, {
            center: [35.2, 10.4],
            zoom: 7,
            zoomControl: true,
            attributionControl: true,
        });

        // Dark map tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Clear existing polygons
        polygonsRef.current.forEach(polygon => polygon.remove());
        polygonsRef.current.clear();

        // Get color based on health status
        const getColor = (status: string) => {
            switch (status) {
                case 'healthy': return '#10b981';
                case 'warning': return '#f59e0b';
                case 'critical': return '#ef4444';
                default: return '#10b981';
            }
        };

        // Add field polygons
        fields.forEach(field => {
            const color = getColor(field.healthStatus);
            const isSelected = field.id === selectedFieldId;

            const polygon = L.polygon(
                field.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngTuple),
                {
                    color: color,
                    weight: isSelected ? 3 : 2,
                    opacity: isSelected ? 1 : 0.8,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.4 : 0.25,
                }
            ).addTo(map);

            // Popup content
            const popupContent = `
        <div style="font-family: system-ui; min-width: 180px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #fff;">
            ${field.name}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${color};"></span>
            <span style="color: ${color}; text-transform: capitalize; font-size: 13px;">
              ${field.healthStatus}
            </span>
          </div>
          <div style="font-size: 12px; color: #9ca3af;">
            Stress Score: <span style="color: #fff; font-weight: 500;">${field.stressScore}/100</span>
          </div>
          <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">
            Region: ${field.region}
          </div>
        </div>
      `;

            polygon.bindPopup(popupContent, {
                className: 'dark-popup'
            });

            polygon.on('click', () => {
                onFieldSelect(field.id);
            });

            polygon.on('mouseover', () => {
                polygon.setStyle({
                    weight: 3,
                    fillOpacity: 0.5,
                });
            });

            polygon.on('mouseout', () => {
                if (field.id !== selectedFieldId) {
                    polygon.setStyle({
                        weight: 2,
                        fillOpacity: 0.25,
                    });
                }
            });

            polygonsRef.current.set(field.id, polygon);
        });

        // Fit bounds to show all fields
        if (fields.length > 0) {
            const bounds = L.latLngBounds(
                fields.flatMap(f => f.coordinates.map(c => [c[0], c[1]] as L.LatLngTuple))
            );
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
        }
    }, [fields, selectedFieldId, onFieldSelect]);

    // Update selected polygon style
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        polygonsRef.current.forEach((polygon, id) => {
            const field = fields.find(f => f.id === id);
            if (!field) return;

            const isSelected = id === selectedFieldId;
            const color = field.healthStatus === 'healthy' ? '#10b981' :
                field.healthStatus === 'warning' ? '#f59e0b' : '#ef4444';

            polygon.setStyle({
                weight: isSelected ? 3 : 2,
                opacity: isSelected ? 1 : 0.8,
                fillOpacity: isSelected ? 0.4 : 0.25,
            });

            if (isSelected) {
                const center = L.latLng(field.center[0], field.center[1]);
                map.panTo(center, { animate: true, duration: 0.5 });
            }
        });
    }, [selectedFieldId, fields]);

    return (
        <div className="relative">
            <div
                ref={mapRef}
                className="h-[400px] rounded-2xl overflow-hidden"
                style={{ background: '#111827' }}
            />

            {/* Loading state */}
            {!mapInstanceRef.current && (
                <div className="absolute inset-0 h-[400px] glass rounded-2xl flex items-center justify-center z-[999]">
                    <div className="text-leaf-400 animate-pulse">Loading map...</div>
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 glass p-3 rounded-lg z-[1000]">
                <div className="text-xs font-medium text-white mb-2">Field Status</div>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-leaf-500"></span>
                        <span className="text-xs text-gray-300">Healthy</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
                        <span className="text-xs text-gray-300">Needs Attention</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-red-500"></span>
                        <span className="text-xs text-gray-300">Critical</span>
                    </div>
                </div>
            </div>

            {/* Map controls hint */}
            <div className="absolute top-4 right-4 glass px-3 py-2 rounded-lg z-[1000]">
                <span className="text-xs text-gray-400">Click a field for details</span>
            </div>
        </div>
    );
}
