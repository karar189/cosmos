/** @jsxImportSource @emotion/react */
'use client';

import { Table } from '@tanstack/react-table';
import { Icon } from '../Icon';
import { Select } from '../Select';
import type { SelectOption } from '../Select';
import * as styles from './TablePagination.styles';

export interface TablePaginationProps<TData> {
  /** TanStack Table instance */
  table: Table<TData>;
  
  /** Total number of rows in dataset */
  totalRows: number;
  
  /** Page size options to display */
  pageSizeOptions?: number[];
}

/**
 * Scroll to top of table when pagination changes
 * Scrolls to show filters/sorting buttons on mobile
 */
const scrollToTop = () => {
  const scrollContainer = document.querySelector('[data-scroll-container]');
  const mobileFilters = document.querySelector('[data-mobile-filters]');
  
  if (mobileFilters && scrollContainer) {
    // Scroll to mobile filters/sorting buttons
    const scrollContainerRect = scrollContainer.getBoundingClientRect();
    const filtersRect = mobileFilters.getBoundingClientRect();
    
    // Calculate relative position of filters within scroll container
    const relativeTop = filtersRect.top - scrollContainerRect.top + scrollContainer.scrollTop;
    
    // Offset: 100px to account for sticky header
    const targetPosition = relativeTop - 100;
    
    scrollContainer.scrollTo({ 
      top: Math.max(0, targetPosition), 
      behavior: 'smooth' 
    });
  } else if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/**
 * TablePagination - Generic pagination controls for tables
 * 
 * Displays page size selector, current range, and page navigation buttons.
 * Automatically scrolls to top when page changes.
 * 
 * @example
 * ```tsx
 * <TablePagination
 *   table={table}
 *   totalRows={data.length}
 *   pageSizeOptions={[5, 10, 20, 30, 50]}
 * />
 * ```
 */
export function TablePagination<TData>({
  table,
  totalRows,
  pageSizeOptions = [5, 10, 20, 30, 50],
}: TablePaginationProps<TData>) {
  const pagination = table.getState().pagination;
  const currentPage = pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  // Number of page buttons to display before/after ellipsis in pagination
  // e.g., [1] [2] [3] ... [10] shows 3 pages at start before ellipsis
  const VISIBLE_PAGE_BUTTONS = 3;

  // Transform page size options into Select options
  const selectOptions: SelectOption[] = [
    ...pageSizeOptions.map((size) => ({
      value: size,
      label: `${size} / page`,
    })),
    {
      value: totalRows,
      label: 'All',
    },
  ];

  const start = pagination.pageIndex * pagination.pageSize + 1;
  const end = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows);
  const rangeText = `${start}-${end} of ${totalRows.toLocaleString()}`;

  const renderPageButtons = () => {
    const pages: (number | { type: 'ellipsis'; goTo: number })[] = [];

    if (totalPages <= VISIBLE_PAGE_BUTTONS + 1) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= VISIBLE_PAGE_BUTTONS) {
      for (let i = 1; i <= VISIBLE_PAGE_BUTTONS; i++) {
        pages.push(i);
      }
      pages.push({ type: 'ellipsis', goTo: VISIBLE_PAGE_BUTTONS + 1 }, totalPages);
    } else if (currentPage >= totalPages - (VISIBLE_PAGE_BUTTONS - 1)) {
      pages.push(1, { type: 'ellipsis', goTo: totalPages - VISIBLE_PAGE_BUTTONS });
      for (let i = totalPages - (VISIBLE_PAGE_BUTTONS - 1); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(
        1,
        { type: 'ellipsis', goTo: currentPage - 1 },
        currentPage,
        { type: 'ellipsis', goTo: currentPage + 1 },
        totalPages
      );
    }

    return pages.map((page, index) => {
      if (typeof page === 'object' && page.type === 'ellipsis') {
        return (
          <button
            key={`ellipsis-${index}`}
            onClick={() => {
              table.setPageIndex(page.goTo - 1);
              scrollToTop();
            }}
            css={styles.paginationButton}
            aria-label={`Go to page ${page.goTo}`}
          >
            ...
          </button>
        );
      }

      const pageNumber = page as number;
      return (
        <button
          key={pageNumber}
          onClick={() => {
            table.setPageIndex(pageNumber - 1);
            scrollToTop();
          }}
          css={[styles.paginationButton, currentPage === pageNumber && styles.paginationButtonActive]}
          aria-label={`Page ${pageNumber}`}
          aria-current={currentPage === pageNumber ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      );
    });
  };

  return (
    <nav 
      css={styles.paginationContainer}
      role="navigation"
      aria-label="Table pagination"
    >
      <div css={styles.paginationButtonsContainer}>
        <button
          onClick={() => {
            table.previousPage();
            scrollToTop();
          }}
          disabled={!table.getCanPreviousPage()}
          css={[styles.paginationButton, !table.getCanPreviousPage() && styles.paginationButtonDisabled]}
          aria-label="Previous page"
        >
          <Icon name="chevron-left" />
        </button>

        {renderPageButtons()}

        <button
          onClick={() => {
            table.nextPage();
            scrollToTop();
          }}
          disabled={!table.getCanNextPage()}
          css={[styles.paginationButton, !table.getCanNextPage() && styles.paginationButtonDisabled]}
          aria-label="Next page"
        >
          <Icon name="chevron-right" />
        </button>
      </div>

      <div css={styles.paginationSelectContainer}>
        <Select
          options={selectOptions}
          value={pagination.pageSize}
          onChange={(value) => {
            table.setPageSize(Number(value));
          }}
          ariaLabel="Rows per page"
        />
        <span css={styles.paginationText} role="status" aria-live="polite" aria-atomic="true">
          {rangeText}
        </span>
      </div>
    </nav>
  );
}

