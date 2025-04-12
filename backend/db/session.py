from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from ..core.settings import settings

# Create an async engine
engine = create_async_engine(settings.SUPABASE_DB_URL, future=True, echo=True)

# Create an async session factory
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with async_session() as session:
        yield session

