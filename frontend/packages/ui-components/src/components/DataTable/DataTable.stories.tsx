/** @jsxImportSource @emotion/react */
import type { Meta } from '@storybook/react';
import { createColumnHelper, Row } from '@tanstack/react-table';
import React from 'react';
import { DataTable } from './DataTable';
import type { FiltersConfig } from './DataTable';

// Sample data type for the stories
interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  status: 'active' | 'inactive' | 'pending';
}

// Sample data
const sampleData: Person[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    email: 'john.doe@example.com',
    status: 'active',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    age: 34,
    email: 'jane.smith@example.com',
    status: 'active',
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    age: 45,
    email: 'bob.johnson@example.com',
    status: 'inactive',
  },
  {
    id: 4,
    firstName: 'Alice',
    lastName: 'Williams',
    age: 23,
    email: 'alice.w@example.com',
    status: 'pending',
  },
  {
    id: 5,
    firstName: 'Charlie',
    lastName: 'Brown',
    age: 56,
    email: 'charlie.b@example.com',
    status: 'active',
  },
  {
    id: 6,
    firstName: 'Diana',
    lastName: 'Miller',
    age: 31,
    email: 'diana.m@example.com',
    status: 'inactive',
  },
];

// Column helper
const columnHelper = createColumnHelper<Person>();

// Define columns
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
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      const color = status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'orange';
      return (
        <span style={{ color, fontWeight: 'bold', textTransform: 'uppercase' }}>{status}</span>
      );
    },
  }),
];

