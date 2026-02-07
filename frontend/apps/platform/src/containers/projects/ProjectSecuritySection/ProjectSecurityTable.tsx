/** @jsxImportSource @emotion/react */
'use client';

import { AuditItem } from '@/types/api/project';
import type { ColumnConfig } from '@core3/ui-components';
import { Badge, DataTable, Icon } from '@core3/ui-components';
import Image from 'next/image';
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './ProjectSecurityTable.styles';

interface ProjectSecurityTableProps {
  data: AuditItem[];
}

/**
 * Formats a date string into a localized format (e.g., "Jan 15, 2024")
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Gets the badge color based on severity
 */
function getFixedFindingsColor(severity?: string): 'green' | 'yellow' | 'orange' | 'red' | 'gray' {
  switch (severity) {
    case 'low':
      return 'green';
    case 'medium':
      return 'yellow';
    case 'high':
      return 'orange';
    case 'critical':
      return 'red';
    default:
      return 'gray';
  }
}

const ProjectSecurityTable: React.FC<ProjectSecurityTableProps> = ({ data }) => {
  const { t } = useTranslation(['projects', 'common']);

  const columnsConfig: ColumnConfig<AuditItem>[] = [
    {
      key: 'auditor',
      name: t('details.security.audits.columns.auditor.label', 'Auditor'),
      type: 'custom',
      render: (value) => {
        const auditor = value as AuditItem['auditor'];
        return (
          <div css={styles.auditorCell}>
            <div css={styles.auditorLogo}>
              {auditor.logo && <Image src={auditor.logo} alt={auditor.name} fill />}
            </div>
            <span css={styles.auditorName}>{auditor.name}</span>
          </div>
        );
      },
      sortingFn: (rowA, rowB) =>
        rowA.original.auditor.name.localeCompare(rowB.original.auditor.name),
    },
    {
      key: 'date',
      name: t('details.security.audits.columns.date.label', 'Date'),
      type: 'custom',
      render: (value) => {
        const dateStr = value as string;
        return <span css={styles.dateCell}>{formatDate(dateStr)}</span>;
      },
      sortingFn: (rowA, rowB) =>
        new Date(rowA.original.date).getTime() - new Date(rowB.original.date).getTime(),
    },
    {
      key: 'fixedFindings',
      name: t('details.security.audits.columns.findingsFixed.label', 'Findings Fixed'),
      type: 'custom',
      enableSorting: false,
      tooltip: {
        text: t('details.security.audits.columns.findingsFixed.tooltip', 'Status of security findings from the audit'),
        icon: 'info',
      },
      render: (value) => {
        const findings = value as AuditItem['fixedFindings'];
        if (!findings) {
          return <span css={styles.naText}>{t('common:nA', 'N/A')}</span>;
        }
        return (
          <Badge
            size="small"
            css={styles.fixedFindingsBadge}
            color={getFixedFindingsColor(findings.severity)}
          >
            {findings.label}
          </Badge>
        );
      },
    },
    {
      key: 'isAuditCodeAccessPresent',
      name: t('details.security.audits.columns.auditCodeAccess.label', 'Audit Code Access'),
      type: 'custom',
      enableSorting: false,
      tooltip: {
        text: t('details.security.audits.columns.auditCodeAccess.tooltip', 'Whether the auditor had access to the source code'),
        icon: 'info',
      },
      render: (value) => {
        const isPresent = value as boolean;
        return (
          <div css={styles.presentCell}>
            <Icon
              name={isPresent ? 'check-circle' : 'negative-circle'}
              css={[styles.checkIcon, !isPresent && styles.negativeCircleIcon]}
            />
            <span>
              {isPresent
                ? t('common:present.yes', 'Present')
                : t('common:absent', 'Absent')}
            </span>
          </div>
        );
      },
    },
    {
      key: 'isChanged',
      name: t('details.security.audits.columns.relevancy.label', 'Relevancy'),
      type: 'custom',
      enableSorting: false,
      tooltip: {
        text: t('details.security.audits.columns.relevancy.tooltip', 'Whether the audited code has changed since the audit'),
        icon: 'info',
      },
      align: 'right',
      render: (value) => {
        const isChanged = value as boolean | undefined;
        return (
          <div css={styles.presentCell}>
            {isChanged && <Icon name="warning-triangle" css={styles.warningIcon} />}
            <span>
              {isChanged
                ? t('common:changed.yes', 'Changed')
                : t('common:changed.no', 'Unchanged')}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataTable
        data={data}
        columnsConfig={columnsConfig}
        enablePagination={false}
        scrollable={{ maxVisibleRows: 4 }}
      />
    </Suspense>
  );
};

export default ProjectSecurityTable;
