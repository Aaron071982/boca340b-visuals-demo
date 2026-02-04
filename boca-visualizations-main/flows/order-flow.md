# Order Receiving Flow

This diagram shows the order receiving and inventory update flow.

**Route Path:** `GET /admin/orders` → `POST /admin/orders/{id}/itemsreceived`  
**Controller:** `Backend\Orders\OrdersController`

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Admin
    participant Browser
    participant OrdersController
    participant OrderRepository
    participant OrderModel
    participant OrderitemModel
    participant InventoryModel
    participant Session
    participant TenantDB
    
    Admin->>Browser: Navigate to /admin/orders
    Browser->>OrdersController: GET /admin/orders (index)
    
    OrdersController->>Session: Get userLocationId
    Session-->>OrdersController: Location ID
    
    OrdersController->>OrderRepository: getAllOrders()
    OrderRepository->>OrderModel: Order::with('orderitems')->get()
    Note over OrderModel: Sets connection:<br/>$this->connection = Location::find(session('userLocationId'))->db_connection
    OrderModel->>TenantDB: SELECT * FROM {database}.orders
    OrderModel->>OrderitemModel: Eager load related orderitems
    OrderitemModel->>TenantDB: SELECT * FROM {database}.orderitems WHERE order_id IN (...)
    TenantDB-->>OrderModel: Orders with orderitems
    OrderModel-->>OrdersController: Collection of Order models
    
    OrdersController-->>Browser: Render orders/index.blade.php
    
    Admin->>Browser: Click "Receive Items" on order
    Browser->>OrdersController: GET /admin/orders/{id}/itemsreceived (or similar)
    
    OrdersController->>OrderRepository: findById($id)
    OrderRepository->>OrderModel: Order::with('orderitems')->find($id)
    OrderModel->>TenantDB: SELECT order + orderitems
    TenantDB-->>OrderModel: Order with orderitems
    OrderModel-->>OrdersController: Order model
    
    OrdersController-->>Browser: Render items received form (Blade view)
    
    Admin->>Browser: Enter received quantities + submit
    Browser->>OrdersController: POST /admin/orders/{id}/itemsreceived (itemsReceivedQnt)
    
    OrdersController->>OrdersController: Validate received quantities
    
    loop For each order item
        OrdersController->>OrderitemModel: Update orderitem (received_qty, status)
        OrderitemModel->>TenantDB: UPDATE {database}.orderitems SET received_qty=?, status='received'
        TenantDB-->>OrderitemModel: Updated
        
        OrdersController->>InventoryModel: Update inventory quantity
        InventoryModel->>TenantDB: UPDATE {database}.inventory SET qty = qty + ? WHERE product_id=?
        TenantDB-->>InventoryModel: Inventory updated
    end
    
    OrdersController->>OrderModel: Update order status (if all items received)
    OrderModel->>TenantDB: UPDATE {database}.orders SET status='completed' WHERE id=?
    TenantDB-->>OrderModel: Order updated
    
    OrdersController-->>Browser: Redirect to /admin/orders with success message
```

## Flow Summary

1. Admin navigates to `/admin/orders` (order list page)
2. Controller loads orders with eager-loaded order items
3. Admin clicks "Receive Items" on an order
4. Controller displays receive items form with order items
5. Admin enters received quantities for each item and submits
6. Controller validates and updates order items (`received_qty`, `status`)
7. Controller updates inventory quantities (increments stock)
8. If all items received, order status updated to 'completed'
9. Redirect to order list with success message

## Database Connections

- **Order/Orderitem queries**: Tenant DB (dynamic connection via `session('userLocationId')` → `Location::find(...)->db_connection`)
- **Tables**: `{databaseName}.orders`, `{databaseName}.orderitems`, `{databaseName}.inventory`

## Data Updated

1. **`orderitems` table**:
   - `received_qty` - Quantity received
   - `status` - Updated to 'received'

2. **`inventory` table**:
   - `qty` - Incremented by received quantity

3. **`orders` table**:
   - `status` - Updated to 'completed' if all items received

## Key Features

- **Multi-DB Connection**: Orders use tenant DB based on session location
- **Inventory Management**: Receiving orders automatically updates inventory quantities
- **Status Tracking**: Order and order item status updated throughout the flow
- **Eager Loading**: Order items loaded with orders to avoid N+1 queries
