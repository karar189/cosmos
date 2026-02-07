import { css } from '@emotion/react';
import { typography, spacing, colors, flex } from '../../theme/styleSystem';

export const StyledFormBoxFooter = css`
  ${flex.centerMain}
  ${spacing.padding.m}
  ${typography.fontSize.sm};
  ${typography.lineHeight.relaxed};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  gap: ${spacing.gap.m};
`;

export const StyledFormBoxSpanText = css`
  color: ${colors.text.secondary};
`;

export const StyledFormBoxSpanBold = css`
  ${typography.fontWeight.bold};
  ${typography.fontFamily.mono};
  color: ${colors.text.primary};
`;
