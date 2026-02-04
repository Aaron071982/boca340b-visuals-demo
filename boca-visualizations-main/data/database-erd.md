# Database Entity Relationship Diagram

The Boca 340B Insights system uses a multi-database architecture with:

- **Central Database** (`mysql` connection): Stores cross-tenant configuration, user accounts, roles/permissions, and location metadata
- **Tenant Databases** (dynamic connection per location): Store operational data per location/facility (isolated per tenant)

## Entity Relationship Diagram

```mermaid
erDiagram
    %% Central Database Entities
    users ||--o{ model_has_roles : has
    users ||--o{ model_has_permissions : has
    roles ||--o{ model_has_roles : assigned_to
    roles ||--o{ role_has_permissions : has
    permissions ||--o{ role_has_permissions : granted_to
    permissions ||--o{ model_has_permissions : granted_to
    locations ||--o{ users : "users belong to"
    locations ||--o{ facilities : "may have"
    locations ||--o{ customers : "tenant DB reference"
    locations ||--o{ orders : "tenant DB reference"
    
    %% Tenant Database Entities - Customer Domain
    customers ||--o{ customer_addresses : has
    customers ||--o{ customer_contacts : has
    customers ||--o{ customer_docs : has
    customers ||--o{ customer_sms : "sends/receives"
    customers ||--o{ orders : places
    customers ||--o{ careplans : "has"
    
    %% Tenant Database Entities - Order Domain
    orders ||--o{ orderitems : contains
    orderitems }o--|| products : "references"
    orderitems }o--|| inventory : "affects"
    
    %% Tenant Database Entities - Product/Inventory Domain
    products }o--|| product_categories : "belongs to"
    products }o--o{ product_tags : "tagged with"
    products ||--o{ inventory : "stocked in"
    products ||--o{ orderitems : "ordered as"
    
    %% Tenant Database Entities - Billing Domain
    orders ||--o{ billing : "generates"
    customers ||--o{ billing : "billed to"
    billing ||--o{ copay : "has"
    
    %% Tenant Database Entities - Communication Domain
    customers ||--o{ email_outbox : "receives"
    email_templates ||--o{ email_outbox : "uses"
    sms_templates ||--o{ customer_sms : "uses"
    
    users {
        bigint id PK
        string name
        string email UK
        string password
        string verification_code
        timestamp created_at
        timestamp updated_at
    }
    
    locations {
        bigint id PK
        string name
        string db_connection "connection name"
        string mssqlip "MS SQL IP if applicable"
        string facility_name
        json metadata
        timestamp created_at
        timestamp updated_at
    }
    
    customers {
        bigint id PK
        string first_name
        string last_name
        string phone UK
        string email
        date date_of_birth
        text address
        string location_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    orders {
        bigint id PK
        bigint customer_id FK
        string order_number UK
        string status
        decimal total_amount
        timestamp order_date
        timestamp created_at
        timestamp updated_at
    }
    
    orderitems {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
        int received_qty
        decimal unit_price
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    products {
        bigint id PK
        bigint product_category_id FK
        string name
        string sku UK
        text description
        decimal price
        timestamp created_at
        timestamp updated_at
    }
    
    inventory {
        bigint id PK
        bigint product_id FK
        int qty
        int min_qty
        timestamp last_updated
        timestamp created_at
        timestamp updated_at
    }
    
    customer_sms {
        bigint id PK
        bigint customer_id FK "nullable"
        string phone_from
        string phone_to
        text message
        string direction "inbound|outbound"
        string status "sent|delivered|failed|received"
        string external_id "provider message ID"
        timestamp delivered_at
        text error_message
        timestamp created_at
        timestamp updated_at
    }
    
    billing {
        bigint id PK
        bigint customer_id FK
        bigint order_id FK "nullable"
        decimal amount
        string status
        timestamp billed_date
        timestamp created_at
        timestamp updated_at
    }
```

## Database Architecture

### Central Database (`mysql` connection)

**Purpose:** Stores cross-tenant configuration and metadata.

**Tables:**
- `users` - User accounts (admins, staff)
- `roles`, `permissions` - Spatie Permission (RBAC)
- `model_has_roles`, `model_has_permissions`, `role_has_permissions` - Permission assignments
- `locations` - Facility/location metadata (includes `db_connection`, `mssqlip`)
- `facilities` - Facility details (if separate from locations)

### Tenant Databases (Dynamic connection per location)

**Purpose:** Store operational data per location/facility (isolated per tenant).

**Tables:**
- `customers`, `customer_addresses`, `customer_contacts`, `customer_docs`
- `orders`, `orderitems`
- `inventory`, `products`, `product_categories`, `product_tags`
- `customer_sms`, `email_outbox`, `email_templates`, `sms_templates`
- `billing`, `copay`, `expenses`
- `drugs`, `refills`, `careplans`
- ... (operational tables per location)

**Connection Selection:**
Tenant models set `$this->connection` dynamically based on session:
```php
$this->connection = session()->get('userLocation')->db_connection;
```

## Key Relationships

### Central Database
- `users` → `roles` (via `model_has_roles`) - Many-to-many
- `users` → `permissions` (via `model_has_permissions`) - Many-to-many
- `roles` → `permissions` (via `role_has_permissions`) - Many-to-many
- `users` → `locations` - Users assigned to locations

### Tenant Databases
- `customers` → `customer_addresses`, `customer_contacts`, `customer_docs` - One-to-many
- `customers` → `orders` - One-to-many
- `orders` → `orderitems` - One-to-many
- `orderitems` → `products` - Many-to-one
- `products` → `inventory` - One-to-one/one-to-many
- `customers` → `customer_sms` - One-to-many (nullable if unlinked SMS)
- `orders` → `billing` - One-to-one/one-to-many
- `customers` → `billing` - One-to-many

## Multi-Database Connection Pattern

**Central DB Models:**
```php
// app/Models/Location.php
protected $connection = 'mysql';
```

**Tenant DB Models (Dynamic):**
```php
// app/Models/Customer.php
public function __construct(array $attributes = [])
{
    parent::__construct($attributes);
    $location = session()->get('userLocation');
    if ($location) {
        $this->connection = $location->db_connection;
        $this->table = $location->database_name . '.customers';
    }
}
```

## Key Takeaways

✅ **Central DB**: Users, roles, permissions, locations (shared across tenants)  
✅ **Tenant DBs**: Customers, orders, inventory, SMS, billing (isolated per location)  
✅ **Dynamic Connection**: Models set `$this->connection` from `session('userLocation')->db_connection`  
✅ **Relationship Boundaries**: Relationships typically stay within same database (central or tenant)  
⚠️ **Cross-DB Relationships**: No direct FK relationships between central and tenant DBs (reference by ID only)
