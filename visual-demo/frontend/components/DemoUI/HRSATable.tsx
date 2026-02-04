'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { generatePharmacy, generateDate, generateRxID, generateNDC, generateDrugName, generateManufacturer } from '@/lib/data-generator';
import { useLocationStore } from '@/lib/location-store';

interface HRSARecord {
  primaryFilledRx: string;
  coveredEntity: string;
  dateFilled: string;
  rxNumber: string;
  refillNumber: string;
  ndc: string;
  drugName: string;
  manufacturerName: string;
  qtyDispensed: number;
}

interface HRSATableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function HRSATable({ onAction }: HRSATableProps) {
  const { currentLocation } = useLocationStore();
  const [hrsaData, setHrsaData] = useState<HRSARecord[]>([]);

  useEffect(() => {
    const mockData: HRSARecord[] = Array.from({ length: 64 }, () => ({
      primaryFilledRx: generatePharmacy(),
      coveredEntity: currentLocation.name.split(' (')[0] + ' STD',
      dateFilled: generateDate(),
      rxNumber: generateRxID(),
      refillNumber: String(Math.floor(Math.random() * 5)),
      ndc: generateNDC(),
      drugName: generateDrugName() + ' [' + (Math.random() < 0.5 ? '100MG' : '50MG') + ']',
      manufacturerName: generateManufacturer(),
      qtyDispensed: Math.floor(Math.random() * 200 + 1),
    }));
    setHrsaData(mockData);
    onAction?.('load', '/admin/reports/hrsa', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<HRSARecord>[] = [
    { key: 'primaryFilledRx', label: 'Primary that Filled Rx', sortable: true },
    { key: 'coveredEntity', label: 'Covered Entity (Facility)', sortable: true },
    { key: 'dateFilled', label: 'Date Filled', sortable: true },
    { key: 'rxNumber', label: 'Rx Number', sortable: true },
    { key: 'refillNumber', label: 'Refill Number', sortable: true },
    { key: 'ndc', label: 'NDC', sortable: true },
    { key: 'drugName', label: 'Drug Name', sortable: true },
    { key: 'manufacturerName', label: 'Manufacturer Name', sortable: true },
    { key: 'qtyDispensed', label: 'Qty Dispensed', sortable: true },
  ];

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          HRSA Report for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={hrsaData}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/reports/hrsa/export', 'POST')}
      />
    </div>
  );
}
