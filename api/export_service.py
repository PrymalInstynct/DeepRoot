"""
export_service.py
Generates Statement of Financial Position documents in PDF and DOCX formats.
- PDF: uses reportlab (Platypus)
- DOCX: calls generate_statement.js via Node.js subprocess
"""

import json
import os
import subprocess
import tempfile
from datetime import date, datetime
from pathlib import Path

# ── Reportlab imports ─────────────────────────────────────────────────────────
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_RIGHT, TA_LEFT, TA_CENTER

# ── Color palette ─────────────────────────────────────────────────────────────
NAVY    = colors.HexColor('#1A3A5C')
LBLUE   = colors.HexColor('#D0E4F7')
LGREY   = colors.HexColor('#F5F7FA')
MGREY   = colors.HexColor('#C0CDD8')
WHITE   = colors.white
BLACK   = colors.black
DK_GREY = colors.HexColor('#444444')
MD_GREY = colors.HexColor('#888888')


def _fmt(n: float) -> str:
    """Format a number as currency: $1,234.56"""
    return f"${n:,.2f}"


def _report_date() -> str:
    return datetime.now().strftime("%B %d, %Y")


# ─────────────────────────────────────────────────────────────────────────────
# PDF generator
# ─────────────────────────────────────────────────────────────────────────────

