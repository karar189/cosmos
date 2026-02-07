import {
  flex,
  spacing,
  typography,
  colors,
  size,
  coloring,
  cursor,
  opacity,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column}
  ${flex.justify.center}
  ${spacing.gap.l};
  ${size.maxWidth.sm}
  ${spacing.margin.zero}
  ${spacing.padding.y.l}
`;

export const headings = css`
  ${flex.column}
  ${spacing.gap.m};
`;

export const backButton = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs};
  ${typography.fontSize.sm};
  ${typography.fontWeight.normal};
  ${typography.fontFamily.primary};
  ${coloring.text.secondary};
  ${cursor.pointer}
  ${size.width.fit}
    
    &:hover {
    ${opacity.moderate}
  }
`;

export const backArrow = css`
  ${typography.fontSize.lg};
`;

export const tagWrapper = css`
  ${flex.center}
  ${typography.fontSize.xs};
`;

export const titleSection = css`
  ${flex.column}
  ${spacing.gap.xs};
`;

export const title = css`
  ${flex.center}
  ${typography.fontSize['3xl']};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  ${coloring.text.primary};
`;

export const subtitle = css`
  ${flex.center}
  ${typography.fontSize.sm};
  ${typography.fontWeight.normal};
  ${typography.fontFamily.primary};
  color: ${colors.text.secondary};
  ${typography.textAlign.center};
  ${typography.lineHeight.normal};
`;

export const optionsContainer = css`
  ${flex.column}
  ${spacing.gap.m};
  ${size.width.full}
  ${spacing.margin.top.s}
`;

export const continueButton = css`
  ${spacing.margin.top.xs};
  ${size.width.full}

  button {
    ${size.width.full}
  }
`;

export const footer = css`
  ${flex.center}
  ${typography.fontSize.sm};
  ${typography.fontWeight.normal};
  ${typography.fontFamily.primary};
  color: ${colors.text.secondary};
  ${spacing.margin.top.m};
`;

export const footerLink = css`
  ${coloring.text.primary};
  ${typography.textDecoration.underline}
  ${cursor.pointer}
    ${spacing.margin.left.xxs};

  &:hover {
    ${opacity.higher}
  }
`;
