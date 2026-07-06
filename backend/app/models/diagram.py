from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Diagram(Base):
    __tablename__ = "diagrams"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    diagram_type = Column(String(100), nullable=False)
    # er_diagram, use_case_diagram, class_diagram, sequence_diagram
    syntax_type = Column(String(50), nullable=False)  # mermaid, plantuml
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="diagrams")
