import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { expect, within } from '@storybook/test';
import DataList from './DataList';
import { colors } from '../../theme/styleSystem';

/**
 * DataList displays a list of data items with labels, values, and optional tooltips.
 * Supports both 'info' and 'check' item types.
 *
 * Use it to present structured data in a consistent format.
 */
const meta = {
  title: 'Components/DataBlocks/DataList',
  component: DataList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'DataList component displays a list of data items, each with a label, value, and optional tooltip. Supports both info and check item types. Perfect for displaying structured information like metrics, statistics, or key-value pairs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of data items to display',
    },
    contentAlign: {
      description: 'Alignment of content (only used when items have checkmarks)',
      control: 'select',
      options: ['left', 'right'],
    },
  },
} satisfies Meta<typeof DataList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Info type - Single item list
 */
export const InfoSingleItem: Story = {
  args: {
    items: [
      {
        label: 'Total Projects',
        value: '1,234',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Total Projects')).toBeInTheDocument();
    expect(canvas.getByText('1,234')).toBeInTheDocument();
  },
};

/**
 * Info type - Multiple items without tooltips
 */
export const InfoMultipleItems: Story = {
  args: {
    items: [
      {
        label: 'Total Projects',
        value: '1,234',
      },
      {
        label: 'Active Users',
        value: '5,678',
      },
      {
        label: 'Risk Score',
        value: '45/100',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Total Projects')).toBeInTheDocument();
    expect(canvas.getByText('1,234')).toBeInTheDocument();
    expect(canvas.getByText('Active Users')).toBeInTheDocument();
    expect(canvas.getByText('5,678')).toBeInTheDocument();
    expect(canvas.getByText('Risk Score')).toBeInTheDocument();
    expect(canvas.getByText('45/100')).toBeInTheDocument();
  },
};

/**
 * Info type - Items with tooltips
 */
export const InfoWithTooltips: Story = {
  args: {
    items: [
      {
        label: 'Total Projects',
        value: '1,234',
        tooltip: 'Total number of projects tracked in the system',
      },
      {
        label: 'Active Users',
        value: '5,678',
        tooltip: 'Number of users who have logged in within the last 30 days',
      },
      {
        label: 'Risk Score',
        value: '45/100',
        tooltip: 'Average risk score across all projects. Lower is better.',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Total Projects')).toBeInTheDocument();
    expect(canvas.getByText('1,234')).toBeInTheDocument();
    expect(canvas.getByText('Active Users')).toBeInTheDocument();
    expect(canvas.getByText('5,678')).toBeInTheDocument();
    expect(canvas.getByText('Risk Score')).toBeInTheDocument();
    expect(canvas.getByText('45/100')).toBeInTheDocument();
    
    // Check that tooltip icons are present (Tooltip component renders SVGs)
    const tooltipIcons = canvasElement.querySelectorAll('svg');
    expect(tooltipIcons.length).toBeGreaterThan(0);
  },
};

/**
 * Check type - Single item list
 */
export const CheckSingleItem: Story = {
  args: {
    items: [
      {
        label: 'Total Projects',
        value: '1,234',
        checked: true,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Total Projects')).toBeInTheDocument();
    expect(canvas.getByText('1,234')).toBeInTheDocument();
    
    // Check that checkmark is present (checked items should have a checkmark icon)
    const checkmarks = canvasElement.querySelectorAll('svg');
    expect(checkmarks.length).toBeGreaterThan(0);
  },
};

/**
 * Check type - Multiple items with mixed checked states
 */
export const CheckMultipleItems: Story = {
  args: {
    items: [
      {
        label: 'Total Projects',
        value: '1,234',
        checked: true,
      },
      {
        label: 'Active Users',
        value: '5,678',
        checked: true,
      },
      {
        label: 'Risk Score',
        value: '45/100',
        checked: false,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Total Projects')).toBeInTheDocument();
    expect(canvas.getByText('1,234')).toBeInTheDocument();
    expect(canvas.getByText('Active Users')).toBeInTheDocument();
    expect(canvas.getByText('5,678')).toBeInTheDocument();
    expect(canvas.getByText('Risk Score')).toBeInTheDocument();
    expect(canvas.getByText('45/100')).toBeInTheDocument();
    
    // Check that checkmarks are present for checked items
    const checkmarks = canvasElement.querySelectorAll('svg');
    expect(checkmarks.length).toBeGreaterThan(0);
  },
};

/**
 * Check type - Items with tooltips
 */
export const CheckWithTooltips: Story = {
  args: {
    items: [
      {
        label: 'Total Projects',
        value: '1,234',
        checked: true,
        tooltip: 'Total number of projects tracked in the system',
      },
      {
        label: 'Active Users',
        value: '5,678',
        checked: true,
        tooltip: 'Number of users who have logged in within the last 30 days',
      },
      {
        label: 'Risk Score',
        value: '45/100',
        checked: false,
        tooltip: 'Average risk score across all projects. Lower is better.',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Total Projects')).toBeInTheDocument();
    expect(canvas.getByText('1,234')).toBeInTheDocument();
    expect(canvas.getByText('Active Users')).toBeInTheDocument();
    expect(canvas.getByText('5,678')).toBeInTheDocument();
    expect(canvas.getByText('Risk Score')).toBeInTheDocument();
    expect(canvas.getByText('45/100')).toBeInTheDocument();
    
    // Check that both checkmarks and tooltip icons are present
    const icons = canvasElement.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  },
};

/**
 * Check type - All checked items
 */
export const CheckAllChecked: Story = {
  args: {
    items: [
      {
        label: 'Security Audit',
        value: 'Completed',
        checked: true,
      },
      {
        label: 'Code Review',
        value: 'Completed',
        checked: true,
      },
      {
        label: 'Testing',
        value: 'Completed',
        checked: true,
      },
      {
        label: 'Documentation',
        value: 'Completed',
        checked: true,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Security Audit')).toBeInTheDocument();
    expect(canvas.getByText('Code Review')).toBeInTheDocument();
    expect(canvas.getByText('Testing')).toBeInTheDocument();
    expect(canvas.getByText('Documentation')).toBeInTheDocument();
    
    // All items should show "Completed"
    const completedTexts = canvas.getAllByText('Completed');
    expect(completedTexts.length).toBe(4);
    
    // All items should have checkmarks
    const checkmarks = canvasElement.querySelectorAll('svg');
    expect(checkmarks.length).toBeGreaterThan(0);
  },
};

/**
 * Check type - Items with React node values
 */
export const CheckWithReactNodeValues: Story = {
  args: {
    items: [
      {
        label: 'Status',
        value: <span style={{ color: colors.semantic.success, fontWeight: 600 }}>● Active</span>,
        checked: true,
        tooltip: 'Current system status',
      },
      {
        label: 'Progress',
        value: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '100px',
                height: '8px',
                backgroundColor: colors.neutral.gray200,
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '65%',
                  height: '100%',
                  backgroundColor: colors.semantic.info,
                }}
              />
            </div>
            <span>65%</span>
          </div>
        ),
        checked: true,
        tooltip: 'Overall completion progress',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Status')).toBeInTheDocument();
    expect(canvas.getByText('Progress')).toBeInTheDocument();
    expect(canvas.getByText('● Active')).toBeInTheDocument();
    expect(canvas.getByText('65%')).toBeInTheDocument();
    
    // Check that checkmarks and tooltip icons are present
    const icons = canvasElement.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  },
};

/**
 * Check type - Right aligned content
 */
export const CheckRightAligned: Story = {
  args: {
    contentAlign: 'right',
    items: [
      {
        label: 'Total Projects',
        value: '1,234',
        checked: true,
      },
      {
        label: 'Active Users',
        value: '5,678',
        checked: true,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Total Projects')).toBeInTheDocument();
    expect(canvas.getByText('1,234')).toBeInTheDocument();
    expect(canvas.getByText('Active Users')).toBeInTheDocument();
    expect(canvas.getByText('5,678')).toBeInTheDocument();
    
    // Check that checkmarks are present
    const checkmarks = canvasElement.querySelectorAll('svg');
    expect(checkmarks.length).toBeGreaterThan(0);
  },
};

/**
 * Empty list
 */
export const EmptyList: Story = {
  args: {
    items: [],
  },
  play: async ({ canvasElement }) => {
    // Empty list should render the container but no items
    const list = canvasElement.querySelector('ul');
    expect(list).toBeInTheDocument();
  },
};

/**
 * Check type - Items with logoUrl
 * Demonstrates that logoUrl correctly displays logos next to items
 */
export const CheckWithLogoUrl: Story = {
  args: {
    items: [
      {
        label: 'Project Alpha',
        value: 'Active',
        checked: true,
        logoUrl:
          'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Ccircle cx="20" cy="20" r="18" fill="%236366F1"/%3E%3Ctext x="20" y="26" font-size="14" fill="white" text-anchor="middle" font-weight="bold"%3EA%3C/text%3E%3C/svg%3E',
        tooltip: 'Project Alpha is currently active',
      },
      {
        label: 'Project Beta',
        value: 'Active',
        checked: true,
        logoUrl:
          'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Ccircle cx="20" cy="20" r="18" fill="%2310B989"/%3E%3Ctext x="20" y="26" font-size="14" fill="white" text-anchor="middle" font-weight="bold"%3EB%3C/text%3E%3C/svg%3E',
        tooltip: 'Project Beta is currently active',
      },
      {
        label: 'Project Gamma',
        value: 'Inactive',
        checked: false,
        logoUrl:
          'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Ccircle cx="20" cy="20" r="18" fill="%236B7280"/%3E%3Ctext x="20" y="26" font-size="14" fill="white" text-anchor="middle" font-weight="bold"%3EG%3C/text%3E%3C/svg%3E',
        tooltip: 'Project Gamma is currently inactive',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Project Alpha')).toBeInTheDocument();
    expect(canvas.getByText('Project Beta')).toBeInTheDocument();
    expect(canvas.getByText('Project Gamma')).toBeInTheDocument();
    expect(canvas.getByText('Inactive')).toBeInTheDocument();
    
    // Both "Project Alpha" and "Project Beta" have value "Active"
    const activeTexts = canvas.getAllByText('Active');
    expect(activeTexts.length).toBe(2);
    
    // Check that logos (images) are present
    const images = canvasElement.querySelectorAll('img');
    expect(images.length).toBe(3);
    
    // Check that checkmarks and tooltip icons are present
    const icons = canvasElement.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  },
};
