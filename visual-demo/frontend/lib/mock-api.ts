/**
 * Mock API and event stream for standalone demo
 */

import { VisualizationEvent } from './event-processor';

export interface MockRequest {
  endpoint: string;
  method: string;
  response: any;
  events: VisualizationEvent[];
}

function createEvents(baseTimestamp: number, requestId: string, endpoint: string, events: any[]): VisualizationEvent[] {
  return events.map((event, index) => ({
    ...event,
    request_id: requestId,
    endpointId: endpoint,
    timestamp: baseTimestamp + (event.delay || index * 50),
  }));
}

const MOCK_REQUESTS: Record<string, MockRequest> = {
  '/admin/dashboard': {
    endpoint: '/admin/dashboard',
    method: 'GET',
    response: {
      stats: {
        totalCustomers: 1234,
        totalOrders: 567,
        pendingDeliveries: 23,
      },
    },
    events: createEvents(Date.now(), 'mock-req-dashboard-1', '/admin/dashboard', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0, meta: { controller: 'Backend\\DashboardController@index' } },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\DashboardController', status: 'success', delay: 10, meta: { method: 'index' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 50, meta: { operation: 'SELECT', connection: 'mysql' } },
      { phase: 'db.query', componentType: 'database', componentId: 'locations', status: 'success', delay: 80, meta: { operation: 'SELECT', connection: 'mysql' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\DashboardController', status: 'success', delay: 120, meta: { method: 'index' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 150, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/customers': {
    endpoint: '/admin/customers',
    method: 'GET',
    response: {
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102' },
      ],
    },
    events: createEvents(Date.now(), 'mock-req-customers-1', '/admin/customers', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customer_addresses', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customer_contacts', status: 'success', delay: 90, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 120 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 150, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/customers/create': {
    endpoint: '/admin/customers/create',
    method: 'GET',
    response: {},
    events: createEvents(Date.now(), 'mock-req-customers-create-1', '/admin/customers/create', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 10, meta: { method: 'create' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 50 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 80, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/orders': {
    endpoint: '/admin/orders',
    method: 'GET',
    response: {
      data: [
        { id: 1, orderNumber: 'ORD-001', customer: 'John Doe', total: '$125.50', status: 'Pending' },
        { id: 2, orderNumber: 'ORD-002', customer: 'Jane Smith', total: '$89.99', status: 'Shipped' },
      ],
    },
    events: createEvents(Date.now(), 'mock-req-orders-1', '/admin/orders', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orderitems', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 90, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'products', status: 'success', delay: 110, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 140 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 170, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/orders/create': {
    endpoint: '/admin/orders/create',
    method: 'GET',
    response: {},
    events: createEvents(Date.now(), 'mock-req-orders-create-1', '/admin/orders/create', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 10, meta: { method: 'create' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'products', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/login': {
    endpoint: '/login',
    method: 'GET',
    response: {},
    events: createEvents(Date.now(), 'mock-req-login-1', '/login', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'CustomAuthController', status: 'success', delay: 10 },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'CustomAuthController', status: 'success', delay: 50 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 80, meta: { statusCode: 200 } },
    ]),
  },
  '/custom-login': {
    endpoint: '/custom-login',
    method: 'POST',
    response: { message: 'OTP sent' },
    events: createEvents(Date.now(), 'mock-req-custom-login-1', '/custom-login', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'CustomAuthController', status: 'success', delay: 10, meta: { method: 'customLogin' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 80, meta: { operation: 'UPDATE', field: 'verification_code' } },
      { phase: 'db.query', componentType: 'database', componentId: 'locations', status: 'success', delay: 100, meta: { operation: 'SELECT' } },
      { phase: 'external.call', componentType: 'external', componentId: 'Mailgun API', status: 'success', delay: 120, meta: { service: 'Mailgun', operation: 'sendSMS' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 140, meta: { operation: 'UPDATE', field: 'login_token' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'CustomAuthController', status: 'success', delay: 160 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200 } },
    ]),
  },
  '/verify': {
    endpoint: '/verify',
    method: 'POST',
    response: { message: 'Verified', token: 'mock-token' },
    events: createEvents(Date.now(), 'mock-req-verify-1', '/verify', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'CustomAuthController', status: 'success', delay: 10, meta: { method: 'verify' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 50, meta: { operation: 'SELECT', field: 'verification_code' } },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Auth', status: 'success', delay: 80, meta: { method: 'login' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 100, meta: { operation: 'UPDATE', field: 'session' } },
      { phase: 'db.query', componentType: 'database', componentId: 'locations', status: 'success', delay: 130, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 160, meta: { operation: 'UPDATE', field: 'session_keys' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Auth', status: 'success', delay: 180 },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'CustomAuthController', status: 'success', delay: 200 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 230, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/getdates': {
    endpoint: '/admin/getdates',
    method: 'POST',
    response: { success: true },
    events: createEvents(Date.now(), 'mock-req-getdates-1', '/admin/getdates', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\SupportController', status: 'success', delay: 10, meta: { method: 'getdates' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 50, meta: { operation: 'UPDATE', field: 'session' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\SupportController', status: 'success', delay: 80 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 110, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/dashboardsettings': {
    endpoint: '/admin/dashboardsettings',
    method: 'POST',
    response: { success: true },
    events: createEvents(Date.now(), 'mock-req-dashboardsettings-1', '/admin/dashboardsettings', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\SupportController', status: 'success', delay: 10, meta: { method: 'dashboardsettings' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 50, meta: { operation: 'UPDATE', field: 'session' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\SupportController', status: 'success', delay: 80 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 110, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/patients/get': {
    endpoint: '/admin/patients/get',
    method: 'GET',
    response: {
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101' },
      ],
    },
    events: createEvents(Date.now(), 'mock-req-patients-1', '/admin/patients/get', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customer_addresses', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customer_contacts', status: 'success', delay: 90, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 120 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 150, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/customers:POST': {
    endpoint: '/admin/customers',
    method: 'POST',
    response: { success: true, id: 5 },
    events: createEvents(Date.now(), 'mock-req-customers-post-1', '/admin/customers', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 10, meta: { method: 'store' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'INSERT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/customers/{id}:PUT': {
    endpoint: '/admin/customers/{id}',
    method: 'PUT',
    response: { success: true },
    events: createEvents(Date.now(), 'mock-req-customers-put-1', '/admin/customers/{id}', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 10, meta: { method: 'update' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'UPDATE' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/customers/{id}:DELETE': {
    endpoint: '/admin/customers/{id}',
    method: 'DELETE',
    response: { success: true },
    events: createEvents(Date.now(), 'mock-req-customers-delete-1', '/admin/customers/{id}', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 10, meta: { method: 'destroy' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'DELETE' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/customers/{id}:GET': {
    endpoint: '/admin/customers/{id}',
    method: 'GET',
    response: { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101', addresses: [], contacts: [] },
    events: createEvents(Date.now(), 'mock-req-customers-view-1', '/admin/customers/{id}', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 10, meta: { method: 'show' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customer_addresses', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customer_contacts', status: 'success', delay: 90, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customer_sms', status: 'success', delay: 110, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 130, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 160 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 190, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/orders:POST': {
    endpoint: '/admin/orders',
    method: 'POST',
    response: { success: true, id: 5 },
    events: createEvents(Date.now(), 'mock-req-orders-post-1', '/admin/orders', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 10, meta: { method: 'store' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 50, meta: { operation: 'INSERT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orderitems', status: 'success', delay: 70, meta: { operation: 'INSERT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'inventory', status: 'success', delay: 90, meta: { operation: 'UPDATE' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 120 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 150, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/orders/{id}:PUT': {
    endpoint: '/admin/orders/{id}',
    method: 'PUT',
    response: { success: true },
    events: createEvents(Date.now(), 'mock-req-orders-put-1', '/admin/orders/{id}', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 10, meta: { method: 'update' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 50, meta: { operation: 'UPDATE' } },
      { phase: 'external.call', componentType: 'external', componentId: 'FedEx API', status: 'success', delay: 80, meta: { service: 'FedEx', operation: 'createShipment' } },
      { phase: 'external.call', componentType: 'external', componentId: 'Twilio', status: 'success', delay: 120, meta: { service: 'Twilio', operation: 'sendSMS' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customer_sms', status: 'success', delay: 150, meta: { operation: 'INSERT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 180 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 210, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/orders/{id}:GET': {
    endpoint: '/admin/orders/{id}',
    method: 'GET',
    response: { id: 1, orderNumber: 'ORD-001', customer: 'John Doe', items: [], total: '$125.50' },
    events: createEvents(Date.now(), 'mock-req-orders-view-1', '/admin/orders/{id}', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 10, meta: { method: 'show' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orderitems', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'products', status: 'success', delay: 90, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 110, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 140 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 170, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/patients/get': {
    endpoint: '/admin/patients/get',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-patients-get-1', '/admin/patients/get', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customer_addresses', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/patients/new': {
    endpoint: '/admin/patients/new',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-patients-new-1', '/admin/patients/new', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 10, meta: { method: 'new' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 80 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 110, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/enrollments/no-rx': {
    endpoint: '/admin/enrollments/no-rx',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-enrollments-no-rx-1', '/admin/enrollments/no-rx', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 80 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 110, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/patients/lost': {
    endpoint: '/admin/patients/lost',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-patients-lost-1', '/admin/patients/lost', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 80 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 110, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/reports/recon': {
    endpoint: '/admin/reports/recon',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-recon-1', '/admin/reports/recon', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Reports\\ReconController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'transactions', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Reports\\ReconController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/reports/transactiondetails': {
    endpoint: '/admin/reports/transactiondetails',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-transactiondetails-1', '/admin/reports/transactiondetails', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Reports\\TransactionController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'transactions', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Reports\\TransactionController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/purchases': {
    endpoint: '/admin/purchases',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-purchases-1', '/admin/purchases', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Purchases\\PurchasesController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'purchases', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'products', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Purchases\\PurchasesController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/essentials': {
    endpoint: '/admin/essentials',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-essentials-1', '/admin/essentials', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Essentials\\EssentialsController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Essentials\\EssentialsController', status: 'success', delay: 80 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 110, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/savings': {
    endpoint: '/admin/savings',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-savings-1', '/admin/savings', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Savings\\SavingsController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'transactions', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Savings\\SavingsController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/inventory': {
    endpoint: '/admin/inventory',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-inventory-1', '/admin/inventory', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Inventory\\InventoryController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'inventory', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'products', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Inventory\\InventoryController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/reports/hrsa': {
    endpoint: '/admin/reports/hrsa',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-hrsa-1', '/admin/reports/hrsa', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Reports\\HRSAController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'transactions', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Reports\\HRSAController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/facilities/shipping_view_report': {
    endpoint: '/admin/facilities/shipping_view_report',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-shipping-1', '/admin/facilities/shipping_view_report', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Facilities\\ShippingController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'external.call', componentType: 'external', componentId: 'FedEx API', status: 'success', delay: 90, meta: { service: 'FedEx', operation: 'trackShipment' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Facilities\\ShippingController', status: 'success', delay: 120 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 150, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/esp/data': {
    endpoint: '/admin/esp/data',
    method: 'GET',
    response: { data: [] },
    events: createEvents(Date.now(), 'mock-req-esp-1', '/admin/esp/data', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\ESP\\ESPController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'esp_data', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\ESP\\ESPController', status: 'success', delay: 80 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 110, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/settings': {
    endpoint: '/admin/settings',
    method: 'GET',
    response: { settings: {} },
    events: createEvents(Date.now(), 'mock-req-settings-1', '/admin/settings', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\SupportController', status: 'success', delay: 10, meta: { method: 'settings' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\SupportController', status: 'success', delay: 80 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 110, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/settings:POST': {
    endpoint: '/admin/settings',
    method: 'POST',
    response: { success: true },
    events: createEvents(Date.now(), 'mock-req-settings-post-1', '/admin/settings', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\SupportController', status: 'success', delay: 10, meta: { method: 'updateSettings' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 50, meta: { operation: 'UPDATE' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\SupportController', status: 'success', delay: 80 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 110, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/globaldata:POST': {
    endpoint: '/admin/globaldata',
    method: 'POST',
    response: { success: true },
    events: createEvents(Date.now(), 'mock-req-globaldata-1', '/admin/globaldata', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 10, meta: { method: 'globaldata' } },
      { phase: 'db.query', componentType: 'database', componentId: 'locations', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'users', status: 'success', delay: 70, meta: { operation: 'UPDATE', field: 'session' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersController', status: 'success', delay: 100 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 130, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/patients/{id}/prescriptions': {
    endpoint: '/admin/patients/{id}/prescriptions',
    method: 'GET',
    response: { prescriptions: [] },
    events: createEvents(Date.now(), 'mock-req-prescriptions-1', '/admin/patients/{id}/prescriptions', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 10, meta: { method: 'patientPrescriptions' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orderitems', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 90, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Orders\\OrdersController', status: 'success', delay: 120 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 150, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/shipping/{id}': {
    endpoint: '/admin/shipping/{id}',
    method: 'GET',
    response: { shipping: {} },
    events: createEvents(Date.now(), 'mock-req-shipping-1', '/admin/shipping/{id}', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Shipping\\ShippingController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'service.call', componentType: 'externalService', componentId: 'FedEx API', status: 'success', delay: 100, meta: { operation: 'tracking' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Shipping\\ShippingController', status: 'success', delay: 130 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 160, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/essentials/{id}': {
    endpoint: '/admin/essentials/{id}',
    method: 'GET',
    response: { essentials: [] },
    events: createEvents(Date.now(), 'mock-req-essentials-id-1', '/admin/essentials/{id}', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Essentials\\EssentialsController', status: 'success', delay: 10 },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 50, meta: { operation: 'SELECT', filter: 'essentials' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Essentials\\EssentialsController', status: 'success', delay: 80 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 110, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/shipping/{patientName}/details': {
    endpoint: '/admin/shipping/{patientName}/details',
    method: 'GET',
    response: { details: {} },
    events: createEvents(Date.now(), 'mock-req-shipping-details-1', '/admin/shipping/{patientName}/details', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Shipping\\ShippingController', status: 'success', delay: 10, meta: { method: 'details' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'service.call', componentType: 'externalService', componentId: 'FedEx API', status: 'success', delay: 100, meta: { operation: 'details' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Shipping\\ShippingController', status: 'success', delay: 130 },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 160, meta: { statusCode: 200 } },
    ]),
  },
  '/admin/patients/export:POST': {
    endpoint: '/admin/patients/export',
    method: 'POST',
    response: { file: 'patients.csv' },
    events: createEvents(Date.now(), 'mock-req-patients-export-1', '/admin/patients/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 10, meta: { method: 'export' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/reports/recon/export:POST': {
    endpoint: '/admin/reports/recon/export',
    method: 'POST',
    response: { file: 'recon.csv' },
    events: createEvents(Date.now(), 'mock-req-recon-export-1', '/admin/reports/recon/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Reports\\ReconController', status: 'success', delay: 10, meta: { method: 'export' } },
      { phase: 'db.query', componentType: 'database', componentId: 'transactions', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Reports\\ReconController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/reports/transactiondetails/export:POST': {
    endpoint: '/admin/reports/transactiondetails/export',
    method: 'POST',
    response: { file: 'transactions.csv' },
    events: createEvents(Date.now(), 'mock-req-transaction-export-1', '/admin/reports/transactiondetails/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Reports\\TransactionController', status: 'success', delay: 10, meta: { method: 'export' } },
      { phase: 'db.query', componentType: 'database', componentId: 'transactions', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Reports\\TransactionController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/purchases/export:POST': {
    endpoint: '/admin/purchases/export',
    method: 'POST',
    response: { file: 'purchases.csv' },
    events: createEvents(Date.now(), 'mock-req-purchases-export-1', '/admin/purchases/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Purchases\\PurchasesController', status: 'success', delay: 10, meta: { method: 'export' } },
      { phase: 'db.query', componentType: 'database', componentId: 'purchases', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Purchases\\PurchasesController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/essentials/export:POST': {
    endpoint: '/admin/essentials/export',
    method: 'POST',
    response: { file: 'essentials.csv' },
    events: createEvents(Date.now(), 'mock-req-essentials-export-1', '/admin/essentials/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Essentials\\EssentialsController', status: 'success', delay: 10, meta: { method: 'export' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Essentials\\EssentialsController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/savings/export:POST': {
    endpoint: '/admin/savings/export',
    method: 'POST',
    response: { file: 'savings.csv' },
    events: createEvents(Date.now(), 'mock-req-savings-export-1', '/admin/savings/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Savings\\SavingsController', status: 'success', delay: 10, meta: { method: 'export' } },
      { phase: 'db.query', componentType: 'database', componentId: 'transactions', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Savings\\SavingsController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/inventory/export:POST': {
    endpoint: '/admin/inventory/export',
    method: 'POST',
    response: { file: 'inventory.csv' },
    events: createEvents(Date.now(), 'mock-req-inventory-export-1', '/admin/inventory/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Inventory\\InventoryController', status: 'success', delay: 10, meta: { method: 'export' } },
      { phase: 'db.query', componentType: 'database', componentId: 'inventory', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Inventory\\InventoryController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/reports/hrsa/export:POST': {
    endpoint: '/admin/reports/hrsa/export',
    method: 'POST',
    response: { file: 'hrsa.csv' },
    events: createEvents(Date.now(), 'mock-req-hrsa-export-1', '/admin/reports/hrsa/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Reports\\HRSAController', status: 'success', delay: 10, meta: { method: 'export' } },
      { phase: 'db.query', componentType: 'database', componentId: 'transactions', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Reports\\HRSAController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/facilities/shipping_view_report/export:POST': {
    endpoint: '/admin/facilities/shipping_view_report/export',
    method: 'POST',
    response: { file: 'shipping.csv' },
    events: createEvents(Date.now(), 'mock-req-shipping-export-1', '/admin/facilities/shipping_view_report/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Shipping\\ShippingController', status: 'success', delay: 10, meta: { method: 'export' } },
      { phase: 'db.query', componentType: 'database', componentId: 'orders', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 70, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Shipping\\ShippingController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/esp/data/export:POST': {
    endpoint: '/admin/esp/data/export',
    method: 'POST',
    response: { file: 'esp.csv' },
    events: createEvents(Date.now(), 'mock-req-esp-export-1', '/admin/esp/data/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\ESP\\ESPController', status: 'success', delay: 10, meta: { method: 'export' } },
      { phase: 'db.query', componentType: 'database', componentId: 'esp_data', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\ESP\\ESPController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/patients/new/export:POST': {
    endpoint: '/admin/patients/new/export',
    method: 'POST',
    response: { file: 'new-patients.csv' },
    events: createEvents(Date.now(), 'mock-req-new-patients-export-1', '/admin/patients/new/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 10, meta: { method: 'exportNew' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/patients/lost/export:POST': {
    endpoint: '/admin/patients/lost/export',
    method: 'POST',
    response: { file: 'lost-patients.csv' },
    events: createEvents(Date.now(), 'mock-req-lost-patients-export-1', '/admin/patients/lost/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 10, meta: { method: 'exportLost' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
  '/admin/enrollments/no-rx/export:POST': {
    endpoint: '/admin/enrollments/no-rx/export',
    method: 'POST',
    response: { file: 'enrollments.csv' },
    events: createEvents(Date.now(), 'mock-req-enrollments-export-1', '/admin/enrollments/no-rx/export', [
      { phase: 'route.matched', componentType: 'route', componentId: 'routes/web.php', status: 'success', delay: 0 },
      { phase: 'controller.enter', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 10, meta: { method: 'exportEnrollments' } },
      { phase: 'db.query', componentType: 'database', componentId: 'customers', status: 'success', delay: 50, meta: { operation: 'SELECT' } },
      { phase: 'controller.exit', componentType: 'controller', componentId: 'Backend\\Customers\\CustomersTableController', status: 'success', delay: 150, meta: { operation: 'export_generation' } },
      { phase: 'response.sent', componentType: 'response', componentId: '200', status: 'success', delay: 180, meta: { statusCode: 200, contentType: 'text/csv' } },
    ]),
  },
};

/**
 * Mock API call
 */
export async function mockApiCall(endpoint: string, method: string = 'GET'): Promise<any> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));

  const key = endpoint.split('?')[0]; // Remove query params
  const mockRequest = MOCK_REQUESTS[key];

  if (mockRequest) {
    return mockRequest.response;
  }

  return { error: 'Not found' };
}

/**
 * Normalize endpoint by replacing IDs with placeholders
 */
function normalizeEndpoint(endpoint: string): string {
  // Replace numeric IDs with {id}
  let normalized = endpoint.replace(/\/\d+/g, '/{id}');
  
  // Handle patient name patterns: /admin/shipping/{name}/details -> /admin/shipping/{patientName}/details
  normalized = normalized.replace(/\/shipping\/[^/]+(?=\/details)/g, '/shipping/{patientName}');
  
  return normalized;
}

/**
 * Get mock events for an endpoint
 */
export function getMockEvents(endpoint: string, method: string = 'GET'): VisualizationEvent[] {
  const key = endpoint.split('?')[0];
  let mockRequest = MOCK_REQUESTS[key];

  // If not found, try with method-specific key
  if (!mockRequest && method !== 'GET') {
    const methodKey = `${key}:${method}`;
    mockRequest = MOCK_REQUESTS[methodKey];
  }

  // Try pattern matching for routes with IDs (for both GET and other methods)
  if (!mockRequest) {
    const normalized = normalizeEndpoint(key);
    const patternKey = method !== 'GET' ? `${normalized}:${method}` : normalized;
    mockRequest = MOCK_REQUESTS[patternKey];
  }

  // Also try with method-specific normalized key
  if (!mockRequest && method !== 'GET') {
    const normalized = normalizeEndpoint(key);
    const methodKey = `${normalized}:${method}`;
    mockRequest = MOCK_REQUESTS[methodKey];
  }

  if (mockRequest) {
    // Clone events and update timestamps to be relative to now
    const baseTimestamp = Date.now();
    const normalizedEndpoint = normalizeEndpoint(key);
    return mockRequest.events.map((event, index) => ({
      ...event,
      endpointId: normalizedEndpoint, // Use normalized endpoint for highlighting
      timestamp: baseTimestamp + (event.delay || index * 50),
    }));
  }

  return [];
}

/**
 * Stream mock events with realistic timing
 */
export async function streamMockEvents(
  endpoint: string,
  onEvent: (event: VisualizationEvent) => void,
  method: string = 'GET'
): Promise<void> {
  const events = getMockEvents(endpoint, method);
  if (events.length === 0) return;

  let lastTimestamp = events[0].timestamp;

  for (const event of events) {
    // Respect timing between events
    const delay = event.timestamp - lastTimestamp;
    if (delay > 0 && delay < 10000) {
      // Cap delay at 10 seconds
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    onEvent(event);
    lastTimestamp = event.timestamp;
  }
}
