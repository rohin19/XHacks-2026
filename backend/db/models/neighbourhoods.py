from sqlalchemy import Column, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Neighborhood(Base):
    """
    Neighborhood with id, nickname, and polygon geometry (coordinates).
    """

    __tablename__ = "neighborhoods"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nickname = Column(Text, nullable=False)
    # Polygon: GeoJSON format {"type": "Polygon", "coordinates": [[[lng, lat], ...]]}
    # Or use GeoAlchemy2: Geometry(geometry_type='POLYGON', srid=4326)
    geometry = Column(JSONB, nullable=False)
