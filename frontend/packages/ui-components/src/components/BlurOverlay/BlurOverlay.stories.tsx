import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BlurOverlay from './BlurOverlay';
import { expect, within } from '@storybook/test';

/**
 * BlurOverlay is a full-width, full-height overlay component that blurs the background
 * and displays a customizable message with optional title. Supports absolute positioning.
 */
const meta = {
  title: 'Components/BlurOverlay',
  component: BlurOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full-width, full-height overlay component that blurs the background content and displays a customizable message with optional title. Can be positioned absolutely or relatively.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to display in the center of the overlay',
      table: {
        defaultValue: { summary: 'Coming soon' },
      },
    },
    title: {
      control: 'text',
      description: 'Title displayed above the text',
    },
    absolute: {
      control: 'boolean',
      description: 'Whether to use absolute positioning',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof BlurOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Coming soon',
    absolute: false,
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ padding: '40px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Content Behind</h2>
        <p style={{ color: 'white' }}>
          This is some content that will be blurred by the BlurOverlay. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
          }}
        >
          <p style={{ color: 'white' }}>More content here...</p>
        </div>
      </div>
      <BlurOverlay {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const overlayText = canvas.getByText('Coming soon');
    expect(overlayText).toBeInTheDocument();
    expect(overlayText).toBeVisible();
    
    // Check that background content is present (though blurred)
    expect(canvas.getByText('Content Behind')).toBeInTheDocument();
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Data Unavailable',
    text: 'This data is coming soon',
    absolute: false,
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ padding: '40px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Content Behind</h2>
        <p style={{ color: 'white' }}>
          This is some content that will be blurred by the BlurOverlay.
        </p>
      </div>
      <BlurOverlay {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const title = canvas.getByText('Data Unavailable');
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
    
    const overlayText = canvas.getByText('This data is coming soon');
    expect(overlayText).toBeInTheDocument();
    expect(overlayText).toBeVisible();
    
    // Check that background content is present
    expect(canvas.getByText('Content Behind')).toBeInTheDocument();
  },
};

export const WithCustomText: Story = {
  args: {
    text: 'Feature coming soon!',
    absolute: false,
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ padding: '40px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Content Behind</h2>
        <p style={{ color: 'white' }}>
          This is some content that will be blurred by the BlurOverlay.
        </p>
      </div>
      <BlurOverlay {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const overlayText = canvas.getByText('Feature coming soon!');
    expect(overlayText).toBeInTheDocument();
    expect(overlayText).toBeVisible();
    
    // Check that background content is present
    expect(canvas.getByText('Content Behind')).toBeInTheDocument();
  },
};

export const AbsolutePositioning: Story = {
  args: {
    text: 'Coming soon',
    absolute: true,
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ padding: '40px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Content Behind</h2>
        <p style={{ color: 'white' }}>
          This is some content that will be blurred by the BlurOverlay. The overlay is
          positioned absolutely.
        </p>
      </div>
      <BlurOverlay {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const overlayText = canvas.getByText('Coming soon');
    expect(overlayText).toBeInTheDocument();
    expect(overlayText).toBeVisible();
    
    // Check that background content is present
    expect(canvas.getByText('Content Behind')).toBeInTheDocument();
    expect(canvas.getByText(/The overlay is positioned absolutely/)).toBeInTheDocument();
  },
};


