from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..db.base_class import Base  # Import Base directly from base_class instead of base
import uuid

class CurrentStudy(Base):
    __tablename__ = "current_study"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    authors = Column(ARRAY(String), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)
    equipments = Column(ARRAY(String), nullable=False)
    reagents = Column(ARRAY(String), nullable=False)
    vector_embedding_id = Column(UUID(as_uuid=True), nullable=True)

    # Use string references for relationships
    user = relationship("User", back_populates="current_studies")