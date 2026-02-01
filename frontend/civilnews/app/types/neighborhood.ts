export interface NeighborhoodProperties {
    id: string; // Changed to string to support Supabase UUIDs
    name: string;
    slug: string;
    center: [number, number]; // [lng, lat]
}

export interface Neighborhood extends GeoJSON.Feature<GeoJSON.Polygon, NeighborhoodProperties> { }
