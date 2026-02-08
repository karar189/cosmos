'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

/**
 * Dashboard Builder is replaced by Dashboard Workspace.
 * Redirect legacy /workspace/dashboard-builder to Dashboard Workspace.
 */
export default function DashboardBuilderRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.WORKSPACE.DASHBOARD_WORKSPACE);
  }, [router]);

  return null;
}
