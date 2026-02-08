'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

/**
 * Agentic Builder is merged into Compliance Maker.
 * Redirect legacy /workspace/agentic-builder to Compliance Maker.
 */
export default function AgenticBuilderRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.WORKSPACE.COMPLIANCE_MAKER);
  }, [router]);

  return null;
}
