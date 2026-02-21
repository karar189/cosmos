import type { FiltersConfig } from '@core3/ui-components';
import { ProjectListItem } from '@/types/api/projectsStatistic';

interface FiltersConfigOptions {
  t: (key: string, defaultValue: string) => string;
}

export function createProjectRegulatoryFiltersConfig({
  t,
}: FiltersConfigOptions): FiltersConfig<ProjectListItem> {
  return {
    fields: [
      {
        key: 'project.category',
        type: 'searchableMultiselect',
        placeholder: t('regulatory.filters.placeholders.category', 'Category'),
      },
      {
        key: 'chains',
        type: 'searchableMultiselect',
        placeholder: t('regulatory.filters.placeholders.chains', 'Chains'),
        getValue: (item) => item.chains.map((chain) => chain.name),
        matchMode: 'some',
      },
      {
        key: 'compliance',
        type: 'searchableMultiselect',
        placeholder: t('regulatory.filters.placeholders.complianceSignals', 'Compliance Signals'),
        getValue: (item) => item.compliance,
        matchMode: 'some',
      },
    ],
    showClearButton: true,
    showCounts: true,
    clearButtonText: t('regulatory.filters.clearButton', 'Clear'),
  };
}
