# 3. Entry point index — routes

---

## 3.1 Route inventory

<!-- DIAGRAM: route-layer-map -->

*(Insert diagram: layers — web vs api vs admin; middleware groups; public vs authenticated.)*

| Doc | Content |
|-----|--------|
| [web-public-authenticated.md](web-public-authenticated.md) | HTTP routes from `web.php` (tables: path, methods, handler, middleware, auth). |
| [admin-modules.md](admin-modules.md) | Admin route groups and module list (`/admin/*`). |
| [api-v1.md](api-v1.md) | API routes from `api.php` (Mailgun webhook, v1 auth and resources). |

---

## 3.2 Route file layout

- **Web:** `routes/web.php` — global, Passport-style, login, cron-like, visualizations; includes `routes/frontend/*.php` and `routes/backend/*.php` (admin).
- **API:** `routes/api.php` — Mailgun webhook group, then `Api\V1` group (auth + resources).
- **Backend:** `routes/backend/*.php` — one file per admin module (auth, dashboard, customers, orders, SMS, etc.); all under namespace `Backend`, prefix `admin`, middleware `admin`.
