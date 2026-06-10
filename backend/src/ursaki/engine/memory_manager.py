"""Emotional memory manager — ChromaDB + LlamaIndex context window builder."""

from __future__ import annotations

import json
import logging
from pathlib import Path

from ursaki.config import settings
from ursaki.models import EmotionSnapshot

logger = logging.getLogger(__name__)

COLLECTION_NAME = "emotional_memory"


class MemoryManager:
    """Manages emotional memory embeddings in local ChromaDB."""

    def __init__(self) -> None:
        self._client = None
        self._collection = None
        self._interactions: dict[str, list[str]] = {}

    def _ensure_collection(self) -> None:
        if self._collection is not None:
            return
        try:
            import chromadb

            persist_dir = Path(settings.chroma_persist_dir)
            persist_dir.mkdir(parents=True, exist_ok=True)
            self._client = chromadb.PersistentClient(path=str(persist_dir))
            self._collection = self._client.get_or_create_collection(COLLECTION_NAME)
        except Exception as exc:
            logger.warning("ChromaDB unavailable, using in-memory fallback: %s", exc)
            self._collection = None

    def embed_emotion(self, user_id: str, snapshot: EmotionSnapshot) -> None:
        """Embed an EmotionSnapshot into ChromaDB."""
        self._ensure_collection()
        doc_id = f"{user_id}_{snapshot.timestamp}"
        document = (
            f"valence={snapshot.valence} arousal={snapshot.arousal} "
            f"dominance={snapshot.dominance} source={snapshot.source}"
        )
        if self._collection is not None:
            self._collection.upsert(
                ids=[doc_id],
                documents=[document],
                metadatas=[{"user_id": user_id, "snapshot": snapshot.model_dump_json()}],
            )

    def retrieve_similar_emotions(
        self,
        user_id: str,
        current: EmotionSnapshot,
        top_k: int = 5,
    ) -> list[EmotionSnapshot]:
        """Retrieve top-k similar emotional memories."""
        self._ensure_collection()
        query = (
            f"valence={current.valence} arousal={current.arousal} "
            f"dominance={current.dominance}"
        )
        if self._collection is None:
            return []

        try:
            results = self._collection.query(
                query_texts=[query],
                n_results=top_k,
                where={"user_id": user_id},
            )
            snapshots: list[EmotionSnapshot] = []
            for meta in results.get("metadatas", [[]])[0]:
                raw = meta.get("snapshot", "{}")
                snapshots.append(EmotionSnapshot.model_validate_json(raw))
            return snapshots
        except Exception as exc:
            logger.warning("Similar emotion retrieval failed: %s", exc)
            return []

    def record_interaction(self, user_id: str, user_msg: str, assistant_msg: str) -> None:
        """Store last interactions for context window."""
        if user_id not in self._interactions:
            self._interactions[user_id] = []
        self._interactions[user_id].append(f"User: {user_msg}\nAssistant: {assistant_msg}")
        self._interactions[user_id] = self._interactions[user_id][-10:]

    def build_context_window(
        self,
        user_id: str,
        current_snapshot: EmotionSnapshot | None = None,
    ) -> str:
        """Build LlamaIndex-style context: last 10 interactions + 5 similar memories."""
        parts: list[str] = []

        recent = self._interactions.get(user_id, [])[-10:]
        if recent:
            parts.append("## Recent Interactions\n" + "\n---\n".join(recent))

        if current_snapshot is not None:
            similar = self.retrieve_similar_emotions(user_id, current_snapshot, top_k=5)
            if similar:
                memory_lines = [
                    f"- {s.timestamp}: V={s.valence} A={s.arousal} D={s.dominance}"
                    for s in similar
                ]
                parts.append("## Similar Emotional Memories\n" + "\n".join(memory_lines))

        return "\n\n".join(parts) if parts else "No prior context available."


memory_manager = MemoryManager()
