from typing import List
from pydantic import BaseModel

class ResearchData(BaseModel):
    user_id: str
    title: str
    abstract: str
    equipments: List[str]
    reagents: List[str]

class ResearchVector(BaseModel):
    user_id: str
    title_vector: List[float]
    abstract_vector: List[float]
    equipments: List[str]
    reagents: List[str]

class RecommendationRequest(BaseModel):
    user_id: str
    top_k: int = 5

class RecommendationResponse(BaseModel):
    recommendations: List[dict]  # user_id와 유사도 점수를 포함 