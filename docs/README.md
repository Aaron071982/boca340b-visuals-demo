# Boca Backend — Documentation (Phase 2)

**Scope:** Repo-extracted facts from routes, controllers, repositories, models, middleware, and services.  
**Method:** Factual extraction only. No inferred endpoints, tables, or improvements.  
**Source:** Cursor scan output provided by Aaron.  
**Status:** Items requiring confirmation are labeled **UNRESOLVED — REQUIRES HUMAN REVIEW**.

---

## Folder structure

```
docs/
├── README.md                    ← This file (index + nav)
├── 01-local-development.md      ← Running the stack, URLs, setup notes
├── 02-entry-points.md           ← Overview of routes / web / api / admin
├── 03-routes/
│   ├── README.md                ← Routes index + nav
│   ├── web-public-authenticated.md   ← HTTP routes from web.php (tables)
│   ├── admin-modules.md          ← Admin route groups and module list
│   └── api-v1.md                ← API routes (api.php) table
├── 04-non-http.md                ← Webhooks, cron-like, CLI, scheduler, jobs
├── 05-execution-chains.md       ← Representative call chains (Section 5)
├── 06-database/
│   ├── README.md                ← Data access summary + pattern
│   └── tables-by-domain.md      ← Table domains (auth, CMS, customers, etc.)
├── 07-integrations.md           ← External services catalog + notes
├── 08-middleware-events-jobs.md ← Middleware, events/listeners, queues/scheduler
├── 09-observability.md           ← Visualization hooks, limits, open items
├── 10-validation-open-items.md  ← Validation summary + Phase 2 mapping
└── _diagrams/                   ← Placeholder dir for generated diagrams
    └── README.md                ← Diagram manifest (filenames + insert locations)
```

---

## Diagram insertion map

| Diagram | Source sections | Insert in file | Placeholder |
|--------|------------------|----------------|-------------|
| Architecture overview | 2, 8 | `02-entry-points.md` | `<!-- DIAGRAM: architecture-overview -->` |
| Route / layer map | 3 | `03-routes/README.md` | `<!-- DIAGRAM: route-layer-map -->` |
| Admin module map | 3.2 | `03-routes/admin-modules.md` | `<!-- DIAGRAM: admin-module-map -->` |
| Execution chain (sample) | 5 | `05-execution-chains.md` | `<!-- DIAGRAM: execution-chain-sms -->` |
| Data access / DB context | 6 | `06-database/README.md` | `<!-- DIAGRAM: database-context -->` |
| Integrations map | 7 | `07-integrations.md` | `<!-- DIAGRAM: integrations-map -->` |
| Middleware / pipeline | 8 | `08-middleware-events-jobs.md` | `<!-- DIAGRAM: middleware-pipeline -->` |
| Observability flow | 9 | `09-observability.md` | `<!-- DIAGRAM: observability-flow -->` |

See `_diagrams/README.md` for exact placeholder snippets to paste into each file.
