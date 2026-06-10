"""3D Memory Palace terrain generator."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from ursaki.models import MemoryNode

BiomeType = Literal[
    "foggy_mountain",
    "meadow",
    "ocean_depth",
    "volcanic",
    "crystal_cave",
]

BIOME_MAP: dict[str, BiomeType] = {
    "anxiety": "foggy_mountain",
    "joy": "meadow",
    "sadness": "ocean_depth",
    "anger": "volcanic",
    "calm": "crystal_cave",
}


class Biome(BaseModel):
    type: BiomeType
    palette: list[str]
    particleEffect: str | None = None


class TerrainNode(BaseModel):
    id: str
    emotionType: str
    intensity: float
    date: str
    spatialCoords: tuple[float, float, float]
    biomeType: BiomeType
    elevation: float
    fogDensity: float
    regionId: str


class TerrainMap(BaseModel):
    nodes: list[TerrainNode]
    biomes: list[Biome]


BIOME_CONFIG: dict[BiomeType, Biome] = {
    "foggy_mountain": Biome(type="foggy_mountain", palette=["#6B7280", "#9CA3AF", "#374151"]),
    "meadow": Biome(type="meadow", palette=["#86EFAC", "#4ADE80", "#FDE047"]),
    "ocean_depth": Biome(
        type="ocean_depth",
        palette=["#1E3A5F", "#2563EB", "#60A5FA"],
        particleEffect="slow_bubbles",
    ),
    "volcanic": Biome(type="volcanic", palette=["#DC2626", "#991B1B", "#F97316"]),
    "crystal_cave": Biome(type="crystal_cave", palette=["#67E8F9", "#22D3EE", "#A5F3FC"]),
}


def _region_id(date_str: str) -> str:
    dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    year, week, _ = dt.isocalendar()
    return f"{year}-W{week:02d}"


def _elevation_for_biome(biome: BiomeType, intensity: float) -> float:
    mapping = {
        "foggy_mountain": 0.5 + intensity * 0.5,
        "meadow": 0.1 + intensity * 0.2,
        "ocean_depth": -0.3 - intensity * 0.4,
        "volcanic": 0.6 + intensity * 0.4,
        "crystal_cave": 0.3,
    }
    return mapping.get(biome, 0.3)


def _fog_for_biome(biome: BiomeType, intensity: float) -> float:
    if biome == "foggy_mountain":
        return 0.4 + intensity * 0.5
    if biome == "volcanic":
        return 0.2 + intensity * 0.3
    return 0.0


def generate_terrain(memory_nodes: list[MemoryNode]) -> TerrainMap:
    """Generate navigable terrain from emotional history."""
    terrain_nodes: list[TerrainNode] = []
    used_biomes: set[BiomeType] = set()

    for i, node in enumerate(memory_nodes):
        emotion_key = node.emotionType.lower()
        biome_type = BIOME_MAP.get(emotion_key, "crystal_cave")
        used_biomes.add(biome_type)

        x, y, z = node.spatialCoords
        if x == 0 and y == 0 and z == 0:
            x = (i % 10) * 2.0 - 9.0
            z = (i // 10) * 2.0 - 9.0
            y = _elevation_for_biome(biome_type, node.intensity)

        terrain_nodes.append(
            TerrainNode(
                id=node.id,
                emotionType=node.emotionType,
                intensity=node.intensity,
                date=node.date,
                spatialCoords=(x, y, z),
                biomeType=biome_type,
                elevation=_elevation_for_biome(biome_type, node.intensity),
                fogDensity=_fog_for_biome(biome_type, node.intensity),
                regionId=_region_id(node.date),
            )
        )

    biomes = [BIOME_CONFIG[b] for b in used_biomes if b in BIOME_CONFIG]
    return TerrainMap(nodes=terrain_nodes, biomes=biomes)
