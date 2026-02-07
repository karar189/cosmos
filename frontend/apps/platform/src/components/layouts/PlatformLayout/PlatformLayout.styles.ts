import { css } from '@emotion/react';
import {
  flex,
  spacing,
  colors,
  size,
  borders,
  typography,
  spacingValues,
  sizeNumberValues,
} from '@core3/ui-components/styleSystem';

export const loadingContainer = css`
  ${flex.center}
  ${flex.column}
  ${spacing.gap.l}
  ${spacing.padding.xxxxl}
  ${size.minHeight.custom(`calc(100vh - ${sizeNumberValues.header}px)`)}
  ${size.width.full}
`;

export const loadingSpinner = css`
  width: ${spacingValues.xxl};
  height: ${spacingValues.xxl};
  border: ${spacingValues.xxs} solid ${colors.neutral.gray200};
  border-top-color: ${colors.primary.main};
  ${borders.radius.full}
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const loadingText = css`
  color: ${colors.neutral.white};
  ${typography.fontSize.base}
`;

export const errorContainer = css`
  ${flex.center}
  ${flex.column}
  ${spacing.gap.l}
  ${spacing.padding.xxxxl}
  ${size.minHeight.custom('60vh')}
  ${size.width.full}
  ${typography.textAlign.center}
`;

export const errorTitle = css`
  ${typography.fontSize.xl}
  ${typography.fontWeight.semibold}
  color: ${colors.text.primary};
  ${spacing.margin.zero}
`;

export const errorMessage = css`
  color: ${colors.text.secondary};
  ${size.maxWidth.custom('500px')}
`;

export const errorActions = css`
  ${flex.row}
  ${spacing.gap.m}
  ${spacing.margin.top.l}
`;

