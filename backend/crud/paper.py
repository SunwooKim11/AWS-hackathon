from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.paper import Paper
from ..schemas.paper import PaperCreate
from datetime import datetime

async def create_paper(db: AsyncSession, paper: PaperCreate):
    # Convert model dict and add current timestamp for created_at
    paper_dict = paper.dict()
    paper_dict['created_at'] = datetime.now()
    
    db_paper = Paper(**paper_dict)
    db.add(db_paper)
    await db.commit()
    await db.refresh(db_paper)
    return db_paper