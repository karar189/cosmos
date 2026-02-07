import { css } from '@emotion/react';
import { flex, spacing, position, colors, background, spacingValues } from '@core3/ui-components/styleSystem';

export const stickyTabsContainer = css`
  ${position.sticky}
  top: calc(${spacingValues.xxxxl} + ${spacingValues.xxl}); // 96px + 48px = 144px (approximate header height)
  ${position.zIndex.sticky}
  ${background.project}
  border-bottom: 1px solid ${colors.neutral.gray200};
`;

export const tabsContent = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.x.l}
`;

export const hiddenSection = css`
  display: none;
`;
