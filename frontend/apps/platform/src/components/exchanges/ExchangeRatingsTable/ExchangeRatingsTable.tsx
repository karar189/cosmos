/** @jsxImportSource @emotion/react */
'use client';

import { ROUTES } from '@/constants/routes';
import useTranslation from '@/hooks/useTranslation';
import { useExchangeSort, useExchangeFilters } from '@/hooks';
import { ExchangeListItem } from '@/types/api/exchangesStatistic';
import { getExchangeCertificationLevel } from '@/utils/certification';
import type { ColumnConfig, FiltersConfig } from '@core3/ui-components';
import { DataTable, NumberCell, Stars, BottomSheet, RadioList, Icon, FilterBottomSheet } from '@core3/ui-components';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import * as styles from './ExchangeRatingsTable.styles';
import { BadgeRankScore } from '@/components/common/BadgeRankScore';
import { formatAmount, formatPercentage } from '@/utils/format';
import { MobileExchangeCard } from './MobileExchangeCard';
import { useCooperationModal } from '@/components/layouts/PlatformLayout';

interface ExchangeRatingsTableProps {
  data: ExchangeListItem[];
}

export default function ExchangeRatingsTable({ data }: ExchangeRatingsTableProps) {
  const { t } = useTranslation(['ratings']);
  const router = useRouter();
  const { openCooperationModal } = useCooperationModal();

  const {
    sorting,
    setSorting,
    pendingSort,
    sortOptions,
    sortBottomSheetOpen,
    setSortBottomSheetOpen,
    handleSortChange,
    handleSortApply,
    handleSortCancel,
  } = useExchangeSort({ t });

  const {
    filterBottomSheetOpen,
    setFilterBottomSheetOpen,
    filterCategories,
    pendingFilters,
    appliedFilters,
    totalSelectedCount,
    handleFilterChange,
    handleFilterApply,
    handleFilterClear,
    handleFilterCancel,
  } = useExchangeFilters({ t, data });

  const filteredData = useMemo(() => {
    if (totalSelectedCount === 0) return data;

    return data.filter((item) => {
      if (appliedFilters.securityFeatures.length > 0) {
        const features: string[] = [];
        if (item.bugBounty?.isActive) features.push('bugBounty');
        if (item.proofOfReserves?.isPresent) features.push('proofOfReserves');
        if (item.penetrationTest?.isPresent) features.push('penetrationTest');
        
        if (!appliedFilters.securityFeatures.some((feature) => features.includes(feature))) {
          return false;
        }
      }

      return true;
    });
  }, [data, appliedFilters, totalSelectedCount]);

  // Handle exchange click - navigate to details
  const handleExchangeClick = useCallback(
    (exchangeId: string) => {
      router.push(ROUTES.EXCHANGES.DETAILS(exchangeId));
    },
    [router]
  );

  // Define columns configuration
  const createColumnsConfig = (
    t: (key: string, defaultValue: string) => string,
    handleExchangeClick: (exchangeId: string) => void
  ): ColumnConfig<ExchangeListItem>[] => [
    {
      key: 'rank',
      name: '#',
      type: 'id',
      enableSorting: false,
      width: 50,
    },
    {
      key: 'exchange',
      name: t('exchanges.table.columns.exchange', 'Exchange'),
      type: 'custom',
      width: 200,
      render: (_value, row) => (
        <div
          css={styles.clickableExchange}
          onClick={() => handleExchangeClick(row.exchange.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleExchangeClick(row.exchange.id);
            }
          }}
        >
          <div css={styles.exchangeLogo}>
            {row.exchange.logo && (
              <Image src={row.exchange.logo} alt={row.exchange.name} fill />
            )}
          </div>
          <div css={styles.exchangeInfo}>
            <span css={styles.exchangeName}>{row.exchange.name}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'certification',
      name: t('exchanges.table.columns.certification', 'Certification'),
      type: 'custom',
      enableSorting: false,
      width: 120,
      render: (value) => (
        <Stars value={getExchangeCertificationLevel((value as ExchangeListItem['certification']).level)} />
      ),
      tooltip: {
        text: t(
          'exchanges.table.tooltips.certification',
          'Exchange certification level based on audits and compliance (★ to ★★★)'
        ),
        icon: 'info',
      },
    },
    {
      key: 'tradingVolume',
      name: t('exchanges.table.columns.tradingVolume', 'Trading Volume (24h)'),
      type: 'custom',
      width: 180,
      render: (_value, row) => {
        const formattedValue = row.tradeVolume?.trade_volume_24h ? formatAmount(row.tradeVolume.trade_volume_24h, {prefix: '$'}) : 'N/A';
        return <NumberCell primary={formattedValue} align="left" loading={false} />;
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.tradeVolume?.trade_volume_24h ?? 0;
        const b = rowB.original.tradeVolume?.trade_volume_24h ?? 0;
        return a - b;
      },
    },
    {
      key: 'tradingVolumeChange',
      name: t('exchanges.table.columns.tradingVolumeChange', 'Trading Volume Change (24h)'),
      type: 'custom',
      width: 200,
      render: (_value, row) => {
        const formattedValue = row.tradeVolume?.trade_volume_change_percentage_24h ? formatPercentage(row.tradeVolume.trade_volume_change_percentage_24h) : 'N/A';
        const secondaryValue = row.tradeVolume?.trade_volume_change_24h ? formatAmount(row.tradeVolume.trade_volume_change_24h, {prefix: '$'}) : undefined;
        return <NumberCell primary={formattedValue} secondary={secondaryValue} align="left" loading={false} />;
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.tradeVolume?.trade_volume_change_percentage_24h ?? 0;
        const b = rowB.original.tradeVolume?.trade_volume_change_percentage_24h ?? 0;
        return a - b;
      },
    },
    {
      key: 'security',
      name: t('exchanges.table.columns.securityScore', 'Security Score'),
      type: 'custom',
      width: 150,
      render: (value) => {
        const typedValue = value as ExchangeListItem['security'];
        return <BadgeRankScore score={typedValue.score} level={typedValue.grade} isSecurityScore={true} />;
      },
      sortingFn: (rowA, rowB) => rowA.original.security.score - rowB.original.security.score,
    },
  ];

  // Create columns config with i18n and click handler
  const columnsConfig = React.useMemo(
    () => createColumnsConfig(t, handleExchangeClick),
    [t, handleExchangeClick]
  );

  // Configure filters for DataTable
  const filtersConfig: FiltersConfig<ExchangeListItem> = React.useMemo(
    () => ({
      fields: [
        {
          key: 'securityFeatures',
          type: 'tabs',
          placeholder: '',
          options: [
            {
              value: 'bugBounty',
              label: t('exchanges.filters.options.bugBounty', 'Bug Bounty'),
            },
            {
              value: 'proofOfReserves',
              label: t('exchanges.filters.options.proofOfReserves', 'Proof of Reserves'),
            },
            {
              value: 'penetrationTest',
              label: t('exchanges.filters.options.penetrationTesting', 'Penetration Testing'),
            },
          ],
          getValue: (item) => {
            // Return the feature name if it's active/present
            const features: string[] = [];
            if (item.bugBounty?.isActive) features.push('bugBounty');
            if (item.proofOfReserves?.isPresent) features.push('proofOfReserves');
            if (item.penetrationTest?.isPresent) features.push('penetrationTest');
            return features;
          },
        },
        // TODO: Re-enable when listedAssets is available in the data
        // {
        //   key: 'listedTokens',
        //   type: 'searchableMultiselect',
        //   placeholder: t('exchanges.filters.placeholders.listedTokens', 'Listed Tokens'),
        //   options: allTokenOptions,
        //   getValue: (item) => item.listedAssets || [],
        // }
      ],
      showClearButton: true,
      clearButtonText: t('exchanges.filters.clearButton', 'CLEAR FILTERS'),
    }),
    [t]
  );

  const mobileCardRenderer = useCallback(
    ({ item, index, totalItems }: { item: ExchangeListItem; index: number; totalItems: number }) => {
      return (
        <MobileExchangeCard
          key={item.exchange.id}
          item={item}
          index={index}
          showCTA={false}
          t={t}
          onCTAClick={openCooperationModal}
          onExchangeClick={handleExchangeClick}
        />
      );
    },
    [t, openCooperationModal, handleExchangeClick]
  );

  return (
    <div css={styles.tableContainer}>
      <div css={styles.mobileFiltersContainer} data-mobile-filters>
        <button
          css={styles.filterButton}
          aria-label={t('exchanges.filters.mobileButtons.filters', 'Filters')}
          onClick={() => setFilterBottomSheetOpen(true)}
        >
          <Icon name="filter" />
          <span>{t('exchanges.filters.mobileButtons.filters', 'Filters')}</span>
          {totalSelectedCount > 0 && (
            <span css={styles.filterBadge}>{totalSelectedCount}</span>
          )}
          <Icon name={filterBottomSheetOpen ? 'chevron-up' : 'chevron-down'} />
        </button>

        <button
          css={styles.filterButton}
          aria-label={t('exchanges.filters.mobileButtons.sorting', 'Sort')}
          onClick={() => setSortBottomSheetOpen(true)}
        >
          <Icon name="sorting" />
          <span>{t('exchanges.filters.mobileButtons.sorting', 'Sort')}</span>
          <Icon name={sortBottomSheetOpen ? 'chevron-up' : 'chevron-down'} />
        </button>
      </div>

      <DataTable
        data={filteredData}
        filters={filtersConfig}
        columnsConfig={columnsConfig}
        mobileCardRenderer={mobileCardRenderer}
        sorting={sorting}
        onSortingChange={setSorting}
        loading={false}
      />

      <BottomSheet
        open={sortBottomSheetOpen}
        onClose={() => setSortBottomSheetOpen(false)}
        title={t('exchanges.sort.title', 'Sort by')}
      >
        <RadioList 
          options={sortOptions} 
          value={pendingSort} 
          onChange={handleSortChange} 
          allowDeselect={true}
        />
        <div css={styles.bottomSheetActions}>
          <button css={styles.cancelButton} onClick={handleSortCancel}>
            {t('exchanges.sort.buttons.cancel', 'Cancel')}
          </button>
          <button css={styles.applyButton} onClick={handleSortApply}>
            <span>{t('exchanges.sort.buttons.apply', 'Apply')}</span>
          </button>
        </div>
      </BottomSheet>

      <FilterBottomSheet
        open={filterBottomSheetOpen}
        onClose={handleFilterCancel}
        title={t('exchanges.filters.title', 'Filters')}
        categories={filterCategories}
        values={pendingFilters}
        onChange={handleFilterChange}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
        clearAllText={t('exchanges.filters.buttons.clearAll', 'CLEAR ALL')}
        clearText={t('exchanges.filters.buttons.clear', 'Clear')}
        applyText={t('exchanges.filters.buttons.apply', 'Apply')}
        ariaCloseLabel={t('common.aria.close', 'Close')}
        ariaBackLabel={t('common.aria.goBack', 'Go back')}
      />
    </div>
  );
}

