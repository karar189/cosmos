/** @jsxImportSource @emotion/react */
import React from 'react';
import type { Meta } from '@storybook/react';
import { createColumnHelper, useReactTable, getCoreRowModel, getPaginationRowModel, PaginationState } from '@tanstack/react-table';
import { TablePagination } from './TablePagination';

// Sample data type
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor('id', { header: '#' }),
  columnHelper.accessor('name', { header: 'Product' }),
  columnHelper.accessor('price', { header: 'Price' }),
  columnHelper.accessor('category', { header: 'Category' }),
];

// Generate sample data
const generateData = (count: number): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 1000) + 10,
    category: categories[Math.floor(Math.random() * categories.length)],
  }));
};

const sampleData = generateData(47);

const meta = {
  title: 'Components/DataTable/TablePagination',
  component: TablePagination,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TablePagination>;

export default meta;

// Demo with working pagination
const PaginationDemo = ({ pageSize = 10 }: { pageSize?: number }) => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data: sampleData,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '16px' }}>TablePagination Component (Isolated)</h3>
      
      {/* Mock table to show current page data */}
      <div style={{ 
        padding: '20px', 
        background: '#f9f9f9', 
        borderRadius: '8px', 
        marginBottom: '20px',
        minHeight: '200px' 
      }}>
        <strong>Showing page {pagination.pageIndex + 1} of {table.getPageCount()}</strong>
        <div style={{ marginTop: '12px' }}>
          {table.getRowModel().rows.map((row) => (
            <div key={row.id} style={{ padding: '4px 0' }}>
              {row.original.name} - ${row.original.price}
            </div>
          ))}
        </div>
      </div>

      <TablePagination
        table={table}
        totalRows={sampleData.length}
        pageSizeOptions={[5, 10, 20, 30]}
      />

      <div style={{ marginTop: '20px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', fontSize: '14px' }}>
        <strong>State:</strong> Page {pagination.pageIndex + 1} of {table.getPageCount()}, 
        showing {pagination.pageSize} per page
      </div>
    </div>
  );
};

export const Default = {
  render: () => <PaginationDemo />,
};

export const SmallPageSize = {
  render: () => <PaginationDemo pageSize={5} />,
};

export const LargePageSize = {
  render: () => <PaginationDemo pageSize={20} />,
};

// Demo with many pages
const ManyPagesDemo = () => {
  const largeData = generateData(247); // 247 items creates many pages
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: largeData,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '16px' }}>Many Pages (247 items, 10 per page)</h3>
      
      <div style={{ 
        padding: '20px', 
        background: '#f9f9f9', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <strong>Page {pagination.pageIndex + 1} of {table.getPageCount()}</strong>
        <p style={{ marginTop: '8px', color: '#666' }}>
          Shows ellipsis navigation for many pages
        </p>
      </div>

      <TablePagination
        table={table}
        totalRows={largeData.length}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </div>
  );
};

export const ManyPages = {
  render: () => <ManyPagesDemo />,
};

