import { css } from '@emotion/react';
import {
  borders,
  colors,
  position,
  spacingValues,
  transitions,
  spacing,
  opacity,
} from '../../theme/styleSystem';

type RadioSize = 'sm' | 'md';

export const container = (disabled: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: ${spacingValues.sm};
  user-select: none;
  color: ${disabled ? colors.text.secondary : colors.text.primary};

  &:hover input:not(:disabled) + span {
    border-color: ${colors.background.dark};
  }
`;

export const input = css`
  ${position.absolute};
  ${opacity.hidden}
  ${spacing.margin.zero};
  ${spacing.padding.zero};
  ${borders.none}

  &:focus-visible + span {
    box-shadow: 0 0 0 3px ${colors.background.dark};
  }

  &:checked + span {
    border-color: ${colors.background.dark};
  }

  &:checked + span::after {
    transform: translate(-50%, -50%) scale(1);
    background: ${colors.background.dark};
  }

  &:disabled + span {
    border-color: ${colors.neutral.gray300};
    background: ${colors.neutral.gray100};
  }
`;

export const control = (size: RadioSize, disabled: boolean) => {
  const outer = size === 'sm' ? 16 : 20;
  const inner = size === 'sm' ? 8 : 10;
  return css`
    ${position.relative};
    width: ${outer}px;
    height: ${outer}px;
    ${borders.radius.full};
    border: 2px solid
      ${disabled ? colors.neutral.gray300 : colors.neutral.gray500};
    background: ${colors.neutral.white};
    ${transitions.colors};
    ${transitions.transform};

    &::after {
      content: '';
      ${position.absolute};
      ${position.top.half};
      ${position.left.half};
      width: ${inner}px;
      height: ${inner}px;
      ${borders.radius.circle};
      transform: translate(-50%, -50%) scale(0);
      ${transitions.transform};
    }
  `;
};
