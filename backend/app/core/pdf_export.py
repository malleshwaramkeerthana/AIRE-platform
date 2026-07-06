import json
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Preformatted
)


def _styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="SectionTitle", fontSize=16, spaceAfter=12, textColor=colors.HexColor("#2563EB"), spaceBefore=18))
    styles.add(ParagraphStyle(name="SubTitle", fontSize=12, spaceAfter=6, textColor=colors.HexColor("#0F172A")))
    styles.add(ParagraphStyle(name="Body", fontSize=10, leading=14, textColor=colors.HexColor("#0F172A")))
    styles.add(ParagraphStyle(name="MonoSmall", fontName="Courier", fontSize=7, leading=9))
    return styles


def _safe_json_load(text, default):
    try:
        return json.loads(text)
    except Exception:
        return default


def generate_project_pdf(project, artifacts: list, diagrams: list, consistency_report) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.8 * inch, bottomMargin=0.8 * inch)
    styles = _styles()
    elements = []

    # Title page
    elements.append(Paragraph(project.name, styles["Title"]))
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(Paragraph("AI-Generated Software Engineering Design Document", styles["SubTitle"]))
    elements.append(Paragraph(f"Created: {project.created_at}", styles["Body"]))
    elements.append(Paragraph(f"Consistency Score: {project.consistency_score}%", styles["Body"]))
    elements.append(PageBreak())

    artifact_map = {a.artifact_type: a.content for a in artifacts}

    # Functional Requirements
    elements.append(Paragraph("1. Functional Requirements", styles["SectionTitle"]))
    for fr in _safe_json_load(artifact_map.get("functional_requirements", "[]"), []):
        elements.append(Paragraph(f"<b>{fr.get('id', '')}</b>: {fr.get('title', '')}", styles["Body"]))
        elements.append(Paragraph(fr.get("description", ""), styles["Body"]))
        elements.append(Spacer(1, 0.05 * inch))

    # Non-Functional Requirements
    elements.append(Paragraph("2. Non-Functional Requirements", styles["SectionTitle"]))
    for nfr in _safe_json_load(artifact_map.get("non_functional_requirements", "[]"), []):
        elements.append(Paragraph(f"<b>{nfr.get('id', '')}</b> [{nfr.get('category', '')}]: {nfr.get('description', '')}", styles["Body"]))

    elements.append(PageBreak())

    # User Stories
    elements.append(Paragraph("3. User Stories", styles["SectionTitle"]))
    for us in _safe_json_load(artifact_map.get("user_stories", "[]"), []):
        elements.append(Paragraph(f"<b>{us.get('id', '')}</b> ({us.get('actor', '')}): {us.get('story', '')}", styles["Body"]))
        for ac in us.get("acceptance_criteria", []):
            elements.append(Paragraph(f"&nbsp;&nbsp;- {ac}", styles["Body"]))
        elements.append(Spacer(1, 0.05 * inch))

    elements.append(PageBreak())

    # Use Cases
    elements.append(Paragraph("4. Use Cases", styles["SectionTitle"]))
    for uc in _safe_json_load(artifact_map.get("use_cases", "[]"), []):
        elements.append(Paragraph(f"<b>{uc.get('id', '')}: {uc.get('name', '')}</b>", styles["Body"]))
        elements.append(Paragraph(f"Actors: {', '.join(uc.get('actors', []))}", styles["Body"]))
        elements.append(Paragraph("Main Flow:", styles["Body"]))
        for step in uc.get("main_flow", []):
            elements.append(Paragraph(f"&nbsp;&nbsp;- {step}", styles["Body"]))
        elements.append(Spacer(1, 0.1 * inch))

    elements.append(PageBreak())

    # Database Schema
    elements.append(Paragraph("5. Database Schema", styles["SectionTitle"]))
    for table in _safe_json_load(artifact_map.get("database_schema", "[]"), []):
        elements.append(Paragraph(f"<b>Table: {table.get('name', '')}</b>", styles["SubTitle"]))
        data = [["Column", "Type", "Constraints"]]
        for col in table.get("columns", []):
            data.append([col.get("name", ""), col.get("type", ""), col.get("constraints", "")])
        t = Table(data, colWidths=[1.8 * inch, 1.8 * inch, 2.8 * inch])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 0.15 * inch))

    elements.append(PageBreak())

    # ER Diagram (raw mermaid source)
    elements.append(Paragraph("6. ER Diagram (Mermaid.js Source)", styles["SectionTitle"]))
    er = next((d for d in diagrams if d.diagram_type == "er_diagram"), None)
    if er:
        elements.append(Preformatted(er.content, styles["MonoSmall"]))

    elements.append(PageBreak())

   
    doc.build(elements)
    buffer.seek(0)
    return buffer.read()
