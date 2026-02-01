"""
GET /api/neighbourhoods: list all neighbourhoods with id and name.
"""

from uuid import UUID

from fastapi import APIRouter
from pydantic import BaseModel

from api.deps import get_supabase

router = APIRouter()


class NeighbourhoodResponse(BaseModel):
    """Response shape: id and name from neighborhoods table."""

    id: UUID
    name: str

    model_config = {"from_attributes": True}


@router.get("/neighbourhoods", response_model=list[NeighbourhoodResponse])
def list_neighbourhoods() -> list[NeighbourhoodResponse]:
    """
    Return all neighbourhoods from the neighborhoods table (id and name).
    """
    client = get_supabase()
    r = client.table("neighborhoods").select("id, name").execute()
    return [NeighbourhoodResponse(**row) for row in (r.data or [])]
