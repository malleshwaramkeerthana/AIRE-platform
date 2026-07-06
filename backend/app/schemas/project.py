from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    requirement_text: str


class ProjectOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    status: str
    consistency_score: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectListOut(BaseModel):
    total: int
    projects: List[ProjectOut]


class ArtifactOut(BaseModel):
    id: int
    artifact_type: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class DiagramOut(BaseModel):
    id: int
    diagram_type: str
    syntax_type: str
    content: str

    class Config:
        from_attributes = True


class ConsistencyReportOut(BaseModel):
    id: int
    extracted_entities: Optional[str]
    artifact_mapping: Optional[str]
    missing_entities: Optional[str]
    relationship_validation: Optional[str]
    score: float

    class Config:
        from_attributes = True


class ProjectWorkspaceOut(BaseModel):
    project: ProjectOut
    artifacts: List[ArtifactOut]
    diagrams: List[DiagramOut]
    consistency_report: Optional[ConsistencyReportOut]
