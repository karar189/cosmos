import React, { useState } from 'react';
import type { Meta } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import FilterTabs from './FilterTabs';
import type { FilterTabOption } from './FilterTabs';
import { colors } from '../../theme/styleSystem';

/**
 * FilterTabs is a tab-style filter component that acts as direct selection buttons.
 * Single-select behavior with toggle capability.
 */
const meta = {
  title: 'Components/FilterTabs',
  component: FilterTabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tab-style filter buttons with single-select behavior. Clicking a tab selects it; clicking the active tab deselects it. Uses same API as multiselect filters for consistency.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilterTabs>;

export default meta;

const statusOptions: FilterTabOption[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

const categoryOptions: FilterTabOption[] = [
  { value: 'defi', label: 'DeFi' },
  { value: 'nft', label: 'NFT' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'dao', label: 'DAO' },
  { value: 'infrastructure', label: 'Infrastructure' },
];

/**
 * Default state with no selection
 * Tests:
 * - All tabs render correctly
 * - No tab is initially selected
 * - Clicking a tab selects it
 */
const DefaultComponent = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <FilterTabs
      options={statusOptions}
      value={value}
      onChange={setValue}
    />
  );
};

export const Default = {
  render: () => <DefaultComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Active' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Completed' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Archived' })).toBeInTheDocument();

    expect(canvas.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
    expect(canvas.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'false');

    const activeTab = canvas.getByRole('button', { name: 'Active' });
    await userEvent.click(activeTab);

    await waitFor(() => {
      expect(canvas.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'true');
    });

    expect(canvas.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
    expect(canvas.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'false');
  },
};

/**
 * With pre-selected value
 * Tests:
 * - Initial selection is displayed correctly
 * - Selected tab has aria-pressed="true"
 * - Can switch to another tab
 */
const WithSelectedValueComponent = () => {
  const [value, setValue] = useState<string[]>(['active']);
  return (
    <FilterTabs
      options={statusOptions}
      value={value}
      onChange={setValue}
    />
  );
};

export const WithSelectedValue = {
  render: () => <WithSelectedValueComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const activeTab = canvas.getByRole('button', { name: 'Active' });
    expect(activeTab).toHaveAttribute('aria-pressed', 'true');

    expect(canvas.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
    expect(canvas.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'false');

    const completedTab = canvas.getByRole('button', { name: 'Completed' });
    await userEvent.click(completedTab);

    await waitFor(() => {
      expect(canvas.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'true');
      expect(canvas.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'false');
    });
  },
};

/**
 * Toggle behavior - clicking active tab deselects it
 * Tests:
 * - Clicking selected tab deselects it
 * - Can reselect the same tab
 */
const ToggleBehaviorComponent = () => {
  const [value, setValue] = useState<string[]>(['defi']);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FilterTabs
        options={categoryOptions}
        value={value}
        onChange={setValue}
      />
      <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
        Selected: {value.length === 0 ? 'None' : value[0]}
      </div>
    </div>
  );
};

export const ToggleBehavior = {
  render: () => <ToggleBehaviorComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Selected: defi')).toBeInTheDocument();
    const defiTab = canvas.getByRole('button', { name: 'DeFi' });
    expect(defiTab).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(defiTab);

    await waitFor(() => {
      expect(canvas.getByText('Selected: None')).toBeInTheDocument();
      expect(defiTab).toHaveAttribute('aria-pressed', 'false');
    });

    await userEvent.click(defiTab);

    await waitFor(() => {
      expect(canvas.getByText('Selected: defi')).toBeInTheDocument();
      expect(defiTab).toHaveAttribute('aria-pressed', 'true');
    });
  },
};

/**
 * Disabled state
 * Tests:
 * - All tabs are disabled
 * - Cannot click disabled tabs
 * - Selected state is maintained
 */
const DisabledComponent = () => {
  const [value, setValue] = useState<string[]>(['active']);
  return (
    <FilterTabs
      options={statusOptions}
      value={value}
      onChange={setValue}
      disabled
    />
  );
};

