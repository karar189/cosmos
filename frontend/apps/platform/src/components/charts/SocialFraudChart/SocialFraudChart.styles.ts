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
  ${flex.column}
  ${spacing.gap.s}
`;

export const titleContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const title = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize.base}
  ${typography.lineHeight.normal}
  ${coloring.text.primary}
`;

export const infoIcon = css`
  ${size.width.xsm}
  ${size.height.xsm}
  ${coloring.text.chart.operational}
  cursor: pointer;
  
  &:hover {
    ${coloring.text.primary}
  }
`;

export const chartWrapper = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.margin.top.m}
`;

