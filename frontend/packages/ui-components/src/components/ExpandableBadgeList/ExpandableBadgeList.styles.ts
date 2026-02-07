import { css } from '@emotion/react';
import { cursor, display, flex, opacity, position, size, spacing, transitions, visibility } from '@core3/ui-components/styleSystem';

export const measureContainer = css`
  ${position.absolute};
  ${visibility.hidden};
  pointer-events: none;
  ${display.flex}
  ${flex.row};
  ${spacing.gap.xxs};
  ${flex.wrap.nowrap};
`
export const opacityFull = css`
  ${opacity.full}
`;
export const opacityHidden = css`
  ${opacity.hidden}
`;
export const container = css`
  ${flex.row};
  ${flex.centerCross};
  ${spacing.gap.xs};
  ${flex.wrap.wrap};
  ${flex.justify.end};
  ${size.width.full};
`;

export const dropdownButton = css`
  ${flex.row};
  ${flex.centerCross};
  ${spacing.gap.xs};
  ${cursor.pointer};
  user-select: none;
  
  &:hover {
    ${opacity.high}
  }
`;

export const arrowIcon = css`
  ${size.width.sm};
  ${size.height.sm};
  ${flex.base};
  ${flex.align.center};
  ${flex.justify.center};
  ${transitions.transform}
`;

export const arrowIconExpanded = css`
  ${arrowIcon};
  transform: rotate(180deg);
`;