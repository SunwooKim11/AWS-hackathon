from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....db.session import SessionLocal
from ....crud.interest import create_interest
from ....schemas.interest import Interest, InterestCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users/{user_id}/interests", response_model=Interest)
def add_interest(user_id: str, interest: InterestCreate, db: Session = Depends(get_db)):
    interest.user_id = user_id
    return create_interest(db, interest)