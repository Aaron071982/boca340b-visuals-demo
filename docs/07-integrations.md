# 7. External integrations

---

## 7.1 Confirmed integrations

| Service | Direction | Base / endpoint | Auth | Primary triggers |
|---------|-----------|------------------|------|-------------------|
| **Twilio** | Outbound | Twilio API | Env credentials (SID/token) | OTP (`sendBocaOTP`), surveys (calls/SMS), customer SMS workflows, templates, cron |
| **Mailgun** | Outbound | `https://api.mailgun.net/v3/boca.nyc` | API key (noted hardcoded in places) | Email send across auth flows, email outbox, fax/email systems, customer SMS reply |
| **Mailgun webhook** | Inbound | POST `api/mailgun/widgets` | Signature middleware | `MailgunWidgetsController` |
| **DID for Sale** | Outbound | `.../didforsaleapi/.../SMS/SingleSend` | Key-based auth | OTP send fallback when not using Twilio |
| **MSSQL pharmacy/Rx** | Outbound | Location-specific MSSQL IPs | Connection config | SMS “picked up / not picked up / eRx” flows; facility data endpoints |
| **Square** | Outbound | **UNRESOLVED** | **UNRESOLVED** | `SquareupLocationsController` actions |
| **GuzzleHTTP** | Outbound | Varies | N/A | Used in webhook controller |

<!-- DIAGRAM: integrations-map -->

*(Insert diagram: inbound vs outbound; Twilio, Mailgun, DID, MSSQL, Square, Guzzle; webhook path.)*

---

## 7.2 Integration notes

- **Mailgun inbound webhook:** Signature and timestamp validation (15s window) via `ValidateMailgunWebhook`.
- **Square:** Base URL and auth pattern were not confirmed in the scan output. **UNRESOLVED — REQUIRES HUMAN REVIEW.**
