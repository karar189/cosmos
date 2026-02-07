/** @jsxImportSource @emotion/react */
'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  PaginationState,
  Row,
} from '@tanstack/react-table';
import { motion } from 'motion/react';
import { Icon } from '../Icon';
import type { MultiSelectOption } from '../MultiSelect';
import * as styles from './DataTable.styles';
import { Core3Button } from '../Button';
import { TableHeader } from './TableHeader';
import { TablePagination } from './TablePagination';
import { TableFilters } from './TableFilters';
import { IdCell, TextCell, IconTextCell, NumberCell, BadgeCell, ProgressCell } from './TableCells';
import type { NumberFormat } from './TableCells';
import { applyFilters, applySearch, calculateFilterCounts } from './utils/filterUtils';

const MotionTr = motion.tr;

/**
 * Custom column metadata interface
 */
interface CustomColumnMeta {
  align?: 'left' | 'center' | 'right';
  tooltip?: {
    text: string;
    icon?: string;
  };
  width?: string | number;
}

/**
 * Column configuration for declarative API
 */
export interface ColumnConfig<TData = Record<string, unknown>, TValue = unknown> {
  /** Data key to access */
  key: keyof TData | string;

  /** Column header name */
  name: string;

  /** Cell type to render */
  type: 'id' | 'text' | 'iconText' | 'number' | 'badge' | 'progress' | 'custom';

  /** Enable sorting (default: true) */
  enableSorting?: boolean;

  /** Custom accessor function for nested or computed values */
  accessorFn?: (row: TData) => TValue;

  /** Custom sorting function */
  sortingFn?: (rowA: Row<TData>, rowB: Row<TData>, columnId: string) => number;

  /** Text/header alignment */
  align?: 'left' | 'center' | 'right';

  /** Optional tooltip configuration for column header */
  tooltip?: {
    /** Tooltip text to display */
    text: string;
    /** Optional icon name (defaults to 'info') */
    icon?: string;
  };

  /** For 'text' type: font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';

  /** For 'number' type: format style */
  numberFormat?: NumberFormat;

  /** For 'iconText' type: secondary text key */
  secondaryKey?: keyof TData;

  /** For 'iconText' type: icon/logo image URL key */
  iconKey?: keyof TData;

  /** For 'custom' type: custom render function */
  render?: (value: TValue, row: TData, meta: unknown) => React.ReactNode;

  /** Fixed width for the column (e.g., '100px', '15%', 200) */
  width?: string | number;
}

/**
 * Filter field configuration
 */
export interface FilterFieldConfig<TData = Record<string, unknown>> {
  /** Unique key for this filter */
  key: string;

  /** Filter type */
  type: 'multiselect' | 'search' | 'searchableMultiselect' | 'tabs';

  /** Placeholder text */
  placeholder: string;

  /** Optional: Custom options (if not provided, will auto-detect from data) */
  options?: MultiSelectOption[];

  /** Optional: Custom function to get value from data item (for complex filtering like market cap ranges) */
  getValue?: (item: TData) => string | string[];

  /** Optional: Match mode for array values - 'some' (default) or 'every' */
  matchMode?: 'some' | 'every';

  /** Optional: Flex position of the filter field (default: 'start') */
  position?: 'start' | 'center' | 'end';
}

/**
 * Filters configuration
 */
export interface FiltersConfig<TData = Record<string, unknown>> {
  /** Array of filter field configurations */
  fields: FilterFieldConfig<TData>[];

  /** Optional: Show clear all filters button (default: true) */
  showClearButton?: boolean;

  /** Optional: Show count badges on filter options (default: true) */
  showCounts?: boolean;

  /** Optional: Clear button text */
  clearButtonText?: string;
}

/**
 * Scrollable table configuration
 */
export interface ScrollableConfig {
  /** Maximum number of visible rows before scrolling (used to calculate height) */
  maxVisibleRows?: number;
  /** Estimated row height in pixels (default: 56) */
  rowHeight?: number;
  /** Header height in pixels (default: 48) */
  headerHeight?: number;
  /** Or specify max height directly (overrides maxVisibleRows calculation) */
  maxHeight?: number | string;
}

export interface DataTableProps<TData> {
  /** Data array to display in the table (full dataset, filtering/sorting/pagination handled internally) */
  data: TData[];

