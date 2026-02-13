'use client';

import { useState, useEffect } from 'react';
import { mockApiCall } from '@/lib/mock-api';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface ManageAdminsProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function ManageAdmins({ onAction }: ManageAdminsProps) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAdmins = async () => {
      setLoading(true);
      setError(null);
      try {
        onAction?.('load', '/admin/auth/user', 'GET');
        const res = await mockApiCall('/admin/auth/user', 'GET');
        if (res?.data) {
          setAdmins(res.data);
        } else {
          setAdmins([]);
        }
      } catch {
        setError('Failed to load admins');
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    };
    loadAdmins();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Manage Admins
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Manage Admins
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
        Manage Admins
      </h2>
      <p className="text-gray-600 mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
        View and manage administrator accounts.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No admin users found.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => onAction?.('edit', `/admin/auth/user/${admin.id}/edit`, 'GET')}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onAction?.('view', `/admin/auth/user/${admin.id}`, 'GET')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
