import { css } from '@emotion/react';
import {
  colors,
  borders,
  spacing,
  flex,
  typography,
  size,
  position,
  transform,
  cursor,
  spacingValues,
  coloring,
  background,
} from '../../theme/styleSystem';

export const container = css`
  ${flex.column}
  ${spacing.gap.s};
`;

export const label = css`
  ${typography.fontSize.xs};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.mono};
  color: ${colors.neutral.black};
  ${background.transparent}
  ${coloring.background.transparent}
`;

export const inputWrapper = css`
  ${position.relative};
  ${size.width.full};
`;

export const input = css`
  ${size.width.full}
  ${size.height.xmd};
  border: 1px solid ${colors.neutral.black};
  ${borders.radius.md};

  padding: ${spacing.padding.s} calc(${spacing.padding.m} * 2)
    ${spacing.padding.s} ${spacing.padding.m};

  color: ${colors.text.primary};

  &:focus {
    ${borders.none};
  }
`;

export const eyeIcon = css`
  ${position.absolute};
  right: ${spacingValues.m};
  ${position.top.half};
  ${transform.translate.y('-50%')};
  ${flex.center};
  ${flex.align.center};
  ${flex.justify.center};
  width: ${spacingValues.l};
  height: ${spacingValues.l};
  ${spacing.padding.zero};
  background: ${colors.background.paper};
  ${borders.none};
  ${cursor.pointer};
  color: ${colors.text.primary};

  svg {
    ${size.width.custom('22px')}
    ${size.height.custom('18px')}
  }

  &:focus {
    ${borders.none};
  }
`;

export const error = css`
  ${typography.fontSize.xs};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.mono};
  color: ${colors.semantic.error};
`;
