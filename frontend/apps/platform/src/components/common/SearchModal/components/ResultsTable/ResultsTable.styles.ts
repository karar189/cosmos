import { css } from "@emotion/react";
import { borders, colors, size, spacing, transitions, cursor, typography, sizeValues, breakpoints } from "@core3/ui-components/styleSystem";

export const resultsTable = css`
  ${size.width.full}
  border-spacing: 0;
`;

export const resultRow = css`
  ${cursor.pointer}
  ${transitions.colors}
  ${borders.radius['3xl']}
  ${spacing.padding.x.zero}
  ${size.height.xl}
  
  ${breakpoints.md} {
    ${spacing.padding.x.l}
  }
  
  &:hover {
    background-color: ${colors.background.hover};
    
    td:first-of-type {
      border-top-left-radius: ${sizeValues.xxs};
      border-bottom-left-radius: ${sizeValues.xxs};
    }
    
    td:last-of-type {
      border-top-right-radius: ${sizeValues.xxs};
      border-bottom-right-radius: ${sizeValues.xxs};
    }
  }

  &:focus {
    outline: none;
    background-color: ${colors.background.hover};

    td:first-of-type {
      border-top-left-radius: ${sizeValues.xxs};
      border-bottom-left-radius: ${sizeValues.xxs};
    }
    
    td:last-of-type {
      border-top-right-radius: ${sizeValues.xxs};
      border-bottom-right-radius: ${sizeValues.xxs};
    }
  }
`;

export const resultRowSelected = css`
  background-color: ${colors.background.hover};
  
  td:first-of-type {
    border-top-left-radius: ${sizeValues.xxs};
    border-bottom-left-radius: ${sizeValues.xxs};
  }
  
  td:last-of-type {
    border-top-right-radius: ${sizeValues.xxs};
    border-bottom-right-radius: ${sizeValues.xxs};
  }
`;

export const projectCell = css`
  ${spacing.padding.y.xs}
  ${spacing.padding.left.zero}
  ${spacing.padding.right.sm}
  ${size.width.min}

  ${breakpoints.md} {
    ${spacing.padding.x.sm}
  }
`;

export const polCell = css`
  ${spacing.padding.y.xs}
  ${spacing.padding.x.sm}
  ${spacing.padding.left.xxxl}
`;

export const polCellProject = css`
  ${spacing.padding.left.zero}
  ${spacing.padding.right.custom('56px')}
`;

export const idCell = css`
  ${spacing.padding.y.xs}
  ${spacing.padding.left.zero}
  ${spacing.padding.right.zero}
  
  ${breakpoints.md} {
    ${spacing.padding.x.sm}
  }
  
  div {
    ${size.width.min}
    ${spacing.margin.left.auto}
  }
`;

export const noResults = css`
  ${spacing.padding.m}
  ${spacing.margin.left.s}
  ${typography.fontSize.sm}
  color: ${colors.text.secondary};
  ${typography.textAlign.center}
`;
