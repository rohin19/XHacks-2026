import uuid
from datetime import datetime
from typing import Any, Optional

from sqlalchemy import Column, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class Event(Base):
    """
    Normalized feed table (Supabase events).
    Schema: id, neighborhood_id (UUID), title, type, summary, source,
    location (GeoJSON Point), start_date, end_date, published_at, updated_at, created_at.
    """

    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    neighborhood_id = Column(UUID(as_uuid=True), ForeignKey("neighborhoods.id"), nullable=True)
    title = Column(Text, nullable=True)
    type = Column(Text, nullable=True)  # ROAD_CLOSURE | PROJECT | SERVICE_REQUEST | PERMIT | VOTE
    summary = Column(Text, nullable=True)
    source = Column(Text, nullable=True)

    # GeoJSON Point: {"type": "Point", "coordinates": [lng, lat]} (WGS84, SRID 4326)
    location = Column(Text, nullable=True)
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=False)  # ground truth for ordering

    updated_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)
