import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import React, { useState } from 'react';
import Core3Tabs from './Tabs';
import Core3Tab from './Tab';
import Core3TabPanel from './TabPanel';

interface TabsDemoProps {
  tabLabels: string[];
  tabValues: (string | number)[];
  disabledTabs?: number[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'standard' | 'scrollable' | 'fullWidth';
}

function TabsDemo({
  tabLabels,
  tabValues,
  disabledTabs = [],
  orientation = 'horizontal',
  variant = 'standard',
}: TabsDemoProps) {
  const [value, setValue] = useState<string | number>(tabValues[0] || '');

  const handleChange = (event: React.SyntheticEvent, newValue: string | number) => {
    setValue(newValue);
  };

  return (
    <div style={{ padding: '20px', maxWidth: variant === 'fullWidth' ? '100%' : '600px' }}>
      <Core3Tabs value={value} onChange={handleChange} orientation={orientation} variant={variant}>
        {tabLabels.map((label, index) => (
          <Core3Tab
            key={tabValues[index]}
            label={label}
            value={tabValues[index]}
            disabled={disabledTabs.includes(index)}
          />
        ))}
      </Core3Tabs>
      {tabValues.map((tabValue, index) => (
        <Core3TabPanel key={tabValue} value={value} index={tabValue}>
          <div style={{ padding: '16px' }}>
            <p>Selected tab: {value}</p>
            <p>Content for tab: {tabLabels[index]}</p>
            <p>This is the content panel for {tabLabels[index]}.</p>
          </div>
        </Core3TabPanel>
      ))}
    </div>
  );
}

const meta = {
  title: 'Components/Tabs',
  component: TabsDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'MUI Tabs provide a way to organize content into multiple panels. Use Core3Tabs, Core3Tab, and Core3TabPanel for consistent styling across the application.',
      },
    },
  },
  argTypes: {
    tabLabels: {
      control: 'object',
      description: 'Array of tab labels',
    },
    tabValues: {
      control: 'object',
      description: 'Array of tab values (must match labels length)',
    },
    disabledTabs: {
      control: 'object',
      description: 'Array of indices for disabled tabs',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the tabs',
    },
    variant: {
      control: 'select',
      options: ['standard', 'scrollable', 'fullWidth'],
      description: 'Variant of the tabs',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTabs: Story = {
  args: {
    tabLabels: ['Overview', 'Details', 'Settings'],
    tabValues: ['overview', 'details', 'settings'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const overviewTab = canvas.getByRole('tab', { name: 'Overview' });
    const detailsTab = canvas.getByRole('tab', { name: 'Details' });
    const settingsTab = canvas.getByRole('tab', { name: 'Settings' });
    
    expect(overviewTab).toBeInTheDocument();
    expect(detailsTab).toBeInTheDocument();
    expect(settingsTab).toBeInTheDocument();
    
    expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    expect(canvas.getByText('Content for tab: Overview')).toBeVisible();
    
    await userEvent.click(detailsTab);
    
    await waitFor(() => {
      expect(detailsTab).toHaveAttribute('aria-selected', 'true');
      expect(canvas.getByText('Content for tab: Details')).toBeVisible();
    });
    
    await userEvent.click(settingsTab);
    
    await waitFor(() => {
      expect(settingsTab).toHaveAttribute('aria-selected', 'true');
      expect(canvas.getByText('Content for tab: Settings')).toBeVisible();
    });
  },
};

export const ScrollableTabs: Story = {
  args: {
    tabLabels: ['Tab One', 'Tab Two', 'Tab Three', 'Tab Four', 'Tab Five', 'Tab Six', 'Tab Seven'],
    tabValues: ['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7'],
    variant: 'scrollable',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const tab1 = canvas.getByRole('tab', { name: 'Tab One' });
    const tab3 = canvas.getByRole('tab', { name: 'Tab Three' });
    const tab7 = canvas.getByRole('tab', { name: 'Tab Seven' });
    
    expect(tab1).toBeInTheDocument();
    expect(tab3).toBeInTheDocument();
    expect(tab7).toBeInTheDocument();
    
    expect(tab1).toHaveAttribute('aria-selected', 'true');
    
    await userEvent.click(tab3);
    
    await waitFor(() => {
      expect(tab3).toHaveAttribute('aria-selected', 'true');
      expect(canvas.getByText('Content for tab: Tab Three')).toBeVisible();
    });
    
    await userEvent.click(tab7);
    
    await waitFor(() => {
      expect(tab7).toHaveAttribute('aria-selected', 'true');
      expect(canvas.getByText('Content for tab: Tab Seven')).toBeVisible();
    });
  },
};

export const FullWidthTabs: Story = {
  args: {
    tabLabels: ['First', 'Second', 'Third'],
    tabValues: ['first', 'second', 'third'],
    variant: 'fullWidth',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const firstTab = canvas.getByRole('tab', { name: 'First' });
    const secondTab = canvas.getByRole('tab', { name: 'Second' });
    const thirdTab = canvas.getByRole('tab', { name: 'Third' });
    
    expect(firstTab).toBeInTheDocument();
    expect(secondTab).toBeInTheDocument();
    expect(thirdTab).toBeInTheDocument();
    
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
    
    await userEvent.click(secondTab);
    
    await waitFor(() => {
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
      expect(canvas.getByText('Content for tab: Second')).toBeVisible();
    });
  },
};

export const TabsWithDisabled: Story = {
  args: {
    tabLabels: ['Active Tab', 'Disabled Tab', 'Another Active'],
    tabValues: ['active', 'disabled', 'another'],
    disabledTabs: [1],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const activeTab = canvas.getByRole('tab', { name: 'Active Tab' });
    const disabledTab = canvas.getByRole('tab', { name: 'Disabled Tab' });
    const anotherTab = canvas.getByRole('tab', { name: 'Another Active' });
    
    expect(activeTab).toBeInTheDocument();
    expect(disabledTab).toBeInTheDocument();
    expect(anotherTab).toBeInTheDocument();
    
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
    expect(disabledTab).toBeDisabled();
    
    await userEvent.click(anotherTab);
    
    await waitFor(() => {
      expect(anotherTab).toHaveAttribute('aria-selected', 'true');
      expect(canvas.getByText('Content for tab: Another Active')).toBeVisible();
    });
  },
};

export const VerticalTabs: Story = {
  args: {
    tabLabels: ['Overview', 'Details', 'Settings'],
    tabValues: ['overview', 'details', 'settings'],
    orientation: 'vertical',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const overviewTab = canvas.getByRole('tab', { name: 'Overview' });
    const detailsTab = canvas.getByRole('tab', { name: 'Details' });
    const settingsTab = canvas.getByRole('tab', { name: 'Settings' });
    
    expect(overviewTab).toBeInTheDocument();
    expect(detailsTab).toBeInTheDocument();
    expect(settingsTab).toBeInTheDocument();
    
    expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    
    await userEvent.click(detailsTab);
    
    await waitFor(() => {
      expect(detailsTab).toHaveAttribute('aria-selected', 'true');
      expect(canvas.getByText('Content for tab: Details')).toBeVisible();
    });
    
    await userEvent.click(settingsTab);
    
    await waitFor(() => {
      expect(settingsTab).toHaveAttribute('aria-selected', 'true');
      expect(canvas.getByText('Content for tab: Settings')).toBeVisible();
    });
  },
};