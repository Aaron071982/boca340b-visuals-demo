'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { generateTransactions, generatePatientName, generateNDC, generateDrugName, generateStrength, generateDate, generateAmount } from '@/lib/data-generator';
import { useLocationStore } from '@/lib/location-store';

interface ReconDetail {
  claimDate: string;
  patientLastName: string;
  patientFirstName: string;
  insCode: string;
  modifier: string;
  rxId: string;
  ndc: string;
  drugDescription: string;
  strength: string;
  rxType: string;
  quantity: number;
  price: string;
}

interface ReconDetailsTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function ReconDetailsTable({ onAction }: ReconDetailsTableProps) {
  const { currentLocation } = useLocationStore();
  const [reconData, setReconData] = useState<ReconDetail[]>([]);

  useEffect(() => {
    // Generate mock recon data
    const mockData: ReconDetail[] = Array.from({ length: 64 }, (_, i) => {
      const name = generatePatientName(currentLocation.code ? `${currentLocation.code}-recon-${i}` : undefined);
      const parts = name.split(', ');
      return {
        claimDate: generateDate(),
        patientLastName: parts[0] || '',
        patientFirstName: parts[1] || '',
        insCode: 'INS' + Math.floor(Math.random() * 9000 + 1000),
        modifier: '',
        rxId: Math.floor(Math.random() * 90000 + 10000).toString(),
        ndc: generateNDC(),
        drugDescription: generateDrugName(),
        strength: generateStrength(),
        rxType: Math.random() < 0.8 ? 'P' : 'O',
        quantity: Math.floor(Math.random() * 200 + 1),
        price: generateAmount(10, 500),
      };
    });
    setReconData(mockData);
    onAction?.('load', '/admin/reports/recon', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<ReconDetail>[] = [
    { key: 'claimDate', label: 'Claim Date', sortable: true },
    { key: 'patientLastName', label: 'Patient Last Name', sortable: true },
    { key: 'patientFirstName', label: 'Patient First Name', sortable: true },
    { key: 'insCode', label: 'Ins Code', sortable: true },
    { key: 'modifier', label: 'Modifier', sortable: true },
    { key: 'rxId', label: 'Rx ID', sortable: true },
    { key: 'ndc', label: 'NDC', sortable: true },
    { key: 'drugDescription', label: 'Drug Description', sortable: true },
    { key: 'strength', label: 'Strength', sortable: true },
    { key: 'rxType', label: 'Rx Type', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'price', label: 'Price', sortable: true, className: 'text-right' },
  ];

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Recon Details for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={reconData}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/reports/recon/export', 'POST')}
      />
    </div>
  );
}
