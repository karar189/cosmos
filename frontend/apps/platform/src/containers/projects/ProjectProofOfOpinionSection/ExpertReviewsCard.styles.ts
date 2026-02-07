import { flex, size, spacing, typography } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const headerContent = css`
  ${flex.row}
  ${spacing.gap.s}
  ${flex.align.center}
  ${flex.one}
  ${flex.justify.between}
`;

export const headerBadge = css`
  ${typography.fontWeight.medium}
  ${size.minWidth.md}
  ${size.height.md}
  ${spacing.padding.zero}
  ${typography.lineHeight.relaxed}
`;

