/** @jsxImportSource @emotion/react */
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from './AuthLayout';
import { AuthLayoutProvider } from './AuthLayoutContext';
import { ROUTES } from '@/constants/routes';

/**
 * Checks if the user is authenticated.
 * TODO: Replace with actual authentication check when auth system is implemented
 * @returns {boolean} True if user is authenticated, false otherwise
 */
function checkAuthentication(): boolean {
  return true;
}

/**
 * Component that wraps children with authentication providers
 * and triggers authentication validation for protected routes.
 *
 * @example
 * ```tsx
 * // In a layout file
 * export default function MyLayout({ children }) {
 *   return <WithAuthProvider>{children}</WithAuthProvider>;
 * }
 * ```
 */
export function WithAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authenticated = checkAuthentication();
    setIsAuthenticated(authenticated);

    if (!authenticated) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AuthLayoutProvider>
      <AuthLayout>{children}</AuthLayout>
    </AuthLayoutProvider>
  );
}
