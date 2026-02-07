/**
 * ProjectSecurityTable Component Styles
 * Styles for the security audits table
 */

import {
  borders,
  coloring,
  flex,
  overflow,
  position,
  size,
  spacing,
  typography,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

/**
 * Auditor cell container
 */
export const auditorCell = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

/**
 * Auditor logo
 */
export const auditorLogo = css`
  ${position.relative}
  ${size.width.md}
  ${size.height.md}
  ${borders.radius.full}
  ${overflow.hidden}
  ${coloring.background.secondary}
`;

/**
 * Auditor logo placeholder when no image is available
 */
export const auditorLogoPlaceholder = css`
  ${flex.center}
  ${size.width.md}
  ${size.height.md}
  ${borders.radius.base}
  ${coloring.background.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.semibold}
  ${coloring.text.secondary}
  flex-shrink: 0;
`;

/**
 * Auditor name
 */
export const auditorName = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

/**
 * Date cell
 */
export const dateCell = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

/**
 * Present cell (for Audit Code Access)
 */
export const presentCell = css`
  ${flex.centerCross}
  ${spacing.gap.s}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
`;

/**
 * Check icon styling
 */
export const checkIcon = css`
  ${size.width.xsm}
  ${size.height.xsm}
  ${coloring.text.primary}
`;

export const negativeCircleIcon = css`
  ${coloring.status.red}
`;
/**
 * Warning icon styling
 */
export const warningIcon = css`
  ${coloring.status.orange}
`;

/**
 * N/A text
 */
export const naText = css`
  ${typography.fontSize.sm}
  ${coloring.text.secondary}
`;

/**
 * Fixed findings badge
 */
export const fixedFindingsBadge = css`
  ${flex.justifySelf.start}
`;
