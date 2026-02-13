'use client';

import { useState } from 'react';
import { locations } from '@/lib/locations';
import { useLocationStore } from '@/lib/location-store';

interface HeaderProps {
  currentPage: string;
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function Header({ currentPage, onAction }: HeaderProps) {
  const { currentLocation, setLocation } = useLocationStore();
  const [startDate, setStartDate] = useState('11-2025');
  const [endDate, setEndDate] = useState('12-2025');

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
    onAction?.('project-change', '/admin/globaldata', 'POST');
  };

  const handleDateChange = () => {
    onAction?.('date-change', '/admin/getdates', 'POST');
  };

  const handleRefresh = () => {
    onAction?.('refresh', '/admin/getdates', 'POST');
  };

  const getBreadcrumb = () => {
    const pageMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'total-patients': 'Total Patients',
      'new-patients': 'New Patients',
      'new-enrollments': 'New Enrollments w/ No Rx',
      'lost-patients': 'Lost Patients',
      'recon-details': 'Recon Details',
      'transaction-details': 'Transaction Details',
      'purchases': 'Purchases',
      'essentials': 'Everyday Essentials',
      'savings': '340B Savings',
      'inventory': 'Inventory On Hand',
      'hrsa': 'HRSA Report',
      'shipping': 'Shipping Information',
      'esp-data': 'ESP Data',
      'settings': 'User Settings',
    };
    return pageMap[currentPage] || 'Dashboard';
  };

  return (
    <div
      className="w-full flex items-center px-6 border-b border-gray-200"
      style={{
        backgroundColor: '#ffffff',
        fontFamily: 'Roboto, sans-serif',
        minHeight: '60px',
      }}
    >
      {/* Logo and Hamburger */}
      <div className="flex items-center gap-3">
        <button className="text-gray-600 hover:text-gray-900 p-2">
          <i className="bi bi-list text-xl"></i>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0f4c81"/>
              <path d="M2 17L12 22L22 17" stroke="#0f4c81" strokeWidth="2"/>
              <path d="M2 12L12 17L22 12" stroke="#0f4c81" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight" style={{ color: '#0f4c81', fontFamily: 'Poppins, sans-serif' }}>
              BOCA
            </h1>
            <p className="text-xs leading-tight" style={{ color: '#20a8d8', fontFamily: 'Poppins, sans-serif' }}>
              340B INSIGHTS
            </p>
          </div>
        </div>
      </div>

      {/* Center: Project Selector and Date Filters */}
      <div className="flex-1 flex items-center justify-center gap-3 mx-6">
        <select
          value={currentLocation.id}
          onChange={handleProjectChange}
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ 
            backgroundColor: '#f8f9fa', 
            fontFamily: 'Roboto, sans-serif',
            minWidth: '300px',
            color: '#2f353a'
          }}
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            handleDateChange();
          }}
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ 
            width: '100px', 
            fontFamily: 'Roboto, sans-serif',
            backgroundColor: '#f8f9fa',
            color: '#2f353a'
          }}
          placeholder="MM-YYYY"
        />
        <input
          type="text"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            handleDateChange();
          }}
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ 
            width: '100px', 
            fontFamily: 'Roboto, sans-serif',
            backgroundColor: '#f8f9fa',
            color: '#2f353a'
          }}
          placeholder="MM-YYYY"
        />
        <button
          onClick={handleRefresh}
          className="btn-enhanced px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          Refresh
        </button>
      </div>

      {/* Right: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <a href="#" className="hover:underline" style={{ color: '#20a8d8', fontFamily: 'Roboto, sans-serif' }}>
          User Manual
        </a>
        <span style={{ color: '#73818f' }}>|</span>
        <a href="#" className="hover:underline" style={{ color: '#20a8d8', fontFamily: 'Roboto, sans-serif' }}>
          Help
        </a>
        <span style={{ color: '#73818f' }}>|</span>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            onAction?.('navigate', '/admin/dashboard', 'GET');
          }}
          className="hover:underline" 
          style={{ color: '#20a8d8', fontFamily: 'Roboto, sans-serif' }}
        >
          Dashboard
        </a>
        {currentPage !== 'dashboard' && (
          <>
            <span style={{ color: '#73818f' }}> &gt; </span>
            <span style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>{getBreadcrumb()}</span>
          </>
        )}
      </div>
    </div>
  );
}
