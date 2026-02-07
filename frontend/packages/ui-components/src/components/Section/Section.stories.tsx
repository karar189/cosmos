import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Section from './Section';
import SectionRank from './SectionRank';
import { DataList } from '../DataBlocks';
import { Card } from '../Card';

/**
 * Section provides a complete section structure with header and grid layout.
 *
 * It combines SectionHeader and SectionGrid to create a structured section
 * that can display content in a grid layout.
 */
const meta = {
  title: 'Components/Section',
  component: Section,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Section component provides a complete section structure with header and grid layout. It combines SectionHeader and SectionGrid to create structured sections for displaying content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Section props
    id: {
      control: 'text',
      description: 'Section HTML id attribute',
      table: {
        category: 'Section',
      },
    },
    title: {
      control: 'text',
      description: 'Section title displayed in the header',
      table: {
        category: 'Section Header',
      },
    },
    showHeader: {
      control: 'boolean',
      description: 'Whether to show the header',
      defaultValue: true,
      table: {
        category: 'Section',
        defaultValue: { summary: 'true' },
      },
    },
    headerContent: {
      control: false,
      description: 'Content to be displayed in the header (e.g., SectionRank)',
      table: {
        category: 'Section Header',
      },
    },
    // SectionHeader props
    icon: {
      control: false,
      description: 'Custom icon element (overrides iconName if provided)',
      table: {
        category: 'Section Header',
      },
    },
    iconName: {
      control: 'select',
      options: ['info', undefined],
      description: 'Icon name from the icon registry',
      table: {
        category: 'Section Header',
      },
    },
    // SectionGrid props - Columns
    columns: {
      control: 'object',
      description:
        'Grid columns definition. Can be a number, string, or array of strings/numbers. Examples: 3, "1fr 2fr 1fr", ["1fr", "2fr", "1fr"], [1, 2, 1]',
      table: {
        category: 'Grid Layout',
      },
    },
    rows: {
      control: 'object',
      description:
        'Grid rows definition. Can be a number, string, or array of strings/numbers. Examples: 2, "auto 1fr", ["auto", "1fr"], [1, 2]',
      table: {
        category: 'Grid Layout',
      },
    },
    areas: {
      control: 'object',
      description:
        'Grid template areas as a 2D array. Defines named grid areas for layout. Children are automatically assigned to grid areas in order. Example: [["header", "header"], ["sidebar", "content"]]',
      table: {
        category: 'Grid Layout',
      },
    },
    gap: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', 'xxxxl'],
      description: 'Gap between grid items',
      defaultValue: 'm',
      table: {
        category: 'Grid Layout',
        defaultValue: { summary: 'm' },
      },
    },
    autoFit: {
      control: 'text',
      description:
        'Auto-fit grid with minimum column width (e.g., "250px"). Overrides columns if provided.',
      table: {
        category: 'Grid Layout',
      },
    },
    autoFill: {
      control: 'text',
      description:
        'Auto-fill grid with minimum column width (e.g., "250px"). Overrides columns if provided.',
      table: {
        category: 'Grid Layout',
      },
    },
    // Children
    children: {
      control: false,
      description: 'Content to be displayed in the grid',
      table: {
        category: 'Content',
      },
    },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default section with header, rank, and DataList in a grid
 */
export const Default: Story = {
  args: {
    title: 'Security',
    headerContent: (
      <SectionRank value={45} maxValue={100} description="average across similar projects" />
    ),
    columns: 3,
    gap: 'm',
    children: (
      <>
        <Card>
          <DataList
            items={[
              { label: 'Bug Bounty', value: '3rd-party' },
              { label: 'Payout policy', value: '$100k-$250k' },
              { label: 'Attestation (SLA)', value: '<3 days' },
            ]}
          />
        </Card>
        <Card>
          <DataList
            items={[
              { label: 'Verified onchain', value: '✓' },
              { label: 'Top-tier assets share', value: '>50%' },
              { label: 'High-risk contracts covered', value: '10+' },
            ]}
          />
        </Card>
        <Card>
          <DataList
            items={[
              { label: 'Circuit breakers', value: '✓' },
              { label: 'On-chain monitoring', value: '✓' },
            ]}
          />
        </Card>
        <Card>
          <DataList
            items={[
              { label: 'Custody', value: 'Self-hosted' },
              { label: 'Coverage', value: 'Average' },
            ]}
          />
        </Card>
        <Card>
          <DataList
            items={[
              { label: 'ISO 27001', value: '✓' },
              { label: 'CCSS Level 2', value: '✓' },
            ]}
          />
        </Card>
        <Card>
          <DataList items={[{ label: 'Status', value: 'Enabled' }]} />
        </Card>
      </>
    ),
  },
};

/**
 * Section with custom grid template columns
 */
export const CustomGridLayout: Story = {
  args: {
    title: 'Financial',
    headerContent: (
      <SectionRank value={45} maxValue={100} description="average across similar projects" />
    ),
    columns: [2, 1], // Shorthand for ["2fr", "1fr"]
    gap: 'l',
    children: (
      <>
        <Card>
          <DataList
            items={[
              { label: 'Revenue Sources', value: 'Multiple' },
              { label: 'Vesting unlock risk', value: '85' },
              { label: 'Treasury not locked', value: '24' },
            ]}
          />
        </Card>
        <Card>
          <DataList
            items={[
              { label: 'Annual Inflation', value: '5-10%' },
              { label: 'Trend', value: 'Stable' },
            ]}
          />
        </Card>
      </>
    ),
  },
};

/**
 * Section with auto-fit responsive grid
 */
