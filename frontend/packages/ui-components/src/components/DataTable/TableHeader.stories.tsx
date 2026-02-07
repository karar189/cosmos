/** @jsxImportSource @emotion/react */
import React from 'react';
import type { Meta } from '@storybook/react';
import { createColumnHelper, useReactTable, getCoreRowModel, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { TableHeader } from './TableHeader';

// Sample data type
interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor('id', {
    header: '#',
    enableSorting: false,
  }),
  columnHelper.accessor('firstName', {
    header: 'First Name',
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    enableSorting: false,
  }),
];

const sampleData: Person[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', age: 28, email: 'john.doe@example.com' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', age: 34, email: 'jane.smith@example.com' },
];

const meta = {
  title: 'Components/DataTable/TableHeader',
  component: TableHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TableHeader>;

export default meta;

// Story with working table instance
const TableHeaderDemo = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  
  const table = useReactTable({
    data: sampleData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '16px' }}>TableHeader Component (Isolated)</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <tbody>
          <tr>
            <td colSpan={columns.length} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Table body would render here...
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style={{ marginTop: '20px', padding: '12px', background: '#f0f9ff', borderRadius: '8px' }}>
        <strong>Current sorting:</strong> {sorting.length > 0 ? JSON.stringify(sorting) : 'None'}
      </div>
    </div>
  );
};

export const Default = {
  render: () => <TableHeaderDemo />,
};

export const WithInitialSort = {
  render: () => {
    const TableWithSort = () => {
      const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'age', desc: true }
      ]);
      
      const table = useReactTable({
        data: sampleData,
        columns,
        state: {
          sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
      });

      return (
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '16px' }}>Pre-sorted by Age (Descending)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHeader headerGroups={table.getHeaderGroups()} />
            <tbody>
              <tr>
                <td colSpan={columns.length} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  Table body would render here...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    };
    
    return <TableWithSort />;
  },
};

