"""Memory Palace routes."""

from fastapi import APIRouter
from pydantic import BaseModel

from ursaki.memory_palace.terrain_generator import TerrainMap, generate_terrain
from ursaki.models import MemoryNode

router = APIRouter(prefix="/memory-palace", tags=["memory-palace"])

_memory_store: dict[str, list[MemoryNode]] = {}


class SaveMemoryRequest(BaseModel):
    nodes: list[MemoryNode]


@router.get("/{user_id}", response_model=TerrainMap)
async def get_memory_palace(user_id: str) -> TerrainMap:
    nodes = _memory_store.get(user_id, [])
    return generate_terrain(nodes)


@router.put("/{user_id}")
async def save_memory_palace(user_id: str, body: SaveMemoryRequest) -> dict[str, str]:
    _memory_store[user_id] = body.nodes
    return {"status": "saved"}
