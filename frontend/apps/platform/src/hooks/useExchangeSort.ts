import { useState, useMemo, useEffect } from 'react';
import type { SortingState } from '@tanstack/react-table';

const SORT_VALUE_MAP: Record<string, SortingState> = {
  'security-high': [{ id: 'security', desc: true }],
  'security-low': [{ id: 'security', desc: false }],
  'volume-high': [{ id: 'tradingVolume', desc: true }],
  'volume-low': [{ id: 'tradingVolume', desc: false }],
};

function getSortValueFromState(sorting: SortingState): string {
  if (sorting.length === 0) return '';
  const { id, desc } = sorting[0];
  if (id === 'security') return desc ? 'security-high' : 'security-low';
  if (id === 'tradingVolume') return desc ? 'volume-high' : 'volume-low';
  return '';
}

interface UseExchangeSortOptions {
  t: (key: string, defaultValue: string) => string;
}

interface UseExchangeSortReturn {
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  pendingSort: string;
  selectedSort: string;
  sortOptions: Array<{ value: string; label: string }>;
  sortBottomSheetOpen: boolean;
  setSortBottomSheetOpen: (open: boolean) => void;
  handleSortChange: (value: string) => void;
  handleSortApply: () => void;
  handleSortCancel: () => void;
}

export function useExchangeSort({ t }: UseExchangeSortOptions): UseExchangeSortReturn {
  const [sortBottomSheetOpen, setSortBottomSheetOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pendingSort, setPendingSort] = useState('');

  const selectedSort = useMemo(() => getSortValueFromState(sorting), [sorting]);

  const sortOptions = useMemo(
    () => [
      { value: 'security-high', label: t('exchanges.sort.securityHigh', 'Security Score: High to Low') },
      { value: 'security-low', label: t('exchanges.sort.securityLow', 'Security Score: Low to High') },
      { value: 'volume-high', label: t('exchanges.sort.volumeHigh', 'Trading Volume: High to Low') },
      { value: 'volume-low', label: t('exchanges.sort.volumeLow', 'Trading Volume: Low to High') },
    ],
    [t]
  );

  useEffect(() => {
    if (sortBottomSheetOpen) {
      setPendingSort(selectedSort);
    }
  }, [sortBottomSheetOpen, selectedSort]);

  const handleSortChange = (value: string) => {
    setPendingSort(value);
  };

  const handleSortApply = () => {
    setSorting(SORT_VALUE_MAP[pendingSort] || []);
    setSortBottomSheetOpen(false);
  };

  const handleSortCancel = () => {
    setPendingSort(selectedSort);
    setSortBottomSheetOpen(false);
  };

  return {
    sorting,
    setSorting,
    pendingSort,
    selectedSort,
    sortOptions,
    sortBottomSheetOpen,
    setSortBottomSheetOpen,
    handleSortChange,
    handleSortApply,
    handleSortCancel,
  };
}
