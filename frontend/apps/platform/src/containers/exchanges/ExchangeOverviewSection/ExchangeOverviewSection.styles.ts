import { css } from '@emotion/react';
import { breakpoints, flex, spacing, display, typography, colors, coloring, borders, size, overflow } from '@core3/ui-components/styleSystem';

export const mobileSecuritySection = css`
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
  ${spacing.padding.x.l}
  ${spacing.margin.y.m}
  ${overflow.visible}
`;

export const gaugeChartMobile = css`
  ${size.width.full}
  ${size.maxWidth.full}
  ${flex.base}
  ${flex.justify.center}
  ${flex.align.center}
  ${spacing.padding.left.xxs}
  
  & > div {
    ${size.width.full}
    ${size.maxWidth.full}
    transform: scale(1.2);
    transform-origin: center center;
  }
`;

export const dataCoverageCard = css`
  ${spacing.padding.zero}
  ${spacing.padding.y.m}
  ${coloring.background.neutral.white}
  ${borders.radius['2xl']}
`;

export const riskMetricsCard = css`
  ${spacing.padding.zero}
  ${spacing.padding.y.m}
  ${coloring.background.neutral.white}
  ${borders.radius['2xl']}
`;

export const securityDynamicCard = css`
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
