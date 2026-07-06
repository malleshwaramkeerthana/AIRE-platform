from app.core.groq_client import generate_text
import json


USE_CASE_DIAGRAM_PROMPT = """You are a UML Specialist. Based on the following use cases and actors,
generate a professional PlantUML Use Case Diagram.

Actors: {actors}
Use Cases (JSON): {use_cases_json}

Rules:
- Use PlantUML "@startuml" / "@enduml" syntax.
- Represent each actor and connect them to relevant use cases.
- Output ONLY the raw PlantUML code, no markdown fences, no explanation.
"""

CLASS_DIAGRAM_PROMPT = """You are a UML Specialist. Based on the following database schema,
generate a professional PlantUML Class Diagram representing the domain model.

Schema (JSON): {schema_json}

Rules:
- Use PlantUML "@startuml" / "@enduml" syntax.
- Represent each table as a class with its attributes and types.
- Show relationships (associations, aggregations) between classes based on the schema relationships.
- Output ONLY the raw PlantUML code, no markdown fences, no explanation.
"""

SEQUENCE_DIAGRAM_PROMPT = """You are a UML Specialist. Based on the following primary use case,
generate a professional PlantUML Sequence Diagram showing the main flow of interaction
between the actor, frontend, backend API, and database.

Primary Use Case (JSON): {use_case_json}

Rules:
- Use PlantUML "@startuml" / "@enduml" syntax.
- Include participants: Actor, Frontend, API, Database (and others if relevant).
- Reflect the main_flow steps as sequential messages.
- Output ONLY the raw PlantUML code, no markdown fences, no explanation.
"""


def _clean(raw: str) -> str:
    raw = raw.strip().replace("```plantuml", "").replace("```", "").strip()
    if not raw.startswith("@startuml"):
        raw = "@startuml\n" + raw
    if not raw.endswith("@enduml"):
        raw = raw + "\n@enduml"
    return raw


def run_uml_agent(extracted: dict, use_cases: dict, schema: dict) -> dict:
    actors = extracted.get("actors", [])

    uc_prompt = USE_CASE_DIAGRAM_PROMPT.format(
        actors=actors,
        use_cases_json=json.dumps(use_cases.get("use_cases", [])[:8], indent=2),
    )
    use_case_diagram = _clean(generate_text(uc_prompt))

    class_prompt = CLASS_DIAGRAM_PROMPT.format(schema_json=json.dumps(schema, indent=2))
    class_diagram = _clean(generate_text(class_prompt))

    primary_uc = use_cases.get("use_cases", [{}])[0] if use_cases.get("use_cases") else {}
    seq_prompt = SEQUENCE_DIAGRAM_PROMPT.format(use_case_json=json.dumps(primary_uc, indent=2))
    sequence_diagram = _clean(generate_text(seq_prompt))

    return {
        "use_case_diagram": use_case_diagram,
        "class_diagram": class_diagram,
        "sequence_diagram": sequence_diagram,
    }
