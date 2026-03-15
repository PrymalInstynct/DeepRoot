# Architectural Decisions Record

This document tracks major architectural choices, component designs, and technical strategies applied across the project. It should be consulted during the 'Discovery' phase before suggesting new libraries or making structural changes.

## Decision 1: DOCX Generation via Node.js (`docx` NPM package)
**Decision**: Use a Node.js micro-script (`docx` package) called by the backend to generate `.docx` formatted financial statements, rather than a native Python package.
**Rationale**: The Node.js ecosystem has superior documentation, actively maintained packages for DOCX building, and explicitly maps to the agent's available `.agent/skills/docx` skill. It aligns seamlessly with the project's primary Node.js/JavaScript tech stack.
**Status**: Active
**Consequences**: The deployment environment natively requires `Node.js (v20+)` alongside the Python/FastAPI environment in order to spawn the DOCX generator subprocess (`api/generate_statement.js`).

## Decision 2: PDF Generation via ReportLab
**Decision**: Use `reportlab` within the Python backend (`api/export_service.py`) to generate PDF financial statements.
**Rationale**: `reportlab` provides robust, scriptable control over PDF canvas creation on the server side, making it highly reliable for drawing exact financial tables and custom layouts without needing browser-based UI rendering bridges like Puppeteer.
**Status**: Active
**Consequences**: PDF layout logic is isolated inside the Python backend and maintained independently from the DOCX formatting logic.

## Decision 3: Property Entry Decoupled from Global Settings
**Decision**: Decouple mortgage and property mapping from monolithic 'Global Settings' into an independent, relational `Property` database model with atomic fields (e.g., Street, City, State, Zipcode).
**Rationale**: Enables the tracking of an arbitrary number of multiple properties, allows granular extra payment modeling for individual terms, and fixes bad data types (e.g., address defaulting to `0.00`).
**Status**: Active
**Consequences**: Global Settings no longer auto-applies real estate variables. The frontend property management dashboard now relies on a customized 3-column responsive layout (Form, Table, and Chart) uniquely designed to manage the independent property objects.