from sqlalchemy.ext.asyncio import AsyncSession
from ..models.interest import Interest
from ..schemas.interest import InterestCreate, InterestInDB
from datetime import datetime
import uuid

async def create_interest(db: AsyncSession, interest: InterestInDB):
    # Create a new dictionary with the interest data plus the timestamp
    interest_data = interest.dict()
    interest_data["created_at"] = datetime.utcnow()
    
    # Create the Interest model instance
    db_interest = Interest(**interest_data)
    db.add(db_interest)
    await db.commit()
    await db.refresh(db_interest)
    return db_interest