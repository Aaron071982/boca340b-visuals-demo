# 8. Middleware, events, and background execution

---

## 8.1 Middleware (selected)

**Global middleware:** Proxies, maintenance, read-only mode, request trimming, empty-string conversion, **VisualizationMiddleware** (sets `X-Request-ID`, emits response-sent event).

**Route/group middleware:**

- **web:** Sessions, CSRF, locale, bindings, logout behavior
- **api:** Throttle + bindings
- **admin:** Authentication
- **mailgun.webhook:** Webhook signature verification
- **Spatie:** Permission middleware for auth routes

<!-- DIAGRAM: middleware-pipeline -->

*(Insert diagram: request → global middleware → group (web/api/admin) → route middleware → controller.)*

---

## 8.2 Events and listeners

- Domain events are dispatched primarily from repository create/update/delete operations.
- Subscribers are registered in `app/Providers/EventServiceProvider.php` via `$subscribe` (auto-discovery disabled).
- **Example event families:**
  - User lifecycle (created/updated/deleted/password changed/confirmed/etc.)
  - Role and permission events
  - Entity create/update/delete across modules (customers, products, locations, SMS, billing, etc.)

---

## 8.3 Jobs, queues, scheduling

- **Scheduler:** No active Laravel scheduler jobs found; `Kernel::schedule()` is empty.
- **Jobs:** No `app/Jobs` directory found.
- **Queue:** One job (`ProcessWidgetFiles`) is referenced but dispatch is commented in `MailgunWidgetsController`.
