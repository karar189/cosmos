import {
  flex,
  typography,
  colors,
  borders,
  spacing,
  transitions,
  size,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.row}
  ${flex.justify.center}
  ${spacing.gap.sm}
`;

export const input = css`
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
  ${transitions.colors}
`;

export const inputError = css`
  border-color: ${colors.semantic.error};
`;
