/** @jsxImportSource @emotion/react */
import type { ColumnConfig } from '@core3/ui-components';
import { NumberCell, ProgressCell, Stars } from '@core3/ui-components';
import type { SerializedStyles } from '@emotion/react';
import Image from 'next/image';
import { ProjectListItem } from '@/types/api/projectsStatistic';
import { getProjectCertificationLevel } from '@/utils/certification';
import { formatAmount, formatPercentage } from '@/utils/format';
import { BadgeRankScore } from '@/components/common/BadgeRankScore';

interface ProjectStyles {
  clickableProject: SerializedStyles;
  projectLogo: SerializedStyles;
  projectInfo: SerializedStyles;
  projectName: SerializedStyles;
  projectChain: SerializedStyles;
}

interface ColumnsConfigOptions {
  t: (key: string, defaultValue: string) => string;
  onProjectClick: (projectId: string) => void;
  styles: ProjectStyles;
}

export function createProjectRatingsColumnsConfig({
  t,
  onProjectClick,
  styles,
}: ColumnsConfigOptions): ColumnConfig<ProjectListItem>[] {
  return [
    {
      key: 'id',
      name: '#',
      type: 'id',
      enableSorting: false,
      width: 24,
    },
    {
      key: 'project',
      name: t('projects.table.columns.project', ''),
      type: 'custom',
      render: (_value, row) => (
        <div
          css={styles.clickableProject}
          onClick={() => onProjectClick(row.project.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onProjectClick(row.project.id);
            }
          }}
        >
          <div css={styles.projectLogo}>
            <Image src={row.project.logo} alt={row.project.name} fill />
          </div>
          <div css={styles.projectInfo}>
            <span css={styles.projectName}>{row.project.name}</span>
            <span css={styles.projectChain}>{row.project.ticker}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'certification',
      name: t('projects.table.columns.certification', ''),
      type: 'custom',
      enableSorting: false,
      render: (value) => (
        <Stars
          value={getProjectCertificationLevel(
            (value as ProjectListItem['certification']).level
          )}
        />
      ),
      tooltip: {
        text: t('projects.table.tooltips.certification', ''),
        icon: 'info',
      },
    },
    {
      key: 'market_cap',
      name: t('projects.table.columns.marketCap', ''),
      type: 'custom',
      accessorFn: (row) => row.marketData?.market_cap,
      render: (_value, row) => {
        const typedValue = row.marketData?.market_cap
          ? formatAmount(row.marketData?.market_cap, { prefix: '$' })
          : 'N/A';
        return <NumberCell primary={typedValue} align="left" loading={false} />;
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.marketData?.market_cap ?? 0;
        const b = rowB.original.marketData?.market_cap ?? 0;
        return a - b;
      },
    },
    {
      key: 'market_cap_change',
      name: t('projects.table.columns.marketCapChange', ''),
      type: 'custom',
      render: (_value, row) => {
        const typedValue = row.marketData?.market_cap_change_percentage_24h
          ? formatPercentage(row.marketData?.market_cap_change_percentage_24h)
          : 'N/A';
        const typedValueSecondary = row.marketData?.market_cap_change_24h
          ? formatAmount(row.marketData?.market_cap_change_24h, { prefix: '$' })
          : undefined;
        return (
          <NumberCell
            primary={typedValue}
            secondary={typedValueSecondary}
            align="left"
            loading={false}
          />
        );
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.marketData?.market_cap_change_percentage_24h ?? 0;
        const b = rowB.original.marketData?.market_cap_change_percentage_24h ?? 0;
        return a - b;
      },
    },
    {
      key: 'pol',
      name: t('projects.table.columns.pol', ''),
      type: 'custom',
      accessorFn: (row) => row.pol,
      render: (value) => {
        const typedValue = value as ProjectListItem['pol'];
        return <BadgeRankScore score={typedValue.score} level={typedValue.grade} isPol />;
      },
      sortingFn: (rowA, rowB) => rowA.original.pol.score - rowB.original.pol.score,
    },
    {
      key: 'dataCoverage',
      name: t('projects.table.columns.dataCoverage', ''),
      type: 'custom',
      render: (value, _row, meta) => {
        const data = value as ProjectListItem['dataCoverage'];
        const typedMeta = meta as { loading?: boolean } | undefined;
        return <ProgressCell value={data.percentage} loading={typedMeta?.loading} />;
      },
      tooltip: {
        text: t('projects.table.tooltips.dataCoverage', ''),
        icon: 'info',
      },
    },
    {
      key: 'project.category',
      name: t('projects.table.columns.category', ''),
      type: 'text',
      align: 'right',
      weight: 'medium',
      enableSorting: false,
    },
  ];
}

