/** @jsxImportSource @emotion/react */
'use client';

import { HeaderDropdown } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import * as styles from './UserMenu.styles';

export interface UserMenuProps {
  /**
   * User's first name
   */
  firstName: string;
  /**
   * User's last name
   */
  lastName: string;
  /**
   * Logout handler
   */
  onLogout: () => void;
}

/**
 * UserMenu - User dropdown menu in header
 * 
 * Shows user's name with dropdown menu containing logout option.
 * Uses HeaderDropdown component styled to match Figma design.
 * 
 * @example
 * ```tsx
 * <UserMenu 
 *   firstName="John" 
 *   lastName="Doe" 
 *   onLogout={handleLogout} 
 * />
 * ```
 */
export default function UserMenu({ firstName, lastName, onLogout }: UserMenuProps) {
  const { t } = useTranslation('common');

  // Format name as "A. Lastname" (first initial + dot + last name)
  const displayName = `${firstName.charAt(0).toUpperCase()}. ${lastName}`;

  const trigger = (
    <div css={styles.trigger}>
      <div css={styles.iconPlaceholder}>
        {/* TODO: replace with actual user icon once we have one */}
        <svg width="20" height="20" viewBox="0 0 20 20" css={styles.icon}>
          <circle cx="10" cy="10" r="8" fill="#A3A7B2" />
        </svg>
      </div>
      <span css={styles.userName}>
        {displayName}
      </span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" css={styles.arrow}>
        <path d="M7 10l5 5 5-5H7z" />
      </svg>
    </div>
  );

  const menuItems = [
    {
      label: t('header.userMenu.logout', 'Log Out'),
      onClick: onLogout,
    },
  ];

  return <HeaderDropdown trigger={trigger} items={menuItems} triggerCss={styles.dropdownTrigger} />;
}

