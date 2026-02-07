import { css } from '@emotion/react';
import { blur, coloring, flex, position, size, spacing, typography } from '../../theme/styleSystem';

export const getBlurOverlayStyles = ({ absolute }: { absolute: boolean }) => css`
  ${absolute ? position.absolute : position.relative}
  ${position.inset.zero}
  ${size.width.full}
  ${size.height.full}
  ${flex.center}
  ${blur.backdrop.sm}
  ${position.zIndex.dropdown}
`;

export const content = css`
  ${flex.column}
  ${flex.align.center}
  ${spacing.gap.xxs}
  ${typography.textAlign.center}
`;

export const title = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const text = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
`;

