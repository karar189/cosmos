import { css } from '@emotion/react';
import {
  borders,
  breakpoints,
  colors,
  coloring,
  cursor,
  flex,
  opacity,
  outline,
  overflow,
  patterns,
  position,
  shadow,
  size,
  sizeValues,
  spacing,
  spacingValues,
  transitions,
  typography,
} from '../../theme/styleSystem';

export const modalContainer = css`
  ${flex.center}
  ${size.minHeight.screen}
  overflow-y: auto;

  ${breakpoints.md} {
    ${spacing.padding.xl}
  }
`;

export const modalBox = css`
  ${position.relative}
  background: ${colors.neutral.white};
  ${shadow.none}
  ${outline.none}
  ${borders.radius.none}

  ${breakpoints.sm} {
    ${borders.radius['2xl']}
    ${spacing.padding.y.xl}
    ${spacing.padding.x.xxl}
  }

  ${breakpoints.md} {
    ${spacing.padding.y.xl}
    ${spacing.padding.x.xxl}
  }
`;

export const closeButton = css`
  ${patterns.resetButton}
  ${position.absolute}
  top: ${spacingValues.xl};
  right: ${spacingValues.l};
  ${cursor.pointer}
  ${transitions.opacity}
  ${size.width.md}
  ${size.height.md}
  ${flex.center}
  
  &:hover {
    ${opacity.veryHigh}
  }

  ${breakpoints.md} {
    top: ${spacingValues.xl};
    right: ${spacingValues.xl};
  }
`;

export const modalBoxFullscreen = css`
  ${position.relative}
  ${flex.column}
  width: calc(100vw - ${sizeValues.xl});
  height: calc(100vh - ${sizeValues.xl});
  ${overflow.hidden}
  background: ${colors.neutral.white};
  ${shadow.none}
  ${outline.none}
  ${borders.radius['2xl']}

  ${breakpoints.lg} {
    width: calc(100vw - ${sizeValues.lg});
    height: calc(100vh - ${sizeValues.xl});
  }
`;

export const modalHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.padding.y.xsm}
  ${spacing.padding.x.l}
  ${flex.item.shrink0}
  border-bottom: 1px solid ${colors.neutral.gray300};
`;

export const modalTitle = css`
  ${typography.fontSize['2xl']}
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${spacing.margin.zero}
`;

export const modalHeaderCloseButton = css`
  ${patterns.resetButton}
  ${cursor.pointer}
  ${transitions.opacity}
  ${size.width.md}
  ${size.height.md}
  ${flex.center}
  
  &:hover {
    ${opacity.veryHigh}
  }
`;

export const modalContentScrollable = css`
  ${spacing.padding.l}
  ${overflow.y.auto}
  ${flex.one}
`;

/**
 * MUI Modal backdrop styles override.
 */
export const modalBackdropStyles = {
  '& .MuiBackdrop-root': {
    backgroundColor: colors.backdrop.modal,
  },
};

