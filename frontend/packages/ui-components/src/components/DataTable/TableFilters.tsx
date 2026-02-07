/** @jsxImportSource @emotion/react */
'use client';

import type { MultiSelectOption } from '../MultiSelect';
import { Input } from '../Input';
import type { FiltersConfig, FilterFieldConfig } from './DataTable';
import * as styles from './TableFilters.styles';
import { FilterMultiSelect } from '../FilterMultiSelect';
import { FilterTabs } from '../FilterTabs';

export interface TableFiltersProps<TData = Record<string, unknown>> {
  /** Filters configuration */
  filtersConfig: FiltersConfig<TData>;
  
  /** Current filter values (for multiselect and tabs) */
  filterValues: Record<string, string[]>;
  
  /** Current search values (for search inputs) */
  searchValues: Record<string, string>;
  
  /** Filter options with counts */
  filterOptionsWithCounts: Record<string, MultiSelectOption[]>;
  
  /** Update filter callback (for multiselect and tabs) */
  updateFilter: (key: string) => (values: string[]) => void;
  
  /** Update search callback (for search inputs) */
  updateSearch: (key: string) => (value: string) => void;
  
  /** Clear all filters callback */
  clearAllFilters: () => void;
  
  /** Whether any filters are active */
  hasActiveFilters: boolean;
}

/**
 * TableFilters - Generic filter controls for tables
 * 
 * Displays multi-select filters grouped by position (start/center/end) with clear button.
 * 
 * @example
 * ```tsx
 * <TableFilters
 *   filtersConfig={filtersConfig}
 *   filterValues={filterValues}
 *   filterOptionsWithCounts={filterOptionsWithCounts}
 *   updateFilter={updateFilter}
 *   clearAllFilters={clearAllFilters}
 * />
 * ```
 */
export function TableFilters<TData = Record<string, unknown>>({
  filtersConfig,
  filterValues,
  searchValues,
  filterOptionsWithCounts,
  updateFilter,
  updateSearch,
  clearAllFilters,
  hasActiveFilters,
}: TableFiltersProps<TData>) {
  if (!filtersConfig || filtersConfig.fields.length === 0) {
    return null;
  }

  // Group filters by position
  const startFields = filtersConfig.fields.filter(filterField => !filterField.position || filterField.position === 'start');
  const centerFields = filtersConfig.fields.filter(filterField => filterField.position === 'center');
  const endFields = filtersConfig.fields.filter(filterField => filterField.position === 'end');

  // Helper to render a filter field
  const renderField = (field: FilterFieldConfig<TData>) => {
    if (field.type === 'search') {
      return (
        <Input
          key={field.key}
          type="text"
          value={searchValues[field.key] || ''}
          onChange={(event) => updateSearch(field.key)(event.target.value)}
          placeholder={field.placeholder}
          showSearchIcon
          variant="search"
          aria-label={field.placeholder || 'Search'}
        />
      );
    }

    if (field.type === 'tabs') {
      const options = field.options || [];
      return (
        <FilterTabs
          key={field.key}
          options={options}
          value={filterValues[field.key] || []}
          onChange={updateFilter(field.key)}
        />
      );
    }
    
    // Default: multiselect
    const options = filtersConfig.showCounts !== false
      ? filterOptionsWithCounts[field.key] || []
      : field.options || [];

    if (field.type === 'searchableMultiselect') {
      return (
        <FilterMultiSelect
          key={field.key}
          searchable
          searchPlaceholder="Search..."
          options={options}
          value={filterValues[field.key] || []}
          onChange={updateFilter(field.key)}
          placeholder={field.placeholder}
        />
      );
    }
    
    return (
      <FilterMultiSelect
        key={field.key}
        options={options}
        value={filterValues[field.key] || []}
        onChange={updateFilter(field.key)}
        placeholder={field.placeholder}
      />
    );
  };

  return (
    <div css={styles.filtersContainer}>
      {/* Left group (start position) */}
      {startFields.length > 0 && (
        <div css={styles.filtersGroup}>
          {startFields.map(renderField)}
        </div>

      )}
      {filtersConfig.showClearButton !== false && hasActiveFilters && (
        <button 
          css={styles.clearFiltersButton} 
          onClick={clearAllFilters}
          aria-label="Clear all filters"
        >
          {filtersConfig.clearButtonText || 'CLEAR FILTERS'}
        </button>
      )}
      
      {/* Center group */}
      {centerFields.length > 0 && (
        <div css={styles.filtersGroupCenter}>
          {centerFields.map(renderField)}
        </div>
      )}
      
      {/* Right group (end position + clear button) */}
      <div css={styles.filtersGroupEnd}>
        {endFields.map(renderField)}
      </div>
    </div>
  );
}

