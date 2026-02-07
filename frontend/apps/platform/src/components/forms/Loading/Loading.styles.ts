import { css } from '@emotion/react';
import {
  flex,
  spacing,
  size,
  coloring,
  position,
  typography,
  transform,
} from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.center}
  ${flex.column}
  ${size.width.screen}
  ${size.height.screen}
  ${coloring.background.paper}
  ${position.fixed}
  ${position.inset.zero}
  ${position.zIndex.modal}
  ${position.relative}
`;

export const logo = css`
  ${size.width.custom('120px')}
  ${size.height.auto}
  ${position.absolute}
  ${position.top.custom('64px')}
  ${position.left.half}
  ${transform.translate.x('-50%')}
`;

export const loadingWrapper = css`
  ${flex.center}
  ${spacing.gap.m}
`;

export const text = css`
  ${spacing.margin.top.l}
  ${typography.fontSize.base}
  ${coloring.text.primary}
  ${typography.fontWeight.medium}
`;