const meta = {
  title: 'Components/DataTable',
  component: DataTable<Record<string, unknown>>,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable<Record<string, unknown>>>;

export default meta;

export const Default = {
  render: () => <DataTable data={sampleData} columns={columns} ariaLabel="User management table" />,
};

export const SmallDataset = {
  render: () => <DataTable data={sampleData.slice(0, 3)} columns={columns} />,
};

export const EmptyTable = {
  render: () => (
    <DataTable
      data={[]}
      columns={columns}
      ariaLabel="Empty user table"
      emptyState={{
        title: 'No users found',
        description: 'There are no users to display at this time',
      }}
    />
  ),
};

export const EmptyTableWithClearButton = {
  render: () => {
    const handleClearFilters = () => {
      alert('Filters cleared!');
    };

    return (
      <DataTable
        data={[]}
        columns={columns}
        ariaLabel="Filtered user table"
        emptyState={{
          title: 'Nothing found',
          description: 'Try to adjust or clear filters to see results',
          buttonText: 'Clear filters',
          onButtonClick: handleClearFilters,
        }}
      />
    );
  },
};

export const WithCaption = {
  render: () => (
    <DataTable
      data={sampleData}
      columns={columns}
      ariaLabel="Employee directory"
      caption="List of employees with their contact information and current status"
    />
  ),
};

// Example with custom row renderer
export const WithCustomRows = {
  render: () => {
    const customRowRenderer = ({ index, totalRows }: { row: Row<Person>; index: number; totalRows: number }) => {
      // Insert a custom row after every 3rd item
      if ((index + 1) % 3 === 0 && index < totalRows - 1) {
        return (
          <tr key={`custom-${index}`}>
            <td
              colSpan={columns.length}
              style={{
                backgroundColor: '#f0f9ff',
                padding: '12px',
                textAlign: 'center',
                fontStyle: 'italic',
                color: '#0369a1',
              }}
            >
              Custom promotional row after every 3 items
            </td>
          </tr>
        );
      }
      return null;
    };

    return <DataTable data={sampleData} columns={columns} customRowRenderer={customRowRenderer} />;
  },
};

// Example with filters
export const WithFilters = {
  render: () => {
    const filtersConfig: FiltersConfig<Person> = {
      fields: [
        {
          key: 'status',
          type: 'multiselect',
          placeholder: 'Status',
        },
        {
          key: 'age',
          type: 'multiselect',
          placeholder: 'Age Group',
          getValue: (item) => {
            if (item.age < 30) return 'Under 30';
            if (item.age < 40) return '30-39';
            if (item.age < 50) return '40-49';
            return '50+';
          },
          options: [
            { value: 'Under 30', label: 'Under 30' },
            { value: '30-39', label: '30-39' },
            { value: '40-49', label: '40-49' },
            { value: '50+', label: '50+' },
          ],
        },
      ],
      showClearButton: true,
      showCounts: true,
      clearButtonText: 'CLEAR ALL',
    };

    return (
      <DataTable
        data={sampleData}
        columns={columns}
        filters={filtersConfig}
        ariaLabel="Filtered user table"
      />
    );
  },
};

// Extended sample data for scrollable demos
const extendedData: Person[] = [
  ...sampleData,
  {
    id: 7,
    firstName: 'Eve',
    lastName: 'Davis',
    age: 29,
    email: 'eve.d@example.com',
    status: 'active',
  },
  {
    id: 8,
    firstName: 'Frank',
    lastName: 'Garcia',
    age: 41,
    email: 'frank.g@example.com',
    status: 'pending',
  },
  {
    id: 9,
    firstName: 'Grace',
    lastName: 'Martinez',
    age: 38,
    email: 'grace.m@example.com',
    status: 'active',
  },
  {
    id: 10,
    firstName: 'Henry',
    lastName: 'Rodriguez',
    age: 52,
    email: 'henry.r@example.com',
    status: 'inactive',
  },
  {
    id: 11,
    firstName: 'Ivy',
    lastName: 'Wilson',
    age: 27,
    email: 'ivy.w@example.com',
    status: 'active',
  },
  {
    id: 12,
    firstName: 'Jack',
    lastName: 'Anderson',
    age: 35,
    email: 'jack.a@example.com',
    status: 'pending',
  },
];

// Example with filters and complex filtering
export const WithComplexFilters = {
  render: () => {
    const filtersConfig: FiltersConfig<Person> = {
      fields: [
        {
          key: 'status',
          type: 'multiselect',
          placeholder: 'Status',
        },
        {
          key: 'age',
          type: 'multiselect',
          placeholder: 'Age Group',
          getValue: (item) => {
            if (item.age < 30) return 'Under 30';
            if (item.age < 40) return '30-39';
            if (item.age < 50) return '40-49';
            return '50+';
          },
          options: [
            { value: 'Under 30', label: 'Under 30' },
            { value: '30-39', label: '30-39' },
            { value: '40-49', label: '40-49' },
            { value: '50+', label: '50+' },
          ],
        },
        {
          key: 'lastName',
          type: 'multiselect',
          placeholder: 'Last Name',
        },
      ],
      showClearButton: true,
      showCounts: true,
      clearButtonText: 'CLEAR FILTERS',
    };

    return (
      <DataTable
        data={extendedData}
        columns={columns}
        filters={filtersConfig}
        ariaLabel="Advanced filtered user table"
        emptyState={{
          title: 'No matches found',
          description: 'Try adjusting your filters to see more results',
        }}
      />
    );
  },
};

// Scrollable table with maxVisibleRows
export const ScrollableByRows = {
  render: () => (
    <DataTable
      data={extendedData}
      columns={columns}
      enablePagination={false}
      scrollable={{ maxVisibleRows: 4 }}
      ariaLabel="Scrollable table showing 4 rows"
    />
  ),
};

// Scrollable table with custom row height
export const ScrollableWithCustomRowHeight = {
  render: () => (
    <DataTable
      data={extendedData}
      columns={columns}
      enablePagination={false}
      scrollable={{ maxVisibleRows: 3, rowHeight: 72 }}
      ariaLabel="Scrollable table with taller rows"
    />
  ),
};

// Scrollable table with explicit maxHeight
export const ScrollableByMaxHeight = {
  render: () => (
    <DataTable
      data={extendedData}
      columns={columns}
      enablePagination={false}
      scrollable={{ maxHeight: 300 }}
      ariaLabel="Scrollable table with 300px max height"
    />
  ),
};

// Scrollable table with CSS unit maxHeight
export const ScrollableByViewportHeight = {
  render: () => (
    <DataTable
      data={extendedData}
      columns={columns}
      enablePagination={false}
      scrollable={{ maxHeight: '50vh' }}
      ariaLabel="Scrollable table with 50vh max height"
    />
  ),
};

// Scrollable table with filters (useful for large datasets without pagination)
export const ScrollableWithFilters = {
  render: () => {
    const filtersConfig: FiltersConfig<Person> = {
      fields: [
        {
          key: 'status',
          type: 'multiselect',
          placeholder: 'Status',
        },
        {
          key: 'search',
          type: 'search',
          placeholder: 'Search by name...',
          getValue: (item) => `${item.firstName} ${item.lastName}`,
        },
      ],
      showClearButton: true,
    };

    return (
      <DataTable
        data={extendedData}
        columns={columns}
        filters={filtersConfig}
        enablePagination={false}
        scrollable={{ maxVisibleRows: 5 }}
        ariaLabel="Scrollable filtered table"
        emptyState={{
          title: 'No matches found',
          description: 'Try adjusting your search or filters',
        }}
      />
    );
  },
};
