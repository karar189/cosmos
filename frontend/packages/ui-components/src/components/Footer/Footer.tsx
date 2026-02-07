/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as styles from './Footer.styles';

export interface FooterLinkItem {
  /**
   * Link display name
   */
  name: string;
  /**
   * Link href
   */
  href: string;
  /**
   * Optional click handler (overrides default link behavior)
   */
  onClick?: (e: React.MouseEvent) => void;
  /**
   * Link target attribute (e.g., '_blank' for new tab)
   */
  target?: string;
}

export interface FooterProps {
  /**
   * Main menu items (e.g., Ratings, Methodology, etc.)
   */
  menuItems?: FooterLinkItem[];
  /**
   * Social media links (e.g., X, LinkedIn, Telegram)
   */
  socialItems?: FooterLinkItem[];
  /**
   * Footer logo image source
   */
  logoSrc?: string;
  /**
   * Footer logo alt text
   * @default 'Footer logo'
   */
  logoAlt?: string;
  /**
   * Custom tagline or branding text
   * Can be string or ReactNode for custom formatting
   * @example
   * ```tsx
   * <Footer tagline={
   *   <>
   *     Crypto <br />
   *     Organisation of <br />
   *     Regulatory <br />
   *     <span>Elaboration</span>
   *   </>
   * } />
   * ```
   */
  tagline?: React.ReactNode;
}

/**
 * Footer component - Configurable site footer with links and branding
 * 
 * Provides a responsive footer with:
 * - Configurable menu items and social links
 * - Optional footer logo
 * - Custom tagline/branding text
 * - Responsive layout (stacked on mobile, horizontal on desktop)
 * 
 * @example
 * ```tsx
 * <Footer
 *   menuItems={[
 *     { name: 'Ratings', href: '/ratings' },
 *     { name: 'Methodology', href: '/methodology' },
 *   ]}
 *   socialItems={[
 *     { name: 'X', href: 'https://x.com/core3' },
 *     { name: 'LinkedIn', href: 'https://linkedin.com/company/core3' },
 *   ]}
 *   logoSrc="/images/footer-logo.webp"
 *   tagline="Crypto Organisation of Regulatory Elaboration"
 * />
 * ```
 */
export default function Footer({
  menuItems = [],
  socialItems = [],
  logoSrc,
  logoAlt = 'Footer logo',
  tagline,
}: FooterProps) {
  return (
    <footer css={styles.footer}>
      {/* Tagline/Branding Text */}
      {tagline && <div css={styles.footerText}>{tagline}</div>}

      {/* Links Section */}
      {(menuItems.length > 0 || socialItems.length > 0) && (
        <div css={styles.links}>
          {/* Menu Items */}
          {menuItems.length > 0 && (
            <div css={styles.linksGroup}>
              {menuItems.map((item) =>
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    css={styles.linkButton}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    css={styles.link}
                    target={item.target}
                    rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          )}

          {/* Social Items */}
          {socialItems.length > 0 && (
            <div css={styles.linksGroup}>
              {socialItems.map((item) =>
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    css={styles.linkButton}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    css={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Logo/Image */}
      {logoSrc && (
        <div css={styles.imageWrapper}>
          <Image src={logoSrc} alt={logoAlt} fill aria-hidden="true" />
        </div>
      )}
    </footer>
  );
}

