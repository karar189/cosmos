/**
 * TableHeader Component Styles
 * Styles for sortable table headers
 */

import { css } from '@emotion/react';
import {
  colors,
  cursor,
  flex,
  opacity,
  pointerEvents,
  size,
  spacing,
  spacingValues,
  transitions,
  typography,
} from '../../styleSystem';

export const thead = css`
  background: ${colors.neutral.white};
`;

export const headerRow = css`
  /* Using box-shadow instead of border-bottom because borders don't stick 
     properly with position: sticky when table uses border-collapse: collapse */
  box-shadow: inset 0 -1px 0 ${colors.neutral.black};
`;

export const th = css`
  ${spacing.padding.y.m}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
  ${typography.textTransform.capitalize}
  color: ${colors.text.secondary};

  &:hover {
    & svg {
      color: ${colors.text.primary};
    }

    & span {
      ${opacity.full}
    }
  }

  & svg {
    ${transitions.colors}
  }
  
  & span {
    ${opacity.medium}
    ${transitions.opacity}
  }
`;

export const headerContent = css`
  ${flex.centerCross}
  user-select: none;
  border-radius: ${spacingValues.s};
  padding: ${spacingValues.xs} ${spacingValues.s};
  margin: -${spacingValues.xs} -${spacingValues.s};
  
  &:focus-visible {
    outline: 2px solid ${colors.neutral.black};
    outline-offset: 0px;
  }
`;

export const alignStyles = {
  left: css`
    ${flex.justify.start};
  `,
  center: css`
    ${flex.justify.center};
  `,
  right: css`
    ${flex.justify.end};
  `,
};


export const tooltipWrapper = css`
  ${spacing.margin.left.xs}
  ${flex.centerCross}
  ${size.height.xs}
  ${cursor.help}
  
  /* Prevent tooltip from triggering sort on click */
  ${pointerEvents.auto}
`;

export const sortIndicator = (active: boolean) => css`
  ${spacing.margin.left.s}
  ${flex.centerCross}
  ${active ? css`
    color: ${colors.neutral.black};
  ` : css`
    color: ${colors.text.secondary};
  `}
  ${transitions.colors}

  & svg {
    ${size.width.xs}
    ${size.height.xs}
  }
`;

