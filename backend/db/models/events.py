import uuid
from datetime import datetime
from typing import Any, Optional

from sqlalchemy import Column, DateTime, ForeignKey, Integer, SmallInteger, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class Event(Base):
    """
    Normalized feed table
    """

    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source = Column(Text, nullable=False)  # e.g., road_ahead, 311, permits, council_votes
    source_pk = Column(Text, nullable=False)  # source unique ID as string
    event_type = Column(Text, nullable=False)  # ROAD_CLOSURE | PROJECT | SERVICE_REQUEST | PERMIT | VOTE | ...
    title = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)

    published_at = Column(DateTime(timezone=True), nullable=False)  # CANONICAL FEED TIME (sort/filter)
    starts_at = Column(DateTime(timezone=True), nullable=True)  # when impact begins
    ends_at = Column(DateTime(timezone=True), nullable=True)  # when impact ends

    # GEOMETRY(GEOMETRY, 4326) - use GeoAlchemy2 if available: Geometry(geometry_type='GEOMETRY', srid=4326)
    geom = Column(Text, nullable=True)  # WKT or use GeoAlchemy2 Geometry(geometry_type='GEOMETRY', srid=4326)
    neighborhood_id = Column(Integer, ForeignKey("neighborhoods.id"), nullable=True)

    url = Column(Text, nullable=True)
    severity = Column(SmallInteger, nullable=False, default=0)
    raw_payload = Column(JSONB, nullable=True)  # optional: store normalized subset for quick details

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
