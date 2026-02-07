import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor, fn } from '@storybook/test';
import React from 'react';
import Footer from './Footer';

/**
 * Footer component provides a responsive site footer with configurable links,
 * social media items, optional logo, and custom tagline.
 *
 * Extracted from the landing page and tailored to be fully reusable across apps.
 */
const meta = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Footer component provides a complete footer solution with configurable menu items, social links, optional logo, and custom branding text. Fully responsive and customizable.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    menuItems: {
      control: 'object',
      description: 'Main menu items array',
      table: {
        category: 'Links',
      },
    },
    socialItems: {
      control: 'object',
      description: 'Social media links array',
      table: {
        category: 'Links',
      },
    },
    logoSrc: {
      control: 'text',
      description: 'Footer logo image source',
      table: {
        category: 'Branding',
      },
    },
    logoAlt: {
      control: 'text',
      description: 'Footer logo alt text',
      defaultValue: 'Footer logo',
      table: {
        category: 'Branding',
        defaultValue: { summary: 'Footer logo' },
      },
    },
    tagline: {
      control: 'text',
      description: 'Custom tagline or branding text',
      table: {
        category: 'Branding',
      },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default footer with all features enabled
 */
export const Default: Story = {
  args: {
    menuItems: [
      { name: 'Ratings', href: '/ratings' },
      { name: 'Methodology', href: '/methodology' },
      { name: 'Listing', href: '/listing' },
      { name: 'Cooperation', href: '/cooperation' },
      { name: 'About', href: '/about' },
    ],
    socialItems: [
      { name: 'X', href: 'https://x.com/core3' },
      { name: 'Linkedin', href: 'https://linkedin.com/company/core3' },
      { name: 'Telegram', href: 'https://t.me/core3' },
    ],
    logoSrc: '/images/footer-logo.webp',
    tagline: (
      <>
        Crypto <br />
        Organisation of <br />
        Regulatory <br />
        <span>Elaboration</span>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const footer = canvasElement.querySelector('footer');
    await expect(footer).toBeInTheDocument();

    await expect(canvas.getByText('Ratings')).toBeInTheDocument();
    await expect(canvas.getByText('Methodology')).toBeInTheDocument();
    await expect(canvas.getByText('Listing')).toBeInTheDocument();
    await expect(canvas.getByText('Cooperation')).toBeInTheDocument();
    await expect(canvas.getByText('About')).toBeInTheDocument();

    await expect(canvas.getByText('X')).toBeInTheDocument();
    await expect(canvas.getByText('Linkedin')).toBeInTheDocument();
    await expect(canvas.getByText('Telegram')).toBeInTheDocument();

    const logo = canvas.getByAltText('Footer logo');
    await expect(logo).toBeInTheDocument();

    await expect(canvas.getByText(/Crypto/)).toBeInTheDocument();
    await expect(canvas.getByText(/Elaboration/)).toBeInTheDocument();
  },
};

/**
 * Minimal footer with just links
 */
export const MinimalLinks: Story = {
  args: {
    menuItems: [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Home')).toBeInTheDocument();
    await expect(canvas.getByText('About')).toBeInTheDocument();
    await expect(canvas.getByText('Contact')).toBeInTheDocument();

    const logo = canvas.queryByAltText('Footer logo');
    await expect(logo).not.toBeInTheDocument();
  },
};

/**
 * Footer with only social links
 */
export const SocialOnly: Story = {
  args: {
    socialItems: [
      { name: 'Twitter', href: 'https://twitter.com/core3' },
      { name: 'GitHub', href: 'https://github.com/core3' },
      { name: 'Discord', href: 'https://discord.gg/core3' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Twitter')).toBeInTheDocument();
    await expect(canvas.getByText('GitHub')).toBeInTheDocument();
    await expect(canvas.getByText('Discord')).toBeInTheDocument();

    const twitterLink = canvas.getByText('Twitter').closest('a');
    await expect(twitterLink).toHaveAttribute('target', '_blank');
    await expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  },
};

/**
 * Footer with custom tagline text
 */
export const CustomTagline: Story = {
  args: {
    tagline: 'Building the future of decentralized finance',
    menuItems: [
      { name: 'Products', href: '/products' },
      { name: 'Resources', href: '/resources' },
    ],
    socialItems: [
      { name: 'Twitter', href: 'https://twitter.com' },
      { name: 'LinkedIn', href: 'https://linkedin.com' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Building the future of decentralized finance')).toBeInTheDocument();

    await expect(canvas.getByText('Products')).toBeInTheDocument();
    await expect(canvas.getByText('Resources')).toBeInTheDocument();

    await expect(canvas.getByText('Twitter')).toBeInTheDocument();
    await expect(canvas.getByText('LinkedIn')).toBeInTheDocument();
  },
};

/**
 * Footer with styled tagline
 */
export const StyledTagline: Story = {
  args: {
    tagline: (
      <div>
        <strong>CORE3</strong> <br />
        <span style={{ fontSize: '0.8em', opacity: 0.8 }}>
          Crypto Organisation of Regulatory Elaboration
        </span>
      </div>
    ),
    menuItems: [
      { name: 'Ratings', href: '/ratings' },
      { name: 'Methodology', href: '/methodology' },
    ],
    logoSrc: '/images/footer-logo.webp',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('CORE3')).toBeInTheDocument();
    await expect(canvas.getByText(/Crypto Organisation/)).toBeInTheDocument();

    await expect(canvas.getByAltText('Footer logo')).toBeInTheDocument();
  },
};

/**
 * Footer without logo
 */
export const WithoutLogo: Story = {
  args: {
    menuItems: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
    socialItems: [
      { name: 'Facebook', href: 'https://facebook.com' },
      { name: 'Instagram', href: 'https://instagram.com' },
    ],
    tagline: 'Your trusted crypto rating platform',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const logo = canvas.queryByAltText('Footer logo');
    await expect(logo).not.toBeInTheDocument();

    await expect(canvas.getByText('Your trusted crypto rating platform')).toBeInTheDocument();

    await expect(canvas.getByText('Privacy Policy')).toBeInTheDocument();
    await expect(canvas.getByText('Terms of Service')).toBeInTheDocument();
    await expect(canvas.getByText('Cookie Policy')).toBeInTheDocument();
  },
};

/**
 * Footer with extended menu items
 */
export const ExtendedMenu: Story = {
  args: {
    menuItems: [
      { name: 'Home', href: '/' },
      { name: 'Project Ratings', href: '/ratings/projects' },
      { name: 'Exchange Ratings', href: '/ratings/exchanges' },
      { name: 'Methodology', href: '/methodology' },
      { name: 'Research', href: '/research' },
      { name: 'Blog', href: '/blog' },
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    socialItems: [
      { name: 'X', href: 'https://x.com' },
      { name: 'LinkedIn', href: 'https://linkedin.com' },
      { name: 'Telegram', href: 'https://t.me' },
      { name: 'Discord', href: 'https://discord.gg' },
    ],
    logoSrc: '/images/footer-logo.webp',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Home')).toBeInTheDocument();
    await expect(canvas.getByText('Contact')).toBeInTheDocument();

    const menuLinks = canvas.getAllByText(/Home|Project Ratings|Exchange Ratings|Methodology|Research|Blog|About Us|Careers|Contact/);
    await expect(menuLinks.length).toBe(9);

    await expect(canvas.getByText('X')).toBeInTheDocument();
    await expect(canvas.getByText('LinkedIn')).toBeInTheDocument();
    await expect(canvas.getByText('Telegram')).toBeInTheDocument();
    await expect(canvas.getByText('Discord')).toBeInTheDocument();
  },
};

/**
 * Footer with logo and no tagline
 */
export const LogoOnly: Story = {
  args: {
    logoSrc: '/images/footer-logo.webp',
    menuItems: [
      { name: 'Products', href: '/products' },
      { name: 'About', href: '/about' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByAltText('Footer logo')).toBeInTheDocument();

    await expect(canvas.getByText('Products')).toBeInTheDocument();
    await expect(canvas.getByText('About')).toBeInTheDocument();
  },
};

/**
 * Simple footer with minimal styling
 */
export const Simple: Story = {
  args: {
    menuItems: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Privacy')).toBeInTheDocument();
    await expect(canvas.getByText('Terms')).toBeInTheDocument();

    const logo = canvas.queryByAltText('Footer logo');
    await expect(logo).not.toBeInTheDocument();
  },
};

/**
 * Complete footer as used in landing page
 */
export const LandingPageFooter: Story = {
  args: {
    menuItems: [
      { name: 'Ratings', href: '#' },
      { name: 'Methodology', href: '#' },
      { name: 'Listing', href: '#' },
      { name: 'Cooperation', href: '#' },
      { name: 'About', href: '#' },
    ],
    socialItems: [
      { name: 'X', href: '#' },
      { name: 'Linkedin', href: '#' },
      { name: 'Telegram', href: '#' },
    ],
    logoSrc: '/images/footer-logo.webp',
    tagline: (
      <>
        Crypto <br />
        Organisation of <br />
        Regulatory <br />
        <span>Elaboration</span>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/Crypto/)).toBeInTheDocument();
    await expect(canvas.getByText('Ratings')).toBeInTheDocument();
    await expect(canvas.getByText('X')).toBeInTheDocument();
    await expect(canvas.getByAltText('Footer logo')).toBeInTheDocument();

    const ratingsLink = canvas.getByText('Ratings').closest('a');
    await expect(ratingsLink).toHaveAttribute('href', '#');
  },
};

/**
 * Footer with click handlers on menu items
 */
export const WithClickHandlers: Story = {
  args: {
    menuItems: [
      { name: 'Home', href: '/', onClick: fn() },
      { name: 'Products', href: '/products', onClick: fn() },
    ],
    socialItems: [
      { name: 'Twitter', href: 'https://twitter.com', onClick: fn() },
    ],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const homeButton = canvas.getByText('Home');
    await userEvent.click(homeButton);

    await waitFor(() => {
      expect(args.menuItems?.[0]?.onClick).toHaveBeenCalledTimes(1);
    });

    const productsButton = canvas.getByText('Products');
    await userEvent.click(productsButton);

    await waitFor(() => {
      expect(args.menuItems?.[1]?.onClick).toHaveBeenCalledTimes(1);
    });

    const twitterButton = canvas.getByText('Twitter');
    await userEvent.click(twitterButton);

    await waitFor(() => {
      expect(args.socialItems?.[0]?.onClick).toHaveBeenCalledTimes(1);
    });
  },
};

/**
 * Footer with external links (target="_blank")
 */
export const WithExternalLinks: Story = {
  args: {
    menuItems: [
      { name: 'Documentation', href: 'https://docs.example.com', target: '_blank' },
      { name: 'API Reference', href: 'https://api.example.com', target: '_blank' },
    ],
    socialItems: [
      { name: 'GitHub', href: 'https://github.com/example' },
      { name: 'Twitter', href: 'https://twitter.com/example' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const docLink = canvas.getByText('Documentation').closest('a');
    await expect(docLink).toHaveAttribute('target', '_blank');
    await expect(docLink).toHaveAttribute('rel', 'noopener noreferrer');

    const apiLink = canvas.getByText('API Reference').closest('a');
    await expect(apiLink).toHaveAttribute('target', '_blank');
    await expect(apiLink).toHaveAttribute('rel', 'noopener noreferrer');

    const githubLink = canvas.getByText('GitHub').closest('a');
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  },
};