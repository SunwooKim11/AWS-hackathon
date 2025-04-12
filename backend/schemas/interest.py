from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional

class InterestBase(BaseModel):
    keyword: str

class InterestCreate(InterestBase):
    pass

class InterestInDB(InterestBase):
    user_id: str
    
class Interest(InterestInDB):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True  # For Pydantic v2 compatibility