import { css } from '@emotion/react';
import { breakpoints, flex, spacing, display, typography, colors, coloring, borders, size, overflow } from '@core3/ui-components/styleSystem';

export const mobilePolSection = css`
  ${flex.column}
  ${spacing.gap.m}

  ${breakpoints.lg} {
    ${display.none}
  }
`;

export const sectionHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.gap.xs}
  ${spacing.padding.x.l}
`;

export const sectionTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.relaxed}
  color: ${colors.neutral.black};
  ${spacing.margin.zero}
`;

export const gaugeChartWrapper = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${size.width.full}
  /* Add horizontal padding to center the gauge */
  ${spacing.padding.x.l}
  ${spacing.margin.y.m}
  ${overflow.visible}
`;

export const gaugeChartMobile = css`
  /* Make gauge bigger for mobile - use full width */
  ${size.width.full}
  ${size.maxWidth.full}
  ${flex.base}
  ${flex.justify.center}
  ${flex.align.center}
  ${spacing.padding.left.xxs}
  
  /* Scale up the gauge chart container - make it larger than default */
  & > div {
    ${size.width.full}
    ${size.maxWidth.full}
    transform: scale(1.2);
    transform-origin: center center;
  }
`;

export const ctaWrapper = css`
  ${spacing.margin.top.l}
  /* Padding is handled by ScoreCardCTA component itself */
`;

export const riskMetricsCard = css`
  /* Remove padding for mobile - let content extend to edges */
  ${spacing.padding.zero}
  ${spacing.padding.y.m}
  ${coloring.background.neutral.white}
  ${borders.radius['2xl']}
`;

export const dataCoverageCard = css`
  /* Remove padding for mobile - let content extend to edges */
  ${spacing.padding.zero}
  ${spacing.padding.y.m}
  ${coloring.background.neutral.white}
  ${borders.radius['2xl']}
`;

export const polDynamicCard = css`
  ${spacing.padding.m}
  ${coloring.background.neutral.white}
  ${borders.radius['2xl']}
  border: 1px solid ${colors.neutral.gray200};
`;

export const desktopOverviewSection = css`
  ${display.none}

  ${breakpoints.lg} {
    ${display.block}
  }
`;

export const mobileChartsAndDataSection = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.m}
  ${spacing.margin.top.m}
  ${borders.radius['2xl']}
  ${coloring.background.section}

  ${breakpoints.lg} {
    ${display.none}
  }
`;

export const mobileSidebarContent = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.margin.top.m}

  ${breakpoints.lg} {
    ${display.none}
  }
`;

