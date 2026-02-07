/** @jsxImportSource @emotion/react */
'use client';

import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

/**
 * WorkspacePage - Main workspace page. Redirects to Compliance Maker by default.
 */
export default function WorkspacePage() {
  redirect(ROUTES.WORKSPACE.COMPLIANCE_MAKER);
}
