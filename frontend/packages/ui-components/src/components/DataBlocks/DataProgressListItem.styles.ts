/**
 * DataProgressListItem Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import {
  borders,
  coloring,
  flex,
  overflow,
  position,
  size,
  spacing,
  spacingValues,
  transform,
  transitions,
  typography,
} from '../../theme/styleSystem';

/**
 * Data progress list item container
 */
export const dataProgressListItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
  ${size.width.full}
  ${position.relative}
  ${spacing.padding.y.xs}
  ${spacing.padding.x.s}
`;

/**
 * Label container with tooltip icon
 */
export const dataProgressListItemLabelContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
  ${position.relative}
  ${flex.one}
  ${size.maxWidth.custom('90%')}
`;

/**
 * Data progress list item label
 */
export const dataProgressListItemLabel = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.primary}
  ${typography.textOverflow.ellipsis}
  ${typography.whiteSpace.nowrap}
  ${overflow.hidden}
`;

/**
 * Progress bar fill
 */
export const dataProgressListItemProgressFill = css`
  ${position.absolute}
  ${position.left.zero}
  ${position.top.half}
  ${transform.translate.y('-50%')}
  ${size.height.calc(`100% - ${spacingValues.xxs}`)}
  ${borders.radius.md}
  ${coloring.background.secondary}
  ${transitions.all}
  ${position.zIndex.base}
`;

/**
 * Data progress list item value
 */
export const dataProgressListItemValue = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.primary}
  ${typography.textAlign.right}
  ${spacing.margin.left.auto}
`;

/**
 * Data progress list item tooltip icon
 */
export const dataProgressListItemTooltipIcon = css`
  ${size.width.sm}
  ${size.height.sm}
`;