def generate_pdf(data: dict) -> str:
    """
    Build a Statement of Financial Position PDF.
    Returns the path to the generated file.
    """
    tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
    tmp.close()
    out_path = tmp.name

    report_date = data.get("report_date", _report_date())
    properties  = data.get("properties", [])
    investments = data.get("investments", [])
    mortgages   = data.get("mortgages", [])

    doc = SimpleDocTemplate(
        out_path,
        pagesize=letter,
        leftMargin=inch,
        rightMargin=inch,
        topMargin=inch * 1.1,
        bottomMargin=inch,
        title="Statement of Financial Position",
        author="DeepRoot Financial Dashboard",
    )

    styles = getSampleStyleSheet()
    normal = styles["Normal"]

    def style(name, **kw):
        return ParagraphStyle(name, parent=normal, **kw)

    s_body      = style("Body", fontSize=10, leading=14, textColor=DK_GREY, fontName="Helvetica")
    s_body_r    = style("BodyR", fontSize=10, leading=14, textColor=DK_GREY, alignment=TA_RIGHT, fontName="Helvetica")
    s_bold      = style("Bold", fontSize=10, leading=14, textColor=DK_GREY, fontName="Helvetica-Bold")
    s_bold_r    = style("BoldR", fontSize=10, leading=14, textColor=DK_GREY, alignment=TA_RIGHT, fontName="Helvetica-Bold")
    s_sub_r     = style("SubR", fontSize=9, leading=12, textColor=MD_GREY, alignment=TA_RIGHT, fontName="Helvetica")
    s_white     = style("White", fontSize=10, leading=14, textColor=WHITE, fontName="Helvetica-Bold")
    s_white_r   = style("WhiteR", fontSize=10, leading=14, textColor=WHITE, alignment=TA_RIGHT, fontName="Helvetica-Bold")
    s_white_lg  = style("WhiteLg", fontSize=12, leading=16, textColor=WHITE, fontName="Helvetica-Bold")
    s_white_lg_r= style("WhiteLgR", fontSize=12, leading=16, textColor=WHITE, alignment=TA_RIGHT, fontName="Helvetica-Bold")

    COL1 = 4.0 * inch
    COL2 = 2.0 * inch
    TW   = COL1 + COL2  # 6 inches

    def section_header(label: str):
        return [
            [Paragraph(label, s_white), Paragraph("", s_white_r)],
        ]

    def data_row(label: str, value: str):
        return [Paragraph(f"  {label}", s_body), Paragraph(value, s_body_r)]

    def subtotal_row(label: str, value: str):
        return [Paragraph(f"  {label}", s_bold), Paragraph(value, s_bold_r)]

    def total_row(label: str, value: str):
        return [Paragraph(label, s_white_lg), Paragraph(value, s_white_lg_r)]

    def build_table(table_data, style_cmds):
        t = Table(table_data, colWidths=[COL1, COL2])
        t.setStyle(TableStyle(style_cmds))
        return t

    # ── Story ─────────────────────────────────────────────────────────────────
    story = []

    # Title block
    story.append(Paragraph(
        '<font color="#1A3A5C"><b>STATEMENT OF FINANCIAL POSITION</b></font>',
        ParagraphStyle("Title", parent=normal, fontSize=18, leading=22, fontName="Helvetica-Bold", textColor=NAVY)
    ))
    story.append(Paragraph(
        f'As of <b>{report_date}</b>',
        ParagraphStyle("Sub", parent=normal, fontSize=10, textColor=DK_GREY, fontName="Helvetica")
    ))
    story.append(HRFlowable(width="100%", thickness=2, color=NAVY, spaceAfter=14))

    # ── ASSETS ────────────────────────────────────────────────────────────────
    asset_rows = [section_header("ASSETS")]

    real_estate_total = 0.0
    for i, p in enumerate(properties):
        val = p.get("current_value") or p.get("purchase_price") or 0.0
        real_estate_total += val
        addr_parts = [p.get("address_street"), p.get("address_city"), p.get("address_state")]
        addr = ", ".join(x for x in addr_parts if x) or p.get("address") or "Property"
        label = f"{p.get('property_type', 'Property')}: {addr}"
        asset_rows.append(data_row(label, _fmt(val)))

    if not properties:
        asset_rows.append(data_row("No properties on record", "—"))

    asset_rows.append(subtotal_row("Total Real Estate", _fmt(real_estate_total)))

    invest_total = 0.0
    for i, inv in enumerate(investments):
        val = inv.get("current_value") or 0.0
        invest_total += val
        label = f"{inv.get('account_type', '')}: {inv.get('name', '')}"
        asset_rows.append(data_row(label, _fmt(val)))

    if not investments:
        asset_rows.append(data_row("No investment accounts on record", "—"))

    asset_rows.append(subtotal_row("Total Investment Accounts", _fmt(invest_total)))

    total_assets = real_estate_total + invest_total
    asset_rows.append(total_row("TOTAL ASSETS", _fmt(total_assets)))

    n_prop = len(properties)
    n_inv  = len(investments)
    # section header=0, prop rows=n_prop, subtotal=1, inv rows, subtotal, total
    asset_style = [
        ("BACKGROUND", (0, 0), (1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (1, 0), WHITE),
        ("GRID", (0, 0), (-1, -1), 0.5, MGREY),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        # Subtotal rows
        ("BACKGROUND", (0, n_prop + 1), (1, n_prop + 1), LBLUE),
        ("BACKGROUND", (0, n_prop + 2 + n_inv + 1), (1, n_prop + 2 + n_inv + 1), LBLUE),
        # Total row
        ("BACKGROUND", (0, -1), (1, -1), NAVY),
        ("TEXTCOLOR", (0, -1), (1, -1), WHITE),
        # Alternating property rows
    ]
    for idx in range(n_prop):
        if idx % 2 == 1:
            asset_style.append(("BACKGROUND", (0, 1 + idx), (1, 1 + idx), LGREY))
    for idx in range(n_inv):
        if idx % 2 == 1:
            asset_style.append(("BACKGROUND", (0, n_prop + 2 + idx), (1, n_prop + 2 + idx), LGREY))

    story.append(build_table(asset_rows, asset_style))
    story.append(Spacer(1, 18))

    # ── LIABILITIES ───────────────────────────────────────────────────────────
    liab_rows = [section_header("LIABILITIES")]

    mortgage_total = 0.0
    for i, m in enumerate(mortgages):
        bal = m.get("outstanding_balance") or 0.0
        mortgage_total += bal
        addr = m.get("address") or "Property"
        liab_rows.append(data_row(f"Mortgage: {addr}", _fmt(bal)))

    if not mortgages:
        liab_rows.append(data_row("No outstanding mortgages", "—"))

    n_mort = len(mortgages)
    liab_rows.append(total_row("TOTAL LIABILITIES", _fmt(mortgage_total)))

    liab_style = [
        ("BACKGROUND", (0, 0), (1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (1, 0), WHITE),
        ("GRID", (0, 0), (-1, -1), 0.5, MGREY),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("BACKGROUND", (0, -1), (1, -1), NAVY),
        ("TEXTCOLOR", (0, -1), (1, -1), WHITE),
    ]
    for idx in range(n_mort):
        if idx % 2 == 1:
            liab_style.append(("BACKGROUND", (0, 1 + idx), (1, 1 + idx), LGREY))

    story.append(build_table(liab_rows, liab_style))
    story.append(Spacer(1, 18))

    # ── NET WORTH ─────────────────────────────────────────────────────────────
    net_worth = total_assets - mortgage_total
    nw_rows = [total_row("NET WORTH  (Total Assets − Total Liabilities)", _fmt(net_worth))]
    nw_style = [
        ("BACKGROUND", (0, 0), (1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (1, 0), WHITE),
        ("GRID", (0, 0), (-1, -1), 0.5, MGREY),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]
    story.append(build_table(nw_rows, nw_style))
    story.append(Spacer(1, 24))

    # Disclaimer
    story.append(Paragraph(
        "<i>This statement is generated from data entered in the DeepRoot Financial Dashboard and is for "
        "informational purposes only. It does not constitute professional financial or legal advice. "
        "Property values reflect the most recent automated valuation or purchase price where no valuation "
        "is available. Investment balances reflect the most recently recorded value.</i>",
        ParagraphStyle("Disc", parent=normal, fontSize=8, textColor=MD_GREY, fontName="Helvetica-Oblique", leading=11)
    ))

    # ── Page header/footer via canvas ─────────────────────────────────────────
    def _on_page(canvas, doc):
        w, h = letter
        # Footer line
        canvas.saveState()
        canvas.setStrokeColor(NAVY)
        canvas.setLineWidth(1)
        canvas.line(inch, 0.7 * inch, w - inch, 0.7 * inch)
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(MD_GREY)
        canvas.drawString(inch, 0.5 * inch, "DeepRoot Financial Dashboard — Confidential")
        canvas.drawRightString(w - inch, 0.5 * inch, f"Page {doc.page}")
        canvas.restoreState()

    doc.build(story, onFirstPage=_on_page, onLaterPages=_on_page)
    return out_path


# ─────────────────────────────────────────────────────────────────────────────
# DOCX generator
# ─────────────────────────────────────────────────────────────────────────────

def generate_docx(data: dict) -> str:
    """
    Build a Statement of Financial Position DOCX via generate_statement.js.
    Returns the path to the generated file.
    """
    tmp = tempfile.NamedTemporaryFile(suffix=".docx", delete=False)
    tmp.close()
    out_path = tmp.name

    payload = dict(data, output_path=out_path)
    payload.setdefault("report_date", _report_date())

    script = Path(__file__).parent / "generate_statement.js"

    result = subprocess.run(
        ["node", str(script)],
        input=json.dumps(payload),
        capture_output=True,
        text=True,
        timeout=30,
    )

    if result.returncode != 0:
        raise RuntimeError(
            f"generate_statement.js failed (exit {result.returncode}):\n"
            f"STDOUT: {result.stdout}\nSTDERR: {result.stderr}"
        )

    return out_path