export const ResponsiveGrid: Story = {
  args: {
    title: 'Metrics',
    autoFit: '250px',
    gap: 'm',
    children: (
      <>
        <Card>
          <DataList items={[{ label: 'TVL', value: '$1.2B' }]} />
        </Card>
        <Card>
          <DataList items={[{ label: 'Active Addresses', value: '125K' }]} />
        </Card>
        <Card>
          <DataList items={[{ label: 'Transactions', value: '45M' }]} />
        </Card>
        <Card>
          <DataList items={[{ label: 'Volume', value: '$500M' }]} />
        </Card>
      </>
    ),
  },
};

/**
 * Section without header
 */
export const WithoutHeader: Story = {
  args: {
    showHeader: false,
    columns: 2,
    gap: 'l',
    children: (
      <>
        <Card>
          <DataList
            items={[
              { label: 'Total Supply', value: '1,000,000' },
              { label: 'Circulating Supply', value: '750,000' },
            ]}
          />
        </Card>
        <Card>
          <DataList
            items={[
              { label: 'Locked Supply', value: '250,000' },
              { label: 'Lock Percentage', value: '25%' },
            ]}
          />
        </Card>
      </>
    ),
  },
};

/**
 * Section with single column layout
 */
export const SingleColumn: Story = {
  args: {
    title: 'Details',
    columns: 1,
    gap: 'm',
    children: (
      <Card>
        <DataList
          items={[
            { label: 'Project Name', value: 'Example Project' },
            { label: 'Status', value: 'Active' },
            { label: 'Created', value: 'Jan 15, 2024' },
            { label: 'Last Updated', value: 'Mar 8, 2025' },
            { label: 'Category', value: 'DeFi' },
          ]}
        />
      </Card>
    ),
  },
};

/**
 * Section with array-based columns
 */
export const ArrayBasedColumns: Story = {
  args: {
    title: 'Dashboard',
    headerContent: <SectionRank value={85} maxValue={100} description="excellent performance" />,
    columns: ['1fr', '2fr', '1fr'], // Explicit sizes
    gap: 'l',
    children: (
      <>
        <Card>
          <DataList items={[{ label: 'Left Panel', value: 'Stats' }]} />
        </Card>
        <Card>
          <DataList items={[{ label: 'Main Content', value: 'Charts' }]} />
        </Card>
        <Card>
          <DataList items={[{ label: 'Right Panel', value: 'Info' }]} />
        </Card>
      </>
    ),
  },
};

/**
 * Section with grid areas for complex layouts
 * Children are automatically assigned to grid areas in order of appearance
 */
export const GridAreas: Story = {
  args: {
    title: 'Complex Layout',
    headerContent: <SectionRank value={60} maxValue={100} description="good structure" />,
    areas: [
      ['header', 'header', 'header'],
      ['sidebar', 'content', 'content'],
      ['footer', 'footer', 'footer'],
    ],
    gap: 'm',
    children: (
      <>
        <div
          style={{
            padding: '16px',
            background: '#f0f0f0',
            borderRadius: '8px',
          }}
        >
          <DataList items={[{ label: 'Header Area', value: 'Auto-assigned to "header"' }]} />
        </div>
        <div
          style={{
            padding: '16px',
            background: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <DataList items={[{ label: 'Sidebar', value: 'Auto-assigned to "sidebar"' }]} />
        </div>
        <div
          style={{
            padding: '16px',
            background: '#fafafa',
            borderRadius: '8px',
          }}
        >
          <DataList items={[{ label: 'Main Content', value: 'Auto-assigned to "content"' }]} />
        </div>
        <div
          style={{
            padding: '16px',
            background: '#f0f0f0',
            borderRadius: '8px',
          }}
        >
          <DataList items={[{ label: 'Footer', value: 'Auto-assigned to "footer"' }]} />
        </div>
      </>
    ),
  },
};

/**
 * Section with mixed array and string columns
 */
export const MixedColumns: Story = {
  args: {
    title: 'Mixed Layout',
    columns: ['250px', '1fr', '200px'], // Fixed, flexible, fixed
    gap: 'm',
    children: (
      <>
        <Card>
          <DataList items={[{ label: 'Fixed Width', value: '250px' }]} />
        </Card>
        <Card>
          <DataList items={[{ label: 'Flexible', value: 'Takes remaining space' }]} />
        </Card>
        <Card>
          <DataList items={[{ label: 'Fixed Width', value: '200px' }]} />
        </Card>
      </>
    ),
  },
};

/**
 * Section with rows definition
 */
export const WithRows: Story = {
  args: {
    title: 'Structured Layout',
    columns: 2,
    rows: ['auto', '1fr', 'auto'],
    gap: 'm',
    children: (
      <>
        <Card>
          <DataList items={[{ label: 'Row 1', value: 'Auto height' }]} />
        </Card>
        <Card>
          <DataList items={[{ label: 'Row 1', value: 'Auto height' }]} />
        </Card>
        <Card>
          <DataList
            items={[
              { label: 'Row 2', value: 'Flexible' },
              { label: 'Content', value: 'Takes remaining space' },
            ]}
          />
        </Card>
        <Card>
          <DataList
            items={[
              { label: 'Row 2', value: 'Flexible' },
              { label: 'Content', value: 'Takes remaining space' },
            ]}
          />
        </Card>
        <Card>
          <DataList items={[{ label: 'Row 3', value: 'Auto height' }]} />
        </Card>
        <Card>
          <DataList items={[{ label: 'Row 3', value: 'Auto height' }]} />
        </Card>
      </>
    ),
  },
};
