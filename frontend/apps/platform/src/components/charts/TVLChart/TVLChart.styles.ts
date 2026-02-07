import { css } from '@emotion/react';
import {
  flex,
  spacing,
  colors,
  typography,
  borders,
  boxShadow,
  coloring,
  opacity,
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
  ${flex.column}
  ${spacing.gap.s}
`;

export const titleRow = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${flex.wrap.wrap}
  ${spacing.gap.m}
`;

export const title = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize.base}
  ${typography.lineHeight.normal}
  ${coloring.text.primary}
`;

export const lastUpdate = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
  ${typography.lineHeight.normal}
  ${coloring.text.secondary}
  ${opacity.moderate}
`;

export const statusContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${flex.wrap.wrap}
  ${spacing.margin.top.s}
`;

export const statusBadge = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.normal}
  ${typography.fontSize.xs}
  ${typography.lineHeight.tight}
  ${coloring.text.chart.operational}
  /* Using chart.operational color with 15% opacity for background */
  background-color: ${colors.chart.operational}26;
  ${borders.radius['2xl']}
  ${spacing.padding.x.sm}
  ${spacing.padding.y.xs}
`;

