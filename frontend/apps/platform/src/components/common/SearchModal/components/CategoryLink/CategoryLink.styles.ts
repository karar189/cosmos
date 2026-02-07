import { css } from "@emotion/react";
import { colors, spacing, typography, cursor, transitions, flex, size, borders, breakpoints } from "@core3/ui-components/styleSystem";

export const categoryLink = (isClickable: boolean, isSelected: boolean = false) => css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.fontFamily.mono}
  ${typography.textTransform.uppercase}
  color: ${colors.text.secondary};
  ${spacing.margin.top.m}
  ${spacing.margin.bottom.xs}
  margin-left: 0;
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}

  ${breakpoints.md} {
    ${spacing.margin.left.sm}
  }

  ${isClickable && css`
    ${cursor.pointer}
    ${transitions.all}

    &:hover {
      color: ${colors.text.primary};

      .chevron-icon {
        transform: translateX(4px);
      }
    }

    &:focus {
      outline: none;
      color: ${colors.text.primary};
      
      .chevron-icon {
        transform: translateX(4px);
      }
    }
  `}

  ${isSelected && css`
    color: ${colors.text.primary};
    background-color: ${colors.background.hover};
    ${borders.radius.base}
    ${spacing.padding.x.xs}
    ${spacing.margin.left.s}
    
    .chevron-icon {
      transform: translateX(4px);
    }
  `}
`;

export const resultCount = css`
  color: ${colors.text.secondary};
  ${typography.fontWeight.normal}
  background: ${colors.badge.gray.background};
  ${borders.radius.full}
  ${spacing.padding.x.xs}
`;

export const chevronIcon = css`
  ${size.width.sm}
  ${size.height.sm}
  color: ${colors.text.secondary};
  ${transitions.all}
  transition-property: transform;
  transition-duration: 0.2s;
  transition-timing-function: ease-out;
`;

