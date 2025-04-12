from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..db.base_class import Base  # Import Base directly from base_class
import uuid

class Tool(Base):
    __tablename__ = "tools"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    keyword = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)

    user = relationship("User", back_populates="tools")