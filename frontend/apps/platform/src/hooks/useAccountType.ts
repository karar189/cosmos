'use client';

import { useState, useEffect } from 'react';
import { isValidAccountType, type AccountTypeValue } from '@/enums/accountType';

/**
 * useAccountType Hook
 *
 * Hook to retrieve and manage account type from localStorage.
 * Reads the account type from localStorage and provides it to components.
 *
 * @returns Account type string (e.g., 'regulator', 'project', 'exchange', 'investor') or undefined if not set
 *
 * @example
 * ```tsx
 * const { accountType } = useAccountType();
 * ```
 */
export function useAccountType() {
  const [accountType, setAccountType] = useState<AccountTypeValue | undefined>(undefined);

  useEffect(() => {
    // Read account type from localStorage
    const storedAccountType = localStorage.getItem('accountType');
    
    // If account type exists in localStorage and is valid, use it
    if (storedAccountType && isValidAccountType(storedAccountType)) {
      setAccountType(storedAccountType);
    }
  }, []);

  return {
    accountType,
  };
}

