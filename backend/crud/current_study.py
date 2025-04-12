from sqlalchemy.orm import Session
from ..models.current_study import CurrentStudy
from ..schemas.current_study import CurrentStudyCreate

def create_current_study(db: Session, current_study: CurrentStudyCreate):
    db_current_study = CurrentStudy(**current_study.dict())
    db.add(db_current_study)
    db.commit()
    db.refresh(db_current_study)
    return db_current_study

def get_current_study(db: Session, user_id: str, study_id: str):
    return db.query(CurrentStudy).filter(CurrentStudy.id == study_id, CurrentStudy.user_id == user_id).first()

def update_current_study(db: Session, user_id: str, study_id: str, study_update: dict):
    study = db.query(CurrentStudy).filter(CurrentStudy.id == study_id, CurrentStudy.user_id == user_id).first()
    if study:
        for key, value in study_update.items():
            setattr(study, key, value)
        db.commit()
        db.refresh(study)
    return study

def delete_current_study(db: Session, user_id: str, study_id: str):
    study = db.query(CurrentStudy).filter(CurrentStudy.id == study_id, CurrentStudy.user_id == user_id).first()
    if study:
        db.delete(study)
        db.commit()
        return True
    return False