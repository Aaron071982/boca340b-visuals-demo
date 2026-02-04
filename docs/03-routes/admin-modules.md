# 3.2 Admin backend routes (/admin/*)

---

## Scope

- **Prefix:** `/admin`
- **Middleware:** `admin` (auth)

All admin routes use resource-style CRUD and/or DataTable `*/get` plus module-specific actions (imports, exports, PDF, dashboards, filters).

<!-- DIAGRAM: admin-module-map -->

*(Insert diagram: admin module groups and representative routes per module.)*

---

## Module groups (non-exhaustive)

| Group | Examples | Route files (under `routes/backend/`) |
|-------|----------|--------------------------------------|
| **Auth** | Users, roles, permissions; activation/deactivation, restore, login-as, password change | `auth.php` |
| **Dashboards** | Operational dashboard, delivery dashboard, reporting endpoints | `Dashboard.php`, `DeliveryDashboard.php` |
| **Core entities** | Customers, orders, products, locations, facilities | `Customers.php`, `Orders.php`, `Products.php`, `Locations.php`, `Facilities.php` |
| **Communications** | Customer SMS, WhatsApp, templates, surveys | `CustomerSms.php`, `CustomerWhatsapp.php`, `SmsTemplates.php`, `Surveys.php` |
| **Documents** | PD forms, reassess, careplan, refills, IPA, fax, email inbox/outbox | `Pdform.php`, `Reassess.php`, `Careplan.php`, `Refill.php`, `Ipa.php`, `Fax.php`, `EmailOutbox.php` |
| **Inventory / replenishment** | Inventory intake/outflow, transfers, vendor imports | `Inventory.php`, `Replenish.php`, `DrugReplenish.php`, `ProductQuantity.php` |
| **Finance / operations** | Billing, cash drawer, withdrawals, copay, expenses | `Billing.php`, `Cashdrawer.php`, `Cashlogentry.php`, `Withdraw.php`, `Copay.php`, `Expense.php`, `Denomination.php` |
| **Content / CMS** | Pages, blogs, FAQs | `Pages.php`, `Blogs.php`, `BlogCategories.php`, `BlogTags.php`, `Faq.php` |
| **Other** | Menus, sublocations, product categories/tags, enrollment, monitoring, fridge log, phone services, reports | Corresponding `*.php` in `routes/backend/` |

---

## Phase 2 recommendation

For Phase 2, maintain a **per-module workflow catalog** that references each module’s route file and main controller/repository (see `05-execution-chains.md` for representative chains).
