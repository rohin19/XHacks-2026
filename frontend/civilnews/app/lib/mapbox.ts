// Custom glass-style Mapbox configuration
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set access token from environment variable
if (typeof window !== 'undefined') {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
}

// Custom glass-themed map style
export const GLASS_MAP_STYLE = {
    version: 8 as const,
    name: 'Glass Theme',
    sources: {
        'mapbox': {
            type: 'vector' as const,
            url: 'mapbox://mapbox.mapbox-streets-v8'
        }
    },
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    layers: [
        {
            id: 'background',
            type: 'background' as const,
            paint: {
                'background-color': 'rgba(240, 248, 255, 0.05)' // Barely visible tint
            }
        },
        {
            id: 'water',
            type: 'fill' as const,
            source: 'mapbox',
            'source-layer': 'water',
            paint: {
                'fill-color': 'rgba(100, 149, 237, 0.08)', // Very subtle water
                'fill-opacity': 0.25
            }
        },
        {
            id: 'landuse',
            type: 'fill' as const,
            source: 'mapbox',
            'source-layer': 'landuse',
            paint: {
                'fill-color': 'rgba(255, 255, 255, 0.1)',
                'fill-opacity': 0.3
            }
        },
        {
            id: 'landuse-outline',
            type: 'line' as const,
            source: 'mapbox',
            'source-layer': 'landuse',
            paint: {
                'line-color': 'rgba(255, 255, 255, 0.6)',
                'line-width': 1.5
            }
        },
        {
            id: 'roads',
            type: 'line' as const,
            source: 'mapbox',
            'source-layer': 'road',
            paint: {
                'line-color': 'rgba(255, 255, 255, 0.7)',
                'line-width': 1.5,
                'line-blur': 0.5
            }
        },
        {
            id: 'building',
            type: 'fill' as const,
            source: 'mapbox',
            'source-layer': 'building',
            paint: {
                'fill-color': 'rgba(255, 255, 255, 0.15)',
                'fill-opacity': 0.4
            }
        },
        {
            id: 'building-outline',
            type: 'line' as const,
            source: 'mapbox',
            'source-layer': 'building',
            paint: {
                'line-color': 'rgba(255, 255, 255, 0.5)',
                'line-width': 1
            }
        },
        {
            id: 'place-labels',
            type: 'symbol' as const,
            source: 'mapbox',
            'source-layer': 'place_label',
            layout: {
                'text-field': ['get', 'name'] as any,
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'] as any,
                'text-size': 12
            },
            paint: {
                'text-color': 'rgba(80, 80, 80, 0.9)',
                'text-halo-color': 'rgba(255, 255, 255, 0.8)',
                'text-halo-width': 2
            }
        },
        {
            id: 'road-labels',
            type: 'symbol' as const,
            source: 'mapbox',
            'source-layer': 'road',
            filter: ['has', 'name'] as any,
            layout: {
                'text-field': ['get', 'name'] as any,
                'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'] as any,
                'text-size': 10,
                'symbol-placement': 'line' as any
            },
            paint: {
                'text-color': 'rgba(100, 100, 100, 0.8)',
                'text-halo-color': 'rgba(255, 255, 255, 0.9)',
                'text-halo-width': 1.5
            }
        }
    ]
};

export const MAP_STYLES = {
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    glass: GLASS_MAP_STYLE // Custom glass theme
};

export const VANCOUVER_BOUNDS: [number, number, number, number] = [
    -123.27, 49.19, // Southwest [lng, lat]
    -123.02, 49.32  // Northeast [lng, lat]
];

export const VANCOUVER_CENTER: [number, number] = [-123.12, 49.25];

export default mapboxgl;
