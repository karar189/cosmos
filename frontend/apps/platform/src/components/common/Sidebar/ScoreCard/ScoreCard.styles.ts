import {
  borders,
  coloring,
  colors,
  flex,
  size,
  spacing,
  typography,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column};
  ${flex.align.center};
  ${spacing.gap.l};
  ${size.width.full};
`;

export const gaugeSection = css`
  ${size.width.full};
  ${flex.column};
  ${flex.align.center};
`;

export const metricsSection = css`
  ${flex.column};
  ${spacing.gap.m};
  ${size.width.full};
`;

export const dataCoverageWrapper = css`
  ${size.width.full};
  ${flex.base};
  ${flex.justify.center};
`;

export const riskMetricsWrapper = css`
  ${flex.column};
  ${spacing.gap.xs};
  ${size.width.full};
`;

export const chartSection = css`
  ${size.width.full}
  ${spacing.padding.x.sm}
  ${spacing.padding.top.sm}
  ${borders.radius['2xl']}
  ${borders.custom({ color: colors.neutral.gray400 })}
`;

export const chartHeaderContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${flex.justify.between}
  ${spacing.margin.bottom.s}
`;

export const chartHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const chartHeaderIcon = css`
  ${size.width.xsm}
  ${size.height.xsm}
`;

export const chartHeaderTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;
