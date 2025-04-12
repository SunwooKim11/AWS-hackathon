from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class CurrentStudyBase(BaseModel):
    title: str
    description: Optional[str] = None
    authors: List[str]
    equipments: List[str]
    reagents: List[str]
    vector_embedding_id: Optional[str] = None

class CurrentStudyCreate(CurrentStudyBase):
    pass

class CurrentStudyInDB(CurrentStudyBase):
    user_id: str

class CurrentStudy(CurrentStudyInDB):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True  # For Pydantic v2 compatibility

class CurrentStudyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    authors: Optional[List[str]] = None
    equipments: Optional[List[str]] = None
    reagents: Optional[List[str]] = None
    vector_embedding_id: Optional[str] = None