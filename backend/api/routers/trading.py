from __future__ import annotations

import random
from fastapi import APIRouter

router = APIRouter(prefix="/trading", tags=["trading"])


@router.get("/positions")
def positions() -> dict:
    # Simulate live tickers moving
    spy_price = 420.50 + random.uniform(-5.0, 5.0)  # Moves up/down by $5
    aapl_price = 185.10 + random.uniform(-2.0, 2.0) # Moves up/down by $2
    
    return {
        "positions": [
            {"symbol": "SPY", "qty": 10, "avg_price": round(spy_price, 2)},
            {"symbol": "AAPL", "qty": 5, "avg_price": round(aapl_price, 2)},
            # Let's add a wild crypto coin just for fun
            {"symbol": "BTC", "qty": 0.5, "avg_price": round(45000 + random.uniform(-500, 500), 2)},
        ]
    }