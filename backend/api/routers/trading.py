from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/trading", tags=["trading"])


@router.get("/positions")
def positions() -> dict:
    return {
        "positions": [
            {"symbol": "SPY", "qty": 10, "avg_price": 420.5},
            {"symbol": "AAPL", "qty": 5, "avg_price": 185.1},
        ]
    }

