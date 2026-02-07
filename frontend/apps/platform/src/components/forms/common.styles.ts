import {
  flex,
  spacing,
  typography,
  colors,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column}
  ${flex.justify.center}
  ${spacing.gap.m};
  ${spacing.gap.xmd};
`;

export const title = css`
  ${flex.center}
  ${typography.fontSize['4xl']};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  color: ${colors.text.primary};
`;

export const form = css`
  ${flex.column}
  ${spacing.gap.m};
`;

export const continueSection = css`
  ${flex.column}
  ${spacing.gap.m};
  ${typography.fontSize.sm};
  ${typography.fontWeight.bold};
`;

export const continueTitle = css`
  ${flex.center}
  ${typography.fontSize.sm};
  ${typography.fontWeight.bold};
  ${typography.fontFamily.primary};
  ${typography.lineHeight.relaxed};
  color: ${colors.text.secondary};
`;

export const terms = css`
  ${flex.center}
  ${typography.fontSize.xs};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  color: ${colors.text.secondary};
`;

export const termsLink = css`
  ${typography.fontWeight.medium};
  color: ${colors.text.primary};
`;

export const StyledFormBoxFooter = css`
  display: flex;
  justify-content: center;
  padding: 16px;
  ${typography.fontSize.sm};
  ${typography.lineHeight.relaxed};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
`;

export const StyledFormBoxSpanText = css`
  color: ${colors.text.secondary};
`;

export const StyledFormBoxSpanBold = css`
  ${typography.fontWeight.bold};
  color: ${colors.text.primary};
`;
