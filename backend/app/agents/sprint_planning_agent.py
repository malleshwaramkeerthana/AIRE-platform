from app.core.groq_client import generate_json
import json

PROMPT_TEMPLATE = """You are a Senior Agile Project Manager.

Project Description:
\"\"\"{requirement_text}\"\"\"

Functional Requirements (JSON): {fr_json}
Modules: {modules}

Create a Sprint Plan (assume 2-week sprints) that organizes the functional requirements
and modules into sprints, with story points and priorities.

Return ONLY valid JSON (no markdown, no commentary) in EXACTLY this structure:
{{
  "sprints": [
    {{
      "sprint_number": 1,
      "duration": "2 weeks",
      "goal": "string",
      "tasks": [
        {{"title": "string", "related_fr": "FR-1", "story_points": 5, "priority": "High|Medium|Low"}}
      ]
    }}
  ]
}}
Plan for 4-6 sprints total.
"""


def run_sprint_planning_agent(requirement_text: str, functional_requirements: list, extracted: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(
        requirement_text=requirement_text,
        fr_json=json.dumps(functional_requirements, indent=2),
        modules=extracted.get("modules", []),
    )
    data = generate_json(prompt)
    data.setdefault("sprints", [])
    return data
