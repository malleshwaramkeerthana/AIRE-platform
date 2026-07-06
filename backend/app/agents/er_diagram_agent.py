import re


def sql_to_mermaid_type(sql_type: str) -> str:
    sql_type = sql_type.upper()

    if "VARCHAR" in sql_type or "TEXT" in sql_type:
        return "string"

    if "SERIAL" in sql_type or "INT" in sql_type:
        return "int"

    if "BOOLEAN" in sql_type:
        return "boolean"

    if "DATE" in sql_type and "TIME" not in sql_type:
        return "date"

    if "TIMESTAMP" in sql_type:
        return "datetime"

    if "DECIMAL" in sql_type or "FLOAT" in sql_type:
        return "float"

    return "string"


def run_er_diagram_agent(schema: dict) -> str:

    lines = ["erDiagram", ""]

    tables = schema.get("tables", [])

    # Generate entity blocks
    for table in tables:

        table_name = table["name"].upper()

        lines.append(f"{table_name} {{")

        for col in table.get("columns", []):

            col_name = col["name"]
            col_type = sql_to_mermaid_type(col.get("type", ""))

            constraint = col.get("constraints", "").upper()

            suffix = ""

            if "PRIMARY KEY" in constraint:
                suffix = " PK"

            elif "REFERENCES" in constraint:
                suffix = " FK"

            lines.append(f"    {col_type} {col_name}{suffix}")

        lines.append("}")
        lines.append("")

    # Generate relationships from foreign keys
    for table in tables:

        current_table = table["name"].upper()

        for col in table.get("columns", []):

            constraint = col.get("constraints", "")

            match = re.search(
                r"REFERENCES\s+([a-zA-Z_]+)\(",
                constraint,
                re.IGNORECASE
            )

            if match:

                parent_table = match.group(1).upper()

                lines.append(
                    f"{parent_table} ||--o{{ {current_table} : contains"
                )

    result = "\n".join(lines)

    print("\n===== GENERATED ER DIAGRAM =====")
    print(result)
    print("================================\n")

    return result