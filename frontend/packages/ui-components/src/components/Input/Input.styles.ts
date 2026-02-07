import { css } from '@emotion/react';
import {
  flex,
  spacing,
  spacingValues,
  typography,
  colors,
  borders,
  position,
  coloring,
  transform,
  opacity,
  cursor,
  pointerEvents,
  size,
} from '../../theme/styleSystem';

export const inputWrapper = css`
  ${position.relative}
  ${flex.row}
  ${flex.align.center}
`;

export const searchIcon = css`
  ${position.absolute}
  left: ${spacingValues.l};
  ${position.top.half}
  ${transform.translate.y('-50%')}
  ${coloring.text.secondary}
  ${pointerEvents.none}
  ${position.zIndex.dropdown}
  ${size.width.sm}
  ${size.height.sm}
`;

export const input = css`
  ${spacing.padding.x.m}
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${borders.radius.full}
  border: 2px solid ${colors.text.primary};
  ${coloring.background.transparent}
  ${coloring.text.primary}
  ${size.width['5xl']}
  ${size.height.xmd}
  box-shadow: none;
  transition: box-shadow 0.2s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px #FFFDEA, 0 0 0 6px rgba(0, 0, 0, 1);
  }

  &::placeholder {
    color: ${colors.text.secondary};
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
  }

  &:disabled {
    ${cursor.notAllowed}
    ${opacity.moderate}
    background: ${colors.neutral.gray100};
  }
`;

export const inputSearch = css`
  ${spacing.padding.left.xxl}
  ${spacing.padding.right.xxl}
`;

