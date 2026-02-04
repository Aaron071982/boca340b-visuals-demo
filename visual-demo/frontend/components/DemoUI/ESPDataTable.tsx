'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { useLocationStore } from '@/lib/location-store';

interface ESPRecord {
  date: string;
  facility: string;
  recordType: string;
  description: string;
  status: string;
}

interface ESPDataTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function ESPDataTable({ onAction }: ESPDataTableProps) {
  const { currentLocation } = useLocationStore();
  const [espData, setEspData] = useState<ESPRecord[]>([]);

  useEffect(() => {
    const mockData: ESPRecord[] = Array.from({ length: 30 }, () => ({
      date: new Date(2025, Math.floor(Math.random() * 2), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
      facility: currentLocation.name.split(' (')[0],
      recordType: ['Import', 'Export', 'Sync', 'Update'][Math.floor(Math.random() * 4)],
      description: 'ESP data synchronization record',
      status: ['Success', 'Pending', 'Error'][Math.floor(Math.random() * 3)],
    }));
    setEspData(mockData);
    onAction?.('load', '/admin/esp/data', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<ESPRecord>[] = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'facility', label: 'Facility', sortable: true },
    { key: 'recordType', label: 'Record Type', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          ESP Data for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={espData}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/esp/data/export', 'POST')}
      />
    </div>
  );
}
