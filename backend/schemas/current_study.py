from pydantic import BaseModel
from typing import List, Optional

class CurrentStudyBase(BaseModel):
    user_id: str
    title: str
    description: Optional[str] = None
    authors: List[str]
    equipments: List[str]
    reagents: List[str]
    vector_embedding_id: Optional[str] = None

class CurrentStudyCreate(CurrentStudyBase):
    pass

class CurrentStudy(CurrentStudyBase):
    id: str
    created_at: str
    updated_at: str

    class Config:
        orm_mode = True

class CurrentStudyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    authors: Optional[List[str]] = None
    equipments: Optional[List[str]] = None
    reagents: Optional[List[str]] = None
    vector_embedding_id: Optional[str] = None