import { useState, useMemo, useEffect } from 'react';
import type { FilterCategory, FilterValues } from '@core3/ui-components';
import { ProjectListItem } from '@/types/api/projectsStatistic';
import {
  MARKET_CAP_OPTIONS,
  getMarketCapRange,
} from '@/lib/projectRatingsFiltersConfig';

const INITIAL_FILTERS: FilterValues = {
  'project.category': [],
  marketCap: [],
  chains: [],
  compliance: [],
};

interface UseProjectFiltersOptions {
  t: (key: string, defaultValue: string) => string;
  data: ProjectListItem[];
}

interface UseProjectFiltersReturn {
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
    'project.category': [...filters['project.category']],
    marketCap: [...filters.marketCap],
    chains: [...filters.chains],
    compliance: [...filters.compliance],
  };
}

function extractOptionsWithCounts<T>(
  data: ProjectListItem[],
  extractor: (item: ProjectListItem) => T[]
): Map<T, number> {
  const countMap = new Map<T, number>();
  data.forEach((item) => {
    extractor(item).forEach((value) => {
      countMap.set(value, (countMap.get(value) || 0) + 1);
    });
  });
  return countMap;
}

export function useProjectFilters({
  t,
  data,
}: UseProjectFiltersOptions): UseProjectFiltersReturn {
  const [filterBottomSheetOpen, setFilterBottomSheetOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(INITIAL_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<FilterValues>(INITIAL_FILTERS);

  const categoryOptions = useMemo(() => {
    const countMap = extractOptionsWithCounts(data, (item) =>
      item.project.category ? [item.project.category] : []
    );
    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, label: value, count }));
  }, [data]);

  const chainOptions = useMemo(() => {
    const countMap = extractOptionsWithCounts(data, (item) =>
      item.chains.map((chain) => chain.name)
    );
    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, label: value, count }));
  }, [data]);

  const complianceOptions = useMemo(() => {
    const countMap = extractOptionsWithCounts(data, (item) => item.compliance);
    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, label: value, count }));
  }, [data]);

  const marketCapOptions = useMemo(() => {
    const countMap = new Map<string, number>();
    data.forEach((item) => {
      const range = getMarketCapRange(item.marketData?.market_cap);
      if (range !== 'N/A') {
        countMap.set(range, (countMap.get(range) || 0) + 1);
      }
    });
    return MARKET_CAP_OPTIONS.map((option) => ({
      ...option,
      count: countMap.get(option.value) || 0,
    }));
  }, [data]);

  const filterCategories = useMemo(
    (): FilterCategory[] => [
      {
        key: 'project.category',
        label: t('projects.filters.categories.category', ''),
        options: categoryOptions,
      },
      {
        key: 'marketCap',
        label: t('projects.filters.categories.marketCap', ''),
        options: marketCapOptions,
      },
      {
        key: 'chains',
        label: t('projects.filters.categories.chains', ''),
        options: chainOptions,
      },
      {
        key: 'compliance',
        label: t('projects.filters.categories.compliance', ''),
        options: complianceOptions,
      },
    ],
    [t, categoryOptions, marketCapOptions, chainOptions, complianceOptions]
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

