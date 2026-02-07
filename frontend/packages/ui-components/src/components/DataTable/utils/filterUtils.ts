// filterUtils.ts

import type { FilterFieldConfig, FiltersConfig } from '../DataTable';

/**
 * Gets a nested value from an object using dot notation path.
 * e.g., getNestedValue({ project: { category: 'DeFi' } }, 'project.category') => 'DeFi'
 *
 * @param obj - The object to extract value from
 * @param path - Dot-separated path string (e.g., 'project.category')
 * @returns The value at the path, or undefined if not found
 */
export function getNestedValue<T = unknown>(
  obj: Record<string, unknown>,
  path: string
): T | undefined {
  // If path doesn't contain dots, do simple lookup
  if (!path.includes('.')) {
    return obj[path] as T | undefined;
  }

  // Split path and traverse the object
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current as T | undefined;
}

/**
 * Extracts the filterable value(s) for a given item + filter field.
 * Supports:
 *  - direct field lookup (item[field.key])
 *  - nested path lookup using dot notation (e.g., 'project.category')
 *  - custom getValue(item)
 */
export function getItemFilterValue<TData>(
  item: TData,
  field: FilterFieldConfig<TData>
): string | string[] {
  if (field.getValue) {
    return field.getValue(item);
  }

  return getNestedValue<string | string[]>(item as Record<string, unknown>, field.key) ?? '';
}

/**
 * Returns all unique values for a filter field.
 * If field.options exist → uses them.
 * Otherwise: auto-detect values from dataset.
 *
 * @template TData
 * @param data - Full dataset
 * @param field - Filter field configuration
 * @returns Array of unique string values
 */
export function getUniqueValues<TData>(data: TData[], field: FilterFieldConfig<TData>): string[] {
  if (field.options) {
    return field.options.map((option) => option.value);
  }

  const set = new Set<string>();

  data.forEach((item) => {
    const value = getItemFilterValue(item, field);

    if (Array.isArray(value)) {
      value.forEach((value) => set.add(value));
    } else if (value) {
      set.add(value);
    }
  });

  return Array.from(set);
}

/**
 * Search within the filtered dataset.
 * - Runs AFTER filters, BEFORE pagination.
 * - Searches across all stringifiable fields.
 *
 * @template T
 * @param {T[]} data - Already-filtered dataset
 * @param {string} query - Search query
 * @returns {T[]} Search-filtered dataset
 */
export function applySearch<T>(data: T[], query: string): T[] {
  if (!query.trim()) return data;

  const lowerCaseQuery = query.toLowerCase();

  return data.filter((row) =>
    Object.values(row as Record<string, unknown>).some((value) => {
      if (value == null) return false;
      return String(value).toLowerCase().includes(lowerCaseQuery);
    })
  );
}

/**
 * Apply all active filters to the dataset.
 *
 * Rules:
 *  - Filters combine with AND
 *  - Per-field:
 *      - array values support matchMode: 'some' | 'every'
 *
 * @template TData
 * @param data - Raw dataset
 * @param filtersConfig - Filter config definition
 * @param filterValues - Object: { [key]: selectedValues[] }
 * @returns Filtered dataset
 */
export function applyFilters<TData>(
  data: TData[],
  filtersConfig: FiltersConfig<TData> | undefined,
  filterValues: Record<string, string[]>
): TData[] {
  if (!filtersConfig || filtersConfig.fields.length === 0) return data;

  return data.filter((item) => {
    return filtersConfig.fields.every((field) => {
      const selected = filterValues[field.key];

      // No filters → item passes
      if (!selected || selected.length === 0) return true;

      const itemValue = getItemFilterValue(item, field);

      if (Array.isArray(itemValue)) {
        const mode = field.matchMode || 'some';
        return mode === 'some'
          ? selected.some((value) => itemValue.includes(value))
          : selected.every((value) => itemValue.includes(value));
      }

      return selected.includes(itemValue as string);
    });
  });
}

/**
 * Calculates the available filter options WITH counts.
 * For each filter:
 *   - Temporarily ignore that filter
 *   - Apply all other filters
 *   - Count how many items match each possible value
 *
 * @template TData
 * @param data - Full dataset
 * @param filtersConfig - Filters definition
 * @param filterValues - Current active values
 * @returns A map: { [filterKey]: Array<{ value, label, count }> }
 */
export function calculateFilterCounts<TData>(
  data: TData[],
  filtersConfig: FiltersConfig<TData> | undefined,
  filterValues: Record<string, string[]>
): Record<string, { value: string; label: string; count: number }[]> {
  if (!filtersConfig) return {};

  const results: Record<string, { value: string; label: string; count: number }[]> = {};

  for (const field of filtersConfig.fields) {
    const uniqueValues = getUniqueValues(data, field);

    results[field.key] = uniqueValues.map((value) => {
      // Filter all data by other filters except this one
      const filteredExcludingCurrent = applyFilters(data, filtersConfig, {
        ...filterValues,
        [field.key]: [], // disable current filter
      });

      // Count how many match THIS specific value
      const count = filteredExcludingCurrent.filter((item) => {
        const currentValue = getItemFilterValue(item, field);

        return Array.isArray(currentValue) ? currentValue.includes(value) : currentValue === value;
      }).length;

      return {
        value,
        label: value,
        count,
      };
    });
  }

  return results;
}
