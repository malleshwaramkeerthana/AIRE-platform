from app.core.groq_client import generate_json

PROMPT_TEMPLATE = """You are a Senior Software Requirements Engineer.

Project Description:
\"\"\"{requirement_text}\"\"\"

Extracted Context:
Actors: {actors}
Features: {features}
Entities: {entities}
Constraints: {constraints}
Modules: {modules}

Generate Functional Requirements and Non-Functional Requirements for this project.

Return ONLY valid JSON (no markdown, no commentary) in EXACTLY this structure:
{{
  "functional_requirements": [
    {{"id": "FR-1", "title": "string", "description": "string"}}
  ],
  "non_functional_requirements": [
    {{"id": "NFR-1", "category": "Performance|Security|Usability|Scalability|Reliability|Maintainability", "description": "string"}}
  ]
}}
Generate at least 8 functional requirements and 6 non-functional requirements.
"""


def run_requirements_generation(requirement_text: str, extracted: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(
        requirement_text=requirement_text,
        actors=extracted.get("actors", []),
        features=extracted.get("features", []),
        entities=extracted.get("entities", []),
        constraints=extracted.get("constraints", []),
        modules=extracted.get("modules", []),
    )
    data = generate_json(prompt)
    data.setdefault("functional_requirements", [])
    data.setdefault("non_functional_requirements", [])
    return data
