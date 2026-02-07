/**
 * DataListItem Component Styles
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
  typography,
  blur,
  colors,
  opacity,
} from '../../theme/styleSystem';

export const dataListItemLogo = css`
  ${position.relative}
  ${size.width.xsm}
  ${size.height.xsm}
  ${borders.radius.full}
  ${overflow.hidden}
  ${coloring.background.secondary}
`;

export const dataListItemLogoFallback = css`
  ${size.width.xsm}
  ${size.height.xsm}
  ${borders.radius.full}
  background: ${colors.neutral.gray700};
  ${opacity.medium}
  ${spacing.margin.right.xxs}
`;
/**
 * Base data list item container
 */
export const dataListItem = css`
  ${flex.row}
  ${spacing.gap.xxs}
  ${size.width.full}
  ${flex.align.center}
  ${spacing.padding.y.xxs}
  ${typography.lineHeight.tight}
`;

/**
 * Data list item checkmark icon
 */
export const dataListItemCheckmark = css`
  ${size.width.xsm}
  ${size.height.xsm}
  ${coloring.text.neutral.black}
`;

/**
 * Content container (label and value) - used for check type
 */
export const dataListItemContent = css`
  ${flex.row}
  ${spacing.gap.xxs}
  ${size.width.full}
  ${flex.one}
`;

/**
 * Label container with tooltip icon
 */
export const dataListItemLabelContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
`;

/**
 * Data list item label
 */
export const dataListItemLabel = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.secondary}
`;

/**
 * Data list item value
 */
export const dataListItemValue = ({
  contentAlign,
  checkPosition,
  valueWeight = 'normal',
}: {
  contentAlign?: 'left' | 'right';
  checkPosition?: 'left' | 'right';
  valueWeight?: 'normal' | 'medium' | 'bold';
}) => css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight[valueWeight]}
  ${coloring.text.primary}
  ${contentAlign === 'right' &&
  css`
    ${spacing.margin.left.auto}
    ${typography.textAlign.right}
  `}
  ${checkPosition === 'right' &&
  css`
    ${spacing.margin.left.zero}
  `}
`;

/**
 * Data list item tooltip icon
 */
export const dataListItemTooltipIcon = css`
  ${size.width.sm}
  ${size.height.sm}
`;

export const dataListItemImage = (error: boolean) => css`
  opacity: ${error ? 0 : 1};
`;

export const dataListItemCheckContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
  ${spacing.margin.left.auto}
`;

export const negativeCircleIcon = css`
  ${coloring.status.red}
`;

export const positiveCircleIcon = css`
  ${coloring.semantic.success}
`;

/**
 * Blurred value style
 */
export const dataListItemValueBlurred = css`
  ${blur.value.sm}
  user-select: none;
`;

export const bulletPoint = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.secondary}
`;