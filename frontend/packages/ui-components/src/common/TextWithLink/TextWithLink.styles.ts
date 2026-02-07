import { css } from '@emotion/react';
import { colors, cursor, flex, typography } from '../../theme/styleSystem';

export const container = css`
  ${flex.center}
  ${flex.justify.center}
`;

export const text = css`
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  color: ${colors.text.secondary};
`;

export const link = css`
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.mono};
  color: ${colors.text.primary};
  ${typography.textDecoration.none};
  ${cursor.pointer};
`;
