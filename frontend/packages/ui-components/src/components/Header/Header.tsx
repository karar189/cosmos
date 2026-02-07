/** @jsxImportSource @emotion/react */
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Core3Button } from '../Button';
import { Icon } from '../Icon';
import * as styles from './Header.styles';

export interface MenuItem {
  /**
   * Menu item display name
   */
  name: string;
  /**
   * Menu item href/link
   */
  href: string;
  /**
   * Whether this menu item is currently active
   */
  active?: boolean;
  /**
   * Link target attribute (e.g., '_blank' for new tab)
   */
  target?: string;
  /**
   * Optional click handler (overrides default link behavior)
   */
  onClick?: (e: React.MouseEvent) => void;
}

export interface HeaderProps {
  /**
   * Logo image source path
   */
  logoSrc?: string;
  /**
   * Custom logo element (overrides logoSrc if provided)
   */
  logoElement?: React.ReactNode;
  /**
   * Logo link href
   * @default '/'
   */
  logoHref?: string;
  /**
   * Navigation menu items
   */
  menuItems?: MenuItem[];
  /**
   * Call-to-action button text
   */
  ctaText?: string;
  /**
   * Call-to-action button text for mobile (optional, falls back to ctaText)
   */
  ctaTextMobile?: string;
  /**
   * Call-to-action button href
   */
  ctaHref?: string;
  /**
   * Call-to-action button click handler
   */
  onCtaClick?: () => void;
  /**
   * CTA button variant
   * @default 'primary'
   */
  ctaVariant?: 'primary' | 'secondary';
  /**
   * Whether CTA button has pulsing/scale animation
   * @default true
   */
  ctaAnimated?: boolean;
  /**
   * Custom search component to render in the header
   */
  searchComponent?: React.ReactNode;
  /**
   * Whether the header should be sticky/fixed at the top
   * @default false
   */
  sticky?: boolean;
  /**
   * Alt text for logo image
   * @default 'Logo'
   */
  logoAlt?: string;
  /**
   * Whether user is authenticated
   */
  isAuthenticated?: boolean;
  /**
   * Account type badge component (shown when authenticated)
   */
  accountTypeBadge?: React.ReactNode;
  /**
   * User menu component (shown when authenticated)
   */
  userMenuComponent?: React.ReactNode;
  /**
   * "More" dropdown menu component (shown when authenticated)
   */
  moreMenuComponent?: React.ReactNode;
}

/**
 * Header component - Navigation header with logo, menu items, and optional CTA
 * 
 * Provides a fully responsive navigation header with:
 * - Logo (image or custom element)
 * - Configurable menu items
 * - Optional CTA button
 * - Optional search component
 * - Mobile hamburger menu
 * - Optional sticky positioning
 * 
 * @example
 * ```tsx
 * <Header
 *   logoSrc="/images/logo.svg"
 *   logoHref="/"
 *   menuItems={[
 *     { name: 'Home', href: '/', active: true },
 *     { name: 'About', href: '/about' },
 *   ]}
 *   ctaText="Get Started"
 *   ctaTextMobile="Start" // Optional: different text for mobile
 *   ctaHref="/signup"
 *   sticky
 * />
 * ```
 */
