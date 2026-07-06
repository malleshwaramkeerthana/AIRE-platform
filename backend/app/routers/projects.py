from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_
import io

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.pipeline import run_full_pipeline
from app.core.pdf_export import generate_project_pdf

from app.models.user import User
from app.models.project import Project
from app.models.artifact import Artifact
from app.models.diagram import Diagram
from app.models.consistency_report import ConsistencyReport
from app.models.history import History

from app.schemas.project import (
    ProjectCreate, ProjectOut, ProjectListOut, ProjectWorkspaceOut,
    ArtifactOut, DiagramOut, ConsistencyReportOut,
)

router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])


@router.post("", response_model=ProjectOut, status_code=201)
def create_project(
    payload: ProjectCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = Project(
        name=payload.name,
        description=payload.description,
        raw_requirement_text=payload.requirement_text,
        owner_id=current_user.id,
        status="draft",
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    db.add(History(project_id=project.id, action="Project created"))
    db.commit()

    # Run the AI pipeline synchronously in the background task.
    # For production, this should be a queue/worker (e.g. Celery, RQ).
    background_tasks.add_task(_run_pipeline_task, project.id, payload.requirement_text)

    return project


def _run_pipeline_task(project_id: int, requirement_text: str):
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if project:
            run_full_pipeline(db, project, requirement_text)
    finally:
        db.close()


@router.get("", response_model=ProjectListOut)
def list_projects(
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Project).filter(Project.owner_id == current_user.id)
    if search:
        query = query.filter(or_(Project.name.ilike(f"%{search}%"), Project.description.ilike(f"%{search}%")))
    projects = query.order_by(Project.created_at.desc()).all()
    return ProjectListOut(total=len(projects), projects=projects)


@router.get("/{project_id}", response_model=ProjectWorkspaceOut)
def get_project_workspace(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_owned_project(db, project_id, current_user)

    artifacts = db.query(Artifact).filter(Artifact.project_id == project_id).all()
    diagrams = db.query(Diagram).filter(Diagram.project_id == project_id).all()
    consistency_report = (
        db.query(ConsistencyReport)
        .filter(ConsistencyReport.project_id == project_id)
        .order_by(ConsistencyReport.created_at.desc())
        .first()
    )

    return ProjectWorkspaceOut(
        project=project,
        artifacts=[ArtifactOut.from_orm(a) for a in artifacts],
        diagrams=[DiagramOut.from_orm(d) for d in diagrams],
        consistency_report=ConsistencyReportOut.from_orm(consistency_report) if consistency_report else None,
    )


@router.post("/{project_id}/regenerate", response_model=ProjectOut)
def regenerate_project(
    project_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_owned_project(db, project_id, current_user)

    # Clear previous artifacts/diagrams/consistency reports
    db.query(Artifact).filter(Artifact.project_id == project_id).delete()
    db.query(Diagram).filter(Diagram.project_id == project_id).delete()
    db.query(ConsistencyReport).filter(ConsistencyReport.project_id == project_id).delete()
    db.commit()

    db.add(History(project_id=project.id, action="Regeneration requested"))
    db.commit()

    background_tasks.add_task(_run_pipeline_task, project.id, project.raw_requirement_text)
    return project


@router.get("/{project_id}/export/pdf")
def export_pdf(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_owned_project(db, project_id, current_user)

    artifacts = db.query(Artifact).filter(Artifact.project_id == project_id).all()
    diagrams = db.query(Diagram).filter(Diagram.project_id == project_id).all()
    consistency_report = (
        db.query(ConsistencyReport)
        .filter(ConsistencyReport.project_id == project_id)
        .order_by(ConsistencyReport.created_at.desc())
        .first()
    )

    pdf_bytes = generate_project_pdf(project, artifacts, diagrams, consistency_report)

    db.add(History(project_id=project.id, action="Exported PDF"))
    db.commit()

    filename = f"{project.name.replace(' ', '_')}_design_document.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/{project_id}/history")
def get_history(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_owned_project(db, project_id, current_user)
    entries = (
        db.query(History)
        .filter(History.project_id == project_id)
        .order_by(History.created_at.desc())
        .all()
    )
    return [
        {"id": e.id, "action": e.action, "details": e.details, "created_at": e.created_at}
        for e in entries
    ]


@router.delete("/{project_id}", status_code=204)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_owned_project(db, project_id, current_user)
    db.delete(project)
    db.commit()
    return None


def _get_owned_project(db: Session, project_id: int, current_user: User) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this project")
    return project
