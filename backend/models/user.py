from sqlalchemy import Column, String, Text, TIMESTAMP, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..db.base_class import Base  # Import Base directly from base_class
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(String, unique=True, nullable=False)  # 사용자 식별용 ID (프론트엔드에서 사용)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    affiliation = Column(String, nullable=True)
    google_scholar_id = Column(String, nullable=False)
    profile_image_url = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False)
    vector_embedding_id = Column(UUID(as_uuid=True), nullable=True)

    # Use string references for relationships
    interests = relationship("Interest", back_populates="user")
    current_studies = relationship("CurrentStudy", back_populates="user")
    papers = relationship("Paper", back_populates="user")
    tools = relationship("Tool", back_populates="user")