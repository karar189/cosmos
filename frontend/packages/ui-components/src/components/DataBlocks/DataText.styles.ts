import { css } from '@emotion/react';
import { coloring, flex, spacing, typography } from '../../theme/styleSystem';

export const dataText = ({ positive, negative, disabled, mono }: { positive: boolean; negative: boolean; disabled: boolean; mono: boolean }) => css`
  ${typography.fontFamily.primary}
  ${typography.fontSize['2xl']}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.primary}
  ${typography.textTransform.capitalize}
  ${positive && coloring.status.green}
  ${negative && coloring.status.red}
  ${disabled && coloring.text.secondary}
  ${mono && typography.fontFamily.mono}
  ${mono && typography.fontWeight.semibold}
`;

export const dataTextLabel = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.relaxed}
  ${coloring.text.secondary}
`;

export const dataTextContent = css`
  ${flex.column}
  ${spacing.gap.xxs}
`;
