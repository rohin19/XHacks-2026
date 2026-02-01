"use client";

import { useRef, useState, useCallback } from 'react';
import Map, { Source, Layer, Marker, Popup } from 'react-map-gl';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl';
import { useRouter } from 'next/navigation';
import { NEIGHBORHOODS } from '@/app/lib/neighborhoods';
import { VANCOUVER_CENTER, MAP_STYLES } from '@/app/lib/mapbox';
import { MapPin } from 'lucide-react';

interface LandingMapProps {
    userLocation?: [number, number]; // [lng, lat]
    onNeighborhoodSelect?: (slug: string) => void;
}

export default function LandingMap({ userLocation, onNeighborhoodSelect }: LandingMapProps) {
    const mapRef = useRef<MapRef>(null);
    const router = useRouter();
    const [hoveredNeighborhood, setHoveredNeighborhood] = useState<string | null>(null);
    const [popupInfo, setPopupInfo] = useState<{ name: string; lng: number; lat: number } | null>(null);

    const onNeighborhoodClick = useCallback((event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (feature && feature.properties) {
            const slug = feature.properties.slug;
            if (onNeighborhoodSelect) {
                onNeighborhoodSelect(slug);
            } else {
                router.push(`/neighborhood/${slug}`);
            }
        }
    }, [router, onNeighborhoodSelect]);

    const onNeighborhoodHover = useCallback((event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (feature && feature.properties) {
            setHoveredNeighborhood(feature.properties.slug);
            setPopupInfo({
                name: feature.properties.name,
                lng: event.lngLat.lng,
                lat: event.lngLat.lat
            });
        }
    }, []);

    const onNeighborhoodLeave = useCallback(() => {
        setHoveredNeighborhood(null);
        setPopupInfo(null);
    }, []);

    return (
        <div className="w-full h-full relative">
            <Map
                ref={mapRef}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                initialViewState={{
                    longitude: VANCOUVER_CENTER[0],
                    latitude: VANCOUVER_CENTER[1],
                    zoom: 11.5
                }}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
                mapStyle={MAP_STYLES.glass} // Custom glass style with roads, labels, and transparency
                interactiveLayerIds={['neighborhoods-fill']}
                onClick={onNeighborhoodClick}
                onMouseMove={onNeighborhoodHover}
                onMouseLeave={onNeighborhoodLeave}
            >
                {/* Neighborhood Polygons */}
                <Source id="neighborhoods" type="geojson" data={NEIGHBORHOODS}>
                    {/* Polygon Fill */}
                    <Layer
                        id="neighborhoods-fill"
                        type="fill"
                        paint={{
                            'fill-color': [
                                'case',
                                ['==', ['get', 'slug'], hoveredNeighborhood],
                                'rgba(135, 206, 250, 0.85)', // Hover state - bright sky blue
                                'rgba(100, 149, 237, 0.55)'   // Default - transparent cornflower blue
                            ],
                            'fill-opacity': 1
                        }}
                    />

                    {/* Polygon Border */}
                    <Layer
                        id="neighborhoods-border"
                        type="line"
                        paint={{
                            'line-color': [
                                'case',
                                ['==', ['get', 'slug'], hoveredNeighborhood],
                                'rgba(135, 206, 250, 1)',     // Hover state - bright sky blue
                                'rgba(100, 149, 237, 0.8)'    // Default state - more opaque border
                            ],
                            'line-width': [
                                'case',
                                ['==', ['get', 'slug'], hoveredNeighborhood],
                                3.5,  // Hover state - bolder (increased from 2.5)
                                2.5   // Default state - bolder (increased from 1.5)
                            ],
                            'line-blur': 0.3  // Reduced blur for crisper borders (was 0.5)
                        }}
                    />

                    {/* Neighborhood Labels */}
                    <Layer
                        id="neighborhoods-labels"
                        type="symbol"
                        layout={{
                            'text-field': ['get', 'name'],
                            'text-font': ['Open Sans Bold', 'Arial Unicode MS Regular'],
                            'text-size': 14,
                            'text-anchor': 'center',
                            'text-allow-overlap': true,
                            'text-optional': false
                        }}
                        paint={{
                            'text-color': '#ffffff',
                            'text-halo-color': 'rgba(100, 149, 237, 0.4)',
                            'text-halo-width': 2.5,
                            'text-opacity': 1
                        }}
                    />

                </Source>

                {/* User Location Marker */}
                {userLocation && (
                    <Marker
                        longitude={userLocation[0]}
                        latitude={userLocation[1]}
                        anchor="bottom"
                    >
                        <div className="relative">
                            <MapPin
                                size={40}
                                className="text-red-500 drop-shadow-lg"
                                fill="rgba(239, 68, 68, 0.3)"
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        </div>
                    </Marker>
                )}

                {/* Neighborhood Tooltip Popup */}
                {popupInfo && (
                    <Popup
                        longitude={popupInfo.lng}
                        latitude={popupInfo.lat}
                        closeButton={false}
                        closeOnClick={false}
                        anchor="bottom"
                        offset={10}
                        className="neighborhood-popup"
                    >
                        <div className="px-3 py-2 bg-white/95 backdrop-blur rounded-lg shadow-lg">
                            <p className="text-sm font-medium text-gray-900">
                                {popupInfo.name}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Click to view dashboard
                            </p>
                        </div>
                    </Popup>
                )}
            </Map>

            {/* Custom Styles for Popup */}
            <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
      `}</style>
        </div>
    );
}
