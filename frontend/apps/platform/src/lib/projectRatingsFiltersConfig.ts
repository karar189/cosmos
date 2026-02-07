import type { FiltersConfig } from '@core3/ui-components';
import { ProjectListItem } from '@/types/api/projectsStatistic';

export const MARKET_CAP_OPTIONS = [
  { value: '<$1M', label: '<$1M' },
  { value: '$1M-$10M', label: '$1M-$10M' },
  { value: '$10M-$100M', label: '$10M-$100M' },
  { value: '$100M-$500M', label: '$100M-$500M' },
  { value: '$500M-$1B', label: '$500M-$1B' },
  { value: '>$1B', label: '>$1B' },
];

export function getMarketCapRange(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  if (value < 1_000_000) return '<$1M';
  if (value < 10_000_000) return '$1M-$10M';
  if (value < 100_000_000) return '$10M-$100M';
  if (value < 500_000_000) return '$100M-$500M';
  if (value < 1_000_000_000) return '$500M-$1B';
  return '>$1B';
}

interface FiltersConfigOptions {
  t: (key: string, defaultValue: string) => string;
}

export function createProjectRatingsFiltersConfig({
  t,
}: FiltersConfigOptions): FiltersConfig<ProjectListItem> {
  return {
    fields: [
      {
        key: 'project.category',
        type: 'searchableMultiselect',
        placeholder: t('projects.filters.placeholders.category', ''),
      },
      {
        key: 'marketCap',
        type: 'multiselect',
        placeholder: t('projects.filters.placeholders.marketCap', ''),
        options: MARKET_CAP_OPTIONS,
        getValue: (item) => getMarketCapRange(item.marketData?.market_cap),
      },
      {
        key: 'chains',
        type: 'searchableMultiselect',
        placeholder: t('projects.filters.placeholders.chains', ''),
        getValue: (item) => item.chains.map((chain) => chain.name),
        matchMode: 'some',
      },
      {
        key: 'compliance',
        type: 'searchableMultiselect',
        placeholder: t('projects.filters.placeholders.complianceSignals', ''),
        getValue: (item) => item.compliance,
        matchMode: 'some',
      },
    ],
    showClearButton: true,
    showCounts: true,
    clearButtonText: t('projects.filters.clearButton', ''),
  };
}

