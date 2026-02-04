# 2. Backend entry points — overview

---

## 2.1 Where entry points are defined

Backend entry points are defined in:

- `routes/web.php`
- `routes/api.php`
- `routes/backend/*.php`

Admin backend routes are grouped under:

- **Prefix:** `/admin`
- **Namespace:** `Backend`
- **Middleware:** `admin` (authentication)

---

## 2.2 High-level flow

<!-- DIAGRAM: architecture-overview -->

*(Insert diagram: request flow from HTTP/API/webhook → middleware → route → controller → repository / service → DB / external.)*

---

## 2.3 Entry point types (summary)

| Type | Source | Examples |
|------|--------|----------|
| HTTP (web) | `routes/web.php` | Public: login, cron-like GETs, visualizations. Authenticated: Passport OAuth, token refresh. |
| HTTP (admin) | `routes/backend/*.php` | All under `/admin` with `admin` middleware: CRUD, DataTables, module-specific actions. |
| API | `routes/api.php` | Prefix `api`: Mailgun webhook, `v1/auth/*`, `v1/pages`, `v1/faqs`, `v1/blog-*` resources. |
| Webhooks | `web.php`, `api.php` | `inbound_message/`, `inbound_status/`, `api/mailgun/widgets`. |
| Cron-like | GET/ANY in `web.php` | `rxnewupdate`, `micropatientupdate`, `signdocumentsingle`, `orderdateimport`, `fillFilldates`. |
| CLI | `routes/console.php` | `inspire` (closure). |
| Scheduler | `app/Console/Kernel.php` | Empty in scan. |
| Queue jobs | — | No `app/Jobs` dir; `ProcessWidgetFiles` referenced but dispatch commented. |

Details: see `03-routes/`, `04-non-http.md`, and `05-execution-chains.md`.
