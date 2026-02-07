/** @jsxImportSource @emotion/react */
import type { Meta, StoryObj } from '@storybook/react';
import { IconTextCell } from './IconTextCell';

/**
 * IconTextCell displays an icon (or fallback circle) with text labels.
 */
const meta = {
  title: 'Components/DataTable/IconTextCell',
  component: IconTextCell,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Cell component for displaying an optional icon with primary and secondary text labels.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: '250px', padding: '1rem', border: '1px solid #e0e0e0' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IconTextCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * With fallback circle (no icon)
 */
export const WithFallbackCircle: Story = {
  args: {
    primary: 'Bitcoin',
    secondary: 'Ethereum',
  },
};

/**
 * With image icon
 */
export const WithImageIcon: Story = {
  args: {
    primary: 'Uniswap',
    secondary: 'Ethereum',
    icon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    iconAlt: 'Uniswap logo',
  },
};

/**
 * Primary text only (no secondary)
 */
export const PrimaryOnly: Story = {
  args: {
    primary: 'Bitcoin',
  },
};

/**
 * Primary and secondary with image
 */
export const PrimaryAndSecondary: Story = {
  args: {
    primary: 'Ethereum',
    secondary: 'Polygon',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
};

/**
 * Small icon size
 */
export const SmallIcon: Story = {
  args: {
    primary: 'Project Name',
    secondary: 'Chain Name',
    iconSize: 'sm',
  },
};

/**
 * Medium icon size (default)
 */
export const MediumIcon: Story = {
  args: {
    primary: 'Project Name',
    secondary: 'Chain Name',
    iconSize: 'md',
  },
};

/**
 * Large icon size
 */
export const LargeIcon: Story = {
  args: {
    primary: 'Project Name',
    secondary: 'Chain Name',
    iconSize: 'lg',
  },
};

/**
 * Long text with ellipsis
 */
export const LongText: Story = {
  args: {
    primary: 'Very Long Project Name That Should Be Truncated',
    secondary: 'Very Long Chain Name That Should Also Be Truncated',
  },
};

/**
 * Example: Cryptocurrency project
 */
export const CryptoExample: Story = {
  args: {
    primary: 'Chainlink',
    secondary: 'Ethereum',
    icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
  },
};

/**
 * Example: DeFi project
 */
export const DeFiExample: Story = {
  args: {
    primary: 'Aave Protocol',
    secondary: 'Multi-Chain',
    icon: 'https://cryptologos.cc/logos/aave-aave-logo.png',
  },
};

