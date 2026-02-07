import { background, borders, breakpoints, coloring, colors, cursor, flex, grid, position, size, sizeValues, spacing, transitions, typography } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const modalContentOverride = css`
  ${spacing.padding.zero}
`;

export const content = css`
  ${position.relative}
  ${size.width.full}
  ${size.height.full}
  ${flex.column}
  ${spacing.gap.l}
  
  ${breakpoints.lg} {
    ${grid.base}
    grid-template-columns: ${sizeValues['4xl']} 1fr ${sizeValues['4xl']};
  }
`;

export const navigationList = css`
  display: none;
  
  ${breakpoints.lg} {
    display: flex;
    ${position.sticky}
    top: 0;
    ${flex.column}
    ${spacing.padding.y.l}
    ${spacing.padding.left.l}
  }
`;

export const navigationItem = css`
  /* Reset button styles */
  ${background.none}
  ${borders.none}
  ${typography.textAlign.left}
  ${size.width.full}
  font: inherit;
  
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${spacing.gap.s}
  ${cursor.pointer}
  ${spacing.padding.y.s}
  ${spacing.padding.left.m}
  color: ${colors.badge.gray.text};
  border-left: 2px solid ${colors.badge.gray.background};
  ${transitions.all}
  
  &:hover {
    color: ${colors.neutral.black};
  }
`;

export const navigationItemActive = css`
  color: ${colors.neutral.black};
  border-left-color: ${colors.neutral.black};
`;

export const submitButtonContainer = css`
  ${spacing.margin.top.l}
`;

export const contentContainer = css`
  ${size.width.full}
  ${spacing.padding.x.l}
  ${spacing.padding.bottom.m}

  ${breakpoints.lg} {
    ${flex.justifySelf.center}
    ${size.maxWidth.custom('800px')}
    ${spacing.padding.x.zero}
  }
  
  ${breakpoints.xxxl} {
    ${size.maxWidth.custom('1000px')}
  }
  
  ${breakpoints.xxxxl} {
    ${size.maxWidth.custom('1400px')}
  }
`;

export const modalSection = css`
  ${spacing.padding.top.l}
  ${spacing.margin.bottom.s}
`;

export const modalSectionTitleContainer = css`
  ${flex.centerCross}
  ${spacing.gap.s}
  ${spacing.margin.bottom.m}
`;

export const modalSectionNumber = css`
  ${size.width.md}
  ${size.height.md}
  ${coloring.background.neutral.dark}
  ${coloring.text.neutral.white}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.none}
  ${flex.center}
  ${borders.radius.full}
`;

export const modalSectionTitle = css`
  ${typography.fontSize.xl}
  ${typography.fontWeight.medium}
`;

export const modalSectionDescription = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${spacing.margin.bottom.s}
`;

export const modalSectionList = css`
  /* Base li styles */
  li {
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    color: ${colors.neutral.gray650};
    ${spacing.margin.left.l}
  }

  /* All ul use black filled circle */
  ul {
    list-style-type: disc;
    ${spacing.margin.left.l}
  }

  /* Nested ul also use disc (override browser defaults) */
  ul ul {
    list-style-type: disc;
    ${spacing.margin.left.l}
  }
`;

export const modalSectionOrderedList = css`
  ${spacing.margin.left.m}

  > ul {
    ${spacing.margin.left.zero}
  }

  li {
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    color: ${colors.neutral.gray650};
    
    ul {
      list-style-type: disc;
      ${spacing.margin.left.xxs}
      ${spacing.margin.bottom.l}
    }
  }

`;

export const modalSectionHeading = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${spacing.margin.bottom.s}
  ${coloring.text.dark}
`;

export const modalSectionNote = css`
  ${spacing.margin.top.m}
`;