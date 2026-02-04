# 3.1 HTTP routes — public and authenticated (web.php)

---

## Table

| Path | Methods | Handler | Middleware | Auth |
|------|--------:|---------|------------|------|
| `clear-cache` | GET | Closure (`Artisan::call optimize:clear`) | default web | Public |
| `inbound_message/` | POST | `Backend\CustomerSms\CustomerSmsController@inbound_message` | default web | Public |
| `inbound_status/` | POST | `Backend\CustomerSms\CustomerSmsController@inbound_status` | default web | Public |
| `privacy` | GET | `Backend\DashboardController@terms` | default web | Public |
| `/token` | POST | `AccessTokenController@issueToken` | throttle | Public |
| `/authorize` | GET | `AuthorizationController@authorize` | web | Public |
| `/token/refresh` | POST | `TransientTokenController@refresh` | web, auth | Authenticated |
| `/authorize` | POST | `ApproveAuthorizationController@approve` | web, auth | Authenticated |
| `/authorize` | DELETE | `DenyAuthorizationController@deny` | web, auth | Authenticated |
| `/tokens` | GET | `AuthorizedAccessTokenController@forUser` | web, auth | Authenticated |
| `/tokens/{token_id}` | DELETE | `AuthorizedAccessTokenController@destroy` | web, auth | Authenticated |
| `/clients` | GET, POST | `ClientController@forUser`, `ClientController@store` | web, auth | Authenticated |
| `/clients/{client_id}` | PUT, DELETE | `ClientController@update`, `ClientController@destroy` | web, auth | Authenticated |
| `/scopes` | GET | `ScopeController@all` | web, auth | Authenticated |
| `/personal-access-tokens` | GET, POST, DELETE | `PersonalAccessTokenController@*` | web, auth | Authenticated |
| `lang/{lang}` | GET | `LanguageController@swap` | default web | Public |
| `login` | GET | `CustomAuthController@index` | default web | Public |
| `custom-login` | POST | `CustomAuthController@customLogin` | default web | Public |
| `verify` | ANY | `CustomAuthController@verify` | default web | Public |
| `shiftlocation` | POST | `CustomAuthController@shiftlocation` | default web | Public |
| `shiftfacility` | POST | `CustomAuthController@shiftfacility` | default web | Public |
| `globaldata` | POST | `Backend\Customers\CustomersController@globaldata` | default web | Public |
| `removeglobaldata` | POST | `Backend\Customers\CustomersController@removeglobaldata` | default web | Public |
| `switchback` | ANY | `CustomAuthController@switchback` | default web | Public |
| `rxnewupdate` | GET | `Backend\CronController@rxnewupdate` | default web | Public |
| `micropatientupdate` | ANY | `Backend\Customers\CustomersController@patientcronupdate` | default web | Public |
| `signdocumentsingle` | GET | `Backend\CronController@signdocumentsingle` | default web | Public |
| `orderdateimport` | GET | `Backend\CronController@orderdateimport` | default web | Public |
| `fillFilldates` | GET | `Backend\DashboardController@fillFilldates` | default web | Public |
| `/visualizations/events` | GET | `VisualizationController@streamEvents` | global (VisualizationMiddleware) | Public |
| `/visualizations/events/json` | GET | `VisualizationController@getEvents` | global (VisualizationMiddleware) | Public |

---

## Notes

- OAuth/Passport-style endpoints appear under `/token`, `/authorize`, `/clients`, `/scopes`, `/personal-access-tokens`.
- Several “cron-like” routes are exposed via public HTTP (e.g. `rxnewupdate`, `orderdateimport`).
- Frontend routes are included via `routes/frontend/*.php` (see main repo route files for full list).
