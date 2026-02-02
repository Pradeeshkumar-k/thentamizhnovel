import React from 'react';
import { DataTableProps } from '../../../types';
// import styles from './DataTable.module.scss'; // SCSS Removed

/**
 * DataTable Component
 *
 * Reusable table component for displaying data in admin pages
 *
 * Props:
 * - columns: Array of column definitions [{ key, label, render? }]
 * - data: Array of data objects
 * - onRowClick: Optional callback when row is clicked
 * - actions: Optional render function for row actions
 * - emptyMessage: Message to show when no data
 */

interface ExtendedDataTableProps extends DataTableProps {
  emptyMessage?: string;
}

const DataTable: React.FC<ExtendedDataTableProps> = ({
  columns = [],
  data = [],
  onRowClick,
  actions,
  emptyMessage = 'No data available'
}) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 bg-surface border border-border rounded-xl text-center shadow-sm">
        <div className="text-5xl mb-4 opacity-50 grayscale">📋</div>
        <p className="text-secondary text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Mobile Component: Card View */}
      <div className="block md:hidden space-y-4">
        {data.map((row, rowIndex) => (
          <div 
            key={row.id || rowIndex} 
            className="bg-surface border border-border p-4 rounded-xl shadow-sm space-y-3"
            onClick={() => onRowClick && onRowClick(row)}
          >
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between items-start gap-4">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider min-w-[30%]">
                  {column.label}
                </span>
                <span className="text-sm text-primary text-right font-medium">
                   {column.render ? column.render(row[column.key], row) : row[column.key]}
                </span>
              </div>
            ))}
            
            {actions && (
              <div className="pt-3 mt-2 border-t border-border flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                 {typeof actions === 'function' ? (
                      actions(row)
                    ) : (
                      actions.map((action, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => action.onClick(row)}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                              action.variant === 'danger' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' :
                              action.variant === 'success' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' :
                              'bg-primary/10 text-primary hover:bg-primary/20'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))
                    )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Component: Standard Table */}
      <div className="hidden md:block w-full overflow-hidden border border-border rounded-xl shadow-sm bg-surface overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-sm">
        <thead className="bg-muted/5 border-b border-border">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap first:pl-6 last:pr-6">
                {column.label}
              </th>
            ))}
            {actions && <th className="px-5 py-4 text-center text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap px-6">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={`transition-colors hover:bg-muted/5 ${onRowClick ? 'cursor-pointer hover:bg-muted/10' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-4 text-primary whitespace-nowrap first:pl-6 last:pr-6">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {actions && (
                <td className="px-5 py-4 whitespace-nowrap last:pr-6" onClick={(e: React.MouseEvent<HTMLTableCellElement>) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-2">
                    {typeof actions === 'function' ? (
                      actions(row)
                    ) : (
                      actions.map((action, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => action.onClick(row)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              action.variant === 'danger' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' :
                              action.variant === 'success' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' :
                              'bg-primary/10 text-primary hover:bg-primary/20'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default DataTable;
