from app.core.groq_client import generate_json

PROMPT_TEMPLATE = """You are a Senior Software Architect.

Project Description:
\"\"\"{requirement_text}\"\"\"

Actors: {actors}
Modules: {modules}
Features: {features}

Describe the recommended Software Architecture and a breakdown of Project Modules
for this system, assuming a React + FastAPI + PostgreSQL stack with JWT auth.

Return ONLY valid JSON (no markdown, no commentary) in EXACTLY this structure:
{{
  "architecture": {{
    "style": "string (e.g. Layered / Microservices / Monolithic)",
    "description": "string",
    "layers": [
      {{"name": "string", "responsibility": "string", "technologies": ["string", ...]}}
    ]
  }},
  "project_modules": [
    {{"name": "string", "description": "string", "components": ["string", ...]}}
  ]
}}
"""


def run_architecture_agent(requirement_text: str, extracted: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(
        requirement_text=requirement_text,
        actors=extracted.get("actors", []),
        modules=extracted.get("modules", []),
        features=extracted.get("features", []),
    )
    data = generate_json(prompt)
    data.setdefault("architecture", {})
    data.setdefault("project_modules", [])
    return data
