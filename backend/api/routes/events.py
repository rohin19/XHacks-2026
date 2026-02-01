"""
GET /api/events: query Supabase events by date range and optional event type.
Read-only; ordered by published_at desc.
"""

from datetime import date, datetime
from enum import Enum
from typing import Any, Optional
from uuid import UUID

from fastapi import APIRouter, Query
from pydantic import BaseModel

from api.deps import get_supabase

router = APIRouter()


class EventType(str, Enum):
    ROAD_CLOSURE = "ROAD_CLOSURE"
    SERVICE_REQUEST = "SERVICE_REQUEST"
    CITY_PROJECT = "CITY_PROJECT"
    PROJECT = "PROJECT"
    PERMIT = "PERMIT"
    VOTE = "VOTE"


class EventResponse(BaseModel):
    """Response shape aligned with db.models.events.Event."""

    id: UUID
    neighborhood_id: Optional[UUID] = None
    title: Optional[str] = None
    type: Optional[str] = None
    summary: Optional[str] = None
    source: Optional[str] = None
    location: Optional[Any] = None  # GeoJSON Point dict or string
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    published_at: datetime
    updated_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


@router.get("/events", response_model=list[EventResponse])
def list_events(
    start_date: date = Query(..., description="Start of date range (inclusive), e.g. startOfDay(now)"),
    end_date: date = Query(..., description="End of date range (inclusive), e.g. endOfDay(now)"),
    event_type: Optional[EventType] = Query(None, description="Filter by EVENT_TYPE"),
) -> list[EventResponse]:
    """
    Return events that overlap the query window [from, to].
    Overlap: (start_date is null OR start_date <= to) AND (end_date is null OR end_date >= from).
    Covers: no start + end only, start only, both, or neither (always active).
    Ordered by published_at descending.
    """
    # Query window: from = start of day, to = end of day
    query_from_iso = datetime.combine(start_date, datetime.min.time()).isoformat()
    query_to_iso = datetime.combine(end_date, datetime.max.time()).replace(microsecond=999999).isoformat()

    client = get_supabase()
    # PostgREST: or=(cond1,cond2) with quoted timestamps for reserved chars
    q = (
        client.table("events")
        .select("*")
        .or_(f'end_date.gte."{query_from_iso}",end_date.is.null')
        .or_(f'start_date.lte."{query_to_iso}",start_date.is.null')
    )
    if event_type is not None:
        q = q.eq("type", event_type.value)
    q = q.order("published_at", desc=True)
    r = q.execute()

    return [EventResponse(**row) for row in (r.data or [])]
