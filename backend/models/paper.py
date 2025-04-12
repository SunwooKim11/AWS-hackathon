from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey, ARRAY, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..db.base_class import Base  # Import Base directly from base_class
import uuid

class Paper(Base):
    __tablename__ = "papers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    title = Column(Text, nullable=False)
    abstract = Column(Text, nullable=False)
    year = Column(Integer, nullable=True)
    journal = Column(String, nullable=False)
    doi = Column(String, nullable=True)
    authors = Column(ARRAY(String), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)
    equipments = Column(ARRAY(String), nullable=False)
    reagents = Column(ARRAY(String), nullable=False)
    vector_embedding_id = Column(UUID(as_uuid=True), nullable=True)

    # Add the relationship to the User model
    user = relationship("User", back_populates="papers")