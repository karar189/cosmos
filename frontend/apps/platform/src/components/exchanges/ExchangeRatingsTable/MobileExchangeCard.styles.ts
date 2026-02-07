import {
  borders,
  coloring,
  colors,
  flex,
  overflow,
  size,
  sizeValues,
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
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:last-child {
    border-bottom: none;
  }
`;

export const mobileCardHeader = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  margin-top: -${spacingValues.s};
`;

export const mobileCardNumber = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
  min-width: ${spacingValues.custom(18)};
`;

export const mobileCardExchangeInfo = css`
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

export const mobileCardName = css`
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

  svg {
    width: ${sizeValues.sm};
    height: ${sizeValues.sm};
    ${display.flex}
  }
  
  /* Ensure tooltip wrapper aligns properly */
  > div {
    ${display.flex}
    ${flex.align.center}
  }
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

export const mobileCardStars = css`
  ${display.flex}
  ${flex.justify.center}
  margin-right: -${spacingValues.xmd};

  svg {
    width: ${sizeValues.sm};
    height: ${sizeValues.sm};
  }
`;

export const mobileCTACard = css`
  ${display.flex}
  ${flex.column}
  background: ${colors.star.unfilled};
  ${borders.radius['3xl']}
  ${spacing.padding.y.m}
  ${spacing.padding.x.m}
`;

export const mobileCTAContent = css`
  ${display.flex}
  ${flex.column}
  ${flex.center}
  ${flex.align.center}
  ${spacing.gap.m}
  ${size.width.full}
`;

export const mobileCTATitle = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  text-align: center;
`;
