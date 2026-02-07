/**
 * Select Component Styles
 * Styles for the single-select dropdown component
 */

import { css } from '@emotion/react';
import { colors, typography, spacing, borders, transitions, spacingValues, size, flex, position, sizeValues, pointerEvents, whiteSpace } from '../../theme/styleSystem';

/**
 * Container wrapper
 */
export const container = css`
`;

/**
 * Select input styles
 */
export const select = css`
  /* Default outline color */
  & .MuiOutlinedInput-notchedOutline {
    border-color: ${colors.neutral.black};
    ${borders.all}
    border-width: 1px;
    ${borders.radius['3xl']}
  }

  /* Hover state */
  &:hover .MuiOutlinedInput-notchedOutline {
    border-width: 1px;
  }

  /* Focused/Active state */
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${colors.neutral.black};
    border-width: 1px;
  }

  /* Input text styling */
  & .MuiSelect-select {
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    color: ${colors.neutral.black};
    ${spacing.padding.x.m}
    ${spacing.padding.y.xs}
    padding-right: ${spacingValues.xl};
    margin-top: 1px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ${size.maxWidth.full}
  }

  /* Select border when dropdown is open - 2px border */
  & .MuiSelect-select[aria-expanded='true'] ~ .MuiOutlinedInput-notchedOutline {
    border-width: 2px;
  }
`;

/**
 * Placeholder styles
 */
export const placeholder = css`
  margin-right: ${spacingValues.m};
`;

/**
 * Custom icon styles
 */
export const selectIcon = css`
  ${position.absolute}
  right: ${spacingValues.m};
  ${pointerEvents.none}
  ${flex.center}
  
  & svg {
    ${size.width.sm}
    ${size.height.sm}
    fill: ${colors.neutral.black};
  }
`;

/**
 * Dropdown menu styles (for MUI sx prop)
 */
export const selectMenuStyles = css`
  .MuiPaper-root {
    background-color: ${colors.neutral.white};
    box-shadow: none;
    ${size.width['4xl']}

    max-height: ${sizeValues['5xl']};
    ${spacing.margin.top.xs}
    border: 2px solid ${colors.neutral.black};
    ${borders.radius['3xl']}
    
    /* Hide scrollbar but keep scrolling */
    /* Firefox */
    scrollbar-width: none;
    
    /* Chrome, Safari, Edge */
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .MuiList-root {
    ${size.width.full}
  }

  /* MenuItem hover and active states */
  .MuiMenuItem-root {
    ${size.height.lg}
    ${spacing.padding.y.xs}
    ${spacing.padding.x.m}
    ${transitions.colors}
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    color: ${colors.neutral.black};
    ${whiteSpace.normal}
    word-wrap: break-word;

    &:hover {
      background-color: ${colors.star.unfilled};
    }

    &.Mui-selected {
      background-color: ${colors.neutral.white};
      
      &:hover {
        background-color: ${colors.star.unfilled};
      }
    }
  }
`;

