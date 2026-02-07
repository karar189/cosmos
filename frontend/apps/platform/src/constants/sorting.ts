export interface SortOption {
  value: string;
  label: string;
}

export const PROJECT_SORT_OPTIONS: SortOption[] = [
  { value: 'pol-high', label: 'projects.sort.polHigh' },
  { value: 'pol-low', label: 'projects.sort.polLow' },
  { value: 'market-cap-high', label: 'projects.sort.marketCapHigh' },
  { value: 'market-cap-low', label: 'projects.sort.marketCapLow' },
] as const;
