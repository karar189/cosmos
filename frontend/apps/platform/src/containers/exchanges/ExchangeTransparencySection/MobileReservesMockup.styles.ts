import { css } from '@emotion/react';
import {
  blur,
  borders,
  coloring,
  colors,
  display,
  flex,
  opacity,
  pointerEvents,
  size,
  spacing,
  spacingValues,
  typography,
  userSelect,
} from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.column}
  ${spacing.gap.m}
  ${size.width.full}
  ${blur.value.custom('10px')}
  ${opacity.veryHigh}
  ${pointerEvents.none}
  ${userSelect.none}
`;

export const tableMockup = css`
  ${flex.column}
  ${spacing.gap.xxs}
  ${size.width.full}
`;

export const headerRow = css`
  ${display.flex}
  ${flex.row}
  ${flex.justify.between}
  ${spacing.padding.bottom.xs}
  border-bottom: ${spacingValues.hairline} solid ${colors.neutral.gray300};
`;

export const headerCell = css`
  ${typography.fontSize.xs}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
  flex: 1;
  
  &:first-of-type {
    flex: 2;
  }
  
  &:not(:first-of-type) {
    text-align: right;
  }
`;

export const dataRow = css`
  ${display.flex}
  ${flex.row}
  ${flex.justify.between}
  ${flex.align.center}
  ${spacing.padding.y.s}
`;

export const assetCell = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  flex: 2;
`;

export const assetDot = (color: string) => css`
  ${size.width.sm}
  ${size.height.sm}
  ${borders.radius.circle}
  background-color: ${color};
  flex-shrink: 0;
`;

export const mockupText = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  flex: 1;
  
  &:not(:first-child) {
    text-align: right;
  }
`;

export const distributionMockup = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.y.m}
  ${spacing.padding.x.m}
  ${borders.radius['2xl']}
  border: ${spacingValues.hairline} solid ${colors.neutral.gray300};
  ${coloring.background.neutral.white}
`;

export const distributionTitle = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${spacing.margin.zero}
`;

export const donutPlaceholder = css`
  ${display.flex}
  ${flex.center}
  ${spacing.padding.y.l}
`;

export const donutRing = css`
  ${size.width.custom('126px')}
  ${size.height.custom('126px')}
  ${borders.radius.circle}
  border: ${spacingValues.m} solid ${colors.neutral.gray200};
  border-top-color: ${colors.semantic.success};
  border-right-color: ${colors.chart.financial};
  border-bottom-color: ${colors.chart.operational};
  border-left-color: ${colors.accent.green};
`;

export const legend = css`
  ${flex.column}
  ${spacing.gap.xxs}
  ${size.width.full}
`;

export const legendItem = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${size.height.custom('28px')}
`;

export const legendLeft = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
`;

export const legendDot = (color: string) => css`
  ${size.width.s}
  ${size.height.s}
  ${borders.radius.circle}
  background-color: ${color};
`;

export const legendLabel = css`
  ${typography.fontSize.sm}
  ${coloring.text.primary}
`;

export const legendValue = css`
  ${typography.fontFamily.mono}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
  ${coloring.text.primary}
`;
