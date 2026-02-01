from sqlalchemy import Column, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func
from sqlalchemy import DateTime

Base = declarative_base()


class Neighborhood(Base):
    """
    Neighborhood: id (uuid), city_id, name, boundary and label_point geometry.
    Matches table public.neighborhoods. Geometry columns require GeoAlchemy2 for full ORM mapping.
    """

    __tablename__ = "neighborhoods"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    city_id = Column(PG_UUID(as_uuid=True), ForeignKey("cities.id", ondelete="CASCADE"), nullable=True)
    name = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=True)
    # boundary geometry not null, label_point geometry null — map with GeoAlchemy2 if needed
