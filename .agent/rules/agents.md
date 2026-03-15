---
trigger: always_on
---

# AGENTS.md - Project Intelligence Manual

## Project Overview
- **Name:** Financial Planning App
- **Goal:** A financial planning tool focused on the total financial picture and wealth-building
- **Tech Stack:** Node.js (v20+), JavaScript

## Operating Rules
- **Branching:** Follow the naming convention in `.agent/rules/management.md`.
- **Progress Tracking:** Always update `TASKS.md` before and after work.
- **Dependencies:** Always check `package.json` before implementing new imports. Use `npm` for installations.

## UI/UX Standards
- Use the **Tailwind CSS** (if applicable) for styling.
- Follow the **frontend-design** skill for component layout.
- Exported documents (PDF/DOCX) must use professional financial formatting (Table-based, 2 decimal places, clear headers).

## Security & Privacy
- Zero-logging of sensitive financial data.
- Use `.env` for all secrets; never hardcode credentials.