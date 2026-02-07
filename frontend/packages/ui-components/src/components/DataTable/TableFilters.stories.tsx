/** @jsxImportSource @emotion/react */
import type { Meta, StoryObj } from '@storybook/react';
import { TableFilters } from './TableFilters';

/**
 * TableFilters displays filter controls for tables with flexible positioning.
 * Supports both multiselect dropdowns and search inputs.
 */
const meta = {
  title: 'Components/DataTable/TableFilters',
  component: TableFilters,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Filter controls for DataTable with support for multiselect and search inputs. Filters can be positioned at start, center, or end.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for generating options
const mockOptions = {
  category: [
    { value: 'defi', label: 'DeFi', count: 12 },
    { value: 'nft', label: 'NFT', count: 8 },
    { value: 'gaming', label: 'Gaming', count: 5 },
  ],
  status: [
    { value: 'active', label: 'Active', count: 15 },
    { value: 'pending', label: 'Pending', count: 3 },
    { value: 'inactive', label: 'Inactive', count: 2 },
  ],
  chain: [
    { value: 'ethereum', label: 'Ethereum', count: 10 },
    { value: 'polygon', label: 'Polygon', count: 7 },
    { value: 'bsc', label: 'BSC', count: 3 },
  ],
};

/**
 * Basic multiselect filters - all positioned at start (default)
 */
export const BasicFilters: Story = {
  args: {
    filtersConfig: {
      fields: [
        {
          key: 'category',
          type: 'multiselect',
          placeholder: 'Category',
        },
        {
          key: 'status',
          type: 'multiselect',
          placeholder: 'Status',
        },
      ],
      showClearButton: true,
    },
    filterValues: {},
    searchValues: {},
    filterOptionsWithCounts: mockOptions,
    updateFilter: (key: string) => (values: string[]) => {
      console.log(`Filter ${key} updated:`, values);
    },
    updateSearch: (key: string) => (value: string) => {
      console.log(`Search ${key} updated:`, value);
    },
    clearAllFilters: () => {
      console.log('All filters cleared');
    },
    hasActiveFilters: false,
  },
};

/**
 * Search input only
 */
export const SearchOnly: Story = {
  args: {
    filtersConfig: {
      fields: [
        {
          key: 'search',
          type: 'search',
          placeholder: 'Search projects...',
        },
      ],
      showClearButton: false,
    },
    filterValues: {},
    searchValues: {},
    filterOptionsWithCounts: {},
    updateFilter: (key: string) => (values: string[]) => {
      console.log(`Filter ${key} updated:`, values);
    },
    updateSearch: (key: string) => (value: string) => {
      console.log(`Search ${key} updated:`, value);
    },
    clearAllFilters: () => {
      console.log('All filters cleared');
    },
    hasActiveFilters: false,
  },
};

/**
 * Search on left, filters on right
 */
export const SearchLeftFiltersRight: Story = {
  args: {
    filtersConfig: {
      fields: [
        {
          key: 'search',
          type: 'search',
          placeholder: 'Search projects and exchanges',
          position: 'start',
        },
        {
          key: 'category',
          type: 'multiselect',
          placeholder: 'Category',
          position: 'end',
        },
        {
          key: 'status',
          type: 'multiselect',
          placeholder: 'Status',
          position: 'end',
        },
      ],
      showClearButton: true,
    },
    filterValues: {},
    searchValues: {},
    filterOptionsWithCounts: mockOptions,
    updateFilter: (key: string) => (values: string[]) => {
      console.log(`Filter ${key} updated:`, values);
    },
    updateSearch: (key: string) => (value: string) => {
      console.log(`Search ${key} updated:`, value);
    },
    clearAllFilters: () => {
      console.log('All filters cleared');
    },
    hasActiveFilters: false,
  },
};

/**
 * Filters with center positioning
 */
export const CenterPositioning: Story = {
  args: {
    filtersConfig: {
      fields: [
        {
          key: 'category',
          type: 'multiselect',
          placeholder: 'Category',
          position: 'start',
        },
        {
          key: 'search',
          type: 'search',
          placeholder: 'Search...',
          position: 'center',
        },
        {
          key: 'status',
          type: 'multiselect',
          placeholder: 'Status',
          position: 'end',
        },
      ],
      showClearButton: true,
    },
    filterValues: {},
    searchValues: {},
    filterOptionsWithCounts: mockOptions,
    updateFilter: (key: string) => (values: string[]) => {
      console.log(`Filter ${key} updated:`, values);
    },
    updateSearch: (key: string) => (value: string) => {
      console.log(`Search ${key} updated:`, value);
    },
    clearAllFilters: () => {
      console.log('All filters cleared');
    },
    hasActiveFilters: false,
  },
};

/**
 * Multiple filters on left, one on right
 */
export const MultipleFiltersGrouped: Story = {
  args: {
    filtersConfig: {
      fields: [
        {
          key: 'category',
          type: 'multiselect',
          placeholder: 'Category',
          position: 'start',
        },
        {
          key: 'chain',
          type: 'multiselect',
          placeholder: 'Chain',
          position: 'start',
        },
        {
          key: 'status',
          type: 'multiselect',
          placeholder: 'Status',
          position: 'end',
        },
      ],
      showClearButton: true,
    },
    filterValues: {},
    searchValues: {},
    filterOptionsWithCounts: mockOptions,
    updateFilter: (key: string) => (values: string[]) => {
      console.log(`Filter ${key} updated:`, values);
    },
    updateSearch: (key: string) => (value: string) => {
      console.log(`Search ${key} updated:`, value);
    },
    clearAllFilters: () => {
      console.log('All filters cleared');
    },
    hasActiveFilters: false,
  },
};

/**
 * With active filters to show clear button
 */
export const WithActiveFilters: Story = {
  args: {
    filtersConfig: {
      fields: [
        {
          key: 'search',
          type: 'search',
          placeholder: 'Search...',
        },
        {
          key: 'category',
          type: 'multiselect',
          placeholder: 'Category',
        },
        {
          key: 'status',
          type: 'multiselect',
          placeholder: 'Status',
        },
      ],
      showClearButton: true,
      clearButtonText: 'CLEAR ALL',
    },
    filterValues: {
      category: ['defi', 'nft'],
    },
    searchValues: {
      search: 'ethereum',
    },
    filterOptionsWithCounts: mockOptions,
    updateFilter: (key: string) => (values: string[]) => {
      console.log(`Filter ${key} updated:`, values);
    },
    updateSearch: (key: string) => (value: string) => {
      console.log(`Search ${key} updated:`, value);
    },
    clearAllFilters: () => {
      console.log('All filters cleared');
    },
    hasActiveFilters: true,
  },
};

/**
 * Multiple search inputs
 */
export const MultipleSearchInputs: Story = {
  args: {
    filtersConfig: {
      fields: [
        {
          key: 'projectSearch',
          type: 'search',
          placeholder: 'Search by project...',
        },
        {
          key: 'chainSearch',
          type: 'search',
          placeholder: 'Search by chain...',
        },
        {
          key: 'category',
          type: 'multiselect',
          placeholder: 'Category',
          position: 'end',
        },
      ],
      showClearButton: true,
    },
    filterValues: {},
    searchValues: {},
    filterOptionsWithCounts: mockOptions,
    updateFilter: (key: string) => (values: string[]) => {
      console.log(`Filter ${key} updated:`, values);
    },
    updateSearch: (key: string) => (value: string) => {
      console.log(`Search ${key} updated:`, value);
    },
    clearAllFilters: () => {
      console.log('All filters cleared');
    },
    hasActiveFilters: false,
  },
};

/**
 * All positions used
 */
export const AllPositions: Story = {
  args: {
    filtersConfig: {
      fields: [
        {
          key: 'category',
          type: 'multiselect',
          placeholder: 'Left Filter',
          position: 'start',
        },
        {
          key: 'search',
          type: 'search',
          placeholder: 'Center search...',
          position: 'center',
        },
        {
          key: 'chain',
          type: 'multiselect',
          placeholder: 'Right Filter 1',
          position: 'end',
        },
        {
          key: 'status',
          type: 'multiselect',
          placeholder: 'Right Filter 2',
          position: 'end',
        },
      ],
      showClearButton: true,
    },
    filterValues: {},
    searchValues: {},
    filterOptionsWithCounts: mockOptions,
    updateFilter: (key: string) => (values: string[]) => {
      console.log(`Filter ${key} updated:`, values);
    },
    updateSearch: (key: string) => (value: string) => {
      console.log(`Search ${key} updated:`, value);
    },
    clearAllFilters: () => {
      console.log('All filters cleared');
    },
    hasActiveFilters: false,
  },
};

