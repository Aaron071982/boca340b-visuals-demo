# boca-visualizations

This repository contains architecture diagrams, request flow sequences, database entity relationships, and integration documentation for the Boca 340B Insights system.

All diagrams are rendered using **GitHub's native Mermaid support**, so they display visually when viewing files on GitHub.

---

## Table of Contents

- [Architecture Overview](architecture/overview.md) - High-level system explanation with layered architecture diagram
- [Architecture Details](architecture/architecture.md) - Detailed architecture diagram and component descriptions
- [Dependency Graph](architecture/dependency-graph.md) - Module dependency flow diagram
- [Request Flows](flows/) - Sequence diagrams for key system flows:
  - [Authentication Flow](flows/auth-flow.md) - Admin login with OTP verification
  - [Customer Management Flow](flows/customer-flow.md) - Customer lifecycle management
  - [Order Receiving Flow](flows/order-flow.md) - Order processing and inventory updates
  - [Inbound SMS Flow](flows/inbound-sms-flow.md) - SMS webhook processing
- [Database ERD](data/database-erd.md) - Entity relationship diagram (Central DB vs Tenant DBs)
- [Security & Authentication](security/security-auth.md) - Auth mechanisms, roles/permissions, webhook security
- [Integrations](integrations/integrations.md) - External service integrations table

---

## Quick Start

1. Navigate to any diagram file above to view the visual diagrams
2. Diagrams render automatically on GitHub when viewing `.md` files
3. Each flow document contains a single sequence diagram for clarity

---

## System Overview

The Boca 340B Insights system is a multi-tenant Laravel application with:

- **Layered Architecture**: UI → Routes → Controllers → Repositories → Services → Models → Database
- **Multi-Database Tenancy**: Session-based dynamic database connection switching per location
- **Dual Authentication**: Web session auth (admin panel) + Passport OAuth (REST API)
- **External Integrations**: Mailgun, Twilio, FedEx, Square, RingCentral, and more

For detailed information, see the documentation files linked above.
