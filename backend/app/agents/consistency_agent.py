"""
Consistency Validation Agent.

Performs deterministic cross-checking of extracted entities against all generated
artifacts (user stories, use cases, database schema, APIs, diagrams), and produces
a consistency score (0-100%).
"""
import re


def _normalize(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower())


def _text_blob_from_artifacts(user_stories, use_cases, schema, api_design, diagrams) -> str:
    parts = []

    for us in user_stories.get("user_stories", []):
        parts.append(us.get("story", ""))
        parts.extend(us.get("related_entities", []))

    for uc in use_cases.get("use_cases", []):
        parts.append(uc.get("name", ""))
        parts.extend(uc.get("related_entities", []))
        parts.extend(uc.get("main_flow", []))

    for table in schema.get("tables", []):
        parts.append(table.get("name", ""))
        for col in table.get("columns", []):
            parts.append(col.get("name", ""))

    for ep in api_design.get("endpoints", []):
        parts.append(ep.get("path", ""))
        parts.append(ep.get("description", ""))

    for key in ["er_diagram", "use_case_diagram", "class_diagram", "sequence_diagram"]:
        val = diagrams.get(key)
        if val:
            parts.append(val)

    return " ".join(parts).lower()


def run_consistency_agent(extracted: dict, user_stories: dict, use_cases: dict,
                           schema: dict, api_design: dict, diagrams: dict) -> dict:
    entities = extracted.get("entities", [])
    blob = _text_blob_from_artifacts(user_stories, use_cases, schema, api_design, diagrams)
    normalized_blob = _normalize(blob)

    artifact_mapping = {}
    missing_entities = []

    for entity in entities:
        norm_entity = _normalize(entity)
        # also try singular form by stripping trailing 's'
        candidates = {norm_entity}
        if norm_entity.endswith("s"):
            candidates.add(norm_entity[:-1])
        else:
            candidates.add(norm_entity + "s")

        found = any(c and c in normalized_blob for c in candidates)
        artifact_mapping[entity] = found
        if not found:
            missing_entities.append(entity)

    total = len(entities) if entities else 1
    matched = total - len(missing_entities)
    score = round((matched / total) * 100, 2)

    # Relationship validation: check that schema relationships reference existing tables
    table_names = {_normalize(t.get("name", "")) for t in schema.get("tables", [])}
    relationship_issues = []
    for table in schema.get("tables", []):
        for rel in table.get("relationships", []):
            target = _normalize(rel.get("with_table", ""))
            if target and target not in table_names:
                relationship_issues.append(
                    f"Table '{table.get('name')}' has relationship to undefined table '{rel.get('with_table')}'"
                )

    relationship_validation = {
        "total_relationships_checked": sum(len(t.get("relationships", [])) for t in schema.get("tables", [])),
        "issues": relationship_issues,
        "valid": len(relationship_issues) == 0,
    }

    return {
        "extracted_entities": entities,
        "artifact_mapping": artifact_mapping,
        "missing_entities": missing_entities,
        "relationship_validation": relationship_validation,
        "score": score,
    }
