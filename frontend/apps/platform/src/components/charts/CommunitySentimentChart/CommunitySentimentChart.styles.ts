import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  borders,
  boxShadow,
  coloring,
  size,
} from '@core3/ui-components/styleSystem';

export const chartCard = css`
  ${flex.column}
  ${coloring.background.neutral.default}
  ${borders.radius.lg}
  ${spacing.padding.l}
  ${spacing.gap.m}
  ${boxShadow.sm}
  ${spacing.margin.bottom.l}
`;

export const header = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.margin.bottom.s}
`;

export const title = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize.base}
  ${typography.lineHeight.normal}
  ${coloring.text.primary}
`;

export const legend = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.l}
  ${spacing.margin.top.s}
`;

export const legendItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
`;

export const legendLabel = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.normal}
  ${typography.fontSize.sm}
  ${coloring.text.primary}
`;

export const legendDotNegative = css`
  ${size.width.sm}
  ${size.height.sm}
  ${borders.radius.full}
  ${coloring.background.chart.negative}
`;

export const legendDotPositive = css`
  ${size.width.sm}
  ${size.height.sm}
  ${borders.radius.full}
  ${coloring.background.chart.positive}
`;

