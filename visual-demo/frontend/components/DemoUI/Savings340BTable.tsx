'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { generatePatientName, generateNDC, generateDrugName, generateStrength, generateDate, generateRxID, generatePrescriber } from '@/lib/data-generator';
import { useLocationStore } from '@/lib/location-store';

interface Savings340B {
  claimDate: string;
  patientNumber: string;
  patientName: string;
  rxId: string;
  ndc: string;
  drugDescription: string;
  strength: string;
  brand: string;
  rxType: string;
  quantity: number;
  prescriberName: string;
}

interface Savings340BTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function Savings340BTable({ onAction }: Savings340BTableProps) {
  const { currentLocation } = useLocationStore();
  const [savings, setSavings] = useState<Savings340B[]>([]);

  useEffect(() => {
    const mockSavings: Savings340B[] = Array.from({ length: 50 }, (_, i) => ({
      claimDate: generateDate(),
      patientNumber: String(Math.floor(Math.random() * 90000 + 20000)),
      patientName: generatePatientName(currentLocation.code ? `${currentLocation.code}-savings-${i}` : undefined),
      rxId: generateRxID(),
      ndc: generateNDC(),
      drugDescription: generateDrugName(),
      strength: generateStrength(),
      brand: Math.random() < 0.3 ? 'Y' : 'N',
      rxType: Math.random() < 0.8 ? 'P' : 'O',
      quantity: Math.floor(Math.random() * 200 + 1),
      prescriberName: generatePrescriber(),
    }));
    setSavings(mockSavings);
    onAction?.('load', '/admin/savings', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<Savings340B>[] = [
    { key: 'claimDate', label: 'Claim Date', sortable: true },
    { key: 'patientNumber', label: 'Patient #', sortable: true },
    { key: 'patientName', label: 'Patient Name', sortable: true },
    { key: 'rxId', label: 'Rx ID', sortable: true },
    { key: 'ndc', label: 'NDC', sortable: true },
    { key: 'drugDescription', label: 'Drug Description', sortable: true },
    { key: 'strength', label: 'Strength', sortable: true },
    { key: 'brand', label: 'Brand', sortable: true },
    { key: 'rxType', label: 'Rx Type', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'prescriberName', label: 'Prescriber Name', sortable: true },
  ];

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          340B Savings for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={savings}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/savings/export', 'POST')}
      />
    </div>
  );
}
