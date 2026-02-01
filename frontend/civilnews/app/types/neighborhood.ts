export interface NeighborhoodProperties {
    id: number;
    name: string;
    slug: string;
    center: [number, number]; // [lng, lat]
}

export interface Neighborhood extends GeoJSON.Feature<GeoJSON.Polygon, NeighborhoodProperties> { }
