// Script to fetch and generate neighborhoods data from Vancouver Open Data API
const fs = require('fs');

const API_URL = 'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/local-area-boundary/records?limit=22';

function slugFromName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function fetchAndGenerateNeighborhoods() {
    try {
        console.log('🔄 Fetching neighborhoods from Vancouver Open Data API...');

        const response = await fetch(API_URL);
        const data = await response.json();

        console.log(`📊 Found ${data.total_count} neighborhoods`);

        // Start building the TypeScript file
        let output = `import { VANCOUVER_CENTER } from './mapbox';
import type { Neighborhood, NeighborhoodProperties } from '../types/neighborhood';

export const NEIGHBORHOODS: GeoJSON.FeatureCollection<GeoJSON.Polygon, NeighborhoodProperties> = {
  type: "FeatureCollection",
  features: [
`;

        // Process each neighborhood
        data.results.forEach((neighborhood, index) => {
            const name = neighborhood.name;
            const coords = neighborhood.geom.geometry.coordinates;
            const center = [neighborhood.geo_point_2d.lon, neighborhood.geo_point_2d.lat];
            const slug = slugFromName(name);

            output += `    {
      type: "Feature",
      properties: {
        id: ${index + 1},
        name: "${name}",
        slug: "${slug}",
        center: [${center[0]}, ${center[1]}]
      },
      geometry: {
        type: "Polygon",
        coordinates: ${JSON.stringify(coords)}
      }
    }${index < data.results.length - 1 ? ',' : ''}
`;
        });

        // Close the file
        output += `  ]
};

// Helper functions
export function getNeighborhoodBySlug(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.features.find(
    (f) => f.properties.slug === slug
  ) as Neighborhood | undefined;
}

export function getNeighborhoodCenter(slug: string): [number, number] {
  const neighborhood = getNeighborhoodBySlug(slug);
  return neighborhood?.properties.center || VANCOUVER_CENTER;
}

export function getAllNeighborhoodNames(): string[] {
  return NEIGHBORHOODS.features.map((f) => f.properties.name);
}
`;

        // Write to file
        fs.writeFileSync('app/lib/neighborhoods.ts', output);

        console.log('✅ Successfully generated app/lib/neighborhoods.ts');
        console.log(`📍 Included all ${data.results.length} neighborhoods with accurate coordinates`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fetchAndGenerateNeighborhoods();
