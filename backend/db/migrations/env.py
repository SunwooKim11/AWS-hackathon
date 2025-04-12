import asyncio
import os
from logging.config import fileConfig
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy import pool
from alembic import context

# 명시적으로 모든 모델을 임포트하여 Alembic이 감지할 수 있게 함
from backend.db.base_class import Base
# Import all models explicitly for Alembic to detect them
from backend.models.user import User
from backend.models.current_study import CurrentStudy
from backend.models.interest import Interest
from backend.models.paper import Paper
from backend.models.tool import Tool
# from backend.models.recommendation import Recommendation

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Alembic Config object
config = context.config

# Set the async database URL
async_db_url = os.getenv("SUPABASE_DB_URL")
config.set_main_option("sqlalchemy.url", async_db_url)

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata for autogenerate support
target_metadata = Base.metadata  # Set target_metadata to Base.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection):
    """Run migrations with a connection."""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
    )

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = create_async_engine(
        config.get_main_option("sqlalchemy.url"),
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())