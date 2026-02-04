# 6. Database access summary (repo-observed)

---

## 6.1 Data access pattern

- **Primary access:** Eloquent models and repository layer.
- **Raw SQL / `DB::table`:** Used notably in `CustomerSmsController` (multiple SMS-related tables).
- **Multi-database:**
  - Dynamic DB selection via `$location->db_connection`
  - MSSQL access via `mssqlcon($location->mssqlip)` and `sqlsrv_*`

<!-- DIAGRAM: database-context -->

*(Insert diagram: request → controller → repository/DB; multi-connection and MSSQL paths.)*

---

## 6.2 Table inventory

| Doc | Content |
|-----|--------|
| [tables-by-domain.md](tables-by-domain.md) | Key table domains (auth, CMS, customers, messaging, operations, inventory, facilities, finance, documents, monitoring). |

---

## 6.3 Notes

- Tables listed are confirmed via models, migrations, repositories, or explicit `DB::table`/raw usage.
- Some tables are marked **UNRESOLVED** where usage was not confirmed in execution chains (e.g. `ledgers`).
- ORM vs raw and transactions are noted in the full backend doc (`BACKEND_DOCUMENTATION.md`) where extracted.
