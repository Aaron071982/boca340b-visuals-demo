'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { generatePatients } from '@/lib/data-generator';
import { useLocationStore } from '@/lib/location-store';

interface Enrollment {
  id: number;
  name: string;
  dob: string;
  enrollmentDate: string;
  status: string;
}

interface NewEnrollmentsTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function NewEnrollmentsTable({ onAction }: NewEnrollmentsTableProps) {
  const { currentLocation } = useLocationStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    const mockPatients = generatePatients(20, currentLocation.code);
    const mockEnrollments: Enrollment[] = mockPatients.map((p) => ({
      ...p,
      enrollmentDate: p.lastDispensed,
      status: 'No Rx',
    }));
    setEnrollments(mockEnrollments);
    onAction?.('load', '/admin/enrollments/no-rx', 'GET');
  }, [currentLocation, onAction]);

  const columns: Column<Enrollment>[] = [
    { key: 'id', label: 'Patient ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'dob', label: 'DOB', sortable: true },
    { key: 'enrollmentDate', label: 'Enrollment Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          New Enrollments w/ No Rx for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={enrollments}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/enrollments/no-rx/export', 'POST')}
      />
    </div>
  );
}
