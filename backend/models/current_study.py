from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from ..db.base import Base
import uuid

class CurrentStudy(Base):
    __tablename__ = "current_study"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    authors = Column(ARRAY(String), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)
    equipments = Column(ARRAY(String), nullable=False)
    reagents = Column(ARRAY(String), nullable=False)
    vector_embedding_id = Column(UUID(as_uuid=True), nullable=True)