import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  borders,
  boxShadow,
  coloring,
  size,
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
  ${coloring.text.secondary}
  ${opacity.half}
  cursor: pointer;
  
  &:hover {
    ${coloring.text.primary}
    ${opacity.full}
  }
`;

export const content = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.start}
  ${spacing.gap.l}
  ${flex.wrap.wrap}
`;

export const chartWrapper = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  flex-shrink: 0;
`;

export const legend = css`
  ${flex.column}
  ${spacing.gap.s}
  ${flex.justify.center}
  flex: 1;
  ${size.minWidth.custom('200px')}
`;

export const legendItem = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${size.width.full}
`;

export const legendLabelGroup = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  flex-shrink: 0;
`;

export const legendDot = css`
  ${size.width.sm}
  ${size.height.sm}
  ${borders.radius.full}
  flex-shrink: 0;
`;

export const legendLabel = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
  ${typography.lineHeight.normal}
  ${coloring.text.primary}
  flex-shrink: 0;
`;

export const legendValue = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.semibold}
  ${typography.fontSize.sm}
  ${typography.lineHeight.normal}
  ${coloring.text.primary}
  flex-shrink: 0;
`;

