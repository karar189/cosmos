import { css } from '@emotion/react';
import { flex, spacing, typography, coloring, size } from '@core3/ui-components/styleSystem';

export const badgeContainer = css`
  ${flex.row}
  ${spacing.gap.s}
  flex-wrap: wrap;
`;

// Standalone Cookie Flags section (rendered outside DataList)
export const cookieFlagsSection = css`
  ${flex.column}
  ${flex.align.start}
  ${spacing.gap.xs}
  ${spacing.padding.y.xxs}
`;

export const cookieFlagsLabel = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.secondary}
`;

export const dividerContainer = css`
  ${spacing.margin.top.m}
  ${spacing.margin.bottom.m}
`;

export const bottomListContainer = css`
  ${flex.column}
  ${flex.align.start}
  ${spacing.gap.sm}
  ${spacing.margin.bottom.zero}
  list-style: none;
  padding: 0;
`;

export const dividerListItem = css`
  ${spacing.margin.top.m}
  ${spacing.margin.bottom.m}
`;

export const penetrationTestCoverage = css`
  ${spacing.margin.top.xxs}
`;

export const penetrationTestCoverageText = css`
  ${typography.fontSize.xs}
  ${coloring.text.secondary}
`;

export const mainListContainer = css`
  ${flex.column}
  ${flex.align.start}
  ${spacing.gap.m}
`;

export const penetrationRow = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
`;

export const penetrationLabel = css`
  ${typography.fontSize.xs}
  ${coloring.text.secondary}
`;

export const certificationsRow = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.l}
  flex-wrap: wrap;
`;

export const certificationItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
`;

export const certificationLabel = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
`;

export const certificationCheckmark = css`
  ${size.width.xsm}
  ${size.height.xsm}
  ${coloring.text.neutral.black}
`;

export const certificationTooltipIcon = css`
  ${size.width.sm}
  ${size.height.sm}
`;

