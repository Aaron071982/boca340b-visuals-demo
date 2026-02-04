# 9. Observability and visualization hooks

This codebase includes a custom, application-level visualization event system.

---

## 9.1 Components

**VisualizationMiddleware**

- Injects request IDs (`X-Request-ID`)
- Emits response lifecycle event(s)

**VisualizationEventService**

- Emits structured events (route matched, controller enter/exit, DB query, external call, response sent, error)
- Stores an in-memory buffer (last ~50 requests)

**VisualizationController**

- `GET /visualizations/events`: SSE stream for live/replay
- `GET /visualizations/events/json`: JSON access to buffered events

<!-- DIAGRAM: observability-flow -->

*(Insert diagram: request → VisualizationMiddleware → controller → VisualizationEventService → buffer; SSE/JSON endpoints.)*

---

## 9.2 Limitations observed in scan

- No tracing SDK detected (no OpenTelemetry SDK in scanned code output).
- No metrics emission detected.
- **UNRESOLVED — REQUIRES HUMAN REVIEW:** Confirm whether APM/logging is configured externally (infrastructure or config not scanned).
