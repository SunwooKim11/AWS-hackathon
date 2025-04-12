from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    email: str
    name: str
    affiliation: Optional[str] = None
    google_scholar_id: str
    profile_image_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    affiliation: Optional[str] = None
    profile_image_url: Optional[str] = None

class User(UserBase):
    id: str
    created_at: str

    class Config:
        orm_mode = True

class UserRequest(BaseModel):
    user_id: str