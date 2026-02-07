/**
 * Account Type Enum
 * 
 * Centralized definition of all account/workspace types in the platform.
 * Use this enum throughout the application instead of hardcoded strings.
 */

export enum AccountType {
  REGULATOR = 'regulator',
  PROJECT = 'project',
  EXCHANGE = 'exchange',
  INVESTOR = 'investor',
}

/**
 * Type union for AccountType values
 */
export type AccountTypeValue = `${AccountType}`;

/**
 * Get all account type values as an array
 */
export const ACCOUNT_TYPES = Object.values(AccountType);

/**
 * Check if a string is a valid account type
 */
export function isValidAccountType(value: string): value is AccountTypeValue {
  return ACCOUNT_TYPES.includes(value as AccountType);
}

