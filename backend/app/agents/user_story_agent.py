from app.core.groq_client import generate_json

PROMPT_TEMPLATE = """You are an Agile Business Analyst.

Project Description:
\"\"\"{requirement_text}\"\"\"

Actors: {actors}
Features: {features}
Entities: {entities}

Generate User Stories in the standard format: "As a <actor>, I want to <action>, so that <benefit>".
Each story must reference one of the actors and one of the entities/features above where applicable.

Return ONLY valid JSON (no markdown, no commentary) in EXACTLY this structure:
{{
  "user_stories": [
    {{
      "id": "US-1",
      "actor": "string",
      "story": "As a ... I want to ... so that ...",
      "acceptance_criteria": ["string", ...],
      "related_entities": ["string", ...]
    }}
  ]
}}
Generate at least 10 user stories covering all actors.
"""


def run_user_story_agent(requirement_text: str, extracted: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(
        requirement_text=requirement_text,
        actors=extracted.get("actors", []),
        features=extracted.get("features", []),
        entities=extracted.get("entities", []),
    )
    data = generate_json(prompt)
    data.setdefault("user_stories", [])
    return data
