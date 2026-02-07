'use client';

import useTranslation from './useTranslation';
import { AccountType, type AccountTypeValue } from '@/enums/accountType';

export interface WorkspaceBlock {
  title: string;
  subtitle: string;
}

export interface WorkspaceContent {
  description: string;
  blocks: WorkspaceBlock[];
}

/**
 * useWorkspaceContent Hook
 *
 * Hook to get translated workspace content based on account type.
 * Returns description and DataBlock configurations for the current account type.
 *
 * @param accountType - The type of account (regulator, project, exchange, investor)
 * @returns Workspace content with translated text, or null if accountType is undefined
 *
 * @example
 * ```tsx
 * const content = useWorkspaceContent(accountType);
 * if (!content) return <div>Please select an account type</div>;
 * const { description, blocks } = content;
 * ```
 */
export function useWorkspaceContent(accountType: AccountTypeValue | undefined): WorkspaceContent | null {
  const { t } = useTranslation('workspace');

  // Return null if no account type is provided
  if (!accountType) {
    return null;
  }

  // Map of content keys for each account type
  const contentMap: Record<AccountTypeValue, { descKey: string; blockKeys: string[] }> = {
    [AccountType.REGULATOR]: {
      descKey: 'workspace.regulator.description',
      blockKeys: ['customScoring', 'averagePolScore', 'licensedCompanies'],
    },
    [AccountType.PROJECT]: {
      descKey: 'workspace.project.description',
      blockKeys: ['dataSubmission', 'scoreReports', 'visibility'],
    },
    [AccountType.EXCHANGE]: {
      descKey: 'workspace.exchange.description',
      blockKeys: ['dataSubmission', 'porAudit', 'visibility'],
    },
    [AccountType.INVESTOR]: {
      descKey: 'workspace.investor.description',
      blockKeys: ['portfolioTracker', 'walletIntegration', 'assetComparison'],
    },
  };

  const config = contentMap[accountType];

  return {
    description: t(config.descKey, ''),
    blocks: config.blockKeys.map((key) => ({
      title: t(`workspace.${accountType}.blocks.${key}.title`, ''),
      subtitle: t(`workspace.${accountType}.blocks.${key}.subtitle`, ''),
    })),
  };
}


