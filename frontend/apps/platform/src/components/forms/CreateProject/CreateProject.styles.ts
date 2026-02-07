import {
  flex,
  spacing,
  typography,
  colors,
  size,
  borders,
  coloring,
  cursor,
  transform,
  opacity,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column}
  ${flex.justify.center}
  ${spacing.gap.m};
  ${size.maxWidth.sm};
  ${spacing.margin.zero}
`;

export const headings = css`
  ${flex.column}
  ${spacing.gap.m};
`;

export const stepIndicator = css`
  ${flex.row}
  ${flex.justify.center}
  ${spacing.gap.l};
  ${typography.fontSize.xs};
  ${typography.fontWeight.normal};
  ${typography.fontFamily.primary};
`;

export const activeStep = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs};
  ${colors.text.primary};
`;

export const inactiveStep = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs};
  ${colors.text.secondary};
  ${opacity.half}
`;

export const stepNumber = css`
  ${flex.center}
  ${size.width.custom('20px')}
  ${size.height.custom('20px')}
  ${borders.radius.circle}
  ${coloring.background.secondary};
  ${typography.fontSize.xs};
  ${typography.fontWeight.medium};
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
  ${typography.textAlign.center};
  ${typography.lineHeight.tight};
  ${typography.fontSize['3xl']};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  ${colors.text.primary};
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

export const form = css`
  ${flex.column}
  ${spacing.gap.s};
  ${size.width.full}
  ${spacing.margin.top.s}
`;

export const fieldsContainer = css`
  ${flex.column}
  ${spacing.gap.s};
  ${size.width.full}

  input::placeholder {
    ${coloring.background.transparent}
    ${opacity.moderate}
  }

  input {
    ${coloring.background.transparent}
  }
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
  ${typography.fontSize.xs};
  ${typography.fontWeight.normal};
  ${typography.fontFamily.primary};
  ${colors.text.secondary};
  ${spacing.margin.top.m};
`;

export const footerLink = css`
  ${colors.text.primary};
  ${typography.textDecoration.underline}
  ${cursor.pointer}
    
    &:hover {
    ${opacity.higher}
  }
`;

export const stepperWrapper = css`
  ${flex.center}
  ${size.width.full}
  ${size.maxWidth.sm}
  ${spacing.margin.zero}
  ${transform.scale(0.85)}
`;
