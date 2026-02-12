from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/status")
def ai_status() -> dict:
    return {
        "assistant": "offline_stub",
        "capabilities": ["summarize", "categorize", "draft"],
    }

