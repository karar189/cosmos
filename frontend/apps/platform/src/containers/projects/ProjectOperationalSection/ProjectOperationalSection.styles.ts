import { flex, size, spacing, typography, breakpoints, display, borders, coloring, colors } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const githubActivityCard = ({ isTokenProject }: { isTokenProject: boolean }) => css`
  ${flex.column}
  ${flex.align.start}
  ${flex.justify.between}
  ${spacing.gap.m}

  ${breakpoints.lg} {
    ${isTokenProject ? flex.row : flex.column}
    ${spacing.gap.l}
  }
`;

export const heatMap = ({ isTokenProject }: { isTokenProject: boolean }) => css`
  ${size.width.full}

  ${breakpoints.lg} {
    ${isTokenProject ? size.width.custom('40%') : size.width.full}
  }
`;

export const badge = css`
  ${size.maxWidth.custom('100px')}
`;

export const heatMapLegend = css`
  ${flex.self.end}
  
  ${breakpoints.lg} {
    ${spacing.margin.bottom.negative.m}
  }
`;

export const certificationsList = css`
  ${size.width.auto}
  ${flex.self.start}
  ${typography.whiteSpace.nowrap}
`;

export const desktopLayout = css`
  ${display.none}

  ${breakpoints.lg} {
    ${display.block}
  }
`;

export const mobileLayout = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.m}
  ${spacing.margin.top.l}
  ${borders.radius['2xl']}
  ${coloring.background.section}

  ${breakpoints.lg} {
    ${display.none}
  }
`;

export const mobileHeader = css`
  ${flex.column}
  ${spacing.gap.s}
  ${spacing.padding.left.zero}
  ${spacing.padding.right.l}
`;

export const mobileHeaderLeft = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const mobileHeaderIcon = css`
  ${size.width.lg}
  ${size.height.lg}
  ${coloring.text.primary}
`;

export const mobileHeaderTitle = css`
  ${typography.fontSize.lg}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${spacing.margin.zero}
`;

export const scoreBadge = css`
  ${spacing.padding.x.s}
  ${spacing.padding.y.xxxs}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  background-color: ${colors.yellow.background};
  color: ${colors.text.primary};
  ${borders.radius.base}
`;

export const mobileHeaderDescription = css`
  ${typography.fontSize.sm}
  ${coloring.text.secondary}
  ${spacing.margin.zero}
`;
