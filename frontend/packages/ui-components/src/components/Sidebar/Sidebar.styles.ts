import { css } from '@emotion/react';
import { colors, typography, flex, size, spacing, overflow } from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.column};
  ${spacing.gap.m};
  ${size.height.full};
  ${spacing.padding.l};
  border-left: 1px solid ${colors.neutral.gray400};
  background-color: ${colors.neutral.white};
  box-sizing: border-box;
  ${size.width.full};
  flex-shrink: 0;
  ${overflow.x.hidden};
`;

export const header = css`
  ${flex.row};
  ${spacing.gap.xs};
  ${flex.align.center};
  ${flex.justify.center};
  ${size.width.full};
`;

export const title = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.base};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.relaxed};
  color: ${colors.neutral.black};
  ${spacing.margin.zero};
`;

export const iconWrapper = css`
  ${flex.base}
  ${flex.align.center};
  ${flex.justify.center};
  ${size.width.sm};
  ${size.height.sm};
`;

export const content = css`
  ${flex.column};
  ${spacing.gap.m};
  ${size.width.full};
  flex: 1;
  ${overflow.y.auto};
  ${overflow.x.hidden};
`;
