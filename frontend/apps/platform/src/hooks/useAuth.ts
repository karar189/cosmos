'use client';

import { useState, useEffect } from 'react';
import { isValidAccountType, type AccountTypeValue } from '@/enums/accountType';

export interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  accountType: AccountTypeValue;
  organizationName?: string;
}

/**
 * useAuth Hook
 *
 * Hook to manage authentication state and user information.
 * Reads from localStorage to determine if user is logged in.
 *
 * @returns Authentication state, user info, and logout function
 *
 * @example
 * ```tsx
 * const { isAuthenticated, user, logout } = useAuth();
 * 
 * if (isAuthenticated) {
 *   return <div>Welcome {user?.firstName}!</div>;
 * }
 * ```
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = checking
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Check logged in flag first - if explicitly logged out, don't check further
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'false') {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    // Check localStorage for auth state
    const accountType = localStorage.getItem('accountType');
    const email = localStorage.getItem('userEmail');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const organizationName = localStorage.getItem('organizationName');

    // User is authenticated if we have minimum required fields
    if (accountType && isValidAccountType(accountType) && email && firstName && lastName) {
      setIsAuthenticated(true);
      setUser({
        accountType,
        email,
        firstName,
        lastName,
        organizationName: organizationName || undefined,
      });
      // Ensure isLoggedIn flag is set to true
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const logout = () => {
    // Set logged out flag - preserves user data for future login
    localStorage.setItem('isLoggedIn', 'false');
    
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    logout,
  };
}

