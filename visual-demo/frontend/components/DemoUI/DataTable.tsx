'use client';

import { useState, useMemo } from 'react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onAction?: (action: string, endpoint: string, method?: string, data?: T) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onSearch?: (query: string) => void;
  onExport?: (format: 'copy' | 'excel') => void;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  searchable?: boolean;
  exportable?: boolean;
  rowActions?: (row: T) => React.ReactNode;
  footerRow?: React.ReactNode;
  note?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onAction,
  onSort,
  onSearch,
  onExport,
  onPageChange,
  pageSize = 10,
  searchable = true,
  exportable = true,
  rowActions,
  footerRow,
  note,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [entriesPerPage, setEntriesPerPage] = useState(pageSize);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key as keyof T];
        return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn as keyof T];
      const bVal = b[sortColumn as keyof T];
      if (aVal === bVal) return 0;
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    const end = start + entriesPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, entriesPerPage]);

  const totalPages = Math.ceil(sortedData.length / entriesPerPage);

  const handleSort = (columnKey: string) => {
    if (onSort) {
      const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
      setSortColumn(columnKey);
      setSortDirection(newDirection);
      onSort(columnKey, newDirection);
    } else {
      // Client-side sort
      if (sortColumn === columnKey) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(columnKey);
        setSortDirection('asc');
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleExport = (format: 'copy' | 'excel') => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export behavior
      const csv = [
        columns.map((col) => col.label).join(','),
        ...sortedData.map((row) =>
          columns.map((col) => {
            const value = row[col.key as keyof T];
            return `"${value?.toString().replace(/"/g, '""') || ''}"`;
          }).join(',')
        ),
      ].join('\n');

      if (format === 'copy') {
        navigator.clipboard.writeText(csv);
      } else {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleEntriesChange = (value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6" style={{ backgroundColor: '#ffffff' }}>
      {/* Table Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
            Show
          </span>
          <select
            value={entriesPerPage}
            onChange={(e) => handleEntriesChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
            entries
          </span>
          {exportable && (
            <>
              <button
                onClick={() => handleExport('copy')}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                style={{ fontFamily: 'Roboto, sans-serif', color: '#2f353a' }}
              >
                Copy
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                style={{ fontFamily: 'Roboto, sans-serif', color: '#2f353a' }}
              >
                Excel
              </button>
            </>
          )}
        </div>
        {searchable && (
          <div className="flex items-center gap-2">
            <label className="text-sm" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
              Search:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: 'Roboto, sans-serif', minWidth: '200px' }}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}
                  onClick={() => column.sortable !== false && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable !== false && (
                      <div className="flex flex-col">
                        <i
                          className={`bi bi-caret-up-fill text-xs ${
                            sortColumn === column.key && sortDirection === 'asc'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <i
                          className={`bi bi-caret-down-fill text-xs ${
                            sortColumn === column.key && sortDirection === 'desc'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {rowActions && <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}
                    style={{ color: '#2f353a', fontFamily: 'Roboto, sans-serif' }}
                  >
                    {column.render
                      ? column.render(row[column.key as keyof T], row)
                      : row[column.key as keyof T]?.toString() || ''}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {rowActions(row)}
                  </td>
                )}
              </tr>
            ))}
            {footerRow && (
              <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                {footerRow}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Note */}
      {note && (
        <p className="mt-2 text-xs" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
          {note}
        </p>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm" style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>
          Showing {Math.min((currentPage - 1) * entriesPerPage + 1, sortedData.length)} to{' '}
          {Math.min(currentPage * entriesPerPage, sortedData.length)} of {sortedData.length} entries
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ fontFamily: 'Roboto, sans-serif', color: '#2f353a' }}
          >
            &lt;
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum;
            if (totalPages <= 7) {
              pageNum = i + 1;
            } else if (currentPage <= 4) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 3) {
              pageNum = totalPages - 6 + i;
            } else {
              pageNum = currentPage - 3 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 ${
                  currentPage === pageNum ? 'bg-blue-600 text-white border-blue-600' : ''
                }`}
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  color: currentPage === pageNum ? '#ffffff' : '#2f353a',
                }}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ fontFamily: 'Roboto, sans-serif', color: '#2f353a' }}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