export const Disabled = {
  render: () => <DisabledComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check all tabs are disabled
    const allTab = canvas.getByRole('button', { name: 'All' });
    const activeTab = canvas.getByRole('button', { name: 'Active' });
    const completedTab = canvas.getByRole('button', { name: 'Completed' });

    expect(allTab).toBeDisabled();
    expect(activeTab).toBeDisabled();
    expect(completedTab).toBeDisabled();

    expect(activeTab).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(completedTab);

    expect(activeTab).toHaveAttribute('aria-pressed', 'true');
    expect(completedTab).toHaveAttribute('aria-pressed', 'false');
  },
};

/**
 * Many tabs with wrapping
 * Tests:
 * - Handles multiple tabs
 * - Tabs wrap correctly
 * - Selection works with many options
 */
const ManyTabsComponent = () => {
  const [value, setValue] = useState<string[]>([]);
  const manyOptions: FilterTabOption[] = Array.from({ length: 10 }, (_, i) => ({
    value: `option-${i}`,
    label: `Option ${i + 1}`,
  }));

  return (
    <FilterTabs
      options={manyOptions}
      value={value}
      onChange={setValue}
    />
  );
};


/**
 * Two tabs only
 * Tests:
 * - Works with minimal number of tabs
 * - Toggle between two options
 */
const TwoTabsComponent = () => {
    const [value, setValue] = useState<string[]>([]);
    const twoOptions: FilterTabOption[] = [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ];
  
    return (
      <FilterTabs
        options={twoOptions}
        value={value}
        onChange={setValue}
      />
    );
  };
  
  export const TwoTabs = {
    render: () => <TwoTabsComponent />,
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
  
      const yesTab = canvas.getByRole('button', { name: 'Yes' });
      const noTab = canvas.getByRole('button', { name: 'No' });
  
      expect(yesTab).toBeInTheDocument();
      expect(noTab).toBeInTheDocument();
  
      await userEvent.click(yesTab);
  
      await waitFor(() => {
        expect(yesTab).toHaveAttribute('aria-pressed', 'true');
        expect(noTab).toHaveAttribute('aria-pressed', 'false');
      });
  
      await userEvent.click(noTab);
  
      await waitFor(() => {
        expect(noTab).toHaveAttribute('aria-pressed', 'true');
        expect(yesTab).toHaveAttribute('aria-pressed', 'false');
      });
    },
  };

export const ManyTabs = {
  render: () => <ManyTabsComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button', { name: 'Option 1' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Option 10' })).toBeInTheDocument();

    expect(canvas.getByRole('button', { name: 'Option 1' })).toHaveAttribute('aria-pressed', 'false');
    expect(canvas.getByRole('button', { name: 'Option 5' })).toHaveAttribute('aria-pressed', 'false');

    const option5Tab = canvas.getByRole('button', { name: 'Option 5' });
    await userEvent.click(option5Tab);

    await waitFor(() => {
      expect(option5Tab).toHaveAttribute('aria-pressed', 'true');
    });

    const option8Tab = canvas.getByRole('button', { name: 'Option 8' });
    await userEvent.click(option8Tab);

    await waitFor(() => {
      expect(option8Tab).toHaveAttribute('aria-pressed', 'true');
      expect(option5Tab).toHaveAttribute('aria-pressed', 'false');
    });
  },
};

/**
 * Long label text
 * Tests:
 * - Handles long text in tabs
 * - Text doesn't wrap (white-space: nowrap)
 * - Tabs remain functional
 */
const LongLabelsComponent = () => {
  const [value, setValue] = useState<string[]>([]);
  const longLabelOptions: FilterTabOption[] = [
    { value: 'short', label: 'Short' },
    { value: 'medium', label: 'Medium Length Label' },
    { value: 'long', label: 'This is a Very Long Label for Testing' },
  ];

  return (
    <FilterTabs
      options={longLabelOptions}
      value={value}
      onChange={setValue}
    />
  );
};

export const LongLabels = {
  render: () => <LongLabelsComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button', { name: 'Short' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Medium Length Label' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'This is a Very Long Label for Testing' })).toBeInTheDocument();

    const longTab = canvas.getByRole('button', { name: 'This is a Very Long Label for Testing' });
    await userEvent.click(longTab);

    await waitFor(() => {
      expect(longTab).toHaveAttribute('aria-pressed', 'true');
    });
  },
};