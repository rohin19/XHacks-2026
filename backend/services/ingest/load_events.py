"""
Shared loader: insert event payloads into Supabase `events` table.
All ingest sources (311, road_ahead, etc.) use this module to load events.
Uses Supabase client; optionally resolves neighborhood_id from neighborhood name.
"""

import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Any, TypedDict

# Load .env from repo root (backend/services/ingest -> 3 levels to backend, 4 to repo)
_REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent


def _load_dotenv() -> None:
    try:
        from dotenv import load_dotenv
        load_dotenv(_REPO_ROOT / ".env")
    except ImportError:
        pass


_load_dotenv()

from supabase import create_client

logger = logging.getLogger(__name__)

# --- Event payload: exact keys sent to Supabase events table ---
# location: GeoJSON {"type": "Point", "coordinates": [lng, lat]}
# Timestamps: ISO 8601 strings with timezone (timestamptz)
# type: one of ROAD_CLOSURE | PROJECT | SERVICE_REQUEST | PERMIT | VOTE


class EventPayload(TypedDict, total=False):
    id: str | None
    neighborhood_id: str | None
    title: str | None
    type: str | None
    summary: str | None
    source: str | None
    location: dict[str, Any] | None  # GeoJSON Point
    start_date: str | None
    end_date: str | None
    published_at: str  # required
    updated_at: str | None
    created_at: str | None
    # Optional: used by loader to resolve neighborhood_id (not sent to DB)
    neighborhood_name: str


def get_supabase():
    """
    Build Supabase client from sb_url/sb_secret or SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY.
    Use the service_role key for backend writes.
    """
    url = os.environ.get("sb_url") or os.environ.get("SUPABASE_URL")
    key = os.environ.get("sb_secret") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError(
            "Missing sb_url or sb_secret (or SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) in environment. "
            "Use the service_role key (Settings → API in Supabase), not the anon key."
        )
    return create_client(url, key)


def resolve_neighborhood_id_by_name(client, name: str | None) -> str | None:
    """
    Look up neighborhood UUID from Supabase neighborhoods by name.
    Returns None if name is empty or no matching row.
    """
    if not name or not isinstance(name, str) or not name.strip():
        return None
    r = client.table("neighborhoods").select("id").eq("name", name.strip()).limit(1).execute()
    if not r.data or len(r.data) == 0:
        return None
    row = r.data[0]
    return row.get("id")


def _to_iso(dt: datetime | str | None) -> str | None:
    """Convert datetime or ISO string to ISO 8601 string with timezone."""
    if dt is None:
        return None
    if isinstance(dt, str):
        return dt
    if isinstance(dt, datetime):
        return dt.isoformat()
    return None


def _serialize_payload(raw: dict[str, Any]) -> dict[str, Any]:
    """
    Produce a row dict with only the 12 event columns, values JSON-ready.
    - Timestamps (datetime or str) -> ISO string
    - UUID -> str
    - Drop neighborhood_name and any extra keys
    """
    out: dict[str, Any] = {}
    for key in (
        "id", "neighborhood_id", "title", "type", "summary", "source",
        "location", "start_date", "end_date", "published_at", "updated_at", "created_at"
    ):
        if key not in raw:
            if key == "published_at":
                raise ValueError("published_at is required")
            out[key] = None
            continue
        val = raw[key]
        if key in ("start_date", "end_date", "published_at", "updated_at", "created_at"):
            out[key] = _to_iso(val)
        elif key == "id" and val is not None:
            out[key] = str(val) if hasattr(val, "hex") else val
        elif key == "neighborhood_id" and val is not None:
            out[key] = str(val) if hasattr(val, "hex") else val
        else:
            out[key] = val
    return out


def load_events(
    events: list[dict[str, Any]],
    *,
    resolve_neighborhood_by_name: bool = True,
) -> int:
    """
    Insert event payloads into Supabase events table.
    Payloads may include neighborhood_name; if resolve_neighborhood_by_name is True,
    neighborhood_id is set from Supabase neighborhoods.name and neighborhood_name is dropped.

    Each payload must have at least: published_at (and the 12 keys when serialized).
    id can be null so Supabase uses gen_random_uuid().

    Returns the number of rows inserted.
    """
    if not events:
        return 0
    client = get_supabase()
    rows: list[dict[str, Any]] = []
    for ev in events:
        if not isinstance(ev, dict):
            continue
        payload = dict(ev)
        if resolve_neighborhood_by_name and payload.get("neighborhood_id") is None:
            name = payload.pop("neighborhood_name", None) or payload.pop("local_area", None)
            if name:
                nid = resolve_neighborhood_id_by_name(client, name)
                if nid:
                    payload["neighborhood_id"] = nid
        payload.pop("neighborhood_name", None)
        payload.pop("local_area", None)
        try:
            row = _serialize_payload(payload)
            rows.append(row)
        except (ValueError, TypeError) as e:
            logger.warning("Skipping invalid event payload: %s", e)
            continue
    if not rows:
        return 0
    client.table("events").insert(rows).execute()
    logger.info("Inserted %s event(s) into Supabase events", len(rows))
    return len(rows)
