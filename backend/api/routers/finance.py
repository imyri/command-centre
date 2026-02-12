from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/finance", tags=["finance"])


@router.get("/summary")
def finance_summary() -> dict:
    return {
        "cash": {"currency": "USD", "amount": 1250.75},
        "net_worth": {"currency": "USD", "amount": 15250.12},
        "updated_at": None,
    }

