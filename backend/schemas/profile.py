from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID

class ProfileCreateRequest(BaseModel):
    user_id: str
    max_papers: Optional[int] = 5

class PaperContent(BaseModel):
    title: str
    abstract: str
    equipments: List[str]
    reagents: List[str]
    vector_embedding_id: Optional[UUID] = None

class ProfileCreateResponse(BaseModel):
    message: str
    status: str
    paper_count: int