from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    name: str
    affiliation: Optional[str] = None
    google_scholar_id: str
    profile_image_url: Optional[str] = None
    email: str
    vector_embedding_id: Optional[UUID] = None

class UserCreate(UserBase):
    user_id: str  # 사용자가 지정한 ID

class UserUpdate(BaseModel):
    name: Optional[str] = None
    affiliation: Optional[str] = None
    profile_image_url: Optional[str] = None
    vector_embedding_id: Optional[UUID] = None

class User(UserBase):
    id: UUID  # 데이터베이스 기본 키 (내부 사용)
    user_id: str  # 사용자 식별용 ID (프론트엔드에서 사용)
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True  # For Pydantic v2 compatibility

class UserRequest(BaseModel):
    user_id: str  # 프론트엔드에서 요청할 때 user_id로 사용자 식별

class UserResponse(User):
    pass