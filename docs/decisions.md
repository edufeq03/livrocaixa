# ADR (Architecture Decision Records) & Project Strategies

This document tracks all key architectural decisions, technological choices, and strategic changes for the Livro Caixa project.

## Architectural Decisions

### ADR 1: Documentation Structure
- **Date:** 2026-02-23
- **Decision:** All technical documentation, specifications, and decision logs will be stored in the `livrocaixa/docs/` folder.
- **Rationale:** Keeps the project organized within its dedicated folder, allowing for other independent projects in the same workspace.

### ADR 2: Code Standard and Language
- **Date:** 2026-02-23
- **Decision:** Use English for all code-related elements (variables, functions, classes, comments) and Portuguese for the User Interface (UI).
- **Rationale:** Technical standard for code while maintaining accessibility for the target Portuguese-speaking users.

### ADR 3: Domain and Tenancy Strategy
- **Date:** 2026-02-23
- **Decision:** Use a single subdomain/domain for the entire system for the MVP. Identification of tenants might change to path-based or slug-based if wildcard DNS is not used, but the core focus is a unified entry point.
- **Rationale:** Simplifies initial deployment and DNS management.

### ADR 4: SMTP and E-mail
- **Date:** 2026-02-23
- **Decision:** Use a Gmail account (ideally a dedicated one) for transactional emails during development and MVP.
- **Rationale:** Low cost and ease of setup for initial tests.

### ADR 5: File Storage Strategy
- **Date:** 2026-02-23
- **Decision:** Implement file upload from day one, using local storage within the container mapped to a persistent volume.
- **Rationale:** Meets the requirement for proof-of-payment uploads.

### ADR 6: Cross-Platform Portability (Windows/Linux)
- **Date:** 2026-02-23
- **Decision:** The project must be developed using platform-agnostic practices: relative paths, environment variables for all configs, and standardized dependency files (`requirements.txt`, `package.json`).
- **Rationale:** Allows the user to move between Windows and Linux without code changes.

### ADR 7: Frontend Component Library & Icons
- **Date:** 2026-02-23
- **Decision:** Use Lucide React for consistent icons and Tailwind CSS v4 for modern utility-first styling.
- **Rationale:** High-quality icons and state-of-the-art styling framework to ensure a premium look and feel.

### ADR 8: Local Database for MVP
- **Date:** 2026-02-23
- **Decision:** Use SQLite for local development and MVP phase.
- **Rationale:** Zero configuration required, simplifies initial testing and local setup while maintaining compatibility with SQLAlchemy for future Postgres migration.

### ADR 9: Multi-Tenant Data Isolation
- **Date:** 2026-02-23
- **Decision:** Schema-level isolation via `tenant_id` column in all core tables.
- **Rationale:** Easiest to implement for MVP on a single DB instance while providing strict logical separation in queries.

### ADR 10: Frontend State Management
- **Date:** 2026-02-23
- **Decision:** Use React Context API for global state (Auth) and Axios for API communication.
- **Rationale:** Lightweight and sufficient for the current scale without the complexity of Redux/Zustand.
