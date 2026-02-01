import * as turf from '@turf/turf';
import { NEIGHBORHOODS } from './neighborhoods';
import type { Neighborhood } from '../types/neighborhood';

export interface GeocodeResult {
    place_name: string;
    center: [number, number]; // [lng, lat]
    text: string;
}

export interface GeocodeResponse {
    features: GeocodeResult[];
}

/**
 * Geocode an address using Mapbox Geocoding API
 */
export async function geocodeAddress(query: string): Promise<GeocodeResponse> {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${token}&` +
        `bbox=-123.27,49.19,-123.02,49.32&` + // Vancouver bounds
        `limit=5&` +
        `types=address,poi` // Only addresses and points of interest
    );

    if (!response.ok) {
        throw new Error('Geocoding failed');
    }

    return response.json();
}

/**
 * Find which neighborhood a point belongs to using point-in-polygon
 */
export function findNeighborhood(point: [number, number]): Neighborhood | null {
    const turfPoint = turf.point(point);

    for (const feature of NEIGHBORHOODS.features) {
        const polygon = turf.polygon(feature.geometry.coordinates);

        if (turf.booleanPointInPolygon(turfPoint, polygon)) {
            return feature as Neighborhood;
        }
    }

    return null;
}

/**
 * Check if a point is within Vancouver bounds
 */
export function isWithinVancouver(point: [number, number]): boolean {
    const [lng, lat] = point;
    return lng >= -123.27 && lng <= -123.02 && lat >= 49.19 && lat <= 49.32;
}
