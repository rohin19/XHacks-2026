"""
Seed script: load Vancouver local-area-boundary into Supabase (cities + neighborhoods).
Uses sb_url and sb_secret from .env; upserts city then bulk upserts neighborhoods with
PostGIS geometry (boundary, label_point) in SRID 4326.
"""

import os
import sys
from pathlib import Path

# Repo root for .env (backend/services/ingest/sources/van_local_area_boundary -> 5 levels up)
_REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent.parent
_BACKEND_ROOT = _REPO_ROOT / "backend"

if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))

# Load .env from repo root
def _load_dotenv():
    try:
        from dotenv import load_dotenv
        load_dotenv(_REPO_ROOT / ".env")
    except ImportError:
        pass


_load_dotenv()

from supabase import create_client

# Import fetch helpers (same package)
from .fetch import (
    API_BASE,
    fetch_data,
    extract_boundary_geojson,
    extract_centroid,
    REQUIRED_KEYS,
)

# --- Configuration ---
CITY_NAME = "Vancouver"
# PostGIS expects GeoJSON; coordinates are [longitude, latitude] (SRID 4326)


def get_supabase():
    """
    Build Supabase client from sb_url and sb_secret.
    Use the service_role key (not anon) for backend writes/upserts; anon is for frontend reads.
    Supabase dashboard: Settings → API → service_role (secret).
    """
    url = os.environ.get("sb_url") or os.environ.get("SUPABASE_URL")
    key = os.environ.get("sb_secret") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError(
            "Missing sb_url or sb_secret (or SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) in environment. "
            "For this script use the service_role key (Settings → API in Supabase), not the anon key."
        )
    return create_client(url, key)


def ensure_closed_polygon(coords: list) -> list:
    """Ensure polygon ring is closed: first and last coordinate pairs identical."""
    if not coords or len(coords) < 2:
        return coords
    first = coords[0]
    last = coords[-1]
    if first[0] != last[0] or first[1] != last[1]:
        coords = list(coords) + [first]
    return coords


def record_to_neighborhood_row(record: dict, city_id: str) -> dict | None:
    """
    Map one API record to a Supabase neighborhoods row.
    boundary: GeoJSON Polygon (SRID 4326), label_point: GeoJSON Point.
    """
    missing = [k for k in REQUIRED_KEYS if k not in record]
    if missing:
        return None

    name = record.get("name")
    if not name or (isinstance(name, str) and not name.strip()):
        return None

    boundary_geojson = extract_boundary_geojson(record)
    if not boundary_geojson:
        return None

    # Close polygon if needed (PostGIS expects closed rings)
    coords = boundary_geojson.get("coordinates")
    if coords and isinstance(coords, list) and len(coords) > 0:
        coords[0] = ensure_closed_polygon(coords[0])
    boundary_geojson["coordinates"] = coords

    # label_point from geo_point_2d (lon, lat) -> GeoJSON Point
    centroid = extract_centroid(record)
    if centroid is None:
        return None
    lon, lat = centroid
    label_point_geojson = {"type": "Point", "coordinates": [lon, lat]}

    # Supabase/PostgREST with PostGIS often accepts GeoJSON for geometry columns
    return {
        "city_id": city_id,
        "name": name.strip(),
        "boundary": boundary_geojson,
        "label_point": label_point_geojson,
    }


def ensure_city(client, name: str = CITY_NAME, api_url: str | None = None) -> str:
    """
    Upsert city by name; return its UUID.
    Uses name as unique key to avoid duplicate cities.
    """
    row = {"name": name, "api_url": api_url or API_BASE}
    client.table("cities").upsert(row, on_conflict="name").execute()
    r = client.table("cities").select("id").eq("name", name).single().execute()
    if not r.data or not r.data.get("id"):
        raise RuntimeError(f"Failed to get city id for {name}")
    return r.data["id"]


def upsert_neighborhoods(client, city_id: str, limit: int = 25, offset: int = 0) -> int:
    """
    Fetch from API, transform to neighborhood rows, bulk upsert into Supabase.
    Upsert keyed on name (within city) for boundary updates. Returns count upserted.
    """
    payload = fetch_data(limit=limit, offset=offset)
    results = payload.get("results") or []
    rows = []
    for rec in results:
        if not isinstance(rec, dict):
            continue
        row = record_to_neighborhood_row(rec, city_id)
        if row is not None:
            rows.append(row)

    if not rows:
        return 0

    # Bulk upsert: unique on (city_id, name) allows updates by name
    client.table("neighborhoods").upsert(rows, on_conflict="city_id,name").execute()
    return len(rows)


def run_seed(limit: int = 25, offset: int = 0) -> None:
    """
    Phase 2: Ensure city exists and get id.
    Phase 3: Fetch boundaries, transform, bulk upsert neighborhoods.
    Phase 4: Print summary.
    """
    client = get_supabase()
    city_id = ensure_city(client, CITY_NAME, API_BASE)
    count = upsert_neighborhoods(client, city_id, limit=limit, offset=offset)
    print(f"Created City: {CITY_NAME} ({city_id}) with {count} Neighborhoods.")


if __name__ == "__main__":
    try:
        run_seed(limit=25, offset=0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
