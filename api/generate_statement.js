/**
 * generate_statement.js
 * Reads JSON from stdin, builds a professional Statement of Financial Position .docx
 * Uses: npm install -g docx
 * Output path printed to stdout.
 */
const fs = require('fs');
const path = require('path');
const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
    ShadingType, VerticalAlign, PageNumber, TabStopType, TabStopPosition,
    WidthType: WT
} = require('docx');

// Read stdin
let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', async () => {
    const data = JSON.parse(raw);
    const outPath = data.output_path;

    // ── Helpers ──────────────────────────────────────────────────────────────
    const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const BLUE  = '1A3A5C';
    const LBLUE = 'D0E4F7';
    const GREY  = 'F5F7FA';
    const WHITE = 'FFFFFF';
    const BORDER_COLOR = 'C0CDD8';

    const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR };
    const borders    = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
    const noBorders  = {
        top:    { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        left:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    };

    // Page content width: US Letter 8.5" - 2*1.25" margins = 6" = 8640 DXA
    const CONTENT_W = 8640;
    const COL1 = 5760;  // ~4"
    const COL2 = 2880;  // ~2"

    const sectionHeaderRow = (label) => new TableRow({
        children: [
            new TableCell({
                columnSpan: 2,
                borders,
                shading: { fill: BLUE, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 150, right: 150 },
                width: { size: CONTENT_W, type: WidthType.DXA },
                children: [new Paragraph({
                    children: [new TextRun({ text: label, bold: true, color: WHITE, size: 22, font: 'Arial' })],
                })],
            }),
        ],
    });

    const dataRow = (label, value, shade = false) => new TableRow({
        children: [
            new TableCell({
                borders,
                shading: shade ? { fill: GREY, type: ShadingType.CLEAR } : { fill: WHITE, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 150, right: 80 },
                width: { size: COL1, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, font: 'Arial' })] })],
            }),
            new TableCell({
                borders,
                shading: shade ? { fill: GREY, type: ShadingType.CLEAR } : { fill: WHITE, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 80, right: 150 },
                width: { size: COL2, type: WidthType.DXA },
                children: [new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: value, size: 20, font: 'Arial' })],
                })],
            }),
        ],
    });

    const subtotalRow = (label, value) => new TableRow({
        children: [
            new TableCell({
                borders,
                shading: { fill: LBLUE, type: ShadingType.CLEAR },
                margins: { top: 90, bottom: 90, left: 150, right: 80 },
                width: { size: COL1, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font: 'Arial' })] })],
            }),
            new TableCell({
                borders,
                shading: { fill: LBLUE, type: ShadingType.CLEAR },
                margins: { top: 90, bottom: 90, left: 80, right: 150 },
                width: { size: COL2, type: WidthType.DXA },
                children: [new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: value, bold: true, size: 20, font: 'Arial' })],
                })],
            }),
        ],
    });

    // ── Build rows ────────────────────────────────────────────────────────────
    const rows = [];

    // ASSETS
    rows.push(sectionHeaderRow('ASSETS'));

    // Real Estate
    let realEstateTotal = 0;
    const properties = data.properties || [];
    if (properties.length === 0) {
        rows.push(dataRow('  No properties on record', '—', false));
    } else {
        properties.forEach((p, i) => {
            const val = p.current_value || p.purchase_price || 0;
            realEstateTotal += val;
            const addr = [p.address_street, p.address_city, p.address_state].filter(Boolean).join(', ') || p.address || 'Property';
            rows.push(dataRow(`  ${p.property_type}: ${addr}`, fmt(val), i % 2 === 1));
        });
    }
    rows.push(subtotalRow('  Total Real Estate', fmt(realEstateTotal)));

    // Investment Accounts
    let investTotal = 0;
    const investments = data.investments || [];
    if (investments.length === 0) {
        rows.push(dataRow('  No investment accounts on record', '—', false));
    } else {
        investments.forEach((inv, i) => {
            investTotal += inv.current_value || 0;
            rows.push(dataRow(`  ${inv.account_type}: ${inv.name}`, fmt(inv.current_value), i % 2 === 1));
        });
    }
    rows.push(subtotalRow('  Total Investment Accounts', fmt(investTotal)));

    const totalAssets = realEstateTotal + investTotal;
    rows.push(subtotalRow('TOTAL ASSETS', fmt(totalAssets)));

    // Spacer
    rows.push(new TableRow({
        children: [
            new TableCell({ columnSpan: 2, borders: noBorders, width: { size: CONTENT_W, type: WidthType.DXA }, children: [new Paragraph('')] }),
        ],
    }));

    // LIABILITIES
    rows.push(sectionHeaderRow('LIABILITIES'));

    let mortgageTotal = 0;
    const mortgages = data.mortgages || [];
    if (mortgages.length === 0) {
        rows.push(dataRow('  No outstanding mortgages', '—', false));
    } else {
        mortgages.forEach((m, i) => {
            mortgageTotal += m.outstanding_balance || 0;
            const addr = m.address || 'Property';
            rows.push(dataRow(`  Mortgage: ${addr}`, fmt(m.outstanding_balance), i % 2 === 1));
        });
    }
    rows.push(subtotalRow('TOTAL LIABILITIES', fmt(mortgageTotal)));

    // Spacer
    rows.push(new TableRow({
        children: [
            new TableCell({ columnSpan: 2, borders: noBorders, width: { size: CONTENT_W, type: WidthType.DXA }, children: [new Paragraph('')] }),
        ],
    }));

    // NET WORTH
    const netWorth = totalAssets - mortgageTotal;
    rows.push(new TableRow({
        children: [
            new TableCell({
                borders,
                shading: { fill: BLUE, type: ShadingType.CLEAR },
                margins: { top: 120, bottom: 120, left: 150, right: 80 },
                width: { size: COL1, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: 'NET WORTH (Total Assets − Total Liabilities)', bold: true, color: WHITE, size: 24, font: 'Arial' })] })],
            }),
            new TableCell({
                borders,
                shading: { fill: BLUE, type: ShadingType.CLEAR },
                margins: { top: 120, bottom: 120, left: 80, right: 150 },
                width: { size: COL2, type: WidthType.DXA },
                children: [new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: fmt(netWorth), bold: true, color: WHITE, size: 24, font: 'Arial' })],
                })],
            }),
        ],
    }));

    // ── Document ──────────────────────────────────────────────────────────────
    const reportDate = data.report_date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const doc = new Document({
        styles: {
            default: {
                document: { run: { font: 'Arial', size: 20 } },
            },
        },
        sections: [{
            properties: {
                page: {
                    size: { width: 12240, height: 15840 },
                    margin: { top: 1152, right: 1152, bottom: 1152, left: 1152 }, // 0.8"
                },
            },
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 4 } },
                            children: [
                                new TextRun({ text: 'STATEMENT OF FINANCIAL POSITION', bold: true, size: 28, color: BLUE, font: 'Arial' }),
                                new TextRun({ text: '\t' + reportDate, size: 20, color: '666666', font: 'Arial' }),
                            ],
                            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                        }),
                    ],
                }),
            },
            footers: {
                default: new Footer({
                    children: [
                        new Paragraph({
                            border: { top: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 4 } },
                            children: [
                                new TextRun({ text: 'DeepRoot Financial Dashboard — Confidential', size: 16, color: '888888', font: 'Arial' }),
                                new TextRun({ text: '\tPage ', size: 16, color: '888888', font: 'Arial' }),
                                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '888888', font: 'Arial' }),
                                new TextRun({ text: ' of ', size: 16, color: '888888', font: 'Arial' }),
                                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '888888', font: 'Arial' }),
                            ],
                            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                        }),
                    ],
                }),
            },
            children: [
                // Sub-title line
                new Paragraph({
                    spacing: { before: 0, after: 240 },
                    children: [
                        new TextRun({ text: 'As of ', size: 20, color: '444444', font: 'Arial' }),
                        new TextRun({ text: reportDate, bold: true, size: 20, color: '444444', font: 'Arial' }),
                    ],
                }),

                // Main balance-sheet table
                new Table({
                    width: { size: CONTENT_W, type: WidthType.DXA },
                    columnWidths: [COL1, COL2],
                    rows,
                }),

                // Disclaimer
                new Paragraph({
                    spacing: { before: 360, after: 0 },
                    children: [
                        new TextRun({
                            text: 'This statement is generated from data entered in the DeepRoot Financial Dashboard and is for informational purposes only. It does not constitute professional financial or legal advice. Property values reflect the most recent automated valuation or purchase price where no valuation is available. Investment balances reflect the most recently recorded value.',
                            size: 16, color: '888888', italics: true, font: 'Arial',
                        }),
                    ],
                }),
            ],
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outPath, buffer);
    process.stdout.write(outPath);
});
