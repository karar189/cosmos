import {
  borders,
  colors,
  cursor,
  flex,
  spacing,
  typography,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column};
  ${spacing.gap.xl}
  color: ${colors.text.secondary};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.relaxed};
  ${typography.fontSize.sm};
  ${typography.textAlign.center};
`;

export const heading = css`
  ${flex.column};
  ${spacing.gap.l}
`;

export const subtitle = css`
  ${typography.fontSize.sm};
  ${typography.fontWeight.normal};
  ${typography.lineHeight.relaxed};
  ${typography.textAlign.center};
  color: ${colors.text.primary};
`;

export const resendLink = css`
  color: ${colors.text.primary};
  ${cursor.pointer};
  ${typography.fontFamily.mono};
  ${typography.textDecoration.none};
  ${borders.none};
  background: ${colors.background.paper};
`;

export const bold = css`
  ${typography.fontWeight.medium};
  color: ${colors.text.primary};
`;

export const authContainer = css`
  ${flex.column};
  ${typography.textAlign.center};
  ${spacing.gap.xmd};
`;

export const authContent = css`
  ${flex.column};
  ${spacing.gap.xl};
`;

export const errorMessage = css`
  ${typography.fontSize.sm};
  ${typography.fontWeight.normal};
  ${typography.fontFamily.primary};
  color: ${colors.semantic.errorLight};
  ${typography.textAlign.center};
  ${typography.lineHeight.relaxed};
`;
