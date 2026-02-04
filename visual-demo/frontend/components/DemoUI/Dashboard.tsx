'use client';

import { useState, useEffect } from 'react';
import { useLocationStore } from '@/lib/location-store';

interface DashboardProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

interface StatCard {
  title: string;
  value: string;
  description: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  valueColor: string;
}

export default function Dashboard({ onAction }: DashboardProps) {
  const { currentLocation } = useLocationStore();
  const [stats, setStats] = useState({
    totalPatients: 0,
    transferAmountDue: 0,
    savings340B: 0,
    newPatients: 0,
    everydayEssentials: 0,
    purchases: 3610.79,
    newEnrollmentsNoRx: 0,
    totalAmountCollected: 13048.74,
    inventoryOnHand: -2622.39,
  });

  useEffect(() => {
    // Load dashboard data
    onAction?.('load', '/admin/dashboard', 'GET');
    // Generate location-specific stats based on location code
    const locationHash = currentLocation.code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseValue = (locationHash % 1000) / 10;
    
    setStats({
      totalPatients: Math.floor(baseValue * 2.5),
      transferAmountDue: baseValue * 150,
      savings340B: baseValue * 80,
      newPatients: Math.floor(baseValue * 0.5),
      everydayEssentials: baseValue * 45,
      purchases: baseValue * 200 + 1000,
      newEnrollmentsNoRx: Math.floor(baseValue * 0.3),
      totalAmountCollected: baseValue * 600 + 5000,
      inventoryOnHand: baseValue * -100 - 1000,
    });
  }, [currentLocation, onAction]);

  const statCards: StatCard[] = [
    {
      title: 'TOTAL PATIENTS',
      value: stats.totalPatients.toString(),
      description: `${stats.totalPatients} unique patients have filled an Rx for date range`,
      icon: 'bi-people',
      iconColor: '#20a8d8',
      iconBg: '#e3f2fd',
      valueColor: '#20a8d8',
    },
    {
      title: 'TRANSFER AMOUNT DUE',
      value: `$${stats.transferAmountDue.toFixed(2)}`,
      description: 'Transfer amount due for date range',
      icon: 'bi-file-text',
      iconColor: '#ff9800',
      iconBg: '#fff3cd',
      valueColor: '#2f353a',
    },
    {
      title: '340B SAVINGS',
      value: `$${stats.savings340B.toFixed(2)}`,
      description: '340B savings for date range',
      icon: 'bi-building',
      iconColor: '#ff9800',
      iconBg: '#fff3cd',
      valueColor: '#2f353a',
    },
    {
      title: 'NEW PATIENTS',
      value: stats.newPatients.toString(),
      description: 'New patients for date range',
      icon: 'bi-person-plus',
      iconColor: '#ff9800',
      iconBg: '#fff3cd',
      valueColor: '#2f353a',
    },
    {
      title: 'EVERYDAY ESSENTIALS',
      value: `$${stats.everydayEssentials.toFixed(2)}`,
      description: 'OTC orders for date range',
      icon: 'bi-box',
      iconColor: '#ff9800',
      iconBg: '#fff3cd',
      valueColor: '#2f353a',
    },
    {
      title: 'PURCHASES',
      value: `$${stats.purchases.toFixed(2)}`,
      description: 'Wholesaler purchases for date range',
      icon: 'bi-cart',
      iconColor: '#20a8d8',
      iconBg: '#e3f2fd',
      valueColor: '#2f353a',
    },
    {
      title: 'NEW ENROLLMENTS WITH NO RX',
      value: stats.newEnrollmentsNoRx.toString(),
      description: 'New referral with no Rx for date range',
      icon: 'bi-prescription',
      iconColor: '#ff9800',
      iconBg: '#fff3cd',
      valueColor: '#2f353a',
    },
    {
      title: 'TOTAL AMOUNT COLLECTED',
      value: `$${stats.totalAmountCollected.toFixed(2)}`,
      description: '64 transactions for date range',
      icon: 'bi-clipboard-data',
      iconColor: '#ff9800',
      iconBg: '#fff3cd',
      valueColor: '#2f353a',
    },
    {
      title: 'INVENTORY ON HAND',
      value: `$${stats.inventoryOnHand.toFixed(2)}`,
      description: 'Inventory for last month in date range',
      icon: 'bi-clipboard-plus',
      iconColor: '#ff9800',
      iconBg: '#fff3cd',
      valueColor: stats.inventoryOnHand < 0 ? '#dc2626' : '#2f353a',
    },
  ];

  // Chart data
  const patientsData = {
    '11-2025': { total: 5, new: 2, enrollments: 1 },
    '12-2025': { total: 5, new: 2, enrollments: 1 },
  };

  const savingsData = {
    '11-2025': { collected: 7000, purchase: 1800, savings: 1300 },
    '12-2025': { collected: 5800, purchase: 1500, savings: 700 },
  };

  return (
    <div className="p-6" style={{ backgroundColor: '#f0f3f5' }}>
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onAction?.('card-click', '/admin/dashboard', 'GET')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                  {card.title}
                </h3>
                <p className="text-3xl font-bold mb-1" style={{ color: card.valueColor, fontFamily: 'Poppins, sans-serif' }}>
                  {card.value}
                </p>
                <p className="text-xs" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                  {card.description}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: card.iconBg }}>
                <i className={`bi ${card.icon} text-2xl`} style={{ color: card.iconColor }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Patients Summary Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
            PATIENTS SUMMARY
          </h3>
          <div className="h-64 flex items-end justify-center gap-8">
            {Object.entries(patientsData).map(([month, data]) => (
              <div key={month} className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-1 w-16">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${(data.total / 5) * 200}px`,
                      backgroundColor: '#3b82f6',
                      minHeight: '20px',
                    }}
                  />
                </div>
                <span className="text-xs" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                  {month}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-xs" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                Total Patients
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#93c5fd' }}></div>
              <span className="text-xs" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                New Patients
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9ca3af' }}></div>
              <span className="text-xs" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                New Enrollments with No Rx
              </span>
            </div>
          </div>
        </div>

        {/* 340B Summary Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
            340B SUMMARY
          </h3>
          <div className="h-64 flex items-end justify-center gap-4">
            {Object.entries(savingsData).map(([month, data]) => (
              <div key={month} className="flex items-end gap-1">
                <div
                  className="w-8 rounded-t"
                  style={{
                    height: `${(data.collected / 8000) * 200}px`,
                    backgroundColor: '#3b82f6',
                    minHeight: '10px',
                  }}
                />
                <div
                  className="w-8 rounded-t"
                  style={{
                    height: `${(data.purchase / 8000) * 200}px`,
                    backgroundColor: '#93c5fd',
                    minHeight: '10px',
                  }}
                />
                <div
                  className="w-8 rounded-t"
                  style={{
                    height: `${(data.savings / 8000) * 200}px`,
                    backgroundColor: '#9ca3af',
                    minHeight: '10px',
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-xs" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                Total Amount Collected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#93c5fd' }}></div>
              <span className="text-xs" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                Total Purchase Amount
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9ca3af' }}></div>
              <span className="text-xs" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
                340B Savings
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
