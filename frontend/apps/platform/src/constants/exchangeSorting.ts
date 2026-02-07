export interface SortOption {
  value: string;
  label: string;
}

export const EXCHANGE_SORT_OPTIONS: SortOption[] = [
  { value: 'security-high', label: 'exchanges.sort.securityHigh' },
  { value: 'security-low', label: 'exchanges.sort.securityLow' },
  { value: 'volume-high', label: 'exchanges.sort.volumeHigh' },
  { value: 'volume-low', label: 'exchanges.sort.volumeLow' },
] as const;