  /** Column definitions for the table (TanStack format - for advanced use) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns?: ColumnDef<TData, any>[];

  /** Column configuration for declarative API */
  columnsConfig?: ColumnConfig<TData>[];

  /** Optional: Filters configuration */
  filters?: FiltersConfig<TData>;

  /** Optional: Enable pagination (default: true) */
  enablePagination?: boolean;

  /** Optional: Pagination config */
  pagination?: {
    initialPageSize: number;
    pageSizeOptions: number[];
  };

  /** Optional: Make table body scrollable with sticky header */
  scrollable?: ScrollableConfig;

  /** Optional: Custom row to insert at specific positions */
  customRowRenderer?: (props: {
    row: Row<TData>;
    index: number;
    totalRows: number;
  }) => React.ReactNode;

  /** Optional: Mobile card renderer - renders cards on mobile instead of table */
  mobileCardRenderer?: (props: {
    item: TData;
    index: number;
    totalItems: number;
  }) => React.ReactNode;

  /** Optional: disable the built-in mobile cards */
  disableDefaultMobileCards?: boolean;

  /** Optional: External sorting state control */
  sorting?: SortingState;
  /** Optional: External sorting state change handler */
  onSortingChange?: (sorting: SortingState) => void;

  /** Optional: Label for screen readers */
  ariaLabel?: string;

  /** Optional: Caption/summary for the table */
  caption?: string;

  /** Optional: Empty state configuration */
  emptyState?: {
    title?: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
  };

  /** Optional: Loading state - pass this to cell components via column definitions */
  loading?: boolean;
}

/**
 * Convert column configuration to TanStack column definitions
 */
function convertToColumnDef<TData, TValue = unknown>(
  config: ColumnConfig<TData, TValue>
): ColumnDef<TData, TValue> {
  // Build column definition based on whether we use accessorFn or accessorKey
  const baseColumn = (
    config.accessorFn
      ? {
          id: config.key as string,
          accessorFn: config.accessorFn,
          header: config.name,
          enableSorting: config.enableSorting !== false,
        }
      : {
          accessorKey: config.key as string,
          header: config.name,
          enableSorting: config.enableSorting !== false,
        }
  ) as ColumnDef<TData, TValue>;

  // Add custom sorting function if provided
  if (config.sortingFn) {
    baseColumn.sortingFn = config.sortingFn;
  }

  // Add meta data (alignment, tooltip, width, etc.)
  baseColumn.meta = {
    ...(config.align && { align: config.align }),
    ...(config.tooltip && { tooltip: config.tooltip }),
    ...(config.width && { width: config.width }),
  };

  // Set column size for TanStack Table
  if (config.width) {
    const widthValue = typeof config.width === 'number' ? config.width : parseInt(config.width, 10);
    if (!isNaN(widthValue)) {
      baseColumn.size = widthValue;
      baseColumn.minSize = widthValue;
      baseColumn.maxSize = widthValue;
    }
  }

  // Generate cell renderer based on type
  baseColumn.cell = (info) => {
    const tableMeta = info.table.options.meta as { loading?: boolean } | undefined;
    const loading = tableMeta?.loading;

    switch (config.type) {
      case 'id':
        return <IdCell value={Number(info.row.id) + 1} loading={loading} />;

      case 'text':
        return (
          <TextCell
            value={info.getValue() as string | number}
            align={config.align}
            weight={config.weight}
            loading={loading}
          />
        );

      case 'iconText': {
        const iconValue = config.iconKey ? info.row.original[config.iconKey] : undefined;
        return (
          <IconTextCell
            primary={info.getValue() as string}
            secondary={
              config.secondaryKey ? String(info.row.original[config.secondaryKey]) : undefined
            }
            icon={iconValue ? String(iconValue) : undefined}
            loading={loading}
          />
        );
      }

      case 'number':
        return (
          <NumberCell
            value={info.getValue() as string | number | undefined}
            format={config.numberFormat}
            align={config.align}
            loading={loading}
          />
        );

      case 'badge':
        return (
          <BadgeCell
            value={info.getValue() as { score: number; grade: string }}
            loading={loading}
          />
        );

      case 'progress':
        return <ProgressCell value={info.getValue() as string | number} loading={loading} />;

      case 'custom': {
        const content = config.render?.(info.getValue(), info.row.original, info.table.options.meta);
        if (config.align) {
          return (
            <div css={[styles.customCellContainer, styles.customCellAlignStyles[config.align]]}>
              {content}
            </div>
          );
        }
        return content;
      }

      default:
        return info.getValue();
    }
  };

  return baseColumn;
}

