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
      <div className="block md:hidden space-y-5">
        {data.map((row, rowIndex) => (
          <div 
            key={row.id || rowIndex} 
            className="group relative bg-surface/50 backdrop-blur-sm border border-border p-5 rounded-2xl shadow-sm space-y-4 hover:border-accent/30 transition-all duration-300"
            onClick={() => onRowClick && onRowClick(row)}
          >
            <div className="space-y-3.5">
              {columns.map((column) => (
                <div key={column.key} className="flex flex-col gap-1 border-b border-border/30 pb-3.5 last:border-0 last:pb-0">
                  <span className="text-[10px] font-black text-muted uppercase tracking-[0.15em]">
                    {column.label}
                  </span>
                  <div className="text-sm text-primary font-bold">
                     {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </div>
                </div>
              ))}
            </div>
            
            {actions && (
              <div className="pt-4 mt-1 border-t border-border flex flex-wrap justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                 {typeof actions === 'function' ? (
                      actions(row)
                    ) : (
                      <div className="flex gap-2 w-full sm:w-auto">
                        {actions.map((action, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => action.onClick(row)}
                            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all duration-300 active:scale-95 ${
                                action.variant === 'danger' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' :
                                action.variant === 'success' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20' :
                                'bg-muted/10 text-primary hover:bg-muted/20 border border-border/50'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
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
