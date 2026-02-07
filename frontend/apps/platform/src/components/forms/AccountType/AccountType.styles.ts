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
`;

export const headings = css`
  ${flex.column}
  ${spacing.gap.m};
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
  ${typography.fontSize.xs};
  ${typography.fontWeight.normal};
  ${typography.fontFamily.primary};
  color: ${colors.text.secondary};
  ${typography.textAlign.center};
  ${typography.lineHeight.normal};
`;

export const optionsContainer = css`
  ${flex.column}
  ${flex.align.center} 
  ${spacing.gap.m};
`;