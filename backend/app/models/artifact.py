from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Artifact(Base):
    __tablename__ = "artifacts"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    artifact_type = Column(String(100), nullable=False)
    # functional_requirements, non_functional_requirements, user_stories, use_cases,
    # database_schema, api_design, sprint_planning, software_architecture, project_modules
    content = Column(Text, nullable=False)  # markdown / JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="artifacts")
