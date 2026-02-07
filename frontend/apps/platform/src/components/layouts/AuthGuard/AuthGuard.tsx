'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export interface AuthGuardProps {
  /**
   * Content to render if authenticated
   */
  children: ReactNode;
  /**
   * Redirect path if not authenticated
   * @default '/auth/login'
   */
  redirectTo?: string;
}

/**
 * AuthGuard - Simple authentication guard without layout
 * 
 * Checks if user is authenticated and redirects to login if not.
 * Does NOT wrap children with any layout - just provides auth protection.
 * 
 * Use this for protected routes that have their own layout.
 * 
 * @example
 * ```tsx
 * // In workspace/layout.tsx
 * export default function WorkspaceLayout({ children }) {
 *   return <AuthGuard>{children}</AuthGuard>;
 * }
 * ```
 */
export function AuthGuard({ children, redirectTo = ROUTES.AUTH.LOGIN }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only redirect if we've finished checking and user is not authenticated
    if (isAuthenticated === false) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  // Still checking authentication - show nothing while loading
  if (isAuthenticated === null) {
    return null;
  }

  // Not authenticated - redirect will happen in useEffect
  if (isAuthenticated === false) {
    return null;
  }

  // Authenticated - render children
  return <>{children}</>;
}

