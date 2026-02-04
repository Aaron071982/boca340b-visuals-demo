# 6.2 Key table domains (high-level)

Below are the major domains confirmed in code through models, migrations, repositories, or explicit raw DB calls.

---

## Auth / access

- `users`, `password_resets`, role/permission tables (Spatie), `password_histories`, `social_accounts`

---

## CMS / content

- `pages`, `faqs`, `blogs`, blog taxonomy tables

---

## Customer core

- `customers` and supporting tables: addresses, emails, notes, docs, signatures, additional data, tracking

---

## Messaging / communications

- `customer_sms`, `customer_whatsapp`, `sms_templates`, `sms_attachments`, inbound-related tables (`incoming_sms`), and operational lists (`pickedups`, `notpickedups`, `erx_data`, `general_sms`)

---

## Operations / orders

- `orders`, `order_items`, plus customer-context order tables

---

## Inventory / catalog

- `products`, `product_categories`, `product_tags`, `product_quantites`, replenishment and drug tables

---

## Facilities / locations

- `locations`, `facilities`, mappings, sub-locations

---

## Finance

- `billing`, `withdraw`, cash drawer/log tables, copay tables, expenses

---

## Documents / forms

- `pdforms`, `reassess`, `careplan`, `refills`, `ipa`, `fax` and attachments, email outbox/inbox tables

---

## Monitoring and misc

- `fridgelog`, monitoring tables, phone services, surveys and survey response tables

---

## Notes

- Some tables are listed by presence of models/migrations but are marked **UNRESOLVED** in the scan (e.g. `ledgers`) where usage was not confirmed in execution chains.
- For a full table-by-table matrix (table | access type | model | file path | triggering entry point), see `BACKEND_DOCUMENTATION.md` Section C.
