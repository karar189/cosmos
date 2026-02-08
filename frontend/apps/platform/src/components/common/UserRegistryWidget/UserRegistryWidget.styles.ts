/**
 * User Registry Widget styles (table + reliability popup)
 */
import {
  coloring,
  display,
  flex,
  overflow,
  size,
  spacing,
  typography,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const tableContainer = css`
  ${size.width.full}
  ${spacing.margin.bottom.m}
`;

export const walletCell = css`
  ${flex.column}
  ${spacing.gap.xxxs}
`;

/** Wallet cell when the wallet has been flagged (red highlight) */
export const walletCellFlagged = css`
  background-color: #fee2e2;
  ${spacing.padding.s}
  ${spacing.margin.xs}
  border-left: 3px solid #dc2626;
  border-radius: 4px;
`;

export const walletAddress = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  word-break: break-all;
`;

export const walletShort = css`
  ${typography.fontSize.xs}
  ${coloring.text.secondary}
`;

export const reliabilityButton = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
`;

export const modalContent = css`
  ${display.flex}
  ${flex.column}
  ${spacing.gap.l}
  max-height: 80vh;
  ${overflow.auto}
`;

export const emptyState = css`
  ${flex.column}
  ${flex.center}
  ${spacing.padding.xl}
  ${spacing.gap.m}
  ${coloring.text.secondary}
  ${typography.fontSize.base}
`;

export const flaggedPopupContent = css`
  ${display.flex}
  ${flex.column}
  ${spacing.gap.m}
`;
