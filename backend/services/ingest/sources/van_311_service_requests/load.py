"""
Load transformed 311 Event records into PostgreSQL/PostGIS.
Upserts by (source, source_pk); resolves neighborhood_id from local_area; uses context-managed sessions.
"""

import logging
import os
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

# Add backend root for db.models
import sys
from pathlib import Path

_BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))

from db.models.events import Event
from db.models.neighbourhoods import Neighborhood

logger = logging.getLogger(__name__)

# --- Configuration ---
DEFAULT_DATABASE_URL = "postgresql://localhost/xhacks"  # override via DATABASE_URL


def _get_engine():
    """Create engine from DATABASE_URL environment variable."""
    url = os.environ.get("DATABASE_URL", DEFAULT_DATABASE_URL)
    return create_engine(url, pool_pre_ping=True)


_engine = None


def get_engine():
    global _engine
    if _engine is None:
        _engine = _get_engine()
    return _engine


@contextmanager
def session_scope() -> Generator[Session, None, None]:
    """
    Provide a transactional scope for database operations.
    Commits on success, rolls back on exception, always closes the session to prevent leaks.
    """
    engine = get_engine()
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def _resolve_neighborhood_id(session: Session, local_area: str | None) -> int | None:
    """Resolve neighborhood_id from local_area (neighborhood_name) via neighborhoods.nickname."""
    if not local_area or not isinstance(local_area, str) or not local_area.strip():
        return None
    row = session.query(Neighborhood).filter(Neighborhood.nickname == local_area.strip()).first()
    return row.id if row else None


def _apply_neighborhood_id(session: Session, event: Event) -> None:
    """Set event.neighborhood_id from raw_payload.local_area if present."""
    if not event.raw_payload or not isinstance(event.raw_payload, dict):
        return
    local_area = event.raw_payload.get("local_area")
    event.neighborhood_id = _resolve_neighborhood_id(session, local_area)


def upsert_events(events: list[Event]) -> tuple[int, int]:
    """
    Upsert events by (source, source_pk): update if exists, insert otherwise.
    Resolves neighborhood_id from local_area before persisting.
    Uses a single session via context manager.

    Returns:
        (inserted_count, updated_count)
    """
    inserted = 0
    updated = 0

    with session_scope() as session:
        for event in events:
            if not isinstance(event, Event):
                continue
            _apply_neighborhood_id(session, event)

            existing = (
                session.query(Event)
                .filter(Event.source == event.source, Event.source_pk == event.source_pk)
                .first()
            )
            if existing:
                # Update in place (existing row already in session)
                existing.event_type = event.event_type
                existing.title = event.title
                existing.summary = event.summary
                existing.published_at = event.published_at
                existing.starts_at = event.starts_at
                existing.ends_at = event.ends_at
                existing.geom = event.geom
                existing.neighborhood_id = event.neighborhood_id
                existing.url = event.url
                existing.severity = event.severity
                existing.raw_payload = event.raw_payload
                updated += 1
            else:
                session.add(event)
                inserted += 1

    logger.info("Upsert complete: %s inserted, %s updated", inserted, updated)
    return inserted, updated
