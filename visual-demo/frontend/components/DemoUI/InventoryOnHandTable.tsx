'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { generateInventory } from '@/lib/data-generator';
import { useLocationStore } from '@/lib/location-store';

interface InventoryItem {
  ndc: string;
  description: string;
  strength: string;
  packageQuantity: number;
  quantityPurchased: number;
  quantityDispensed: number;
  quantityOnHand: number;
  packageSize: string;
}

interface InventoryOnHandTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function InventoryOnHandTable({ onAction }: InventoryOnHandTableProps) {
  const { currentLocation } = useLocationStore();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const mockInventory = generateInventory(60, currentLocation.code);
    setInventory(mockInventory);
    onAction?.('load', '/admin/inventory', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<InventoryItem>[] = [
    { key: 'ndc', label: 'NDC', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'strength', label: 'Strength', sortable: true },
    { key: 'packageQuantity', label: 'Package Quantity', sortable: true },
    { key: 'quantityPurchased', label: 'Quantity Purchased', sortable: true },
    { key: 'quantityDispensed', label: 'Quantity Dispensed', sortable: true },
    {
      key: 'quantityOnHand',
      label: 'Quantity On Hand',
      sortable: true,
      render: (value: number) => (
        <span style={{ color: value < 0 ? '#dc2626' : '#2f353a' }}>{value}</span>
      ),
    },
    { key: 'packageSize', label: 'Package Size', sortable: true },
  ];

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Inventory On Hand for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={inventory}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/inventory/export', 'POST')}
      />
    </div>
  );
}
