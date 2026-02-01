"""
Synchronize Vancouver local-area-boundary (neighbourhoods) from the City of Vancouver
Open Data API into the local Neighbourhood domain model.
"""

import sys
from pathlib import Path

# Ensure backend is on path when running from any working directory
_BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))

import requests
from db.models.neighbourhoods import Neighborhood

# --- Configuration ---
API_BASE = "https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/local-area-boundary/records"
DEFAULT_LIMIT = 25
REQUIRED_KEYS = ("name", "geom")


def fetch_data(limit: int = DEFAULT_LIMIT, offset: int = 0) -> dict:
    """
    Perform a GET request to the Vancouver Open Data API for local-area-boundary.
    Returns the full JSON response (includes total_count and results).
    """
    params = {"limit": limit, "offset": offset}
    try:
        response = requests.get(API_BASE, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise RuntimeError(f"Failed to fetch local-area-boundary: {e}") from e


def extract_centroid(record: dict) -> tuple[float, float] | None:
    """
    Extract centroid (lon, lat) from geo_point_2d if present.
    API provides lon and lat; returns (longitude, latitude).
    """
    point = record.get("geo_point_2d")
    if not point or not isinstance(point, dict):
        return None
    lon = point.get("lon")
    lat = point.get("lat")
    if lon is None or lat is None:
        return None
    try:
        return (float(lon), float(lat))
    except (TypeError, ValueError):
        return None


def extract_boundary_geojson(record: dict) -> dict | None:
    """
    Extract boundary as GeoJSON Polygon from geom.geometry.
    Returns {"type": "Polygon", "coordinates": [[[lng, lat], ...]]} for model.geometry.
    """
    geom = record.get("geom")
    if not geom or not isinstance(geom, dict):
        return None
    geometry = geom.get("geometry")
    if not geometry or not isinstance(geometry, dict):
        return None
    coords = geometry.get("coordinates")
    geom_type = geometry.get("type", "Polygon")
    if coords is None:
        return None
    return {"type": geom_type, "coordinates": coords}


def map_to_model(record: dict) -> Neighborhood | None:
    """
    Map a single API record to a Neighbourhood model instance.
    Validates required keys and geometry before instantiating.
    """
    # Type safety: validate expected keys exist
    missing = [k for k in REQUIRED_KEYS if k not in record]
    if missing:
        return None

    name = record.get("name")
    if name is None or (isinstance(name, str) and not name.strip()):
        return None

    boundary = extract_boundary_geojson(record)
    if boundary is None:
        return None

    # Centroid available for future use (e.g. if model gains a centroid field)
    _centroid = extract_centroid(record)

    return Neighborhood(
        nickname=name.strip(),
        geometry=boundary,
    )


def prepare_for_insertion(payload: dict) -> list[Neighborhood]:
    """
    Iterate through the API results array and build Neighbourhood instances
    ready for database insertion. Skips records that fail validation.
    """
    results = payload.get("results")
    if not isinstance(results, list):
        return []

    # Pagination: total_count available for scaling (e.g. fetch all pages)
    # total_count = payload.get("total_count", 0)
    # To fetch all: loop with offset += limit until offset >= total_count

    neighbourhoods: list[Neighborhood] = []
    for record in results:
        if not isinstance(record, dict):
            continue
        instance = map_to_model(record)
        if instance is not None:
            neighbourhoods.append(instance)
    return neighbourhoods


def sync(limit: int = DEFAULT_LIMIT, offset: int = 0) -> list[Neighborhood]:
    """
    Fetch from API, transform to model instances, and return list ready for DB insert.
    """
    data = fetch_data(limit=limit, offset=offset)
    return prepare_for_insertion(data)


if __name__ == "__main__":
    try:
        rows = sync(limit=DEFAULT_LIMIT)
        print(f"Prepared {len(rows)} neighbourhood(s) for insertion.")
        for n in rows:
            print(f"  - {n.nickname}")
    except RuntimeError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
