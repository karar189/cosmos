import { useState, useMemo, useEffect } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { PROJECT_SORT_OPTIONS } from '@/constants/sorting';

const SORT_VALUE_MAP: Record<string, SortingState> = {
  'pol-high': [{ id: 'pol', desc: true }],
  'pol-low': [{ id: 'pol', desc: false }],
  'market-cap-high': [{ id: 'market_cap', desc: true }],
  'market-cap-low': [{ id: 'market_cap', desc: false }],
};

function getSortValueFromState(sorting: SortingState): string {
  if (sorting.length === 0) return '';
  const { id, desc } = sorting[0];
  if (id === 'pol') return desc ? 'pol-high' : 'pol-low';
  if (id === 'market_cap') return desc ? 'market-cap-high' : 'market-cap-low';
  return '';
}

interface UseProjectSortOptions {
  t: (key: string, defaultValue: string) => string;
}

interface UseProjectSortReturn {
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

export function useProjectSort({ t }: UseProjectSortOptions): UseProjectSortReturn {
  const [sortBottomSheetOpen, setSortBottomSheetOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pendingSort, setPendingSort] = useState('');

  const selectedSort = useMemo(() => getSortValueFromState(sorting), [sorting]);

  const sortOptions = useMemo(
    () =>
      PROJECT_SORT_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label, ''),
      })),
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

