"""
Transform raw 311 API JSON into structured Event-ready records.
Handles temporal normalization, geospatial mapping, nullables, and categorization.
"""

import logging
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

# Ensure backend root is on path for db.models
_BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))

from db.models.events import Event

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
        # fromisoformat handles +00:00, -07:00, etc.
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (ValueError, TypeError) as e:
        logger.warning("Malformed date skipped: %r -> %s", value, e)
        return None


def _point_wkt(lat: float | None, lon: float | None) -> str | None:
    """Build WKT POINT from latitude and longitude (API order: lat, lon; WKT: lon lat)."""
    if lat is None or lon is None:
        return None
    try:
        x, y = float(lon), float(lat)
        return f"POINT({x} {y})"
    except (TypeError, ValueError):
        return None


def _strip_zz_old(text: str | None) -> str:
    """Remove 'ZZ - OLD' prefix from API text."""
    if text is None or not isinstance(text, str):
        return ""
    return ZZ_OLD_PREFIX.sub("", text).strip() or text.strip()


def _build_source_pk(open_ts: str | None, address: str | None) -> str:
    """Unique key for upsert: service_request_open_timestamp + address."""
    ts = (open_ts or "").strip()
    addr = (address or "").strip()
    return f"{ts}|{addr}" if ts else addr or "unknown"


def _normalize_status(status: str | None) -> str:
    """Map API status to internal current_state (stored in raw_payload)."""
    if status is None or not isinstance(status, str):
        return "UNKNOWN"
    return status.strip().upper() or "UNKNOWN"


def transform_record(raw: dict[str, Any]) -> Event | None:
    """
    Convert a single raw 311 API record into an Event instance.

    - Temporal: service_request_open_timestamp -> published_at, starts_at; last_modified_timestamp in raw_payload.
    - Geospatial: latitude + longitude -> geom as WKT POINT.
    - Nullable: closure_reason, service_request_close_date (active cases) handled; stored in raw_payload.
    - Categorization: department -> origin_dept, service_request_type -> event_type (strip ZZ - OLD), channel in raw_payload.

    Returns None on unrecoverable failure (e.g. missing required timestamps); logs warnings for skipped fields.
    """
    if not isinstance(raw, dict):
        return None

    open_ts_str = raw.get("service_request_open_timestamp")
    published_at = _parse_iso8601(open_ts_str)
    if published_at is None:
        logger.warning("Skipping record: missing or invalid service_request_open_timestamp")
        return None

    address = raw.get("address")
    source_pk = _build_source_pk(open_ts_str, address if address is None else str(address))

    # Temporal: starts_at = open, ends_at = close date (nullable for active cases)
    starts_at = published_at
    close_date_str = raw.get("service_request_close_date")
    ends_at = None
    if close_date_str:
        try:
            # API may return date only "2025-09-26"
            if "T" in str(close_date_str):
                ends_at = _parse_iso8601(close_date_str)
            else:
                ends_at = datetime.fromisoformat(str(close_date_str).strip() + "T00:00:00+00:00")
        except (ValueError, TypeError):
            logger.warning("Malformed service_request_close_date: %r", close_date_str)

    last_modified = raw.get("last_modified_timestamp")
    last_modified_dt = _parse_iso8601(last_modified) if last_modified else None

    # Geospatial: unified Point from lat/lon
    lat = raw.get("latitude")
    lon = raw.get("longitude")
    geom = _point_wkt(lat, lon)

    # Categorization: strip ZZ - OLD from service_request_type for display; event_type constant
    service_request_type = _strip_zz_old(raw.get("service_request_type"))
    title = service_request_type or "Service Request"
    status = _normalize_status(raw.get("status"))
    summary_parts = [f"Status: {status}"]
    if raw.get("local_area"):
        summary_parts.append(f"Area: {raw.get('local_area')}")
    summary = "; ".join(summary_parts)

    # raw_payload: origin_dept, current_state, channel, nullable closure fields, local_area for FK resolution
    raw_payload: dict[str, Any] = {
        "origin_dept": raw.get("department"),
        "current_state": status,
        "channel": raw.get("channel"),
        "closure_reason": raw.get("closure_reason"),
        "service_request_close_date": close_date_str,
        "last_modified_timestamp": last_modified_dt.isoformat() if last_modified_dt else None,
        "local_area": raw.get("local_area"),
    }

    return Event(
        source=SOURCE_311,
        source_pk=source_pk,
        event_type=EVENT_TYPE_SERVICE_REQUEST,
        title=title,
        summary=summary,
        published_at=published_at,
        starts_at=starts_at,
        ends_at=ends_at,
        geom=geom,
        neighborhood_id=None,  # Resolved in load.py from local_area -> neighborhoods.id
        url=None,
        raw_payload=raw_payload,
    )


def transform_batch(raw_records: list[dict[str, Any]]) -> list[Event]:
    """
    Convert a list of raw API records into Event instances.
    Logs transformation failures without crashing the batch; returns only successful events.
    """
    events: list[Event] = []
    for i, raw in enumerate(raw_records):
        try:
            ev = transform_record(raw)
            if ev is not None:
                events.append(ev)
        except Exception as e:
            logger.warning("Transform failed for record index %s: %s", i, e, exc_info=False)
    return events
