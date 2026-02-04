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

interface TotalPatientsTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function TotalPatientsTable({ onAction }: TotalPatientsTableProps) {
  const { currentLocation } = useLocationStore();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Generate mock data
    const mockPatients = generatePatients(50, currentLocation.code);
    setPatients(mockPatients);
    // Trigger load event
    onAction?.('load', '/admin/patients/get', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<Patient>[] = [
    {
      key: 'id',
      label: 'Patient ID',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            const patientId = (e.currentTarget.closest('tr')?.querySelector('td')?.textContent) || '';
            onAction?.('view-patient', `/admin/customers/${patientId}`, 'GET');
          }}
          className="text-blue-600 hover:underline"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          {value}
        </a>
      ),
    },
    {
      key: 'dob',
      label: 'DOB',
      sortable: true,
    },
    {
      key: 'pharmacy',
      label: 'Pharmacy',
      sortable: true,
    },
    {
      key: 'lastDispensed',
      label: 'Last Dispensed',
      sortable: true,
    },
  ];

  const handleRowAction = (patient: Patient) => (
    <div className="flex gap-2">
      <button
        onClick={() => onAction?.('prescriptions', `/admin/patients/${patient.id}/prescriptions`, 'GET')}
        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        Prescriptions
      </button>
      <button
        onClick={() => onAction?.('shipping-details', `/admin/shipping/${patient.id}`, 'GET')}
        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        Shipping Details
      </button>
      <button
        onClick={() => onAction?.('essentials', `/admin/essentials/${patient.id}`, 'GET')}
        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        Everyday Essentials
      </button>
    </div>
  );

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Total Patients for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={patients}
        onAction={onAction}
        onExport={(format) => onAction?.('export', `/admin/patients/export`, 'POST')}
        rowActions={handleRowAction}
      />
    </div>
  );
}
