from sqlalchemy.orm import Session
from ..models.interest import Interest
from ..schemas.interest import InterestCreate

def create_interest(db: Session, interest: InterestCreate):
    db_interest = Interest(**interest.dict())
    db.add(db_interest)
    db.commit()
    db.refresh(db_interest)
    return db_interest