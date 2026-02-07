import { css } from "@emotion/react";
import { borders, breakpoints, colors, size, spacing, spacingValues, typography, pointerEvents, flex, patterns, cursor, transitions, sizeValues, display } from "@core3/ui-components/styleSystem";

export const inputContainer = css`
  ${flex.centerCross}
  ${spacing.gap.s}
  ${spacing.padding.y.s}
  border-bottom: 1px solid ${colors.text.primary};
  margin-left: -${spacingValues.l};
  margin-right: -${spacingValues.l};
  padding-left: ${spacingValues.xl};
  padding-right: ${spacingValues.xl};

  ${breakpoints.md} {
    ${spacing.gap.m}
    ${spacing.padding.x.l}
    ${spacing.margin.x.zero}
    border-bottom: ${borders.bottom};
  }
`;

export const searchIcon = css`
  ${size.width.md}
  ${size.height.md}
  color: ${colors.neutral.gray500};
  flex-shrink: 0;
`;

export const closeButton = css`
  ${patterns.resetButton}
  ${flex.center}
  ${size.width.custom('40px')}
  ${size.height.custom('40px')}
  ${borders.radius.circle}
  ${cursor.pointer}
  ${transitions.all}
  flex-shrink: 0;
  
  svg {
    width: ${sizeValues.md};
    height: ${sizeValues.md};
    color: ${colors.text.primary};
  }
  
  &:hover {
    background-color: ${colors.background.hover};
  }
  
  &:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
  }

  ${breakpoints.md} {
    ${display.none}
  }
`;

export const clearButtonDesktop = css`
  ${display.none}

  ${breakpoints.md} {
    ${display.block}
  }
`;

export const searchInput = css`
  ${pointerEvents.auto}
  & .MuiOutlinedInput-root {
    ${borders.radius['3xl']}
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    
    & fieldset {
      ${borders.none}
    }
    
    &.Mui-focused fieldset {
      ${borders.none}
    }
  }
  
  & .MuiInputBase-input {
    ${typography.fontSize.base}
    padding-left: ${spacingValues.xs} !important;
    
    &::placeholder {
      ${typography.fontSize.sm}
    }
    
    ${breakpoints.md} {
      ${typography.fontSize.xl}
      padding-left: 0 !important;
    }
    
    /* Remove autocomplete background */
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px transparent inset !important;
      -webkit-text-fill-color: ${colors.text.primary} !important;
      transition: background-color 5000s ease-in-out 0s;
    }
  }
`;

