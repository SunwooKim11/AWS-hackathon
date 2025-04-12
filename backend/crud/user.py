from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate
from sqlalchemy.future import select
from datetime import datetime
import uuid

async def get_user(db: AsyncSession, user_id: str):
    """사용자가 지정한 user_id로 사용자 조회"""
    result = await db.execute(
        select(User).where(User.user_id == user_id)
    )
    return result.scalar_one_or_none()

async def get_user_by_id(db: AsyncSession, id: uuid.UUID):
    """시스템 내부 UUID로 사용자 조회"""
    result = await db.execute(
        select(User).where(User.id == id)
    )
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(
        select(User).where(User.email == email)
    )
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user: UserCreate):
    user_data = user.dict()
    user_data["created_at"] = datetime.utcnow()  # Set the current UTC time for created_at
    # user_data에는 이미 user_id가 포함되어 있음 (사용자 지정)
    # id는 자동 생성됨 (default=uuid.uuid4)
    db_user = User(**user_data)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def update_user(db: AsyncSession, user_id: str, user: UserUpdate):
    db_user = await get_user(db, user_id)
    if db_user:
        for key, value in user.dict(exclude_unset=True).items():
            setattr(db_user, key, value)
        await db.commit()
        await db.refresh(db_user)
    return db_user

async def delete_user(db: AsyncSession, user_id: str):
    db_user = await get_user(db, user_id)
    if db_user:
        await db.delete(db_user)
        await db.commit()
    return db_user