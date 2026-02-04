'use client';

import { useState } from 'react';

interface CustomersTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function CustomersTable({ onAction }: CustomersTableProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<number | null>(null);
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0103', status: 'Inactive' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '555-0104', status: 'Active' },
  ]);

  const handleAddCustomer = () => {
    setShowCreateForm(true);
    onAction?.('add', '/admin/customers/create');
  };

  const handleEditCustomer = (id: number) => {
    setEditingCustomer(id);
    onAction?.('edit', `/admin/customers/${id}/edit`);
  };

  const handleDeleteCustomer = (id: number) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
      onAction?.('delete', `/admin/customers/${id}`, 'DELETE');
    }
  };

  const handleViewCustomer = (id: number) => {
    onAction?.('view', `/admin/customers/${id}`, 'GET');
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (showCreateForm) {
      // Simulate adding new customer
      const newId = Math.max(...customers.map(c => c.id)) + 1;
      setCustomers([...customers, { 
        id: newId, 
        name: 'New Customer', 
        email: 'new@example.com', 
        phone: '555-0000', 
        status: 'Active' 
      }]);
      setShowCreateForm(false);
      onAction?.('save', '/admin/customers', 'POST');
    } else if (editingCustomer) {
      // Simulate updating customer
      setCustomers(customers.map(c => 
        c.id === editingCustomer ? { ...c, name: 'Updated Customer' } : c
      ));
      const customerId = editingCustomer;
      setEditingCustomer(null);
      onAction?.('update', `/admin/customers/${customerId}`, 'PUT');
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: '#f0f3f5' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Customers
        </h2>
        <button
          onClick={handleAddCustomer}
          className="text-white px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity font-medium"
          style={{
            backgroundColor: '#20a8d8',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          Add Customer
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
                ID
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}
              >
                Name
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}
              >
                Email
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}
              >
                Phone
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
            {customers.map((customer) => (
              <tr 
                key={customer.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleViewCustomer(customer.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
                  {customer.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
                  {customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                  {customer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                  {customer.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCustomer(customer.id);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomer(customer.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Customer Modal */}
      {(showCreateForm || editingCustomer) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
              {showCreateForm ? 'Add New Customer' : 'Edit Customer'}
            </h3>
            <form onSubmit={handleSaveCustomer}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={editingCustomer ? customers.find(c => c.id === editingCustomer)?.name : ''}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={editingCustomer ? customers.find(c => c.id === editingCustomer)?.email : ''}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={editingCustomer ? customers.find(c => c.id === editingCustomer)?.phone : ''}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingCustomer(null);
                  }}
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
                  {showCreateForm ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
