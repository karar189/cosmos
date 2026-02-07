import {
  flex,
  typography,
  colors,
  spacing,
  borders,
  position,
  cursor,
  size,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column}
  ${flex.one}
`;

export const header = css`
  ${flex.row}
  ${flex.align.center}
  ${position.absolute}
  ${position.top.zero}
  ${position.left.zero}
  ${spacing.gap.s};
  ${spacing.padding.l}
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  color: ${colors.text.secondary};
  background: ${colors.background.paper};
  ${borders.none};
  ${cursor.pointer};
  ${size.width.auto};
`;

export const backButton = css`
  ${spacing.padding.xxs};
  color: ${colors.text.primary};
`;

export const backText = css`
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  color: ${colors.text.primary};
`;

export const content = css`
  ${flex.column}
  ${spacing.gap.xmd};
`;

export const title = css`
  ${flex.center}
  ${typography.fontSize['3xl']};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  color: ${colors.text.primary};
`;

export const subtitle = css`
  ${flex.center}
  ${typography.fontSize.sm};
  ${typography.fontWeight.normal};
  ${typography.fontFamily.primary};
  color: ${colors.text.secondary};
  ${typography.textAlign.center};
  ${typography.lineHeight.relaxed};

  strong {
    ${typography.fontWeight.semibold};
    color: ${colors.text.primary};
  }
`;

export const form = css`
  ${flex.column}
  ${spacing.gap.xl};
`;

export const otpContainer = css`
  ${flex.row}
  ${flex.justify.center}
  ${spacing.gap.custom(12)};
`;

export const otpInput = css`
  ${size.width.custom('56px')}
  ${size.height.custom('50px')}
  ${typography.fontSize['2xl']};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  ${typography.textAlign.center};
  ${borders.all}
  ${borders.radius.xl};
  background: ${colors.background.paper};
  color: ${colors.text.primary};
`;

export const submitButton = css`
  ${size.width.full};
  ${spacing.margin.top.s};
`;

export const resendContainer = css`
  ${flex.center}
  ${typography.fontSize.sm};
  ${typography.fontFamily.primary};
  ${spacing.margin.top.s};
`;

export const timerText = css`
  ${typography.fontWeight.normal};
  ${typography.fontFamily.mono};
  color: ${colors.text.secondary};
`;

export const resendButton = css`
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  color: ${colors.text.primary};
  background: ${colors.background.paper};
  ${borders.none};
  ${cursor.pointer};
  ${typography.textDecoration.underline};
  ${typography.fontFamily.mono};
`;

export const footer = css`
  ${flex.center}
  ${typography.fontSize.sm};
  ${typography.fontFamily.primary};
  ${spacing.margin.top.auto};
`;

export const footerText = css`
  ${typography.fontWeight.medium};
  color: ${colors.text.secondary};
`;

export const footerLink = css`
  ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  ${cursor.pointer};
`;

export const boldText = css`
  ${typography.fontWeight.semibold};
  ${typography.fontFamily.primary};
  color: ${colors.text.primary};
  background: ${colors.background.paper};
  ${borders.none};
  ${cursor.pointer};
  ${typography.textDecoration.none};
  ${typography.fontFamily.primary};
`;

export const headings = css`
  ${flex.column}
  ${spacing.gap.l};
`;

export const errorMessage = css`
  ${typography.fontSize.sm};
  ${typography.fontWeight.normal};
  ${typography.fontFamily.primary};
  color: ${colors.semantic.errorLight};
  ${typography.textAlign.center};
  ${typography.lineHeight.relaxed};
`;
