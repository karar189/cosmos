import { css } from '@emotion/react';
import { borders, flex, overflow, position, size, spacing, spacingValues, colors as themeColors, typography } from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.base};
  ${flex.align.center};
  ${spacing.gap.s};
  ${size.width.auto};
`;

export const track = css`
  background-color: ${themeColors.background.card};
  ${borders.radius.lg};
  ${overflow.hidden};
  width: 80px;
  ${position.relative}
`;

export const fill = css`
  ${size.height.full};
  ${borders.radius.lg};
  transition: width 0.3s ease;
`;

export const sizes = {
  small: css`
    height: ${spacingValues.xxs};
  `,
  medium: css`
    height: ${spacingValues.xs};
  `,
  large: css`
    height: ${spacingValues.s};
  `,
};

export const colors = {
  default: css`
    background-color: ${themeColors.text.secondary};
  `,
  green: css`
    background-color: ${themeColors.status.green};
  `,
  yellow: css`
    background-color: ${themeColors.accent.yellow};
  `,
  orange: css`
    background-color: ${themeColors.semantic.alert};
  `,
  red: css`
    background-color: ${themeColors.status.red};
  `,
};

export const label = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.normal};
  color: ${themeColors.text.primary};
  white-space: nowrap;
  ${size.minWidth.xl};
  ${typography.textAlign.right};
`;

export const labelMax = css`
  color: ${themeColors.text.variants.secondary.op65};
`;
