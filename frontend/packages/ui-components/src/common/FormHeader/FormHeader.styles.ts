import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  colors,
  size,
} from '../../theme/styleSystem';

export const header = css`
  ${flex.column}
  ${flex.align.center}
  ${spacing.gap.l}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${typography.fontFamily.primary}
  ${size.width.auto}
  color: ${colors.text.primary};
`;

export const title = css`
  ${typography.fontSize.custom(32)}
  ${typography.fontWeight.bold}
  ${typography.textAlign.center}
`;

export const subtitle = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.normal}
  color: ${colors.text.secondary};
  ${typography.textAlign.center}
`;
