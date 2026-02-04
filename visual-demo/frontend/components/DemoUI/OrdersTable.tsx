'use client';

import { useState } from 'react';

interface OrdersTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function OrdersTable({ onAction }: OrdersTableProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [orders, setOrders] = useState([
    { id: 1, orderNumber: 'ORD-001', customer: 'John Doe', total: '$125.50', status: 'Pending' },
    { id: 2, orderNumber: 'ORD-002', customer: 'Jane Smith', total: '$89.99', status: 'Shipped' },
    { id: 3, orderNumber: 'ORD-003', customer: 'Bob Johnson', total: '$234.00', status: 'Delivered' },
    { id: 4, orderNumber: 'ORD-004', customer: 'Alice Williams', total: '$67.25', status: 'Pending' },
  ]);

  const handleNewOrder = () => {
    setShowCreateForm(true);
    onAction?.('create', '/admin/orders/create');
  };

  const handleViewOrder = (id: number) => {
    onAction?.('view', `/admin/orders/${id}`, 'GET');
  };

  const handleShipOrder = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Shipped' } : o));
    onAction?.('ship', `/admin/orders/${id}`, 'PUT');
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...orders.map(o => o.id)) + 1;
    setOrders([...orders, {
      id: newId,
      orderNumber: `ORD-${String(newId).padStart(3, '0')}`,
      customer: 'New Customer',
      total: '$0.00',
      status: 'Pending'
    }]);
    setShowCreateForm(false);
    onAction?.('save', '/admin/orders', 'POST');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return { bg: '#fff3cd', text: '#856404' };
      case 'Shipped':
        return { bg: '#cfe2ff', text: '#084298' };
      case 'Delivered':
        return { bg: '#d1e7dd', text: '#0f5132' };
      default:
        return { bg: '#f8f9fa', text: '#495057' };
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: '#f0f3f5' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Orders
        </h2>
        <button
          onClick={handleNewOrder}
          className="text-white px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity font-medium"
          style={{
            backgroundColor: '#20a8d8',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          New Order
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}
              >
                Order #
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}
              >
                Customer
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}
              >
                Total
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}
              >
                Status
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const statusColors = getStatusColor(order.status);
              return (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewOrder(order.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      style={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.status === 'Pending' && (
                      <button
                        onClick={(e) => handleShipOrder(order.id, e)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Ship Order
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Order Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
              Create New Order
            </h3>
            <form onSubmit={handleSaveOrder}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
                  Customer
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option>Select Customer</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                  <option>Bob Johnson</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
                  Products
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option>Select Product</option>
                  <option>Product A</option>
                  <option>Product B</option>
                  <option>Product C</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="1"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
