'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from './DataTable';
import { generateTransactions } from '@/lib/data-generator';
import { useLocationStore } from '@/lib/location-store';

interface TransactionDetail {
  claimDate: string;
  rxId: string;
  ndc: string;
  drugDescription: string;
  strength: string;
  rxType: string;
  quantity: number;
  totalInsPaid: string;
  patientCoPay: string;
  copayCollected: string;
  pharmacyFee: string;
  amount: string;
}

interface TransactionDetailsTableProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function TransactionDetailsTable({ onAction }: TransactionDetailsTableProps) {
  const { currentLocation } = useLocationStore();
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);

  useEffect(() => {
    const mockTransactions = generateTransactions(64, currentLocation.code);
    setTransactions(mockTransactions);
    onAction?.('load', '/admin/reports/transactiondetails', 'GET');
  }, [currentLocation, onAction]);

  // Calculate totals
  const totals = transactions.reduce(
    (acc, t) => ({
      totalInsPaid: acc.totalInsPaid + parseFloat(t.totalInsPaid.replace('$', '') || '0'),
      patientCoPay: acc.patientCoPay + parseFloat(t.patientCoPay.replace('$', '') || '0'),
      copayCollected: acc.copayCollected + parseFloat(t.copayCollected.replace('$', '') || '0'),
      pharmacyFee: acc.pharmacyFee + parseFloat(t.pharmacyFee.replace('$', '') || '0'),
      amount: acc.amount + parseFloat(t.amount.replace('$', '') || '0'),
    }),
    { totalInsPaid: 0, patientCoPay: 0, copayCollected: 0, pharmacyFee: 0, amount: 0 }
  );

  const columns: Column<TransactionDetail>[] = [
    { key: 'claimDate', label: 'Claim Date', sortable: true },
    { key: 'rxId', label: 'Rx ID', sortable: true },
    { key: 'ndc', label: 'NDC', sortable: true },
    { key: 'drugDescription', label: 'Drug Description', sortable: true },
    { key: 'strength', label: 'Strength', sortable: true },
    { key: 'rxType', label: 'Rx Type', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'totalInsPaid', label: 'Total Ins Paid', sortable: true, className: 'text-right' },
    { key: 'patientCoPay', label: 'Patient CoPay', sortable: true, className: 'text-right' },
    { key: 'copayCollected', label: 'CoPay Collected', sortable: true, className: 'text-right' },
    { key: 'pharmacyFee', label: 'Pharmacy Fee', sortable: true, className: 'text-right' },
    { key: 'amount', label: 'Amount', sortable: true, className: 'text-right' },
  ];

  const footerRow = (
    <>
      <td colSpan={7} className="px-6 py-4 text-right font-semibold" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
        Totals:
      </td>
      <td className="px-6 py-4 text-right font-semibold" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
        ${totals.totalInsPaid.toFixed(2)}
      </td>
      <td className="px-6 py-4 text-right font-semibold" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
        ${totals.patientCoPay.toFixed(2)}
      </td>
      <td className="px-6 py-4 text-right font-semibold" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
        ${totals.copayCollected.toFixed(2)}
      </td>
      <td className="px-6 py-4 text-right font-semibold" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
        ${totals.pharmacyFee.toFixed(2)}
      </td>
      <td className="px-6 py-4 text-right font-semibold" style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}>
        ${totals.amount.toFixed(2)}
      </td>
    </>
  );

  return (
    <div>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
          Transaction Details for The 6:52 Project Foundation Inc <span style={{ color: '#ff9800' }}>11-2025</span> to <span style={{ color: '#ff9800' }}>12-2025</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={transactions}
        onAction={onAction}
        onExport={(format) => onAction?.('export', '/admin/reports/transactiondetails/export', 'POST')}
        footerRow={footerRow}
      />
    </div>
  );
}
