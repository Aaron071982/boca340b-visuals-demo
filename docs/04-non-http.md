# 4. Non-HTTP entry points

---

## Table

| Type | Trigger | Handler | Notes |
|------|---------|---------|-------|
| **Webhook** | POST `api/mailgun/widgets` | `MailgunWidgetsController@store` | Signature-validated via middleware |
| **Webhook** | POST `inbound_message/` | `CustomerSmsController@inbound_message` | Public endpoint |
| **Webhook** | POST `inbound_status/` | `CustomerSmsController@inbound_status` | Public endpoint |
| **Cron-like (HTTP-exposed)** | GET/ANY (multiple) | `CronController`, `CustomersController`, `DashboardController` | Public routes used for periodic tasks (e.g. `rxnewupdate`, `micropatientupdate`, `signdocumentsingle`, `orderdateimport`, `fillFilldates`) |
| **CLI** | `inspire` | Closure | `routes/console.php` |
| **Scheduler** | — | — | `app/Console/Kernel.php` `schedule()` is empty |
| **Queue jobs** | — | — | No `app/Jobs` directory found; one job reference (`ProcessWidgetFiles`) exists but dispatch is commented in `MailgunWidgetsController` |

---

## Notes

- Webhooks are the only non-HTTP “trigger” style entry points confirmed in the scan; cron-like behavior is implemented via public HTTP GET/ANY routes.
- Scheduler and queue usage are not active in the scanned app code; confirm externally if used (e.g. cron calling HTTP, or queue workers elsewhere).
