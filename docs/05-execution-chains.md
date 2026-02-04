# 5. Execution chains (representative)

The following are representative call chains based on scanned code paths.

---

## 1. Inbound SMS (raw)

- **Entry:** `POST inbound_message/`
- **Handler:** `CustomerSmsController@inbound_message`
- **Notes:** Handler appears minimal in extracted scan.
- **UNRESOLVED — REQUIRES HUMAN REVIEW:** Confirm whether downstream persistence or external calls occur beyond the minimal handler body.

---

## 2. Admin custom login

- **Entry:** admin login routes (`login`, `custom-login`)
- **Handler:** `CustomAuthController@customLogin`
- **Core effect:** Session/auth operations.
- **Data:** `users` (auth-related access).

---

## 3. Admin Customer SMS create

- **Entry:** `admin.customersms.store`
- **Handler:** `CustomerSmsController@store`
- **Repository:** `CustomerSmsRepository::create`
- **Events:** `CustomerSmsUpdated` (dispatched via repository).
- **Data:** `customer_sms` (ORM).

---

## 4. Admin send SMS

- **Entry:** `admin.customersms.sendsmsstore`
- **Handler:** `CustomerSmsController@sendsmsstore`
- **Internal:** `sendSms()` and `sendBocaOTP` helper logic.
- **Repository:** `CustomerSmsRepository::create`
- **Data:** `customer_sms`
- **External:** Outbound SMS through Twilio or DID for Sale (conditional).

<!-- DIAGRAM: execution-chain-sms -->

*(Insert diagram: flow from sendsmsstore → sendSms/sendBocaOTP → Twilio/DID → repository create.)*

---

## 5. Admin customers list

- **Entry:** `admin.customers.index`
- **Handler:** `CustomersController@index`
- **Likely flow:** ViewResponse + DataTable controller + repository.
- **Data:** `customers` (+ relations).

---

## 6. Admin order create

- **Entry:** `admin.orders.store`
- **Handler:** `OrdersController@store`
- **Repository:** `OrdersRepository::create`
- **Events:** `OrderCreated`
- **Data:** `orders`, `order_items` (via model relationships).

---

## 7. Visualization event streaming

- **Entry:** `GET /visualizations/events`
- **Handler:** `VisualizationController@streamEvents`
- **Service:** `VisualizationEventService` (in-memory event buffer).
- **Data:** None (in-memory).

---

## 8. Mailgun webhook ingest

- **Entry:** `POST api/mailgun/widgets`
- **Handler:** `MailgunWidgetsController@store`
- **External:** Webhook from Mailgun.
- **Notes:** Job `ProcessWidgetFiles` is referenced but dispatch is commented.
- **UNRESOLVED — REQUIRES HUMAN REVIEW:** Confirm intended processing behavior if job dispatch is enabled elsewhere.
