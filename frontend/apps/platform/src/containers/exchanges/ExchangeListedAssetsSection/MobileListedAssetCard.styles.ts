import {
  borders,
  coloring,
  colors,
  flex,
  overflow,
  size,
  spacing,
  spacingValues,
  typography,
  display,
  position,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const mobileCard = css`
  ${display.flex}
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.bottom.l}
  border-bottom: ${spacingValues.hairline} solid ${colors.neutral.gray200};

  &:last-child {
    border-bottom: none;
  }
`;

export const mobileCardHeader = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.s}
  margin-top: -${spacingValues.s};
`;

export const mobileCardAssetInfo = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  flex: 1;
`;

export const mobileCardLogo = css`
  ${position.relative}
  ${overflow.hidden}
  ${size.width.custom('30px')}
  ${size.height.custom('30px')}
  ${borders.radius.circle}
  ${coloring.background.primary}
  flex-shrink: 0;
`;

export const mobileCardNames = css`
  ${display.flex}
  ${flex.column}
  ${spacing.gap.xxxs}
`;

export const mobileCardTicker = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  ${typography.lineHeight.relaxed}
`;

export const mobileCardMetrics = css`
  ${display.flex}
  ${flex.column}
  ${spacing.gap.s}
`;

export const mobileCardMetric = css`
  ${display.flex}
  ${flex.row}
  ${flex.justify.between}
  ${flex.align.center}
  ${spacing.gap.s}
  width: 100%;
`;

export const mobileCardMetricLabel = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${typography.fontSize.sm}
  ${coloring.text.secondary}
`;

export const mobileCardMetricValue = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${flex.justify.end}
  text-align: right;
  margin-left: auto;
`;
