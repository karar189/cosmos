import { borders, coloring, colors, flex, overflow, size, spacing, typography } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column}
  ${flex.centerMain}
  ${spacing.gap.s}
  ${size.width.full}
  ${size.height.full}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const labels = css`
  ${flex.centerCross}
  ${flex.justify.between}
`;

export const labelItem = css`
  ${flex.centerCross}
  ${spacing.gap.xs}
`;

export const labelDot = (isLeft: boolean) => css`
  ${size.width.xxs}
  ${size.height.xxs}
  ${borders.radius.full}
  background-color: ${isLeft ? colors.status.green : colors.status.red};
`;

export const values = css`
  ${flex.centerCross}
  ${flex.justify.between}
  ${typography.fontFamily.mono}
`;

export const labelValuePercentage = css`
  ${spacing.margin.left.xs}
  ${coloring.text.secondary}
`;

export const bar = css`
  ${flex.base}
  ${flex.justify.between}
  ${size.width.full}
  ${size.height.sm}
  ${borders.radius.md}
  ${overflow.hidden}
  ${spacing.margin.top.xs}
`;

export const barSegmentLeft = (percentage: number) => css`
  ${size.width.custom(
    `calc(${percentage}% - 2px)`
  )}
  background-color: ${colors.status.green};
`;

export const barSegmentRight = (percentage: number) => css`
  ${size.width.custom(
    `calc(${percentage}% - 2px)`
  )}
  background-color: ${colors.status.red};
`;