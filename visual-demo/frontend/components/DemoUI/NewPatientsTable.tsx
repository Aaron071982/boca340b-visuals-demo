'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { generatePatients } from '@/lib/data-generator';
import { useLocationStore } from '@/lib/location-store';

interface Patient {
  id: number;
  name: string;
  dob: string;
  pharmacy: string;
  lastDispensed: string;
}

interface NewPatientsTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function NewPatientsTable({ onAction }: NewPatientsTableProps) {
  const { currentLocation } = useLocationStore();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const mockPatients = generatePatients(30, currentLocation.code).slice(0, 15); // New patients subset
    setPatients(mockPatients);
    onAction?.('load', '/admin/patients/new', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<Patient>[] = [
    { key: 'id', label: 'Patient ID', sortable: true },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => (
        <a href="#" className="text-blue-600 hover:underline" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {value}
        </a>
      ),
    },
    { key: 'dob', label: 'DOB', sortable: true },
    { key: 'pharmacy', label: 'Pharmacy', sortable: true },
    { key: 'lastDispensed', label: 'Last Dispensed', sortable: true },
  ];

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          New Patients for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={patients}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/patients/new/export', 'POST')}
      />
    </div>
  );
}
