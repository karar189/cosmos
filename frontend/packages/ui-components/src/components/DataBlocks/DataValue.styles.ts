/**
 * DataValue Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { coloring, flex, size, spacing, typography } from '../../theme/styleSystem';

/**
 * Data value container
 */
export const dataValue = css`
  ${flex.column}
  ${spacing.gap.xxs}
`;

/**
 * Label container with tooltip icon
 */
export const dataValueLabelContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
`;

/**
 * Data value label
 */
export const dataValueLabel = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.relaxed}
  ${coloring.text.secondary}
`;

/**
 * Data value tooltip icon
 */
export const dataValueTooltipIcon = css`
  ${size.width.sm}
  ${size.height.sm}
`;

/**
 * Data value content container (value and subvalue)
 */
export const dataValueContent = css`
  ${flex.row}
  ${flex.align.end}
  ${spacing.gap.s}
  ${size.height.lg}
`;

/**
 * Data value main value
 */
export const dataValueValue = ({ disabled }: { disabled?: boolean }) => css`
  ${typography.fontFamily.mono}
  ${typography.fontSize['2xl']}
  ${typography.fontWeight.bold}
  ${typography.lineHeight.tight}
  ${disabled ? coloring.text.secondary : coloring.text.primary}
`;

/**
 * Data value subvalue
 */
export const dataValueSubvalue = ({
  type,
  positive,
  negative,
  disabled,
}: {
  type: 'primary' | 'secondary';
  positive: boolean;
  negative: boolean;
  disabled?: boolean;
}) => {
  let color = coloring.text.primary;
  switch (type) {
    case 'primary':
      color = coloring.text.primary;
      break;
    case 'secondary':
      color = coloring.text.secondary;
      break;
  }
  if (positive) {
    color = coloring.status.green;
  } else if (negative) {
    color = coloring.status.red;
  }
  if (disabled) {
    color = coloring.text.secondary;
  }

  return css`
    ${type === 'primary' ? typography.fontSize.sm : typography.fontSize.xs}
    ${typography.fontWeight.medium}
  ${type === 'primary' ? typography.lineHeight.normal : typography.lineHeight.tight}
  ${color}
  `;
};

/**
 * Data value subvalues container
 */
export const dataValueSubvalues = css`
  ${flex.column}
  ${flex.align.start}
  ${spacing.gap.xxxs}
`;
