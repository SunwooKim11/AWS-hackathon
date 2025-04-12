from pydantic import BaseModel
from typing import List, Optional

class PaperBase(BaseModel):
    user_id: str
    title: str
    abstract: str
    year: Optional[int] = None
    journal: str
    doi: Optional[str] = None
    authors: List[str]
    equipments: List[str]
    reagents: List[str]
    vector_embedding_id: Optional[str] = None

class PaperCreate(PaperBase):
    pass

class Paper(PaperBase):
    id: str
    created_at: str

    class Config:
        orm_mode = True