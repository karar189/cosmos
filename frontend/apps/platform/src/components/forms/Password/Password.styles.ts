import {
  colors,
  flex,
  opacity,
  spacing,
  typography,
  coloring,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column}
  ${flex.one}
  ${spacing.gap.xmd}
`;

export const headers = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${spacing.gap.l}
  ${flex.column}
  ${flex.center}
`;

export const title = css`
  ${typography.fontSize['3xl']};
  ${typography.fontFamily.primary}
  color: ${colors.text.primary}
`;

export const subtitle = css`
  ${typography.fontSize.sm}
  ${typography.fontFamily.primary}
  color: ${colors.text.secondary}
`;

export const boldText = css`
  ${typography.fontWeight.semibold}
  color: ${colors.text.primary}
`;

export const form = css`
  ${flex.column}
  ${spacing.gap.l}

  input::placeholder {
    ${coloring.background.transparent}
    ${opacity.moderate}
  }

  input {
    ${coloring.background.transparent}
  }
`;

export const newPasswordForm = css`
  ${flex.column}
  ${spacing.gap.m}

  input::placeholder {
    ${coloring.background.transparent}
    ${opacity.moderate}
  }

  input {
    ${coloring.background.transparent}
  } 
`;
