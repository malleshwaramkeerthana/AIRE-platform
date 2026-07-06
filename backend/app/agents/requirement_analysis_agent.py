from app.core.groq_client import generate_json

PROMPT_TEMPLATE = """You are a Senior Requirement Analyst.
Analyze the following software project description and extract structured information.

Project Description:
\"\"\"{requirement_text}\"\"\"

Return ONLY valid JSON (no markdown, no commentary) in EXACTLY this structure:
{{
  "actors": ["string", ...],
  "features": ["string", ...],
  "entities": ["string", ...],
  "constraints": ["string", ...],
  "modules": ["string", ...]
}}
"""


def run_requirement_analysis(requirement_text: str) -> dict:
    prompt = PROMPT_TEMPLATE.format(requirement_text=requirement_text)
    data = generate_json(prompt)
    for key in ["actors", "features", "entities", "constraints", "modules"]:
        data.setdefault(key, [])
    return data
