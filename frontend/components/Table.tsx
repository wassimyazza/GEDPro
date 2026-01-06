// Simple Table component
// A reusable table for displaying data

import React from 'react';

// Define the props for the Table component
type Column = {
    key: string; // Key to access the data
    label: string; // Column header label
};

type TableProps = {
    columns: Column[]; // Array of column definitions
    data: any[]; // Array of data rows
    onRowClick?: (row: any) => void; // Optional function to call when a row is clicked
};

export default function Table({ columns, data, onRowClick }: TableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-8 text-center text-gray-500"
                            >
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`border-b ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                                    }`}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="px-6 py-4 text-sm text-gray-800"
                                    >
                                        {row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
