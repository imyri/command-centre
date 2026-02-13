from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "command-centre-api"
    environment: str = "local"
    
    # Database
    database_url: str = "sqlite:///./data/command_centre.db"

    # CORS - Allow all connections so your phone can connect
    cors_allow_origins: list[str] = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = ["*"]
    cors_allow_headers: list[str] = ["*"]

    # Logging
    log_level: str = "INFO"

    # AI
    google_api_key: str | None = None


settings = Settings()