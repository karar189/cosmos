import { colors, flex, size, spacing, typography } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column}
  ${spacing.gap.xs}
`;

export const totalValue = css`
  ${typography.fontFamily.mono}
  ${typography.fontWeight.semibold}
  ${typography.fontSize['4xl']}
  color: ${colors.text.primary};
`;

export const deltaRow = css`
  ${flex.centerCross}
  ${spacing.gap.s}
`;

export const deltaIcon = css`
  ${size.width.xxs}
  ${size.height.xxs}
  color: ${colors.status.red};
  transform: rotate(180deg);
`;

export const deltaText = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  color: ${colors.badge.gray.text};
`;

