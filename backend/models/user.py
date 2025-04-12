from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..db.base import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False)
    name = Column(String, nullable=False)
    affiliation = Column(String, nullable=True)
    google_scholar_id = Column(String, nullable=False)
    profile_image_url = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False)

    interests = relationship("Interest", back_populates="user")
    current_studies = relationship("CurrentStudy", back_populates="user")
    papers = relationship("Paper", back_populates="user")
    tools = relationship("Tool", back_populates="user")