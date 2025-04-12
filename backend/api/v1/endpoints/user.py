from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....db.session import SessionLocal
from ....crud.user import get_user, create_user, update_user, delete_user
from ....schemas.user import User, UserCreate, UserUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/users/{user_id}", response_model=User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/users/{user_id}", response_model=User)
def update_user_profile(user_id: str, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = update_user(db, user_id, user)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user