export default function Header({
  logoSrc,
  logoElement,
  logoHref = '/',
  menuItems = [],
  ctaText,
  ctaTextMobile,
  ctaHref,
  onCtaClick,
  ctaVariant = 'primary',
  ctaAnimated = true,
  searchComponent,
  sticky = false,
  logoAlt = 'Logo',
  isAuthenticated = false,
  accountTypeBadge,
  userMenuComponent,
  moreMenuComponent,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    }
    closeMobileMenu();
  };

  return (
    <header css={[styles.header, sticky && styles.headerSticky]}>
      <div css={styles.container}>
        {/* Left Section: Logo + Navigation */}
        <div css={isAuthenticated ? styles.leftSection : styles.leftSectionUnauthenticated}>
          {/* Logo */}
          <div css={styles.logoContainer}>
            <Link href={logoHref} css={styles.logoLink}>
              {logoElement ? (
                logoElement
              ) : logoSrc ? (
                <Image src={logoSrc} alt={logoAlt} width={140} height={34} priority />
              ) : (
                <span css={styles.logoPlaceholder}>LOGO</span>
              )}
            </Link>
          </div>

          {/* Account Type Badge (authenticated only) */}
          {isAuthenticated && accountTypeBadge && (
            <div css={styles.authBadgeSection}>
              <div css={styles.separator} />
              <div css={styles.badgeContainer}>{accountTypeBadge}</div>
              <div css={styles.separator} />
            </div>
          )}

          {/* Desktop Navigation */}
          <nav css={styles.desktopNav}>
            {menuItems.length > 0 && (
              <ul css={styles.navList}>
                {menuItems.map((item) => (
                  <li key={item.name} css={styles.navItem}>
                    {item.onClick ? (
                      <button
                        onClick={item.onClick}
                        css={[styles.navLink, item.active && styles.navLinkActive]}
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        css={[styles.navLink, item.active && styles.navLinkActive]}
                        target={item.target}
                        rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
                
                {/* More Menu (authenticated only) */}
                {isAuthenticated && moreMenuComponent && (
                  <li css={styles.navItem}>{moreMenuComponent}</li>
                )}
              </ul>
            )}
          </nav>
        </div>

        {/* Right Section: Search + CTA/UserMenu */}
        <div css={styles.rightSection}>
          {/* Search Component */}
          {searchComponent && (
            <div css={styles.searchPlaceholder}>
              {searchComponent}
            </div>
          )}

          {/* User Menu (authenticated) or CTA Button (unauthenticated) */}
          {isAuthenticated && userMenuComponent ? (
            userMenuComponent
          ) : ctaText ? (
            <div css={styles.ctaContainer}>
              {ctaHref ? (
                <Link href={ctaHref}>
                  <Core3Button onClick={handleCtaClick} variant={ctaVariant} animated={ctaAnimated}>
                    {ctaTextMobile && (
                      <span css={styles.mobileCtaText}>
                        {ctaTextMobile}
                      </span>
                    )}
                    <span css={ctaTextMobile ? styles.ctaText : undefined}>
                      {ctaText}
                    </span>
                  </Core3Button>
                </Link>
              ) : (
                <Core3Button onClick={handleCtaClick} variant={ctaVariant} animated={ctaAnimated}>
                  {ctaTextMobile && (
                    <span css={styles.mobileCtaText}>
                      {ctaTextMobile}
                    </span>
                  )}
                  <span css={ctaTextMobile ? styles.ctaText : undefined}>
                    {ctaText}
                  </span>
                </Core3Button>
              )}
            </div>
          ) : null}

          {/* Mobile Menu Toggle */}
          <button
            css={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span css={[styles.hamburgerLine, mobileMenuOpen && styles.hamburgerLineOpen]} />
            <span css={[styles.hamburgerLine, mobileMenuOpen && styles.hamburgerLineOpen]} />
            <span css={[styles.hamburgerLine, mobileMenuOpen && styles.hamburgerLineOpen]} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div css={styles.mobileMenuBackdrop} onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu Panel */}
      <div css={[styles.mobileNav, mobileMenuOpen && styles.mobileNavOpen]}>
        <div css={styles.mobileNavHeader}>
          {/* Logo */}
          <Link href={logoHref} css={styles.logoLink} onClick={closeMobileMenu}>
            {logoElement ? (
              logoElement
            ) : logoSrc ? (
              <Image src={logoSrc} alt={logoAlt} width={140} height={34} priority />
            ) : (
              <span css={styles.logoPlaceholder}>LOGO</span>
            )}
          </Link>

          {/* Close Button */}
          <button
            css={styles.mobileCloseButton}
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <div css={styles.mobileNavContent}>
          {/* Search in Mobile Menu */}
          {searchComponent && (
            <div css={styles.mobileSearchContainer}>
              {searchComponent}
            </div>
          )}

          {/* Mobile Navigation Links */}
          <nav>
            <ul css={styles.mobileNavList}>
              {menuItems.map((item) => (
                <li key={item.name} css={styles.mobileNavItem}>
                  {item.onClick ? (
                    <button
                      onClick={(e) => {
                        item.onClick?.(e);
                        closeMobileMenu();
                      }}
                      css={[styles.mobileNavLink, item.active && styles.mobileNavLinkActive]}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      css={[styles.mobileNavLink, item.active && styles.mobileNavLinkActive]}
                      target={item.target}
                      rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}

              {/* More Menu in Mobile */}
              {moreMenuComponent && (
                <li css={styles.mobileNavItem}>
                  {moreMenuComponent}
                </li>
              )}
            </ul>
          </nav>

          {/* CTA Button at bottom */}
          {(ctaTextMobile || ctaText) && (
            <div css={styles.mobileCta}>
              {ctaHref ? (
                <Link href={ctaHref} onClick={closeMobileMenu}>
                  <Core3Button onClick={handleCtaClick} variant={ctaVariant} fullWidth>
                    {ctaTextMobile || ctaText}
                  </Core3Button>
                </Link>
              ) : (
                <Core3Button onClick={handleCtaClick} variant={ctaVariant} fullWidth>
                  {ctaTextMobile || ctaText}
                </Core3Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


