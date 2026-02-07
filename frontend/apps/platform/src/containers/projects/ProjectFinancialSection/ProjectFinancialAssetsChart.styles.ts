import { borders, flex, size, spacing, typography } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.row}
  ${spacing.gap.m}
`;

export const dataPointsContainer = (hasToken: boolean = false) => css`
  list-style: none;
  ${flex.one}
  ${spacing.padding.zero}
  ${spacing.margin.zero}
  ${flex.column}
  ${spacing.gap.xxs}
  ${hasToken && size.maxWidth.custom('200px')}
`;

export const dataPoint = css`
  ${spacing.padding.y.xxs}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
`;

export const dataPointCircle = (color: string) => css`
  background-color: ${color};
  ${size.width.s}
  ${size.height.s}
  ${borders.radius.full}
`;

export const dataPointValue = css`
  ${typography.textAlign.right}
  ${typography.fontFamily.mono}
  ${spacing.margin.left.auto}
`;