/**
 * DataTable - A generic, reusable table component with built-in sorting
 *
 * Simple and focused: renders data with sortable columns.
 * Filters and pagination are handled by parent/sibling components.
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={data}
 *   columnsConfig={[
 *     { key: 'id', name: '#', type: 'id', enableSorting: false },
 *     { key: 'name', name: 'Name', type: 'text' }
 *   ]}
 * />
 * ```
 */
export function DataTable<TData>({
  data,
  columns: columnsProp,
  columnsConfig,
  filters: filtersConfig,
  customRowRenderer,
  mobileCardRenderer,
  disableDefaultMobileCards = false,
  sorting: externalSorting,
  onSortingChange: externalOnSortingChange,
  ariaLabel,
  caption,
  emptyState,
  enablePagination = true,
  pagination: paginationConfig = {
    initialPageSize: 10,
    pageSizeOptions: [5, 10, 20, 30, 50],
  },
  scrollable,
  loading = false,
}: DataTableProps<TData>) {
  // Convert columnsConfig to TanStack columns if provided, otherwise use columns prop
  const columns = React.useMemo(() => {
    if (columnsConfig) {
      return columnsConfig.map((config) => convertToColumnDef(config));
    }
    if (columnsProp) {
      return columnsProp;
    }
    throw new Error('DataTable: Either columns or columnsConfig must be provided');
  }, [columnsConfig, columnsProp]);
  
  // State management - use external sorting if provided, otherwise internal
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const sorting = externalSorting !== undefined ? externalSorting : internalSorting;
  const setSorting = externalOnSortingChange !== undefined ? externalOnSortingChange : setInternalSorting;
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: paginationConfig.initialPageSize,
  });
  const [sortAnnouncement, setSortAnnouncement] = React.useState('');

  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [data.length]);

  // Filter state: { filterKey: selectedValues[] } for multiselect and tabs filters
  const [filterValues, setFilterValues] = React.useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    filtersConfig?.fields.forEach((field) => {
      if (field.type === 'multiselect' || field.type === 'searchableMultiselect' || field.type === 'tabs') {
        initial[field.key] = [];
      }
    });
    return initial;
  });

  // Search state: { filterKey: searchQuery } for search filters
  const [searchValues, setSearchValues] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    filtersConfig?.fields.forEach((field) => {
      if (field.type === 'search') {
        initial[field.key] = '';
      }
    });
    return initial;
  });

  // Helper to update a specific multiselect filter
  const updateFilter = (key: string) => (values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [key]: values }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Helper to update a specific search filter
  const updateSearch = (key: string) => (value: string) => {
    setSearchValues((prev) => ({ ...prev, [key]: value }));
    // Reset to first page when search changes
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Helper to clear all filters
  const clearAllFilters = () => {
    const clearedFilters: Record<string, string[]> = {};
    const clearedSearch: Record<string, string> = {};
    filtersConfig?.fields.forEach((field) => {
      if (field.type === 'multiselect' || field.type === 'searchableMultiselect' || field.type === 'tabs') {
        clearedFilters[field.key] = [];
      } else if (field.type === 'search') {
        clearedSearch[field.key] = '';
      }
    });
    setFilterValues(clearedFilters);
    setSearchValues(clearedSearch);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Filter data (happens before sorting and pagination)
  const filteredData = useMemo(() => {
    // First apply multiselect filters
    let result = applyFilters(data, filtersConfig, filterValues);

    // Then apply search filters
    if (filtersConfig) {
      filtersConfig.fields.forEach((field) => {
        if (field.type === 'search') {
          const query = searchValues[field.key];
          if (query && query.trim()) {
            if (field.getValue) {
              // Custom search on specific field(s)
              const lowerCaseQuery = query.toLowerCase();
              result = result.filter((item) => {
                const value = field.getValue!(item);
                if (value == null) return false;
                if (Array.isArray(value)) {
                  return value.some((specificValue) =>
                    String(specificValue).toLowerCase().includes(lowerCaseQuery)
                  );
                }
                return String(value).toLowerCase().includes(lowerCaseQuery);
              });
            } else {
              // Global search across all fields using applySearch utility
              result = applySearch(result, query);
            }
          }
        }
      });

    }

    return result;
  }, [data, filtersConfig, filterValues, searchValues]);

  // Generate filter options with counts (only for multiselect filters)
  const filterOptionsWithCounts = useMemo(
    () => calculateFilterCounts(data, filtersConfig, filterValues),
    [data, filtersConfig, filterValues]
  );

  // Check if any filters are active
  const hasActiveFilters =
    Object.values(filterValues).some((vals) => vals.length > 0) ||
    Object.values(searchValues).some((val) => val.trim().length > 0);

  const table = useReactTable({
    data: filteredData, // Use filtered data, not raw data
    columns,
    state: {
      sorting,
      pagination,
    },
    meta: {
      loading: loading, // Store loading state in table meta for cell access
    },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        const newSorting = updater(sorting);
        setSorting(newSorting);
        
        // Announce sorting changes to screen readers
        if (newSorting.length > 0) {
          const { id, desc } = newSorting[0];
          setSortAnnouncement(`Table sorted by ${id}, ${desc ? 'descending' : 'ascending'} order`);
        } else {
          setSortAnnouncement('Table sorting cleared');
        }
      } else {
        setSorting(updater);
      }
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    manualPagination: false, // DataTable handles pagination internally
    autoResetPageIndex: false, // Don't reset to page 1 when sorting
  });

  const totalRows = filteredData.length; // Total rows after filtering
  const hasData = totalRows > 0;

  // Get sorted and paginated data for mobile cards
  const useMobileCards = mobileCardRenderer !== undefined || (!disableDefaultMobileCards && columnsConfig);

  const mobileRows = React.useMemo(() => {
    if (!useMobileCards) return [];
    return table.getRowModel().rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMobileCards, table, sorting, pagination, filteredData]);

  const renderDefaultMobileCard = ({ row }: { row: Row<TData> }) => {
    const cells = row.getVisibleCells();
    const [first, ...rest] = cells;
    const headerGroups = table.getHeaderGroups();

    const renderHeader = first
      ? (first.column.columnDef.cell
          ? flexRender(first.column.columnDef.cell, first.getContext())
          : String(first.getValue() ?? ''))
      : null;

    return (
      <div css={styles.mobileCard} key={row.id}>
        {renderHeader && <div css={styles.mobileCardHeader}>{renderHeader}</div>}
        <div css={styles.mobileCardBody}>
          {rest.map((cell) => {
            // Find the matching header from header groups
            const header = headerGroups
              .flatMap((group) => group.headers)
              .find((h) => h.column.id === cell.column.id);

            const headerContent = header
              ? flexRender(header.column.columnDef.header, header.getContext())
              : typeof cell.column.columnDef.header === 'string'
                ? cell.column.columnDef.header
                : cell.column.id;

            return (
              <div key={cell.id} css={styles.mobileCardRow}>
                <span css={styles.mobileCardLabel}>{headerContent}</span>
                <span css={styles.mobileCardValue}>
                  {cell.column.columnDef.cell
                    ? flexRender(cell.column.columnDef.cell, cell.getContext())
                    : String(cell.getValue() ?? '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div css={styles.tableContainer} data-table-container>
      {/* Filters */}
      {filtersConfig && (
        <TableFilters
          filtersConfig={filtersConfig}
          filterValues={filterValues}
          searchValues={searchValues}
          filterOptionsWithCounts={filterOptionsWithCounts}
          updateFilter={updateFilter}
          updateSearch={updateSearch}
          clearAllFilters={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* Mobile Card View */}
      {useMobileCards && (
        <div css={styles.mobileCardList}>
          {!hasData ? (
            <div css={styles.noResultsContainer} role="status" aria-live="polite">
              <Icon name="no-results" css={styles.noResultsIcon} aria-hidden="true" />
              <div css={styles.noResultsContent}>
                <h2 css={styles.noResultsTitle}>{emptyState?.title || 'Nothing found'}</h2>
                <p css={styles.noResultsDescription}>{emptyState?.description || 'Try to adjust or clear filters'}</p>
              </div>
              {(emptyState?.buttonText || emptyState?.onButtonClick) && (
                <div css={styles.noResultsButton}>
                  <Core3Button
                    size="small"
                    variant="secondary"
                    onClick={emptyState?.onButtonClick || (() => {})}
                    fullWidth={false}
                  >
                    {emptyState?.buttonText || 'Clear filters'}
                  </Core3Button>
                </div>
              )}
            </div>
          ) : mobileRows.length === 0 ? null : (
            mobileRows.map((row, index) =>
              mobileCardRenderer
                ? mobileCardRenderer({
                    item: row.original,
                    index: pagination.pageIndex * pagination.pageSize + index,
                    totalItems: totalRows,
                  })
                : renderDefaultMobileCard({ row })
            )
          )}
        </div>
      )}

      {/* Live region for announcing sort changes to screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {sortAnnouncement}
      </div>

      <div css={useMobileCards && styles.desktopTableWrapper}>
        <div css={scrollable ? styles.scrollableWrapper(scrollable) : undefined}>
        <table
          css={[styles.table, scrollable && styles.scrollableTable]}
          role="table"
          aria-label={ariaLabel || 'Data table'}
          aria-rowcount={totalRows + 1}
          aria-colcount={columns.length}
          aria-describedby={caption ? 'table-caption' : undefined}
        >
          {caption && (
            <caption id="table-caption" style={{ captionSide: 'top', padding: '0.5rem' }}>
              {caption}
            </caption>
          )}
          {hasData && <TableHeader headerGroups={table.getHeaderGroups()} />}
          <tbody>
            {!hasData ? (
              <tr role="row">
                <td
                  colSpan={columns.length}
                  css={styles.td}
                  role="cell"
                  style={{ textAlign: 'center', padding: '2rem' }}
                >
                  <div
                    css={styles.noResultsContainer}
                    role="status"
                    aria-live="polite"
                    aria-label={emptyState?.title || 'No data available'}
                  >
                    <Icon name="no-results" css={styles.noResultsIcon} aria-hidden="true" />

                    <div css={styles.noResultsContent}>
                      <h2 css={styles.noResultsTitle} id="empty-state-title">
                        {emptyState?.title || 'Nothing found'}
                      </h2>
                      <p css={styles.noResultsDescription} id="empty-state-description">
                        {emptyState?.description || 'Try to adjust or clear filters'}
                      </p>
                    </div>

                    {(emptyState?.buttonText || emptyState?.onButtonClick) && (
                      <div css={styles.noResultsButton}>
                        <Core3Button
                          size="small"
                          variant="secondary"
                          onClick={emptyState?.onButtonClick || (() => {})}
                          fullWidth={false}
                          aria-label={`${emptyState?.buttonText || 'Clear filters'}, ${emptyState?.description || 'clears current filters to see all results'}`}
                        >
                          {emptyState?.buttonText || 'Clear filters'}
                        </Core3Button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {table.getRowModel().rows.map((row, rowIndex: number) => {
                  // Check if a custom row will be rendered after this row
                  const hasCustomRowAfter =
                    customRowRenderer?.({
                      row,
                      index: rowIndex,
                      totalRows: table.getRowModel().rows.length,
                    }) !== null;

                  return (
                    <React.Fragment key={row.id}>
                      <MotionTr
                        css={styles.row(hasCustomRowAfter)}
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          opacity: { duration: 0.15 },
                          layout: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                        }}
                        role="row"
                        aria-rowindex={rowIndex + 2}
                      >
                        {row.getVisibleCells().map((cell, cellIndex: number) => {
                          const cellMeta = cell.column.columnDef.meta as CustomColumnMeta | undefined;
                          const cellWidth = cellMeta?.width;
                          const widthStyle = cellWidth 
                            ? typeof cellWidth === 'number' 
                              ? `${cellWidth}px` 
                              : cellWidth
                            : undefined;
                          
                          return (
                            <td 
                              key={cell.id} 
                              css={styles.td} 
                              style={widthStyle ? { width: widthStyle } : undefined}
                              role="cell" 
                              aria-colindex={cellIndex + 1}
                            >
                              {cell.column.columnDef.cell
                                ? flexRender(cell.column.columnDef.cell, cell.getContext())
                                : null}
                            </td>
                          );
                        })}
                      </MotionTr>

                      {customRowRenderer?.({
                        row,
                        index: rowIndex,
                        totalRows: table.getRowModel().rows.length,
                      })}
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
      </div>

      {/* Pagination - always at the bottom */}
      {enablePagination && hasData && (
        <TablePagination
          table={table}
          totalRows={totalRows}
          pageSizeOptions={paginationConfig.pageSizeOptions}
        />
      )}
    </div>
  );
}
