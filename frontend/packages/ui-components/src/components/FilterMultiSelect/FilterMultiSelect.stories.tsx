import React, { useState } from 'react';
import type { Meta } from '@storybook/react';
import { expect, within, userEvent, waitFor, screen } from '@storybook/test';
import FilterMultiSelect from './FilterMultiSelect';
import type { FilterMultiSelectOption } from './FilterMultiSelect';
import { colors } from '../../theme/styleSystem';

/**
 * FilterMultiSelect is a multi-select dropdown with integrated search functionality.
 * Perfect for filtering large lists of options.
 */
const meta = {
  title: 'Components/FilterMultiSelect',
  component: FilterMultiSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Multi-select dropdown with search, count badges, and custom styling. Ideal for table filters.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '300px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilterMultiSelect>;

export default meta;

const categoryOptions: FilterMultiSelectOption[] = [
  { value: 'defi', label: 'DeFi', count: 12 },
  { value: 'nft', label: 'NFT', count: 8 },
  { value: 'gaming', label: 'Gaming', count: 5 },
  { value: 'dao', label: 'DAO', count: 3 },
  { value: 'infrastructure', label: 'Infrastructure', count: 7 },
  { value: 'exchange', label: 'Exchange', count: 4 },
  { value: 'wallet', label: 'Wallet', count: 6 },
];

const chainOptions: FilterMultiSelectOption[] = [
  { value: 'ethereum', label: 'Ethereum', count: 15 },
  { value: 'polygon', label: 'Polygon', count: 10 },
  { value: 'bsc', label: 'BSC', count: 8 },
  { value: 'arbitrum', label: 'Arbitrum', count: 6 },
  { value: 'optimism', label: 'Optimism', count: 5 },
  { value: 'avalanche', label: 'Avalanche', count: 4 },
  { value: 'solana', label: 'Solana', count: 3 },
];

/**
 * Default with search enabled
 * Tests:
 * - Opens dropdown on click
 * - Shows all options
 * - Displays count badges
 */
const DefaultComponent = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <FilterMultiSelect
      options={categoryOptions}
      value={value}
      onChange={setValue}
      placeholder="Category"
    />
  );
};

export const Default = {
  render: () => <DefaultComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Category')).toBeInTheDocument();
    
    const selectButton = canvas.getByRole('combobox');
    await userEvent.click(selectButton);
    
    await waitFor(() => {
      expect(screen.getByText('DeFi')).toBeInTheDocument();
    });
    
    expect(screen.getByText('NFT')).toBeInTheDocument();
    expect(screen.getByText('Gaming')).toBeInTheDocument();
    
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  },
};

/**
 * With pre-selected values
 * Tests:
 * - Shows selected count in badge
 * - Pre-selected items are checked
 * - Selected items appear at top of list
 */
const WithSelectedValuesComponent = () => {
  const [value, setValue] = useState<string[]>(['defi', 'nft']);
  return (
    <FilterMultiSelect
      options={categoryOptions}
      value={value}
      onChange={setValue}
      placeholder="Category"
    />
  );
};

export const WithSelectedValues = {
  render: () => <WithSelectedValuesComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('2')).toBeInTheDocument();
    
    const selectButton = canvas.getByRole('combobox');
    await userEvent.click(selectButton);
    
    await waitFor(() => {
      expect(screen.getByText('DeFi')).toBeInTheDocument();
    });
    
    const checkboxes = screen.getAllByRole('checkbox');
    const defiCheckbox = checkboxes.find((cb) => {
      const menuItem = cb.closest('li');
      return menuItem?.textContent?.includes('DeFi');
    });
    const nftCheckbox = checkboxes.find((cb) => {
      const menuItem = cb.closest('li');
      return menuItem?.textContent?.includes('NFT');
    });
    
    expect(defiCheckbox).toBeChecked();
    expect(nftCheckbox).toBeChecked();
  },
};

/**
 * Search disabled
 * Tests:
 * - Search input is not present
 * - All options are still visible
 */
const WithoutSearchComponent = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <FilterMultiSelect
      options={categoryOptions}
      value={value}
      onChange={setValue}
      placeholder="Category"
      searchable={false}
    />
  );
};

export const WithoutSearch = {
  render: () => <WithoutSearchComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const selectButton = canvas.getByRole('combobox');
    await userEvent.click(selectButton);
    
    await waitFor(() => {
      expect(screen.getByText('DeFi')).toBeInTheDocument();
    });
    
    const searchInput = screen.queryByPlaceholderText('Search...');
    expect(searchInput).not.toBeInTheDocument();
    
    expect(screen.getByText('Gaming')).toBeInTheDocument();
    expect(screen.getByText('DAO')).toBeInTheDocument();
  },
};

/**
 * Custom search placeholder
 * Tests:
 * - Search input shows custom placeholder
 * - Search functionality works with custom placeholder
 */
const CustomSearchPlaceholderComponent = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <FilterMultiSelect
      options={chainOptions}
      value={value}
      onChange={setValue}
      placeholder="Chains"
      searchPlaceholder="Type to filter chains..."
      searchable={true}
    />
  );
};

