import json
from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.requirement import Requirement
from app.models.artifact import Artifact
from app.models.diagram import Diagram
from app.models.history import History

from app.agents import (
    run_requirement_analysis,
    run_requirements_generation,
    run_user_story_agent,
    run_use_case_agent,
    run_database_design_agent,
    run_er_diagram_agent,
)


def run_full_pipeline(db: Session, project: Project, requirement_text: str):
    print("PIPELINE STARTED")

    project.status = "processing"
    db.commit()

    try:
        # -------------------------
        # Agent 1: Requirement Analysis
        # -------------------------
        extracted = run_requirement_analysis(requirement_text)

        requirement = Requirement(
            project_id=project.id,
            raw_text=requirement_text,
            extracted_entities=extracted,
        )

        db.add(requirement)
        db.commit()

        print("Agent 1 Done")

        # -------------------------
        # Agent 2: Requirements Generation
        # -------------------------
        req_gen = run_requirements_generation(
            requirement_text,
            extracted
        )

        _save_artifact(
            db,
            project.id,
            "functional_requirements",
            req_gen.get("functional_requirements", [])
        )

        _save_artifact(
            db,
            project.id,
            "non_functional_requirements",
            req_gen.get("non_functional_requirements", [])
        )

        db.commit()

        print("Agent 2 Done")

        # -------------------------
        # Agent 3: User Stories
        # -------------------------
        user_stories = run_user_story_agent(
            requirement_text,
            extracted
        )

        _save_artifact(
            db,
            project.id,
            "user_stories",
            user_stories.get("user_stories", [])
        )

        db.commit()

        print("Agent 3 Done")

        # -------------------------
        # Agent 4: Use Cases
        # -------------------------
        use_cases = run_use_case_agent(
            requirement_text,
            extracted
        )

        _save_artifact(
            db,
            project.id,
            "use_cases",
            use_cases.get("use_cases", [])
        )

        db.commit()

        print("Agent 4 Done")

        # -------------------------
        # Agent 5: Database Schema
        # -------------------------
        schema = run_database_design_agent(
            requirement_text,
            extracted
        )

        _save_artifact(
            db,
            project.id,
            "database_schema",
            schema.get("tables", [])
        )

        db.commit()

        print("Agent 5 Done")

        # -------------------------
        # Agent 6: ER Diagram
        # -------------------------
        er_diagram = run_er_diagram_agent(schema)

        db.add(
            Diagram(
                project_id=project.id,
                diagram_type="er_diagram",
                syntax_type="mermaid",
                content=er_diagram
            )
        )

        db.commit()

        print("Agent 6 Done")

        # -------------------------
        # Project Complete
        # -------------------------
        project.consistency_score = 100
        project.status = "completed"
        project.raw_requirement_text = requirement_text

        db.add(
            History(
                project_id=project.id,
                action="Generated Design",
                details="Requirements, User Stories, Use Cases, Database Schema and ER Diagram generated successfully."
            )
        )

        db.commit()

        print("PROJECT COMPLETED")

    except Exception as exc:
        print("ERROR OCCURRED:")
        print(str(exc))

        project.status = "draft"

        db.add(
            History(
                project_id=project.id,
                action="Generation Failed",
                details=str(exc)
            )
        )

        db.commit()

        raise


def _save_artifact(
    db: Session,
    project_id: int,
    artifact_type: str,
    content
):
    artifact = Artifact(
        project_id=project_id,
        artifact_type=artifact_type,
        content=json.dumps(content, indent=2),
    )

    db.add(artifact)