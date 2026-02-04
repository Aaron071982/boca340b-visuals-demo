# Customer Management Flow

This diagram shows the customer/patient management lifecycle flow.

**Route Path:** `GET /admin/customers` → `GET /admin/customers/patientshow/{id}/{locationid}`  
**Controllers:** `Backend\Customers\CustomersController`, `Backend\Customers\CustomersTableController`

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Admin
    participant Browser
    participant CustomersController
    participant CustomersTableController
    participant CustomerRepository
    participant CustomerModel
    participant CustomerAddressModel
    participant CustomerContactModel
    participant Session
    participant TenantDB
    
    Admin->>Browser: Navigate to /admin/customers
    Browser->>CustomersController: GET /admin/customers (index)
    
    CustomersController->>Session: Get userLocation (from login session)
    Session-->>CustomersController: Location object (db_connection)
    
    CustomersController->>CustomerRepository: getAll() or paginated list
    CustomerRepository->>CustomerModel: Query customers table
    Note over CustomerModel: Sets connection from session:<br/>$this->connection = session('userLocation')->db_connection
    CustomerModel->>TenantDB: SELECT * FROM {database}.customers
    TenantDB-->>CustomerModel: Customer records
    CustomerModel-->>CustomerRepository: Collection of Customer models
    CustomerRepository-->>CustomersController: Customer collection
    
    alt DataTables AJAX request
        Browser->>CustomersTableController: AJAX GET /admin/customers/data
        CustomersTableController->>CustomerRepository: getDataTableData()
        CustomerRepository->>CustomerModel: Query with filters/search
        CustomerModel->>TenantDB: SELECT with WHERE clauses
        TenantDB-->>CustomerModel: Filtered results
        CustomerModel-->>CustomersTableController: JSON data for DataTables
        CustomersTableController-->>Browser: JSON response
    end
    
    CustomersController-->>Browser: Render customers/index.blade.php (with Vue/DataTables)
    
    Admin->>Browser: Click on customer row
    Browser->>CustomersController: GET /admin/customers/patientshow/{id}/{locationid}
    
    CustomersController->>CustomerRepository: findById($id)
    CustomerRepository->>CustomerModel: Customer::with(['addresses', 'contacts', 'documents'])
    CustomerModel->>TenantDB: SELECT customer + JOIN addresses, contacts, docs
    TenantDB-->>CustomerModel: Customer with relationships
    CustomerModel-->>CustomersController: Customer model with eager-loaded relations
    
    CustomersController->>CustomerAddressModel: Query related addresses (via relationship)
    CustomerAddressModel->>TenantDB: SELECT FROM {database}.customer_addresses
    TenantDB-->>CustomerAddressModel: Address records
    
    CustomersController->>CustomerContactModel: Query related contacts (via relationship)
    CustomerContactModel->>TenantDB: SELECT FROM {database}.customer_contacts
    TenantDB-->>CustomerContactModel: Contact records
    
    CustomersController-->>Browser: Render customers/patientshow.blade.php (patient details view)
```

## Flow Summary

1. Admin navigates to `/admin/customers` (customer list page)
2. Controller gets location from session to select tenant database
3. Repository queries customer records from tenant DB
4. DataTables AJAX request (optional) provides filtered/sorted customer list
5. Admin clicks on customer row to view details
6. Controller loads customer with eager-loaded relationships (addresses, contacts, documents)
7. Patient detail view rendered with full customer information

## Database Connections

- **Customer queries**: Tenant DB (dynamic connection via `session('userLocation')->db_connection`)
- **Tables**: `{databaseName}.customers`, `{databaseName}.customer_addresses`, `{databaseName}.customer_contacts`

## Key Features

- **Multi-DB Connection**: Models dynamically select tenant DB based on session location
- **Repository Pattern**: Controllers use repositories for data access
- **Eager Loading**: Relationships loaded via Eloquent `with()` to avoid N+1 queries
- **DataTables Integration**: AJAX-powered filtering, sorting, and pagination
