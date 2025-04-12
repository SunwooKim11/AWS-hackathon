from typing import List
from pydantic import BaseModel
from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from ..db.base_class import Base  # Import Base directly from base_class
import uuid

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

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    recommended_user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    score = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)

    # Define relationships if needed
    user = relationship("User", foreign_keys=[user_id], backref="recommendations_made")
    recommended_user = relationship("User", foreign_keys=[recommended_user_id], backref="recommendations_received")