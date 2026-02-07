import { css } from '@emotion/react';
import { typography, spacing, size, borders, transitions, flex, coloring, whiteSpace, position, cursor } from '../../theme/styleSystem';

export const StyledFormBoxHeader = css`
  ${flex.base}
  ${flex.justify.between}
  ${flex.align.center}
  ${spacing.padding.m} ${spacing.padding.l};
  ${typography.fontSize.sm};
  ${typography.lineHeight.relaxed};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  ${position.absolute}
  ${position.top.zero}
  ${position.left.zero}
  ${position.right.zero}
  ${spacing.gap.xxxxl};
`;

export const StyledFormHeaderLeft = css`
  ${flex.base}
  ${flex.align.center}
`;

export const StyledFormHeaderRight = css`
  ${flex.base}
  ${flex.align.center}
  ${spacing.gap.xxs};
`;

export const StyledBackButton = css`
  ${flex.base}
  ${flex.align.center}
  ${spacing.gap.xxs};
  ${coloring.background.transparent}
  ${borders.none}
  ${cursor.pointer}
  ${spacing.padding.xxs} ${spacing.padding.s};
  ${borders.radius.lg}
  ${transitions.colors}
  ${typography.fontFamily.primary};

  &:hover {
    ${coloring.background.section};
  }

  &:focus {
    ${borders.none}
  }

  &:active {
    ${coloring.background.transparent}
  }
`;

export const StyledBackIcon = css`
  ${typography.fontSize.xl}
  ${coloring.text.secondary};
`;

export const StyledBackText = css`
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${coloring.text.secondary};
  ${whiteSpace.nowrap}
`;

export const StyledEmailText = css`
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${coloring.text.primary};
  ${spacing.margin.left.s};
`;

export const StyledAvatar = css`
  ${size.width.lg}
  ${size.height.lg}
  ${typography.fontSize.sm};
  ${typography.fontWeight.semibold};
  ${coloring.text.primary};
  ${coloring.background.section}
`;

export const StyledDropdownButton = css`
  ${flex.base}
  ${flex.align.center}
  ${flex.justify.center}
  ${size.width.lg}
  ${size.height.lg}
  ${coloring.background.transparent}
  ${borders.none}
  ${cursor.pointer}
  ${spacing.padding.xxs}
  ${borders.radius.lg}
  ${transitions.colors}
  ${typography.fontFamily.primary};
  ${spacing.margin.left.xxs};

  &:hover {
    ${coloring.background.section};
  }

  &:active {
    ${coloring.background.transparent}
  }
`;

export const StyledDropdownIcon = css`
    ${size.width.xsm};
    ${size.height.xsm};
    ${coloring.background.transparent}
`;