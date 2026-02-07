/** @jsxImportSource @emotion/react */
'use client';

import React, { useCallback } from 'react';
import { ListedAssetsSection } from '@/types/api/exchange';
import {
  Section,
  DataTable,
  Badge,
} from '@core3/ui-components';
import { useTranslation } from 'react-i18next';
import { formatAmount } from '@/utils/format';
import type { ColumnConfig, FiltersConfig } from '@core3/ui-components';
import { BadgeRankScore } from '@/components/common/BadgeRankScore';
import * as styles from './ExchangeListedAssetsSection.styles';
import { MobileListedAssetCard } from './MobileListedAssetCard';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import Image from 'next/image';

interface ExchangeListedAssetsSectionProps {
  id: string;
  data?: ListedAssetsSection;
}

const ExchangeListedAssetsSection: React.FC<ExchangeListedAssetsSectionProps> = ({
  id,
  data: listedAssetsData,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  // Get unique categories for filter
  const categories = React.useMemo(() => {
    if (!listedAssetsData?.list) return [];
    const uniqueCategories = Array.from(
      new Set(listedAssetsData.list.map((asset) => asset.category).filter((cat): cat is string => cat !== null))
    );
    return uniqueCategories.sort();
  }, [listedAssetsData?.list]);

  const handleAssetClick = (projectId: string | null | undefined, ticker: string) => {
    // Navigate to project detail page if projectId exists, otherwise search
    if (projectId) {
      router.push(ROUTES.PROJECTS.DETAILS(projectId));
    } else {
      router.push(ROUTES.RATINGS.PROJECTS_SEARCH(ticker));
    }
  };

  // Create columns config for listed assets table
  const columnsConfig: ColumnConfig<ListedAssetsSection['list'][0]>[] = [
    {
      key: 'asset',
      name: t('exchanges.listedAssets.table.columns.asset', 'Asset'),
      type: 'custom',
      width: 120,
      render: (_value, row) => (
        <div
          css={styles.clickableAsset}
          onClick={() => handleAssetClick(row.projectId, row.ticker)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleAssetClick(row.projectId, row.ticker);
            }
          }}
        >
          {row.logo ? (
            <div css={styles.assetLogo}>
              <Image src={row.logo} alt={row.name} fill />
            </div>
          ) : (
            <div css={styles.assetLogoPlaceholder}>
              <span css={styles.placeholderText}>{row.ticker.charAt(0)}</span>
            </div>
          )}
          <div css={styles.assetInfo}>
            <span css={styles.assetName}>{row.name}</span>
            <span css={styles.assetTicker}>{row.ticker}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'marketCap',
      name: t('exchanges.listedAssets.table.columns.marketCap', 'Market Cap'),
      align: 'left',
      type: 'custom',
      width: 100,
      render: (_value, row) => {
        if (row.marketCap === null) {
          return <span css={styles.noData}>{t('common.unknown', 'N/A')}</span>;
        }
        return (
          <span css={styles.marketCapValue}>
            {formatAmount(row.marketCap, { prefix: '$', compact: true, decimalPlaces: 2 })}
          </span>
        );
      },
      sortingFn: (rowA, rowB) => {
        const capA = rowA.original.marketCap ?? -1;
        const capB = rowB.original.marketCap ?? -1;
        return capA - capB;
      },
    },
    {
      key: 'tokenAudits',
      name: t('exchanges.listedAssets.table.columns.tokenAudits', 'Token Audits'),
      type: 'custom',
      weight: 'medium',
      enableSorting: false,
      width: 110,
      render: (_value, row) => {
        const isAbsent = !row.tokenAudits || row.tokenAudits.toLowerCase().includes('absent') || row.tokenAudits.toLowerCase().includes('n/a');
        
        if (isAbsent) {
          return <span css={styles.noData}>{t('common.unknown', 'N/A')}</span>;
        }
        return <span css={styles.auditText}>{row.tokenAudits}</span>;
      },
    },
    {
      key: 'bugBounty',
      name: t('exchanges.listedAssets.table.columns.bugBounty', 'Bug Bounty'),
      type: 'custom',
      enableSorting: false,
      width: 100,
      render: (_value, row) => {
        const hasBugBounty = row.bugBounty === 'Yes' || row.bugBounty === true;
        const isAbsent = !row.bugBounty || row.bugBounty === 'No';
        
        if (isAbsent) {
          return <span css={styles.noData}>{t('common.unknown', 'N/A')}</span>;
        }
        if (hasBugBounty) {
          return <span css={styles.auditText}>{t('common.yes', 'Yes')}</span>;
        }
        return <span css={styles.auditText}>{String(row.bugBounty)}</span>;
      },
    },
    {
      key: 'pol',
      name: t('exchanges.listedAssets.table.columns.pol', 'PoL'),
      align: 'left',
      type: 'custom',
      width: 100,
      render: (value) => {
        const pol = value as ListedAssetsSection['list'][0]['pol'];
        if (!pol) {
          return <span css={styles.noData}>{t('common.unknown', 'N/A')}</span>;
        }
        return <BadgeRankScore score={pol.score} level={pol.grade} isPol />;
      },
      sortingFn: (rowA, rowB) => {
        const scoreA = rowA.original.pol?.score ?? -1;
        const scoreB = rowB.original.pol?.score ?? -1;
        return scoreA - scoreB;
      },
    },
    {
      key: 'category',
      name: t('exchanges.listedAssets.table.columns.category', 'Category'),
      type: 'custom',
      align: 'left',
      weight: 'medium',
      enableSorting: false,
      accessorFn: (row) => row.category || 'N/A',
      width: 120,
      render: (value) => {
        const categoryValue = (value as string | null | undefined) ?? '';
        if (!categoryValue) {
          return <span css={styles.noData}>{t('common.unknown', 'N/A')}</span>;
        }
        return <span css={styles.categoryText}>{categoryValue}</span>;
      },
    },
  ];

  // Create filters config
  const filtersConfig: FiltersConfig<ListedAssetsSection['list'][0]> = {
    fields: [
      {
        key: 'search',
        type: 'search',
        placeholder: t('exchanges.listedAssets.searchPlaceholder', 'Search tokens'),
        position: 'start',
        getValue: (item) => [item.ticker, item.category ?? ''].join(' '),
      },
      {
        key: 'category',
        type: 'multiselect',
        placeholder: t('exchanges.listedAssets.categoryPlaceholder', 'Category'),
        position: 'end',
        options: categories.map((cat) => ({ value: cat, label: cat })),
      },
    ],
  };

  const mobileCardRenderer = useCallback(
    ({ item }: { item: ListedAssetsSection['list'][0]; index: number; totalItems: number }) => {
      return (
        <MobileListedAssetCard
          key={item.ticker}
          item={item}
          t={t}
        />
      );
    },
    [t]
  );

  return (
    <Section
      id={id}
      title={t('exchanges.listedAssets.title', 'Listed Assets')}
      iconName="data-stack"
      headerContent={
        listedAssetsData?.total !== undefined ? (
          <Badge size="small" mono color="gray">
            {listedAssetsData.total}
          </Badge>
        ) : undefined
      }
      areas={[['table', 'table', 'table']]}
    >
      <div css={styles.tableContainer}>
        <DataTable
          data={listedAssetsData?.list || []}
          columnsConfig={columnsConfig}
          filters={filtersConfig}
          mobileCardRenderer={mobileCardRenderer}
          enablePagination={true}
          pagination={{
            initialPageSize: 10,
            pageSizeOptions: [10, 20, 30, 50],
          }}
          loading={false}
        />
      </div>
    </Section>
  );
};

export default ExchangeListedAssetsSection;

