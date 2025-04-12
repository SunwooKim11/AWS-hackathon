from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from ....db.session import get_db
from ....crud.user import get_user, create_user, update_user, delete_user, get_user_by_email
from ....schemas.user import User, UserCreate, UserUpdate, UserResponse

router = APIRouter()

@router.get("/users/{user_id}", response_model=User)
async def read_user(user_id: str, db: AsyncSession = Depends(get_db)):
    db_user = await get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/users/email/{email}")
async def read_user_by_email(email: str, db: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_email(db, email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/users/{user_id}", response_model=User)
async def update_user_profile(user_id: str, user: UserUpdate, db: AsyncSession = Depends(get_db)):
    db_user = await update_user(db, user_id, user)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/users", response_model=UserResponse)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await create_user(db, user)