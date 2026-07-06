from app.core.groq_client import generate_json

PROMPT_TEMPLATE = """
You are a PostgreSQL Database Architect.

Project:
{requirement_text}

Entities:
{entities}

Modules:
{modules}

Generate a database schema.

IMPORTANT:
- Return ONLY valid JSON.
- No explanations.
- No markdown.
- No comments.
- No extra text before or after JSON.
- Keep maximum 10 tables.
- Use double quotes only.
- Every string must be properly closed.

Required JSON format:

{{
  "tables": [
    {{
      "name": "users",
      "columns": [
        {{
          "name": "id",
          "type": "SERIAL",
          "constraints": "PRIMARY KEY"
        }}
      ],
      "relationships": []
    }}
  ]
}}
"""


def run_database_design_agent(requirement_text: str, extracted: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(
        requirement_text=requirement_text,
        entities=extracted.get("entities", []),
        modules=extracted.get("modules", []),
    )
    data = generate_json(prompt)
    data.setdefault("tables", [])
    return data
