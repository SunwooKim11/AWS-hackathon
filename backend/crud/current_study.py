from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..models.current_study import CurrentStudy
from ..schemas.current_study import CurrentStudyInDB
from datetime import datetime
import uuid

async def create_current_study(db: AsyncSession, current_study: CurrentStudyInDB):
    # Create a new dictionary with the current study data
    current_study_data = current_study.dict()
    
    # Set required fields
    current_time = datetime.utcnow()
    current_study_data["id"] = uuid.uuid4()
    current_study_data["created_at"] = current_time
    current_study_data["updated_at"] = current_time
    
    # Handle vector_embedding_id - convert to UUID if it's a valid UUID string, or set to None if not
    vector_id = current_study_data.get("vector_embedding_id")
    if vector_id:
        try:
            current_study_data["vector_embedding_id"] = uuid.UUID(vector_id)
        except (ValueError, AttributeError):
            # If it's not a valid UUID string, set it to None
            current_study_data["vector_embedding_id"] = None
    
    # Create the CurrentStudy model instance
    db_current_study = CurrentStudy(**current_study_data)
    db.add(db_current_study)
    await db.commit()
    await db.refresh(db_current_study)
    return db_current_study

async def get_current_study(db: AsyncSession, user_id: str, study_id: str):
    result = await db.execute(
        select(CurrentStudy).where(CurrentStudy.user_id == user_id, CurrentStudy.id == study_id)
    )
    return result.scalar_one_or_none()

async def update_current_study(db: AsyncSession, user_id: str, study_id: str, study_update: dict):
    result = await db.execute(
        select(CurrentStudy).where(CurrentStudy.user_id == user_id, CurrentStudy.id == study_id)
    )
    study = result.scalar_one_or_none()
    
    if study:
        for key, value in study_update.items():
            setattr(study, key, value)
        study.updated_at = datetime.utcnow()  # Update the timestamp
        await db.commit()
        await db.refresh(study)
    return study

async def delete_current_study(db: AsyncSession, user_id: str, study_id: str):
    result = await db.execute(
        select(CurrentStudy).where(CurrentStudy.user_id == user_id, CurrentStudy.id == study_id)
    )
    study = result.scalar_one_or_none()
    
    if study:
        await db.delete(study)
        await db.commit()
        return True
    return False