import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import LabelBubble from './LabelBubble';
import React from 'react';
import { colors } from '../../theme/styleSystem';

/**
 * LabelBubble is a pill-shaped label component used for tags, categories, and status indicators.
 */
const meta = {
  title: 'Components/LabelBubble',
  component: LabelBubble,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible pill-shaped label component for displaying tags, categories, or status indicators with customizable colors.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text content of the label',
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color of the label',
    },
    textColor: {
      control: 'color',
      description: 'Text color of the label',
      table: {
        defaultValue: { summary: colors.text.primary },
      },
    },
  },
} satisfies Meta<typeof LabelBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default label with yellow background
 */
export const Default: Story = {
  args: {
    text: 'Crypto',
    backgroundColor: colors.accent.yellow,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const label = canvas.getByText('Crypto');
    expect(label).toBeInTheDocument();
    
    expect(label).toHaveStyle({ backgroundColor: colors.accent.yellow, color: colors.neutral.black,
    });
  },
};

/**
 * Green label variant
 */
export const Green: Story = {
  args: {
    text: 'Verified',
    backgroundColor: colors.primary.main,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const label = canvas.getByText('Verified');
    expect(label).toBeInTheDocument();
    expect(label).toHaveStyle({ backgroundColor: colors.primary.main });
  },
};

/**
 * Blue label variant
 */
const BLUE_LABEL_COLOR = '#C7E8FF';

export const Blue: Story = {
  args: {
    text: 'Data',
    backgroundColor: BLUE_LABEL_COLOR,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const label = canvas.getByText('Data');
    expect(label).toBeInTheDocument();
    expect(label).toHaveStyle({ backgroundColor: BLUE_LABEL_COLOR });
  },
};

/**
 * Orange label variant
 */
export const Orange: Story = {
  args: {
    text: 'Entry',
    backgroundColor: colors.accent.orange,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const label = canvas.getByText('Entry');
    expect(label).toBeInTheDocument();
    expect(label).toHaveStyle({ backgroundColor: colors.accent.orange });
  },
};

/**
 * Dark background with white text
 */
export const DarkBackground: Story = {
  args: {
    text: 'Premium',
    backgroundColor: colors.primary.contrast,
    textColor: colors.neutral.white,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const label = canvas.getByText('Premium');
    expect(label).toBeInTheDocument();
    expect(label).toHaveStyle({ backgroundColor: colors.primary.contrast, color: colors.neutral.white,
    });
  },
};

/**
 * Long text example
 */
export const LongText: Story = {
  args: {
    text: 'Risk Assessment Complete',
    backgroundColor: colors.accent.yellow,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const label = canvas.getByText('Risk Assessment Complete');
    expect(label).toBeInTheDocument();
    expect(label).toHaveStyle({ backgroundColor: colors.accent.yellow });
    
    expect(label.textContent).toBe('Risk Assessment Complete');
  },
};

/**
 * Multiple labels side by side
 */
export const MultipleBubbles: Story = {
  args: {
    text: 'Crypto',
    backgroundColor: colors.accent.yellow,
  },
  args: {
    text: 'Crypto',
    backgroundColor: colors.accent.yellow,
  },
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <LabelBubble text="Crypto" backgroundColor={colors.accent.yellow} />
      <LabelBubble text="Web3" backgroundColor={colors.primary.main} />
      <LabelBubble text="DeFi" backgroundColor={BLUE_LABEL_COLOR} />
      <LabelBubble text="NFT" backgroundColor={colors.accent.orange} />
    </div>
  ),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const cryptoLabel = canvas.getByText('Crypto');
    const web3Label = canvas.getByText('Web3');
    const defiLabel = canvas.getByText('DeFi');
    const nftLabel = canvas.getByText('NFT');
    
    expect(cryptoLabel).toBeInTheDocument();
    expect(web3Label).toBeInTheDocument();
    expect(defiLabel).toBeInTheDocument();
    expect(nftLabel).toBeInTheDocument();
    
    expect(cryptoLabel).toHaveStyle({ backgroundColor: colors.accent.yellow });
    expect(web3Label).toHaveStyle({ backgroundColor: colors.primary.main });
    expect(defiLabel).toHaveStyle({ backgroundColor: BLUE_LABEL_COLOR });
    expect(nftLabel).toHaveStyle({ backgroundColor: colors.accent.orange });
  },
};