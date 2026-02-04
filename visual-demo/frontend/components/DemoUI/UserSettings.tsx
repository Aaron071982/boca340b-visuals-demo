'use client';

import { useState } from 'react';

interface UserSettingsProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function UserSettings({ onAction }: UserSettingsProps) {
  const [settings, setSettings] = useState({
    email: 'jamal-uddin.kazi@example.com',
    notifications: true,
    theme: 'light',
    language: 'en',
  });

  const handleSave = () => {
    onAction?.('save', '/admin/settings', 'POST');
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
        User Settings
      </h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
                Enable Email Notifications
              </span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Save Settings
            </button>
            <button
              onClick={() => setSettings({ email: 'jamal-uddin.kazi@example.com', notifications: true, theme: 'light', language: 'en' })}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              style={{ fontFamily: 'Roboto, sans-serif', color: '#2f353a' }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
