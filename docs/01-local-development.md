# 1. Local development and running the stack

---

## 1.1 Components

| Component | Local URL | How to run | Notes |
|-----------|-----------|------------|-------|
| **Visual demo (Next.js)** | http://localhost:3000 | `cd visual-demo/frontend && npm run dev` | Running. Network address reported: http://192.168.1.28:3000 |
| **Laravel backend** | http://127.0.0.1:8000 | `cd boca340binsights.com-main && composer install && php artisan serve` | **UNRESOLVED — REQUIRES HUMAN REVIEW:** `composer install` fails on PHP 8.5.2 (lock expects PHP ~8.0–8.2). Repo lacks `.env`; copy `.env.example` → `.env`, configure DB, run `php artisan key:generate`, `php artisan migrate`, `php artisan passport:install`, `php artisan db:seed` (per `readme.md`). |

---

## 1.2 Quick reference

- **Next.js:** Serves the visual-demo UI and can consume Laravel visualization endpoints.
- **Laravel:** Serves web and API routes; admin is under `/admin` with auth middleware.
- **Database:** Laravel expects MySQL (and optionally MSSQL per location); configure in `.env` after copying from `.env.example`.
