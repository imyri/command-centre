from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "command-centre-api"
    environment: str = "local"

    # SQLite initial, migration-ready for Postgres.
    # Examples:
    # - sqlite:///./data/command_centre.db
    # - postgresql+psycopg://user:pass@localhost:5432/command_centre
    database_url: str = "sqlite:///./data/command_centre.db"

    cors_allow_origins: list[str] = ["http://localhost:3000"]
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = ["*"]
    cors_allow_headers: list[str] = ["*"]

    log_level: str = "INFO"


settings = Settings()

