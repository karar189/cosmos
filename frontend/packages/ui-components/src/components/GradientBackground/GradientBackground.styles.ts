import { css } from '@emotion/react';
import {
  colors,
  flex,
  gradients,
  overflow,
  pointerEvents,
  position,
  size,
  spacing,
  transform,
} from '../../theme/styleSystem';

export const wrapper = css`
  ${position.relative}
  ${size.width.full}
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.padding.x.l}
  ${spacing.padding.y.xxl}
  background: ${colors.semantic.step};
  ${overflow.hidden}
  border-radius: 0 0 1.625rem 1.625rem;
`;

export const gradientOverlay = css`
  ${position.absolute}
  ${position.bottom.zero}
  ${position.left.half}
  ${transform.translate.xy('-50%', '50%')}
  ${size.width.custom('1500px')}
  ${size.height.custom('1500px')}
  background: ${gradients.mainRadial};
  ${pointerEvents.none}
`;

export const content = css`
  ${position.relative}
  ${size.width.full}
  ${position.zIndex.dropdown}
`;

