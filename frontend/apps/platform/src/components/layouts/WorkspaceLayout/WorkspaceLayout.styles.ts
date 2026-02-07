import { css } from '@emotion/react';
import {
  flex,
  spacing,
  size,
  coloring,
  typography,
  breakpoints,
  position,
  cursor,
} from '@core3/ui-components/styleSystem';

/**
 * Main workspace container
 */
export const workspaceContainer = css`
  ${flex.column}
  ${size.width.full}
  ${size.minHeight.screen}
  ${coloring.background.project}
`;

/**
 * Workspace grid layout (sidebar + main content)
 */
export const workspaceGrid = css`
  ${flex.row}
  ${size.width.full}
  ${flex.item.grow}
  ${size.height.full}
`;



/**
 * Main content area
 */
export const mainContent = css`
  ${flex.column}
  ${flex.item.grow}
  ${spacing.padding.xl}
  ${coloring.background.project}
  ${size.width.full}
  ${size.minHeight.screen}
  ${spacing.gap.l}
  ${position.relative}
  
  ${breakpoints.md} {
    ${spacing.padding.l}
  }
  
  ${breakpoints.sm} {
    ${spacing.padding.m}
  }
`;

/**
 * Coming Soon section styles
 */
export const comingSoonContainer = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.gap.m}
  ${size.width.full}
  ${spacing.margin.top.xxxxl}
  ${spacing.padding.top.l}
  ${spacing.margin.bottom.xl}
`;

export const comingSoonIcon = css`
  ${size.width.custom('60px')}
  ${size.height.custom('60px')}
  ${coloring.text.variants.secondary.op65}
`;

export const comingSoonTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize['3xl']}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.primary}
  ${typography.textAlign.center}
`;

export const comingSoonDescription = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.relaxed}
  ${coloring.text.variants.secondary.op75}
  ${typography.textAlign.center}
  ${size.maxWidth.custom('550px')}
`;

/**
 * DataBlocks grid container
 */
export const dataBlocksGrid = css`
  ${flex.row}
  ${flex.justify.center}
  ${spacing.gap.l}
  ${size.width.full}
  
  ${breakpoints.md} {
    ${flex.wrap.wrap}
    ${flex.align.center}
  }
`;

/**
 * Contact section at the bottom
 */
export const contactSection = css`
  ${flex.row}
  ${flex.justify.center}
  ${size.width.full}
  ${spacing.margin.top.auto}
  ${spacing.padding.bottom.xxxxl}
  ${spacing.padding.top.xl}
`;

/**
 * Contact text
 */
export const contactText = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.base}
  ${typography.fontWeight.normal}
  ${coloring.text.variants.secondary.op65}
  
  strong {
    ${typography.fontWeight.medium}
    ${coloring.text.primary}
    ${cursor.pointer}
  }
`;