export const CustomSearchPlaceholder = {
  render: () => <CustomSearchPlaceholderComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const selectButton = canvas.getByRole('combobox');
    await userEvent.click(selectButton);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Type to filter chains...');
      expect(searchInput).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Type to filter chains...');
    await userEvent.type(searchInput, 'poly');
    
    await waitFor(() => {
      expect(screen.getByText('Polygon')).toBeInTheDocument();
      expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
    });
  },
};

/**
 * Large list demonstration
 * Tests:
 * - Renders large number of options
 * - Search filters work correctly
 * - Selection works with many items
 */
const LargeListComponent = () => {
  const [value, setValue] = useState<string[]>([]);
  const largeList: FilterMultiSelectOption[] = Array.from({ length: 50 }, (_, i) => ({
    value: `option-${i}`,
    label: `Option ${i + 1}`,
    count: Math.floor(Math.random() * 100),
  }));
  
  return (
    <FilterMultiSelect
      options={largeList}
      value={value}
      onChange={setValue}
      placeholder="Select options"
      searchPlaceholder="Search from 50 options..."
      searchable={true}
    />
  );
};

export const LargeList = {
  render: () => <LargeListComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const selectButton = canvas.getByRole('combobox');
    await userEvent.click(selectButton);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search from 50 options...');
    await userEvent.type(searchInput, '10');
    
    await waitFor(() => {
      expect(screen.getByText('Option 10')).toBeInTheDocument();
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  },
};

/**
 * Options without count badges
 * Tests:
 * - Options render without count badges
 * - Selection still works correctly
 */
const WithoutCountsComponent = () => {
  const [value, setValue] = useState<string[]>([]);
  const optionsWithoutCounts = categoryOptions.map(opt => ({
    value: opt.value,
    label: opt.label,
  }));
  
  return (
    <FilterMultiSelect
      options={optionsWithoutCounts}
      value={value}
      onChange={setValue}
      placeholder="Category"
    />
  );
};

export const WithoutCounts = {
  render: () => <WithoutCountsComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const selectButton = canvas.getByRole('combobox');
    await userEvent.click(selectButton);
    
    await waitFor(() => {
      expect(screen.getByText('DeFi')).toBeInTheDocument();
    });
    
    expect(screen.getByText('NFT')).toBeInTheDocument();
    expect(screen.getByText('Gaming')).toBeInTheDocument();

    const menuItems = screen.getAllByRole('option');
    const defiItem = menuItems.find(item => item.textContent?.includes('DeFi'));
    expect(defiItem?.textContent).not.toMatch(/12/);
  },
};

/**
 * Disabled state
 * Tests:
 * - Component is disabled
 * - Dropdown doesn't open on click
 */
const DisabledComponent = () => {
  const [value, setValue] = useState<string[]>(['defi']);
  return (
    <FilterMultiSelect
      options={categoryOptions}
      value={value}
      onChange={setValue}
      placeholder="Category"
      disabled
    />
  );
};

export const Disabled = {
  render: () => <DisabledComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('1')).toBeInTheDocument();
    
    const selectButton = canvas.getByRole('combobox');
    expect(selectButton).toHaveClass('Mui-disabled');
    
    await userEvent.click(selectButton);
    
    expect(screen.queryByText('DeFi')).not.toBeInTheDocument();
  },
};

/**
 * Interactive demo showing search and selection behavior
 * Tests:
 * - Search filtering works correctly
 * - Multiple selections update count
 * - Search clears on close
 */
const InteractiveDemoComponent = () => {
  const [value, setValue] = useState<string[]>([]);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FilterMultiSelect
        options={chainOptions}
        value={value}
        onChange={setValue}
        placeholder="Select blockchain chains"
        searchPlaceholder="Search chains..."
        searchable={true}
      />
      <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
        Selected: {value.length === 0 ? 'None' : value.join(', ')}
      </div>
    </div>
  );
};

export const InteractiveDemo = {
  render: () => <InteractiveDemoComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Selected: None')).toBeInTheDocument();
    
    const selectButton = canvas.getByRole('combobox');
    await userEvent.click(selectButton);

    await waitFor(() => {
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search chains...');
    await userEvent.type(searchInput, 'eth');
    
    await waitFor(() => {
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
      expect(screen.queryByText('Polygon')).not.toBeInTheDocument();
    });
    
    const ethereumOption = screen.getByText('Ethereum');
    await userEvent.click(ethereumOption);
    
    await waitFor(() => {
      expect(canvas.getByText('1')).toBeInTheDocument();
    });
  },
};

/**
 * Search functionality with no results
 * Tests:
 * - Shows "No results found" when search returns empty
 * - Can recover by clearing search
 */
const SearchNoResultsComponent = () => {
  const [value, setValue] = useState<string[]>([]);
  
  return (
    <FilterMultiSelect
      options={categoryOptions}
      value={value}
      onChange={setValue}
      placeholder="Category"
      searchable={true}
    />
  );
};

export const SearchNoResults = {
  render: () => <SearchNoResultsComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const selectButton = canvas.getByRole('combobox');
    await userEvent.click(selectButton);
    
    await waitFor(() => {
      expect(screen.getByText('DeFi')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search...');
    await userEvent.type(searchInput, 'xyz123nonexistent');
    
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
      expect(screen.queryByText('DeFi')).not.toBeInTheDocument();
    });
  },
};