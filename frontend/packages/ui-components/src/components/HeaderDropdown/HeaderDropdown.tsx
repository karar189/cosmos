/** @jsxImportSource @emotion/react */
'use client';

import { useState } from 'react';
import { Menu, MenuItem as MuiMenuItem, Divider } from '@mui/material';
import Link from 'next/link';
import { SerializedStyles } from '@emotion/react';
import * as styles from './HeaderDropdown.styles';

export interface HeaderDropdownItem {
  label: string;
  href?: string;
  target?: string;
  onClick?: (e: React.MouseEvent) => void;
  divider?: boolean;
}

export interface HeaderDropdownProps {
  /**
   * Trigger button content
   */
  trigger: React.ReactNode;
  /**
   * Dropdown menu items
   */
  items: HeaderDropdownItem[];
  /**
   * Custom CSS for trigger button
   */
  triggerCss?: SerializedStyles;
}

/**
 * HeaderDropdown - Dropdown menu component for header navigation
 * 
 * Uses MUI Menu component styled with styleSystem.
 * Supports links and click handlers for menu items.
 * 
 * @example
 * ```tsx
 * <HeaderDropdown
 *   trigger="MORE"
 *   items={[
 *     { label: 'Methodology', href: '/methodology', target: '_blank' },
 *     { label: 'Cooperation', onClick: openModal },
 *     { label: 'Logout', onClick: handleLogout, divider: true },
 *   ]}
 * />
 * ```
 */
export default function HeaderDropdown({ trigger, items, triggerCss }: HeaderDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button
        css={[styles.trigger, triggerCss]}
        onClick={handleClick}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {trigger}
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={styles.menuStyles}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {items.map((item, index) => (
          <div key={index}>
            {item.divider && <Divider css={styles.divider} />}
            <MuiMenuItem
              onClick={(e) => {
                if (item.onClick) {
                  item.onClick(e);
                }
                handleClose();
              }}
              css={styles.menuItem}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  target={item.target}
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  css={styles.menuLink}
                >
                  {item.label}
                </Link>
              ) : (
                <span css={styles.menuText}>{item.label}</span>
              )}
            </MuiMenuItem>
          </div>
        ))}
      </Menu>
    </>
  );
}

