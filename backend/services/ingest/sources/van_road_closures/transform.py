"""
Transform Road Ahead road closure records into event payloads for Supabase events table.
Output: dicts with type, dates, location (GeoJSON), and optional neighborhood_name.
"""

import logging
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger(__name__)

# Internal schema constants for Road Ahead
SOURCE_ROAD_AHEAD = "road_ahead_closures"
EVENT_TYPE_ROAD_CLOSURE = "ROAD_CLOSURE"


def _parse_date(value: str | None) -> datetime | None:
    """Parse a date or ISO-8601 timestamp to timezone-aware datetime."""
    if value is None or (isinstance(value, str) and not value.strip()):
        return None
    try:
        text = str(value).strip()
        if "T" in text:
            return datetime.fromisoformat(text.replace("Z", "+00:00"))
        return datetime.fromisoformat(text + "T00:00:00+00:00")
    except (ValueError, TypeError) as e:
        logger.warning("Malformed date skipped: %r -> %s", value, e)
        return None


def _point_geojson(point: dict[str, Any] | None) -> dict[str, Any] | None:
    """Build GeoJSON Point from API geo_point_2d {lon, lat}."""
    if not point or not isinstance(point, dict):
        return None
    lon = point.get("lon")
    lat = point.get("lat")
    if lon is None or lat is None:
        return None
    try:
        return {"type": "Point", "coordinates": [float(lon), float(lat)]}
    except (TypeError, ValueError):
        return None


def _build_summary(record: dict[str, Any]) -> str:
    """Assemble a short summary from known fields."""
    parts: list[str] = []
    location = record.get("location")
    comp_date = record.get("comp_date")
    url_link = record.get("url_link")

    if location:
        parts.append(f"Road closure: {location}")
    if comp_date:
        parts.append(f"Est. completion: {comp_date}")
    if url_link:
        parts.append(f"See more: {url_link}")

    return "; ".join(parts) if parts else "Road closure update"


def transform_record(raw: dict[str, Any]) -> dict[str, Any] | None:
    """
    Convert a single Road Ahead record into an event payload dict for Supabase events.

    Output keys: id, neighborhood_id, title, type, summary, source, location (GeoJSON),
    start_date, end_date, published_at, updated_at, created_at, neighborhood_name.
    """
    if not isinstance(raw, dict):
        return None

    # Use comp_date as canonical published_at (required by loader)
    comp_date = raw.get("comp_date")
    published_at = datetime.now(timezone.utc)
    if published_at is None:
        logger.warning("Skipping record: missing or invalid comp_date")
        return None


    start_date = None
    end_date = _parse_date(comp_date)

    # Geospatial: GeoJSON Point from geo_point_2d
    location = _point_geojson(raw.get("geo_point_2d"))

    title = raw.get("project") or "Road Closure"
    summary = _build_summary(raw)

    updated_at = None

    return {
        "id": None,
        "neighborhood_id": None,
        "title": title,
        "type": EVENT_TYPE_ROAD_CLOSURE,
        "summary": summary,
        "source": SOURCE_ROAD_AHEAD,
        "location": location,
        "start_date": start_date,
        "end_date": end_date,
        "published_at": published_at,
        "updated_at": updated_at,
        # "created_at": created_at,
        "neighborhood_name": None,
    }


def transform_batch(raw_records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Convert a list of Road Ahead records into event payload dicts.
    Logs transformation failures without crashing the batch; returns only successful events.
    """
    events: list[dict[str, Any]] = []
    for i, raw in enumerate(raw_records):
        try:
            ev = transform_record(raw)
            if ev is not None:
                events.append(ev)
        except Exception as e:
            logger.warning("Transform failed for record index %s: %s", i, e, exc_info=False)
    return events
