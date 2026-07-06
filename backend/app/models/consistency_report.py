from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, Float, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class ConsistencyReport(Base):
    __tablename__ = "consistency_reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    extracted_entities = Column(Text, nullable=True)   # JSON string
    artifact_mapping = Column(Text, nullable=True)     # JSON string
    missing_entities = Column(Text, nullable=True)     # JSON string
    relationship_validation = Column(Text, nullable=True)  # JSON string
    score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="consistency_reports")
