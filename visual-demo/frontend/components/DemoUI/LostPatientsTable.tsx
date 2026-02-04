'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { generatePatients } from '@/lib/data-generator';
import { useLocationStore } from '@/lib/location-store';

interface LostPatient {
  id: number;
  name: string;
  dob: string;
  lastDispensed: string;
  daysSinceLastRx: number;
}

interface LostPatientsTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function LostPatientsTable({ onAction }: LostPatientsTableProps) {
  const { currentLocation } = useLocationStore();
  const [lostPatients, setLostPatients] = useState<LostPatient[]>([]);

  useEffect(() => {
    const mockPatients = generatePatients(25, currentLocation.code);
    const mockLost: LostPatient[] = mockPatients.map((p) => ({
      id: p.id,
      name: p.name,
      dob: p.dob,
      lastDispensed: p.lastDispensed,
      daysSinceLastRx: Math.floor(Math.random() * 365 + 90),
    }));
    setLostPatients(mockLost);
    onAction?.('load', '/admin/patients/lost', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<LostPatient>[] = [
    { key: 'id', label: 'Patient ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'dob', label: 'DOB', sortable: true },
    { key: 'lastDispensed', label: 'Last Dispensed', sortable: true },
    { key: 'daysSinceLastRx', label: 'Days Since Last Rx', sortable: true },
  ];

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Lost Patients for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={lostPatients}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/patients/lost/export', 'POST')}
      />
    </div>
  );
}
