from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....db.session import SessionLocal
from ....crud.current_study import create_current_study, get_current_study, update_current_study, delete_current_study
from ....schemas.current_study import CurrentStudy, CurrentStudyCreate, CurrentStudyUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users/{user_id}/current-study", response_model=CurrentStudy)
def add_current_study(user_id: str, current_study: CurrentStudyCreate, db: Session = Depends(get_db)):
    current_study.user_id = user_id
    return create_current_study(db, current_study)

@router.get("/users/{user_id}/current-study/{study_id}", response_model=CurrentStudy)
def read_current_study(user_id: str, study_id: str, db: Session = Depends(get_db)):
    study = get_current_study(db, user_id, study_id)
    if not study:
        raise HTTPException(status_code=404, detail="Current study not found")
    return study

@router.put("/users/{user_id}/current-study/{study_id}", response_model=CurrentStudy)
def update_current_study_endpoint(user_id: str, study_id: str, study_update: CurrentStudyUpdate, db: Session = Depends(get_db)):
    study = update_current_study(db, user_id, study_id, study_update)
    if not study:
        raise HTTPException(status_code=404, detail="Current study not found")
    return study

@router.delete("/users/{user_id}/current-study/{study_id}", response_model=dict)
def delete_current_study_endpoint(user_id: str, study_id: str, db: Session = Depends(get_db)):
    success = delete_current_study(db, user_id, study_id)
    if not success:
        raise HTTPException(status_code=404, detail="Current study not found")
    return {"message": "Current study deleted successfully"}