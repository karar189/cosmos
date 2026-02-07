import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  borders,
  boxShadow,
  coloring,
  size,
  colors,
  pointerEvents,
} from '../../../styleSystem';

export const chartContainer = css`
  ${flex.column}
  ${flex.align.center}
  position: relative;
  ${pointerEvents.none}
`;

export const gaugeWrapper = css`
  position: relative;
  overflow: visible;
`;

export const indicator = css`
  position: absolute;
  ${size.width.sm}
  ${size.height.sm}
  ${borders.radius.full}
  /* Using direct color reference for border since borders utility doesn't support color customization */
  border: 2px solid ${colors.neutral.white};
  ${boxShadow.sm}
  z-index: 10;
  transform: translate(-50%, -50%);
`;

export const cap = css`
  position: absolute;
  ${borders.radius.full}
  transform: translate(-50%, -50%);
  z-index: 1;
`;

export const labelContainer = css`
  ${flex.column}
  ${flex.align.center}
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${spacing.gap.xs}
  z-index: 5;
`;

export const label = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.normal}
  ${typography.fontSize.sm}
  ${typography.lineHeight.normal}
  ${coloring.text.secondary}
`;

export const status = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize['2xl']}
  ${typography.lineHeight.tight}
  ${coloring.text.primary}
`;
