# Diagram manifest and insertion placeholders

Diagrams matching the **website right-panel** (Architecture, Dependencies, Database/ERD, Flow) are stored here as PNG and SVG.

---

## Available diagrams (from visual-demo website)

| Tab on website | Files | Source Mermaid |
|----------------|-------|----------------|
| **Architecture** | `architecture.svg`, `architecture.png` | `architecture_architecture.md_01.mmd` |
| **Dependencies** | `dependency-graph.svg`, `dependency-graph.png` | `architecture_dependency-graph.md_01.mmd` |
| **Database/ERD** | `database-erd.svg`, `database-erd.png` | `data_database-erd.md_01.mmd` |
| **Flow** (auth) | `flow-auth.svg`, `flow-auth.png` | `flows_auth-flow.md_01.mmd` |

Use SVG for sharp scaling in docs; use PNG for compatibility (e.g. Word, slides).

---

## Placeholder snippets (paste into docs)

Use these exact comments in the corresponding `.md` files so diagram generators know where to insert or link images.

| File | Placeholder comment | Suggested diagram filename |
|------|---------------------|-----------------------------|
| `../02-entry-points.md` | `<!-- DIAGRAM: architecture-overview -->` | `architecture-overview.svg` or `.png` |
| `../03-routes/README.md` | `<!-- DIAGRAM: route-layer-map -->` | `route-layer-map.svg` or `.png` |
| `../03-routes/admin-modules.md` | `<!-- DIAGRAM: admin-module-map -->` | `admin-module-map.svg` or `.png` |
| `../05-execution-chains.md` | `<!-- DIAGRAM: execution-chain-sms -->` | `execution-chain-sms.svg` or `.png` |
| `../06-database/README.md` | `<!-- DIAGRAM: database-context -->` | `database-context.svg` or `.png` |
| `../07-integrations.md` | `<!-- DIAGRAM: integrations-map -->` | `integrations-map.svg` or `.png` |
| `../08-middleware-events-jobs.md` | `<!-- DIAGRAM: middleware-pipeline -->` | `middleware-pipeline.svg` or `.png` |
| `../09-observability.md` | `<!-- DIAGRAM: observability-flow -->` | `observability-flow.svg` or `.png` |

---

## Markdown image syntax (after generation)

Once a diagram file exists, reference it in the doc like this:

```markdown
<!-- DIAGRAM: architecture-overview -->
![Architecture overview](_diagrams/architecture-overview.svg)
```

Use relative path from the doc file (e.g. from `docs/02-entry-points.md` use `_diagrams/architecture-overview.svg`).
