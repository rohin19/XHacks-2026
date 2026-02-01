"""
Transform raw 311 API JSON into event payloads for Supabase events table.
Output: dicts with type, start_date/end_date, location (GeoJSON), local_area for neighborhood resolution.
"""

import logging
import re
from datetime import datetime
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

# Internal schema constants for 311
SOURCE_311 = "311"
EVENT_TYPE_SERVICE_REQUEST = "SERVICE_REQUEST"
ZZ_OLD_PREFIX = re.compile(r"^ZZ\s*-\s*OLD\s*[-:]?\s*", re.IGNORECASE)


def _parse_iso8601(value: str | None) -> datetime | None:
    """Parse ISO-8601 timestamp with offset (e.g. -07:00) to timezone-aware datetime."""
    if value is None or (isinstance(value, str) and not value.strip()):
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (ValueError, TypeError) as e:
        logger.warning("Malformed date skipped: %r -> %s", value, e)
        return None


def _point_geojson(lat: float | None, lon: float | None) -> dict[str, Any] | None:
    """Build GeoJSON Point from latitude and longitude (API order: lat, lon; GeoJSON: [lng, lat])."""
    if lat is None or lon is None:
        return None
    try:
        x, y = float(lon), float(lat)
        return {"type": "Point", "coordinates": [x, y]}
    except (TypeError, ValueError):
        return None


def _strip_zz_old(text: str | None) -> str:
    """Remove 'ZZ - OLD' prefix from API text."""
    if text is None or not isinstance(text, str):
        return ""
    return ZZ_OLD_PREFIX.sub("", text).strip() or text.strip()


def _normalize_status(status: str | None) -> str:
    """Map API status to normalized string."""
    if status is None or not isinstance(status, str):
        return "UNKNOWN"
    return status.strip().upper() or "UNKNOWN"


def transform_record(raw: dict[str, Any]) -> dict[str, Any] | None:
    """
    Convert a single raw 311 API record into an event payload dict for Supabase events.

    Output keys: id, neighborhood_id, title, type, summary, source, location (GeoJSON),
    start_date, end_date, published_at, updated_at, created_at, local_area (for resolution).
    """
    if not isinstance(raw, dict):
        return None

    open_ts_str = raw.get("service_request_open_timestamp")
    published_at = _parse_iso8601(open_ts_str)
    if published_at is None:
        logger.warning("Skipping record: missing or invalid service_request_open_timestamp")
        return None

    # Temporal: start_date = open, end_date = close date (nullable for active cases)
    start_date = published_at
    close_date_str = raw.get("service_request_close_date")
    end_date = None
    if close_date_str:
        try:
            if "T" in str(close_date_str):
                end_date = _parse_iso8601(close_date_str)
            else:
                end_date = datetime.fromisoformat(str(close_date_str).strip() + "T00:00:00+00:00")
        except (ValueError, TypeError):
            logger.warning("Malformed service_request_close_date: %r", close_date_str)

    last_modified = raw.get("last_modified_timestamp")
    updated_at = _parse_iso8601(last_modified) if last_modified else None

    # Geospatial: GeoJSON Point from lat/lon
    lat = raw.get("latitude")
    lon = raw.get("longitude")
    location = _point_geojson(lat, lon)

    # Categorization: strip ZZ - OLD from service_request_type; type constant
    service_request_type = _strip_zz_old(raw.get("service_request_type"))
    title = service_request_type or "Service Request"
    status = _normalize_status(raw.get("status"))

    # Action statement for frontend: "{event} happened {location}. Status: ... Closure reason: ..."
    event_label = title
    location_parts = []
    if raw.get("address") and str(raw.get("address")).strip():
        location_parts.append(str(raw.get("address")).strip())
    if raw.get("local_area") and str(raw.get("local_area")).strip():
        location_parts.append(str(raw.get("local_area")).strip())
    if location_parts:
        location_str = " at " + ", ".join(location_parts)
    else:
        location_str = ""
    summary = f"{event_label} happened{location_str}."
    if status and status != "UNKNOWN":
        summary += f" Status: {status}."
    closure_reason = raw.get("closure_reason")
    if closure_reason and str(closure_reason).strip():
        summary += f" Closure reason: {str(closure_reason).strip()}."

    # created_at = published_at for ingested records; updated_at when last modified
    created_at = published_at

    return {
        "id": None,
        "neighborhood_id": None,
        "title": title,
        "type": EVENT_TYPE_SERVICE_REQUEST,
        "summary": summary,
        "source": SOURCE_311,
        "location": location,
        "start_date": start_date,
        "end_date": end_date,
        "published_at": published_at,
        "updated_at": updated_at,
        "created_at": created_at,
        "local_area": raw.get("local_area"),
    }


def transform_batch(raw_records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Convert a list of raw API records into event payload dicts.
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
