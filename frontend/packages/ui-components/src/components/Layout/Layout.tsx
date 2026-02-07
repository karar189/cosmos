/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import Header, { HeaderProps } from '../Header/Header';
import Footer, { FooterProps } from '../Footer/Footer';
import * as styles from './Layout.styles';

export interface LayoutProps {
  /**
   * Main content to be displayed
   */
  children: React.ReactNode;
  /**
   * Custom content for the title section (displayed when variant is 'with-title')
   * Expected to contain title, subtitle, or any custom page header content
   * @example
   * ```tsx
   * titleSectionContent={
   *   <>
   *     <h1><strong>explore</strong> 1,000+ projects.</h1>
   *     <p>Additional description or filters</p>
   *   </>
   * }
   * ```
   */
  titleSectionContent?: React.ReactNode;
  /**
   * Layout variant
   * - 'default': Header → Content → Footer
   * - 'with-title': Header → Title Section → Content (with rounded top borders) → Footer
   * @default 'default'
   */
  variant?: 'default' | 'with-title';
  /**
   * Props to pass to the Header component
   */
  headerProps?: HeaderProps;
  /**
   * Props to pass to the Footer component
   */
  footerProps?: FooterProps;
  /**
   * Whether to show the header
   * @default true
   */
  showHeader?: boolean;
  /**
   * Whether to show the footer
   * @default true
   */
  showFooter?: boolean;
  /**
   * Custom CSS class name for the main content area
   */
  contentClassName?: string;
}

/**
 * Layout component - Complete page layout with header, content, and footer
 * 
 * Provides two layout variants:
 * 1. **default**: Simple layout with header, content, and footer
 * 2. **with-title**: Includes a title section between header and content
 * 
 * Features:
 * - Modular: Header and Footer can be shown/hidden independently
 * - Configurable: Pass props to customize Header and Footer
 * - Responsive: Adapts to different screen sizes
 * - Sticky footer: Footer always at bottom even with minimal content
 * 
 * @example
 * ```tsx
 * // Default layout
 * <Layout
 *   headerProps={{
 *     logoSrc: '/logo.svg',
 *     menuItems: [{ name: 'Home', href: '/' }],
 *     ctaText: 'Sign In',
 *   }}
 *   footerProps={{
 *     menuItems: [{ name: 'Privacy', href: '/privacy' }],
 *   }}
 * >
 *   <YourContent />
 * </Layout>
 * 
 * // With title section variant
 * <Layout
 *   variant="with-title"
 *   titleSectionContent={
 *     <>
 *       <h1><strong>explore</strong> 1,000+ projects.</h1>
 *       <p>Additional filters or description</p>
 *     </>
 *   }
 *   headerProps={{ logoSrc: '/logo.svg' }}
 * >
 *   <YourContent />
 * </Layout>
 * ```
 */
export default function Layout({
  children,
  titleSectionContent,
  variant = 'default',
  headerProps,
  footerProps,
  showHeader = true,
  showFooter = true,
  contentClassName,
}: LayoutProps) {
  return (
    <div css={styles.layoutContainer} data-scroll-container>
      {/* Gradient Background */}
      <div css={styles.gradientBackground} />

      {/* Header */}
      {showHeader && headerProps && <Header {...headerProps} />}

      {/* Title Section (only for 'with-title' variant) */}
      {variant === 'with-title' && titleSectionContent && (
        <div css={styles.titleSection}>
          <div css={styles.titleContainer}>{titleSectionContent}</div>
        </div>
      )}

      {/* Main Content */}
      <main
        css={[
          styles.mainContent,
          variant === 'with-title' && styles.mainContentWithTitle,
        ]}
        className={contentClassName}
      >
        {children}
      </main>

      {/* Footer */}
      {showFooter && footerProps && <Footer {...footerProps} />}
    </div>
  );
}

