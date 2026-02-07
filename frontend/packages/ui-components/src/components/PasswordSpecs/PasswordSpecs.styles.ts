import { css } from '@emotion/react';
import {
  colors,
  flex,
  size,
  spacing,
  spacingValues,
  typography,
} from '../../theme/styleSystem';

export const container = css`
  ${flex.column}
  ${spacing.gap.custom(11)}
  ${size.width.full}
  ul {
    list-style: disc;
    padding: ${spacingValues.zero} ${spacingValues.m};
    ${spacing.margin.zero};
    ${typography.fontFamily.primary}
    ${typography.fontSize.sm}
    ${typography.fontWeight.normal}
  }
`;

export const list = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.normal}
`;

export const listItem = css`
  '&:checked': {
    color: ${colors.semantic.success};
  }
`;

export const specMet = css`
  color: ${colors.text.secondary};
  ${typography.textDecoration.lineThrough}
  list-style: disc;

  &::marker {
    color: ${colors.semantic.success};
  }
`;

export const specNotMet = css`
  color: ${colors.text.primary};
  ${typography.textDecoration.none};
  list-style: disc;
`;
