import os
from dotenv import load_dotenv
from pathlib import Path

# Explicitly load the .env file from the backend directory
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "AWS Hackathon Backend"
    PROJECT_VERSION: str = "1.0.0"

    # Database settings
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "password")
    DB_NAME: str = os.getenv("DB_NAME", "aws_hackathon")
     # Supabase 설정
    SUPABASE_DB_URL: str = os.getenv("SUPABASE_DB_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "your-supabase-key")

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

   
settings = Settings()