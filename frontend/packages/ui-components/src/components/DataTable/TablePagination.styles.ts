import { css } from '@emotion/react';
import {
  borders,
  breakpoints,
  colors,
  display,
  flex,
  opacity,
  size,
  spacing,
  spacingValues,
  transitions,
  typography,
} from '../../styleSystem';

export const paginationContainer = css`
  ${size.width.full}
  ${display.flex}
  ${flex.column}
  ${flex.align.center}
  ${spacing.gap.m}
  ${spacing.margin.top.l}

  ${breakpoints.md} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const paginationButtonsContainer = css`
  ${display.flex}
  ${flex.row}
  ${flex.center}
  ${spacing.gap.s}
  order: 1;

  ${breakpoints.md} {
    order: 2;
  }
`;

export const paginationSelectContainer = css`
  ${display.flex}
  ${flex.row}
  ${flex.center}
  ${spacing.gap.m}
  order: 2;

  ${breakpoints.md} {
    order: 1;
  }
`;

export const paginationText = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  color: ${colors.neutral.black};
  white-space: nowrap;
`;

export const paginationButton = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  color: ${colors.neutral.gray600};
  ${display.flex}
  ${flex.center}
  ${size.width.lg}
  ${size.height.lg}
  ${borders.radius.full}
  border: none;
  cursor: pointer;
  background: transparent;
  ${transitions.all}
  
  &:hover {
    color: ${colors.neutral.black};
    border: ${spacingValues.hairline} solid ${colors.neutral.black};
  }
  
  &:focus-visible {
    outline: ${spacingValues.xxxs} solid ${colors.neutral.black};
    outline-offset: ${spacingValues.xxxs};
  }
`;

export const paginationButtonDisabled = css`
  cursor: default;
  ${opacity.half}

  &:hover {
    color: ${colors.neutral.gray600};
    border: none;
  }
`;

export const paginationButtonActive = css`
  background: ${colors.neutral.black};
  color: ${colors.neutral.white};
  border: ${spacingValues.hairline} solid ${colors.neutral.black};

  &:hover {
    color: ${colors.neutral.white};
    background: ${colors.neutral.black};
  }
`;

