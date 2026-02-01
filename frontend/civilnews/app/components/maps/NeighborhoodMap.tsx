"use client";

import { useEffect, useState, useCallback } from 'react';
import Map, { Layer, Source, Marker } from 'react-map-gl';
import { X, MapPin } from 'lucide-react';
import { NEIGHBORHOODS } from '@/app/lib/neighborhoods';
import { GLASS_MAP_STYLE } from '@/app/lib/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface NeighborhoodMapProps {
    neighborhoodSlug: string;
    selectedPosts: Array<{
        id: number;
        title: string;
        location?: string;
        lat?: number;
        lng?: number;
        category: string;
    }>;
    onRemove: (id: number) => void;
    onClose: () => void;
}

const categoryColors = {
    development: '#1E3A8A',
    road: '#B45309',
    council: '#047857',
    service: '#7C3AED',
};

export function NeighborhoodMap({
    neighborhoodSlug,
    selectedPosts,
    onRemove,
    onClose
}: NeighborhoodMapProps) {
    const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

    // Find the current neighborhood from the features array
    const neighborhood = NEIGHBORHOODS.features.find((feature: any) => feature.properties.slug === neighborhoodSlug);

    // Calculate center and bounds of the neighborhood
    const getNeighborhoodBounds = useCallback(() => {
        if (!neighborhood?.geometry?.coordinates?.[0]) {
            return {
                center: [-123.1207, 49.2827] as [number, number],
                zoom: 12
            };
        }

        const coords = neighborhood.geometry.coordinates[0];
        const lngs = coords.map((c: any) => c[0]);
        const lats = coords.map((c: any) => c[1]);

        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);

        const centerLng = (minLng + maxLng) / 2;
        const centerLat = (minLat + maxLat) / 2;

        return {
            center: [centerLng, centerLat] as [number, number],
            zoom: 13
        };
    }, [neighborhood]);

    const { center, zoom } = getNeighborhoodBounds();

    // Create GeoJSON for the neighborhood polygon
    const neighborhoodGeoJSON = neighborhood ? {
        type: 'FeatureCollection' as const,
        features: [neighborhood]
    } : null;

    return (
        <div className="fixed top-0 right-0 h-screen w-full lg:w-[500px] bg-white border-l-2 border-[#E2E8F0] shadow-2xl flex flex-col z-40">
            {/* Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-[#E2E8F0]">
                <div>
                    <h3 className="font-['Work_Sans',sans-serif] font-bold text-lg lg:text-xl text-[#0F172A]">
                        {neighborhood?.properties?.name || 'Map View'}
                    </h3>
                    <p className="font-['Inter',sans-serif] text-xs lg:text-sm text-[#64748B] mt-1">
                        {selectedPosts.length} {selectedPosts.length === 1 ? 'event' : 'events'} on map
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                    <X size={20} className="text-[#64748B]" />
                </button>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative overflow-hidden">
                <Map
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    initialViewState={{
                        longitude: center[0],
                        latitude: center[1],
                        zoom: zoom
                    }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/mapbox/light-v11"
                    interactive={true}
                >
                    {/* Neighborhood Polygon */}
                    {neighborhoodGeoJSON && (
                        <Source id="neighborhood" type="geojson" data={neighborhoodGeoJSON as any}>
                            {/* Polygon Fill */}
                            <Layer
                                id="neighborhood-fill"
                                type="fill"
                                paint={{
                                    'fill-color': 'rgba(100, 149, 237, 0.3)',
                                    'fill-opacity': 1
                                }}
                            />

                            {/* Polygon Border */}
                            <Layer
                                id="neighborhood-border"
                                type="line"
                                paint={{
                                    'line-color': 'rgba(100, 149, 237, 1)',
                                    'line-width': 2,
                                    'line-blur': 0.5
                                }}
                            />
                        </Source>
                    )}

                    {/* Event Markers */}
                    {selectedPosts.map((post) => {
                        const lat = post.lat || center[1];
                        const lng = post.lng || center[0];
                        const color = categoryColors[post.category as keyof typeof categoryColors] || '#0F172A';

                        return (
                            <Marker
                                key={post.id}
                                longitude={lng}
                                latitude={lat}
                                anchor="bottom"
                            >
                                <div
                                    className="relative cursor-pointer transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoveredEvent(post.id)}
                                    onMouseLeave={() => setHoveredEvent(null)}
                                >
                                    <MapPin
                                        size={32}
                                        fill={color}
                                        color={color}
                                        className="drop-shadow-lg"
                                    />

                                    {/* Tooltip on hover */}
                                    {hoveredEvent === post.id && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-[#E2E8F0] whitespace-nowrap z-50">
                                            <p className="font-['Work_Sans',sans-serif] font-semibold text-sm text-[#0F172A]">
                                                {post.title}
                                            </p>
                                            {post.location && (
                                                <p className="font-['Inter',sans-serif] text-xs text-[#64748B] mt-1">
                                                    {post.location}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Marker>
                        );
                    })}
                </Map>

                {/* Empty State */}
                {selectedPosts.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm pointer-events-none">
                        <div className="text-center p-6 lg:p-8">
                            <MapPin size={48} className="text-[#94A3B8] mx-auto mb-4" />
                            <p className="font-['Inter',sans-serif] text-sm text-[#64748B] max-w-[250px]">
                                Click on event cards to see their locations on the map
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Events List */}
            {selectedPosts.length > 0 && (
                <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] max-h-[250px] overflow-y-auto">
                    {selectedPosts.map((post) => (
                        <div
                            key={post.id}
                            className="p-3 lg:p-4 border-b border-[#E2E8F0] hover:bg-white transition-colors group"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor: categoryColors[post.category as keyof typeof categoryColors] || '#0F172A'
                                            }}
                                        />
                                        <h4 className="font-['Work_Sans',sans-serif] font-semibold text-xs lg:text-sm text-[#0F172A] truncate">
                                            {post.title}
                                        </h4>
                                    </div>
                                    {post.location && (
                                        <p className="font-['Inter',sans-serif] text-xs text-[#64748B] flex items-center gap-1 ml-5">
                                            <MapPin size={12} />
                                            {post.location}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => onRemove(post.id)}
                                    className="p-1 hover:bg-[#FEE2E2] rounded transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X size={14} className="text-[#EF4444]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
