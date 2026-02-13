from __future__ import annotations

import random
from fastapi import APIRouter

router = APIRouter(prefix="/finance", tags=["finance"])


@router.get("/summary")
def finance_summary() -> dict:
    # Base values
    base_cash = 1250.75
    base_nw = 15250.12
    
    # Create a random fluctuation between -2% and +2%
    # This simulates "market movement" every time you load the page
    market_mood = random.uniform(0.98, 1.02)
    
    return {
        "cash": {"currency": "USD", "amount": round(base_cash, 2)},
        # Net worth changes with the market!
        "net_worth": {"currency": "USD", "amount": round(base_nw * market_mood, 2)},
        "updated_at": None,
    }