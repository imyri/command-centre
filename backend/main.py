from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import ai, finance, health, productivity, trading
from core.config import settings
from core.logging import configure_logging, get_logger, log_event
from db.session import engine

# Import models to register metadata for Alembic.
from db.base import Base  # noqa: E402
from models import project as _project  # noqa: F401,E402
from models import task as _task  # noqa: F401,E402


configure_logging(settings.log_level)
logger = get_logger("app")

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

app.include_router(health.router)
app.include_router(finance.router)
app.include_router(trading.router)
app.include_router(ai.router)
app.include_router(productivity.router)


@app.on_event("startup")
def _startup() -> None:
    # Engine created on import; this is a hook for future bootstrap steps.
    _ = engine
    log_event(logger, "startup", environment=settings.environment, database_url=settings.database_url)


@app.on_event("shutdown")
def _shutdown() -> None:
    log_event(logger, "shutdown")

