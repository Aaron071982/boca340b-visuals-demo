'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { generateTransactions } from '@/lib/data-generator';
import { useLocationStore } from '@/lib/location-store';

interface Essential {
  orderDate: string;
  patientName: string;
  item: string;
  quantity: number;
  amount: string;
}

interface EverydayEssentialsTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function EverydayEssentialsTable({ onAction }: EverydayEssentialsTableProps) {
  const { currentLocation } = useLocationStore();
  const [essentials, setEssentials] = useState<Essential[]>([]);

  useEffect(() => {
    const mockTransactions = generateTransactions(40, currentLocation.code);
    const mockEssentials: Essential[] = mockTransactions.map((t) => ({
      orderDate: t.claimDate,
      patientName: 'Patient ' + Math.floor(Math.random() * 1000),
      item: t.drugDescription,
      quantity: t.quantity,
      amount: t.amount,
    }));
    setEssentials(mockEssentials);
    onAction?.('load', '/admin/essentials', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<Essential>[] = [
    { key: 'orderDate', label: 'Order Date', sortable: true },
    { key: 'patientName', label: 'Patient Name', sortable: true },
    { key: 'item', label: 'Item', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, className: 'text-right' },
  ];

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Everyday Essentials for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={essentials}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/essentials/export', 'POST')}
      />
    </div>
  );
}
