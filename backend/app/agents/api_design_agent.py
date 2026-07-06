from app.core.groq_client import generate_json
import json

PROMPT_TEMPLATE = """You are a Senior API Architect.

Project Description:
\"\"\"{requirement_text}\"\"\"

Database Schema (JSON): {schema_json}
Modules: {modules}

Design a REST API specification covering Authentication, and CRUD/business operations
for every table in the schema and module above.

Return ONLY valid JSON (no markdown, no commentary) in EXACTLY this structure:
{{
  "endpoints": [
    {{
      "method": "GET|POST|PUT|PATCH|DELETE",
      "path": "/api/v1/...",
      "description": "string",
      "request_body": {{}},
      "response": {{}},
      "auth_required": true
    }}
  ]
}}
Generate at least 15 endpoints.
"""


def run_api_design_agent(requirement_text: str, schema: dict, extracted: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(
        requirement_text=requirement_text,
        schema_json=json.dumps(schema, indent=2),
        modules=extracted.get("modules", []),
    )
    data = generate_json(prompt)
    data.setdefault("endpoints", [])
    return data
