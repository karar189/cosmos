import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import Sidebar from './Sidebar';
import { Card } from '../Card';
import { DataList } from '../DataBlocks';
import { Badge } from '../Badge';
import { Section } from '../Section';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Project Details',
    children: (
      <div>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
          This is the sidebar content.
        </p>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Project Details')).toBeInTheDocument();
    expect(canvas.getByText('This is the sidebar content.')).toBeInTheDocument();
    
    const sidebar = canvasElement.querySelector('aside');
    expect(sidebar).toBeInTheDocument();
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Featured Project',
    children: (
      <div>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
          Sidebar with icon.
        </p>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Featured Project')).toBeInTheDocument();
    expect(canvas.getByText('Sidebar with icon.')).toBeInTheDocument();
  },
};

export const WithDataCards: Story = {
  args: {
    title: 'Project Information',
    children: (
      <>
        <Card>
          <DataList
            items={[
              { label: 'Status', value: 'Active' },
              { label: 'Created', value: '2024-01-15' },
            ]}
          />
        </Card>
        <Card>
          <DataList
            items={[
              { label: 'Total Users', value: '1,234' },
              { label: 'Active Sessions', value: '456' },
            ]}
          />
        </Card>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Project Information')).toBeInTheDocument();
    expect(canvas.getByText('Status')).toBeInTheDocument();
    expect(canvas.getByText('Active')).toBeInTheDocument();
    expect(canvas.getByText('Created')).toBeInTheDocument();
    expect(canvas.getByText('2024-01-15')).toBeInTheDocument();
    expect(canvas.getByText('Total Users')).toBeInTheDocument();
    expect(canvas.getByText('1,234')).toBeInTheDocument();
    expect(canvas.getByText('Active Sessions')).toBeInTheDocument();
    expect(canvas.getByText('456')).toBeInTheDocument();
  },
};

export const WithBadges: Story = {
  args: {
    title: 'Tags & Categories',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 500 }}>
            Status
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Badge  color="green" size="small" >
              Active
            </Badge>
            <Badge color="gray" size="small" >
              Verified
            </Badge>
          </div>
        </div>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Tags & Categories')).toBeInTheDocument();
    expect(canvas.getByText('Status')).toBeInTheDocument();

    expect(canvas.getByText('Active')).toBeInTheDocument();
    expect(canvas.getByText('Verified')).toBeInTheDocument();
  },
};

export const WithSections: Story = {
  args: {
    title: 'Project Overview',
    children: (
      <>
        <Section title="Statistics" columns={1} gap="m">
          <Card>
            <DataList
              items={[
                { label: 'Market Cap', value: '$1.2B' },
                { label: '24h Volume', value: '$150M' },
              ]}
            />
          </Card>
        </Section>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Project Overview')).toBeInTheDocument();
    expect(canvas.getByText('Statistics')).toBeInTheDocument();
    expect(canvas.getByText('Market Cap')).toBeInTheDocument();
    expect(canvas.getByText('$1.2B')).toBeInTheDocument();
    expect(canvas.getByText('24h Volume')).toBeInTheDocument();
    expect(canvas.getByText('$150M')).toBeInTheDocument();
  },
};

export const ScrollableContent: Story = {
  args: {
    title: 'Long Content List',
    children: (
      <>
        {Array.from({ length: 10 }, (_, i) => (
          <Card key={i}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 500 }}>
              Item {i + 1}
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              This is item {i + 1}.
            </p>
          </Card>
        ))}
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Long Content List')).toBeInTheDocument();
    expect(canvas.getByText('Item 1')).toBeInTheDocument();
    expect(canvas.getByText('This is item 1.')).toBeInTheDocument();
    expect(canvas.getByText('Item 10')).toBeInTheDocument();
    expect(canvas.getByText('This is item 10.')).toBeInTheDocument();
    expect(canvas.getByText('Item 5')).toBeInTheDocument();
  },
};
