from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ....db.session import get_db
from ....crud.current_study import create_current_study, get_current_study, update_current_study, delete_current_study
from ....schemas.current_study import CurrentStudy, CurrentStudyCreate, CurrentStudyUpdate, CurrentStudyInDB

router = APIRouter()

@router.post("/users/{user_id}/current-study", response_model=CurrentStudy)
async def add_current_study(user_id: str, current_study: CurrentStudyCreate, db: AsyncSession = Depends(get_db)):
    # Create a CurrentStudyInDB that includes user_id from the path
    current_study_in_db = CurrentStudyInDB(**current_study.dict(), user_id=user_id)
    return await create_current_study(db, current_study_in_db)

@router.get("/users/{user_id}/current-study/{study_id}", response_model=CurrentStudy)
async def read_current_study(user_id: str, study_id: str, db: AsyncSession = Depends(get_db)):
    study = await get_current_study(db, user_id, study_id)
    if not study:
        raise HTTPException(status_code=404, detail="Current study not found")
    return study

@router.put("/users/{user_id}/current-study/{study_id}", response_model=CurrentStudy)
async def update_current_study_endpoint(user_id: str, study_id: str, study_update: CurrentStudyUpdate, db: AsyncSession = Depends(get_db)):
    study = await update_current_study(db, user_id, study_id, study_update.dict(exclude_unset=True))
    if not study:
        raise HTTPException(status_code=404, detail="Current study not found")
    return study

@router.delete("/users/{user_id}/current-study/{study_id}", response_model=dict)
async def delete_current_study_endpoint(user_id: str, study_id: str, db: AsyncSession = Depends(get_db)):
    success = await delete_current_study(db, user_id, study_id)
    if not success:
        raise HTTPException(status_code=404, detail="Current study not found")
    return {"message": "Current study deleted successfully"}