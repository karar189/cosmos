/** @jsxImportSource @emotion/react */
'use client';

import { AccountType, type AccountTypeValue } from '@/enums/accountType';
import * as styles from './AccountTypeBadge.styles';

export interface AccountTypeBadgeProps {
  /**
   * Account type
   */
  accountType: AccountTypeValue;
  /**
   * Organization name (for regulators/organizations)
   */
  organizationName?: string;
}

/**
 * AccountTypeBadge - Displays user's account type and organization
 * 
 * Shows account type icon/logo and organization name in header.
 * Styled to match Figma design with vertical layout.
 * 
 * @example
 * ```tsx
 * <AccountTypeBadge 
 *   accountType="regulator" 
 *   organizationName="ADGM" 
 * />
 * ```
 */
export default function AccountTypeBadge({ 
  accountType, 
  organizationName 
}: AccountTypeBadgeProps) {
  // Map account types to display labels
  const accountTypeLabels: Record<AccountTypeValue, string> = {
    [AccountType.REGULATOR]: 'Regulator',
    [AccountType.PROJECT]: 'Project',
    [AccountType.EXCHANGE]: 'Exchange',
    [AccountType.INVESTOR]: 'Investor',
  };

  const label = accountTypeLabels[accountType] || accountType;

  return (
    <div css={styles.container}>
      <div css={styles.iconContainer}>
        {/* Placeholder icon - replace with actual account type icons/logos */}
        <div css={styles.icon}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="currentColor">
            <circle cx="17" cy="17" r="16" stroke="currentColor" fill="none" strokeWidth="2" />
            <text x="17" y="22" fontSize="12" textAnchor="middle" fill="currentColor">
              {accountType[0].toUpperCase()}
            </text>
          </svg>
        </div>
      </div>
      <div css={styles.textContainer}>
        <span css={styles.accountTypeLabel}>{label}</span>
        {organizationName && (
          <span css={styles.organizationName}>{organizationName}</span>
        )}
      </div>
    </div>
  );
}

