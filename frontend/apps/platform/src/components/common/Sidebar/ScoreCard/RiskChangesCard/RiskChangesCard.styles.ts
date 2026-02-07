import { css } from '@emotion/react';
import { colors, typography, flex, spacing, size, opacity } from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.column};
  ${spacing.gap.m};
  ${size.width.full};
  ${flex.align.start};
`;

export const itemsList = css`
  ${flex.column};
  ${spacing.gap.xs};
  ${size.width.full};
`;

export const item = css`
  ${flex.column};
  ${spacing.gap.xs}
  ${size.width.full};
`;

export const itemDate = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.xs};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.tight};
  color: ${colors.neutral.gray600};
  ${opacity.medium};
`;

export const itemDescription = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.normal};
  color: ${colors.neutral.black};
  white-space: pre-wrap;
  ${typography.wordBreak.breakWord};
`;

export const separator = css`
  ${size.width.full};
  height: 1px;
  background-color: ${colors.neutral.gray400};
  ${opacity.veryLow};
  ${spacing.margin.top.xs};
`;
