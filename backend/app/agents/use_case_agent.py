from app.core.groq_client import generate_json

PROMPT_TEMPLATE = """You are a Senior Systems Analyst.

Project Description:
\"\"\"{requirement_text}\"\"\"

Actors: {actors}
Features: {features}
Entities: {entities}
Modules: {modules}

Generate detailed Use Cases for this system. Each use case must include actors,
preconditions, main flow steps, alternate flows, and postconditions.

Return ONLY valid JSON (no markdown, no commentary) in EXACTLY this structure:
{{
  "use_cases": [
    {{
      "id": "UC-1",
      "name": "string",
      "actors": ["string", ...],
      "preconditions": ["string", ...],
      "main_flow": ["string", ...],
      "alternate_flows": ["string", ...],
      "postconditions": ["string", ...],
      "related_entities": ["string", ...]
    }}
  ]
}}
Generate at least 8 use cases covering core modules and actors.
"""


def run_use_case_agent(requirement_text: str, extracted: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(
        requirement_text=requirement_text,
        actors=extracted.get("actors", []),
        features=extracted.get("features", []),
        entities=extracted.get("entities", []),
        modules=extracted.get("modules", []),
    )
    data = generate_json(prompt)
    data.setdefault("use_cases", [])
    return data
