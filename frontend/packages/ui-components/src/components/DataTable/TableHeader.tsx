/** @jsxImportSource @emotion/react */
'use client';

import { flexRender, HeaderGroup, Header } from '@tanstack/react-table';
import { motion } from 'motion/react';
import { Tooltip } from '@mui/material';
import * as styles from './TableHeader.styles';
import { cellAlignPadding } from './DataTable.styles';
import ArrowDownIcon from '../Icon/icons/ArrowDownIcon';
import { TooltipIcon } from '../Tooltip';
import { IconName } from '../Icon/iconRegistry';

interface CustomColumnMeta {
  align?: 'left' | 'center' | 'right';
  tooltip?: {
    text: string;
    icon?: string;
  };
  width?: string | number;
}

export interface TableHeaderProps<TData> {
  /** Header groups from TanStack Table */
  headerGroups: HeaderGroup<TData>[];
}

/**
 * Helper function to determine the aria-sort attribute value based on sort state
 */
function getAriaSortValue(
  isSorted: false | 'asc' | 'desc',
  canSort: boolean
): 'ascending' | 'descending' | 'none' | undefined {
  if (isSorted) {
    return isSorted === 'asc' ? 'ascending' : 'descending';
  }
  return canSort ? 'none' : undefined;
}

/**
 * Helper function to generate the aria-label for sortable column headers
 */
function getAriaLabel(
  canSort: boolean,
  headerText: string,
  isSorted: false | 'asc' | 'desc'
): string | undefined {
  if (!canSort) {
    return undefined;
  }

  const currentState = isSorted === 'asc' 
    ? 'sorted ascending' 
    : isSorted === 'desc' 
      ? 'sorted descending' 
      : 'not sorted';

  const nextAction = isSorted === 'asc'
    ? 'sort descending'
    : isSorted === 'desc'
      ? 'clear sort'
      : 'sort ascending';

  return `${headerText}, ${currentState}, click to ${nextAction}`;
}

/**
 * TableHeader - Generic table header component with sorting support
 * 
 * Renders sortable column headers with full ARIA accessibility.
 * Extracted from DataTable for reusability.
 * 
 * @example
 * ```tsx
 * <TableHeader
 *   headerGroups={table.getHeaderGroups()}
 * />
 * ```
 */
export function TableHeader<TData>({
  headerGroups,
}: TableHeaderProps<TData>) {
  return (
    <thead css={styles.thead}>
      {headerGroups.map((headerGroup: HeaderGroup<TData>) => (
        <tr key={headerGroup.id} css={styles.headerRow} role="row">
          {headerGroup.headers.map((header: Header<TData, unknown>, colIndex: number) => {
            const canSort = header.column.getCanSort();
            const isSorted = header.column.getIsSorted();
            const headerText = typeof header.column.columnDef.header === 'string' 
              ? header.column.columnDef.header 
              : header.column.id;
            const meta = header.column.columnDef.meta as CustomColumnMeta | undefined;
            const tooltip = meta?.tooltip;
            const align = meta?.align;
            const width = meta?.width;
            const isLastColumn = colIndex === headerGroup.headers.length - 1;
            
            // Convert width to CSS value
            const widthStyle = width 
              ? typeof width === 'number' 
                ? `${width}px` 
                : width
              : undefined;
            
            return (
              <th 
                key={header.id} 
                css={[styles.th, cellAlignPadding(align, isLastColumn)]}
                style={widthStyle ? { width: widthStyle } : undefined}
                scope="col"
                aria-colindex={colIndex + 1}
                aria-sort={getAriaSortValue(isSorted, canSort)}
              >
                {header.isPlaceholder ? null : (
                  <div
                    css={[
                      styles.headerContent,
                      align && styles.alignStyles[align],
                      (header.column.columnDef.meta as { className?: string })?.className ?? null
                    ]}
                    onClick={header.column.getToggleSortingHandler()}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        header.column.getToggleSortingHandler()?.(event);
                      }
                    }}
                    role={canSort ? 'button' : undefined}
                    tabIndex={canSort ? 0 : undefined}
                    aria-label={getAriaLabel(canSort, headerText, isSorted)}
                    style={{
                      cursor: canSort ? 'pointer' : 'default',
                    }}
                  >
                    <span>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                    {tooltip && (
                      <Tooltip title={tooltip.text} arrow>
                        <div 
                          css={styles.tooltipWrapper}
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) => event.stopPropagation()}
                        >
                          <TooltipIcon icon={tooltip.icon as IconName | undefined} />
                        </div>
                      </Tooltip>
                    )}
                    {canSort && (
                      <motion.div
                        css={styles.sortIndicator(!!isSorted)}
                        animate={{ 
                          rotate: isSorted === 'desc' ? 180 : 0 
                        }}
                        transition={{ 
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        aria-hidden="true"
                      >
                        <ArrowDownIcon />
                      </motion.div>
                    )}
                  </div>
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
