'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { generatePurchases } from '@/lib/data-generator';
import { useLocationStore } from '@/lib/location-store';

interface Purchase {
  wholesaler: string;
  invoiceNumber: string;
  date: string;
  itemNumber: string;
  description: string;
  vendorNDC: string;
  type: string;
  packageSize: string;
  quantityPurchased: number;
  unitCost: string;
  extended: string;
}

interface PurchasesTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function PurchasesTable({ onAction }: PurchasesTableProps) {
  const { currentLocation } = useLocationStore();
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    const mockPurchases = generatePurchases(80, currentLocation.code);
    setPurchases(mockPurchases);
    onAction?.('load', '/admin/purchases', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<Purchase>[] = [
    { key: 'wholesaler', label: 'Wholesaler', sortable: true },
    { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'itemNumber', label: 'Item #', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'vendorNDC', label: 'Vendor NDC', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'packageSize', label: 'Package Size', sortable: true },
    { key: 'quantityPurchased', label: 'Quantity Purchased', sortable: true },
    { key: 'unitCost', label: 'Unit Cost', sortable: true, className: 'text-right' },
    { key: 'extended', label: 'Extended', sortable: true, className: 'text-right' },
  ];

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Purchases for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={purchases}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/purchases/export', 'POST')}
      />
    </div>
  );
}
