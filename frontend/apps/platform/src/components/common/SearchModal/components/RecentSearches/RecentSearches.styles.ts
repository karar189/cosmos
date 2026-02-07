import { css } from "@emotion/react";
import { borders, colors, flex, size, spacing, typography, transitions, cursor, opacity } from "@core3/ui-components/styleSystem";

export const categorySubtitle = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.fontFamily.mono}
  ${typography.textTransform.uppercase}
  color: ${colors.text.secondary};
  ${spacing.margin.top.m}
  ${spacing.margin.bottom.xs}
  ${spacing.margin.left.zero}
`;

export const recentSearchesHeader = css`
  ${flex.centerCross}
  ${spacing.gap.xs}
`;

export const clearButton = css`
  ${spacing.margin.top.s}
  ${spacing.margin.left.xxs}
  ${flex.center}
  ${cursor.pointer}
  ${spacing.padding.zero}
  ${borders.none}

  svg {
    ${size.width.sm}
    ${size.height.sm}
    color: ${colors.text.secondary};
    ${transitions.colors}
    
    &:hover {
      color: ${colors.text.primary};
    }
  }
`;

export const recentSearchesList = css`
  ${flex.base}
  ${flex.wrap}
  ${spacing.gap.s}
  ${spacing.margin.left.zero}
`;

export const selector = css`
  ${flex.centerCross}
  ${borders.radius['3xl']}
  ${borders.all}
  border-color: ${colors.background.tagBorder};
  ${spacing.padding.xxs}
  ${spacing.padding.right.s}
  ${spacing.gap.xs}
  ${size.width.fit}
  ${cursor.pointer}
  ${transitions.colors}

  &:hover {
    background-color: ${colors.background.hover};
  }
`;

export const selectorSelected = css`
  background-color: ${colors.background.hover};
  border-color: ${colors.text.primary};
`;

export const iconContainer = css`
  ${size.width.md}
  ${size.height.md}
  ${flex.center}
  flex-shrink: 0;
`;

export const iconImage = css`
  ${size.width.full}
  ${size.height.full}
  ${borders.radius.full}
  object-fit: cover;
`;

export const fallbackCircle = css`
  ${size.width.md}
  ${size.height.md}
  ${borders.radius.full}
  background: ${colors.neutral.gray700};
  ${opacity.medium}
`;

export const selectorText = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  white-space: nowrap;
`;

