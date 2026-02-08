/** @jsxImportSource @emotion/react */
'use client';

import { ROUTES } from '@/constants/routes';
import useTranslation from '@/hooks/useTranslation';
import { useProjectSort } from '@/hooks/useProjectSort';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import { ProjectListItem } from '@/types/api/projectsStatistic';
import { saveNavigationState } from '@/utils/navigationState';
import { createProjectRatingsColumnsConfig } from '@/lib/projectRatingsColumnsConfig';
import { createProjectRatingsFiltersConfig, getMarketCapRange } from '@/lib/projectRatingsFiltersConfig';
import { DataTable, BottomSheet, RadioList, Icon, FilterBottomSheet } from '@core3/ui-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useMemo } from 'react';
import * as styles from './ProjectRatingsTable.styles';
import { useCooperationModal } from '@/components/layouts/PlatformLayout';
import { MobileProjectCard } from './MobileProjectCard';

interface ProjectRatingsTableProps {
  data: ProjectListItem[];
}

function ProjectRatingsTableContent({ data }: ProjectRatingsTableProps) {
  const { t } = useTranslation(['ratings']);
  const router = useRouter();
  const searchParams = useSearchParams();
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
  } = useProjectSort({ t });

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
  } = useProjectFilters({ t, data });

  const filteredData = useMemo(() => {
    if (totalSelectedCount === 0) return data;

    return data.filter((item) => {
      if (appliedFilters['project.category'].length > 0) {
        if (!appliedFilters['project.category'].includes(item.project.category)) {
          return false;
        }
      }

      if (appliedFilters.marketCap.length > 0) {
        const range = getMarketCapRange(item.marketData?.market_cap);
        if (range === 'N/A' || !appliedFilters.marketCap.includes(range)) {
          return false;
        }
      }

      if (appliedFilters.chains.length > 0) {
        const chainNames = item.chains.map((chain) => chain.name);
        if (!appliedFilters.chains.some((chain) => chainNames.includes(chain))) {
          return false;
        }
      }

      if (appliedFilters.compliance.length > 0) {
        if (!appliedFilters.compliance.some((signal) => item.compliance.includes(signal))) {
          return false;
        }
      }

      return true;
    });
  }, [data, appliedFilters, totalSelectedCount]);

  const handleProjectClick = useCallback(
    (projectId: string) => {
      const currentPage = searchParams.get('page');
      const currentTab = searchParams.get('tab');

      saveNavigationState({
        page: currentPage ? parseInt(currentPage) : undefined,
        tab: currentTab || undefined,
        scrollPosition: window.scrollY,
      });

      router.push(ROUTES.PROJECTS.DETAILS(projectId));
    },
    [router, searchParams]
  );

  const columnsConfig = useMemo(
    () =>
      createProjectRatingsColumnsConfig({
        t,
        onProjectClick: handleProjectClick,
        styles: {
          clickableProject: styles.clickableProject,
          projectLogo: styles.projectLogo,
          projectInfo: styles.projectInfo,
          projectName: styles.projectName,
          projectChain: styles.projectChain,
        },
      }),
    [t, handleProjectClick]
  );

  const filtersConfig = useMemo(() => createProjectRatingsFiltersConfig({ t }), [t]);

  const mobileCardRenderer = useCallback(
    ({ item, index, totalItems }: { item: ProjectListItem; index: number; totalItems: number }) => {
      return (
        <MobileProjectCard
          key={item.project.id}
          item={item}
          index={index}
          showCTA={false}
          t={t}
          onCTAClick={openCooperationModal}
          onProjectClick={handleProjectClick}
        />
      );
    },
    [t, openCooperationModal]
  );


  return (
    <div css={styles.tableContainer}>
      <div css={styles.mobileFiltersContainer} data-mobile-filters>
        <button
          css={styles.filterButton}
          aria-label={t('projects.filters.mobileButtons.filters', '')}
          onClick={() => setFilterBottomSheetOpen(true)}
        >
          <Icon name="filter" />
          <span>{t('projects.filters.mobileButtons.filters', '')}</span>
          {totalSelectedCount > 0 && (
            <span css={styles.filterBadge}>{totalSelectedCount}</span>
          )}
          <Icon name={filterBottomSheetOpen ? 'chevron-up' : 'chevron-down'} />
        </button>

        <button
          css={styles.filterButton}
          aria-label={t('projects.filters.mobileButtons.sorting', '')}
          onClick={() => setSortBottomSheetOpen(true)}
        >
          <Icon name="sorting" />
          <span>{t('projects.filters.mobileButtons.sorting', '')}</span>
          <Icon name={sortBottomSheetOpen ? 'chevron-up' : 'chevron-down'} />
        </button>
      </div>

      <DataTable
        data={filteredData}
        columnsConfig={columnsConfig}
        filters={filtersConfig}
        mobileCardRenderer={mobileCardRenderer}
        sorting={sorting}
        onSortingChange={setSorting}
        loading={false}
      />

      <BottomSheet
        open={sortBottomSheetOpen}
        onClose={() => setSortBottomSheetOpen(false)}
        title={t('projects.sort.title', '')}
      >
        <RadioList 
          options={sortOptions} 
          value={pendingSort} 
          onChange={handleSortChange} 
          allowDeselect={true}
        />
        <div css={styles.bottomSheetActions}>
          <button css={styles.cancelButton} onClick={handleSortCancel}>
            {t('projects.sort.buttons.cancel', '')}
          </button>
          <button css={styles.applyButton} onClick={handleSortApply}>
            <span>{t('projects.sort.buttons.apply', '')}</span>
          </button>
        </div>
      </BottomSheet>

      <FilterBottomSheet
        open={filterBottomSheetOpen}
        onClose={handleFilterCancel}
        title={t('projects.filters.title', '')}
        categories={filterCategories}
        values={pendingFilters}
        onChange={handleFilterChange}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
        clearAllText={t('projects.filters.buttons.clearAll', '')}
        clearText={t('projects.filters.buttons.clear', '')}
        applyText={t('projects.filters.buttons.apply', '')}
        ariaCloseLabel={t('common.aria.close', '')}
        ariaBackLabel={t('common.aria.goBack', '')}
      />
    </div>
  );
}

export default function ProjectRatingsTable({ data }: ProjectRatingsTableProps) {
  return (
    <Suspense fallback={null}>
      <ProjectRatingsTableContent data={data} />
    </Suspense>
  );
}
