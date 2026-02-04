'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { generateShippingInfo } from '@/lib/data-generator';
import { useLocationStore } from '@/lib/location-store';

interface ShippingInfo {
  patientName: string;
  dateOfBirth: string;
  lastOrderDate: string;
  nextOrderDate: string;
  expectedDeliveryDate: string;
}

interface ShippingInformationTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function ShippingInformationTable({ onAction }: ShippingInformationTableProps) {
  const { currentLocation } = useLocationStore();
  const [shippingData, setShippingData] = useState<ShippingInfo[]>([]);

  useEffect(() => {
    const mockShipping = generateShippingInfo(20, currentLocation.code);
    setShippingData(mockShipping);
    onAction?.('load', '/admin/facilities/shipping_view_report', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<ShippingInfo>[] = [
    { key: 'patientName', label: 'Patient Name', sortable: true },
    { key: 'dateOfBirth', label: 'Date of Birth', sortable: true },
    { key: 'lastOrderDate', label: 'Last Order Date', sortable: true },
    { key: 'nextOrderDate', label: 'Next Order Date', sortable: true },
    { key: 'expectedDeliveryDate', label: 'Expected Delivery Date', sortable: true },
  ];

  const handleRowAction = (row: ShippingInfo) => (
    <button
      onClick={() => onAction?.('details', `/admin/shipping/${row.patientName}/details`, 'GET')}
      className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
      style={{ fontFamily: 'Roboto, sans-serif' }}
    >
      Details
    </button>
  );

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Shipping Information for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={shippingData}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/facilities/shipping_view_report/export', 'POST')}
        rowActions={handleRowAction}
        note="* Designates a 340B client"
      />
    </div>
  );
}
