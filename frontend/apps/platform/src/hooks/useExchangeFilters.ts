import { useState, useMemo, useEffect } from 'react';
import type { FilterCategory, FilterValues } from '@core3/ui-components';
import { ExchangeListItem } from '@/types/api/exchangesStatistic';

const INITIAL_FILTERS: FilterValues = {
  securityFeatures: [],
};

interface UseExchangeFiltersOptions {
  t: (key: string, defaultValue: string) => string;
  data: ExchangeListItem[];
}

interface UseExchangeFiltersReturn {
  filterBottomSheetOpen: boolean;
  setFilterBottomSheetOpen: (open: boolean) => void;
  filterCategories: FilterCategory[];
  pendingFilters: FilterValues;
  appliedFilters: FilterValues;
  totalSelectedCount: number;
  handleFilterChange: (values: FilterValues) => void;
  handleFilterApply: () => void;
  handleFilterClear: () => void;
  handleFilterCancel: () => void;
}

function cloneFilters(filters: FilterValues): FilterValues {
  return {
    securityFeatures: [...filters.securityFeatures],
  };
}

export function useExchangeFilters({
  t,
  data,
}: UseExchangeFiltersOptions): UseExchangeFiltersReturn {
  const [filterBottomSheetOpen, setFilterBottomSheetOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(INITIAL_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<FilterValues>(INITIAL_FILTERS);

  const securityFeaturesOptions = useMemo(() => {
    const countMap = new Map<string, number>();
    
    data.forEach((item) => {
      if (item.bugBounty?.isActive) {
        countMap.set('bugBounty', (countMap.get('bugBounty') || 0) + 1);
      }
      if (item.proofOfReserves?.isPresent) {
        countMap.set('proofOfReserves', (countMap.get('proofOfReserves') || 0) + 1);
      }
      if (item.penetrationTest?.isPresent) {
        countMap.set('penetrationTest', (countMap.get('penetrationTest') || 0) + 1);
      }
    });

    return [
      {
        value: 'bugBounty',
        label: t('exchanges.filters.options.bugBounty', 'Bug Bounty'),
        count: countMap.get('bugBounty') || 0,
      },
      {
        value: 'proofOfReserves',
        label: t('exchanges.filters.options.proofOfReserves', 'Proof of Reserves'),
        count: countMap.get('proofOfReserves') || 0,
      },
      {
        value: 'penetrationTest',
        label: t('exchanges.filters.options.penetrationTesting', 'Penetration Testing'),
        count: countMap.get('penetrationTest') || 0,
      },
    ];
  }, [data, t]);

  const filterCategories = useMemo(
    (): FilterCategory[] => [
      {
        key: 'securityFeatures',
        label: t('exchanges.filters.categories.securityFeatures', 'Security Features'),
        options: securityFeaturesOptions,
      },
    ],
    [t, securityFeaturesOptions]
  );

  const totalSelectedCount = Object.values(appliedFilters).reduce(
    (total, arr) => total + arr.length,
    0
  );

  useEffect(() => {
    if (filterBottomSheetOpen) {
      setPendingFilters(cloneFilters(appliedFilters));
    }
  }, [filterBottomSheetOpen, appliedFilters]);

  const handleFilterChange = (values: FilterValues) => {
    setPendingFilters(cloneFilters(values));
  };

  const handleFilterApply = () => {
    setAppliedFilters(cloneFilters(pendingFilters));
    setFilterBottomSheetOpen(false);
  };

  const handleFilterClear = () => {
    setPendingFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
  };

  const handleFilterCancel = () => {
    setPendingFilters(cloneFilters(appliedFilters));
    setFilterBottomSheetOpen(false);
  };

  return {
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
  };
}
