/**
 * Comprehensive Emotion Style System
 *
 * A type-safe, standardized styling system that eliminates hardcoded values
 * and provides an intuitive API for consistent styling across the application.
 *
 * @example
 * import { flex, spacing, colors, typography } from '@/theme/styleSystem';
 *
 * const styles = css`
 *   ${flex.center}
 *   ${spacing.padding.m}
 *   ${typography.fontSize.lg}
 *   color: ${colors.text.primary};
 * `;
 */

import { css, SerializedStyles } from '@emotion/react';

// ============================================================================
// SPACING SYSTEM
// ============================================================================

/**
 * Standardized spacing scale for consistent margins and paddings
 * Uses rem units for proportional scaling with root font-size
 */
export const spacingValues = {
  /** 0 - No spacing */
  zero: '0',
  /** 0.0625rem (1px at 16px base) - Hairline spacing */
  hairline: '0.0625rem',
  /** 0.125rem (2px at 16px base) - Extra extra extra small spacing */
  xxxs: '0.125rem',
  /** 0.25rem (4px at 16px base) - Extra extra small spacing */
  xxs: '0.25rem',
  /** 0.375rem (6px at 16px base) - Extra small spacing */
  xs: '0.375rem',
  /** 0.5rem (8px at 16px base) - Small spacing */
  s: '0.5rem',
  /** 0.75rem (12px at 16px base) - Small spacing */
  sm: '0.75rem',
  /** 1rem (16px at 16px base) - Medium spacing (base unit) */
  m: '1rem',
  /** 1.25rem (20px at 16px base) - Extra small-medium spacing */
  xsm: '1.25rem',
  /** 1.5rem (24px at 16px base) - Large spacing */
  l: '1.5rem',
  /** 2rem (32px at 16px base) - Extra large spacing */
  xl: '2rem',
  /** 2.5rem (40px at 16px base) - Extra medium large spacing */
  xmd: '2.5rem',
  /** 3rem (48px at 16px base) - 2X large spacing */
  xxl: '3rem',
  /** 4rem (64px at 16px base) - 3X large spacing */
  xxxl: '4rem',
  /** 6rem (96px at 16px base) - 4X large spacing */
  xxxxl: '6rem',
  /** custom spacing value in rem (pass px value, converts to rem) */
  custom: (value: number) => `${value / 16}rem`,
} as const;

/**
 * Padding utilities with standardized spacing scale
 *
 * @example
 * // Apply medium padding on all sides
 * ${spacing.padding.m}
 *
 * // Apply horizontal padding
 * ${spacing.padding.x.l}
 *
 * // Apply specific side padding
 * ${spacing.padding.top.xl}
 */
export const spacing = {
  padding: {
    /** 0 padding on all sides */
    zero: css`
      padding: 0;
    `,
    /** 2px padding on all sides */
    xxxs: css`
      padding: ${spacingValues.xxxs};
    `,
    /** 4px padding on all sides */
    xxs: css`
      padding: ${spacingValues.xxs};
    `,
    /** 6px padding on all sides */
    xs: css`
      padding: ${spacingValues.xs};
    `,
    /** 8px padding on all sides */
    s: css`
      padding: ${spacingValues.s};
    `,
    /** 12px padding on all sides */
    sm: css`
      padding: ${spacingValues.sm};
    `,
    /** 16px padding on all sides */
    m: css`
      padding: ${spacingValues.m};
    `,
    /** 24px padding on all sides */
    l: css`
      padding: ${spacingValues.l};
    `,
    /** 32px padding on all sides */
    xl: css`
      padding: ${spacingValues.xl};
    `,
    /** 48px padding on all sides */
    xxl: css`
      padding: ${spacingValues.xxl};
    `,
    /** 64px padding on all sides */
    xxxl: css`
      padding: ${spacingValues.xxxl};
    `,
    /** 96px padding on all sides */
    xxxxl: css`
      padding: ${spacingValues.xxxxl};
    `,

    /** Horizontal (left & right) padding utilities */
    x: {
      /** 0 horizontal padding */
      zero: css`
        padding-left: 0;
        padding-right: 0;
      `,
      /** 2px horizontal padding */
      xxxs: css`
        padding-left: ${spacingValues.xxxs};
        padding-right: ${spacingValues.xxxs};
      `,
      /** 4px horizontal padding */
      xxs: css`
        padding-left: ${spacingValues.xs};
        padding-right: ${spacingValues.xs};
      `,
      /** 6px horizontal padding */
      xs: css`
        padding-left: ${spacingValues.xs};
        padding-right: ${spacingValues.xs};
      `,
      /** 8px horizontal padding */
      s: css`
        padding-left: ${spacingValues.s};
        padding-right: ${spacingValues.s};
      `,
      /** 12px horizontal padding */
      sm: css`
        padding-left: ${spacingValues.sm};
        padding-right: ${spacingValues.sm};
      `,
      /** 16px horizontal padding */
      m: css`
        padding-left: ${spacingValues.m};
        padding-right: ${spacingValues.m};
      `,
      /** 24px horizontal padding */
      l: css`
        padding-left: ${spacingValues.l};
        padding-right: ${spacingValues.l};
      `,
      /** 32px horizontal padding */
      xl: css`
        padding-left: ${spacingValues.xl};
        padding-right: ${spacingValues.xl};
      `,
      /** 48px horizontal padding */
      xxl: css`
        padding-left: ${spacingValues.xxl};
        padding-right: ${spacingValues.xxl};
      `,
      /** 64px horizontal padding */
      xxxl: css`
        padding-left: ${spacingValues.xxxl};
        padding-right: ${spacingValues.xxxl};
      `,
      /** 96px horizontal padding */
      xxxxl: css`
        padding-left: ${spacingValues.xxxxl};
        padding-right: ${spacingValues.xxxxl};
      `,
    },

    /** Vertical (top & bottom) padding utilities */
    y: {
      /** 0 vertical padding */
      zero: css`
        padding-top: 0;
        padding-bottom: 0;
      `,
      /** 2px vertical padding */
      xxxs: css`
        padding-top: ${spacingValues.xxxs};
        padding-bottom: ${spacingValues.xxxs};
      `,
      custom: (value: string) => css`
        padding-top: ${value};
        padding-bottom: ${value};
      `,
      xxxxs: css`
        padding-top: ${spacingValues.xxxs};
        padding-bottom: ${spacingValues.xxxs};
      `,
      /** 4px vertical padding */
      xxs: css`
        padding-top: ${spacingValues.xxs};
        padding-bottom: ${spacingValues.xxs};
      `,
      /** 6px vertical padding */
      xs: css`
        padding-top: ${spacingValues.xs};
        padding-bottom: ${spacingValues.xs};
      `,
      /** 8px vertical padding */
      s: css`
        padding-top: ${spacingValues.s};
        padding-bottom: ${spacingValues.s};
      `,
      sm: css`
        padding-top: ${spacingValues.sm};
        padding-bottom: ${spacingValues.sm};
      `,
      /** 20px vertical padding */
      xsm: css`
        padding-top: ${spacingValues.xsm};
        padding-bottom: ${spacingValues.xsm};
      `,

      /** 16px vertical padding */
      m: css`
        padding-top: ${spacingValues.m};
        padding-bottom: ${spacingValues.m};
      `,
      /** 24px vertical padding */
      l: css`
        padding-top: ${spacingValues.l};
        padding-bottom: ${spacingValues.l};
      `,
      /** 32px vertical padding */
      xl: css`
        padding-top: ${spacingValues.xl};
        padding-bottom: ${spacingValues.xl};
      `,
      /** 48px vertical padding */
      xxl: css`
        padding-top: ${spacingValues.xxl};
        padding-bottom: ${spacingValues.xxl};
      `,
      /** 64px vertical padding */
      xxxl: css`
        padding-top: ${spacingValues.xxxl};
        padding-bottom: ${spacingValues.xxxl};
      `,
      /** 96px vertical padding */
      xxxxl: css`
        padding-top: ${spacingValues.xxxxl};
        padding-bottom: ${spacingValues.xxxxl};
      `,
    },

    /** Individual side padding utilities */
    top: {
      /** 0 padding on top side */
      zero: css`
        padding-top: 0;
      `,
      /** 4px top padding */
      xxs: css`
        padding-top: ${spacingValues.xxs};
      `,
      /** 6px top padding */
      xs: css`
        padding-top: ${spacingValues.xs};
      `,
      /** 8px top padding */
      s: css`
        padding-top: ${spacingValues.s};
      `,
      /** 12px top padding */
      sm: css`
        padding-top: ${spacingValues.sm};
      `,
      /** 16px top padding */
      m: css`
        padding-top: ${spacingValues.m};
      `,
      /** 24px top padding */
      l: css`
        padding-top: ${spacingValues.l};
      `,
      /** 32px top padding */
      xl: css`
        padding-top: ${spacingValues.xl};
      `,
      /** 48px top padding */
      xxl: css`
        padding-top: ${spacingValues.xxl};
      `,
      /** 64px top padding */
      xxxl: css`
        padding-top: ${spacingValues.xxxl};
      `,
      /** 96px top padding */
      xxxxl: css`
        padding-top: ${spacingValues.xxxxl};
      `,
      /** Custom top padding */
      custom: (value: string) => css`
        padding-top: ${value};
      `,
    },

    bottom: {
      /** 0 padding on bottom side */
      zero: css`
        padding-bottom: 0;
      `,
      /** 4px bottom padding */
      xxs: css`
        padding-bottom: ${spacingValues.xxs};
      `,
      /** 6px bottom padding */
      xs: css`
        padding-bottom: ${spacingValues.xs};
      `,
      /** 8px bottom padding */
      s: css`
        padding-bottom: ${spacingValues.s};
      `,
      /** 12px bottom padding */
      sm: css`
        padding-bottom: ${spacingValues.sm};
      `,
      /** 16px bottom padding */
      m: css`
        padding-bottom: ${spacingValues.m};
      `,
      /** 24px bottom padding */
      l: css`
        padding-bottom: ${spacingValues.l};
      `,
      /** 32px bottom padding */
      xl: css`
        padding-bottom: ${spacingValues.xl};
      `,
      /** 48px bottom padding */
      xxl: css`
        padding-bottom: ${spacingValues.xxl};
      `,
      /** 64px bottom padding */
      xxxl: css`
        padding-bottom: ${spacingValues.xxxl};
      `,
      /** 96px bottom padding */
      xxxxl: css`
        padding-bottom: ${spacingValues.xxxxl};
      `,
      /** Custom bottom padding */
      custom: (value: string) => css`
        padding-bottom: ${value};
      `,
    },

    left: {
      /** 0 padding on left side */
      zero: css`
        padding-left: 0;
      `,
      /** 4px left padding */
      xxs: css`
        padding-left: ${spacingValues.xxs};
      `,
      /** 6px left padding */
      xs: css`
        padding-left: ${spacingValues.xs};
      `,
      /** 8px left padding */
      s: css`
        padding-left: ${spacingValues.s};
      `,
      /** 12px left padding */
      sm: css`
        padding-left: ${spacingValues.sm};
      `,
      /** 16px left padding */
      m: css`
        padding-left: ${spacingValues.m};
      `,
      /** 24px left padding */
      l: css`
        padding-left: ${spacingValues.l};
      `,
      /** 32px left padding */
      xl: css`
        padding-left: ${spacingValues.xl};
      `,
      /** 48px left padding */
      xxl: css`
        padding-left: ${spacingValues.xxl};
      `,
      /** 64px left padding */
      xxxl: css`
        padding-left: ${spacingValues.xxxl};
      `,
      /** 96px left padding */
      xxxxl: css`
        padding-left: ${spacingValues.xxxxl};
      `,
      /** Custom left padding */
      custom: (value: string) => css`
        padding-left: ${value};
      `,
    },

    right: {
      /** 0 padding on right side */
      zero: css`
        padding-right: 0;
      `,
      /** 4px right padding */
      xxs: css`
        padding-right: ${spacingValues.xxs};
      `,
      /** 6px right padding */
      xs: css`
        padding-right: ${spacingValues.xs};
      `,
      /** 8px right padding */
      s: css`
        padding-right: ${spacingValues.s};
      `,
      /** 12px right padding */
      sm: css`
        padding-right: ${spacingValues.sm};
      `,
      /** 16px right padding */
      m: css`
        padding-right: ${spacingValues.m};
      `,
      /** 24px right padding */
      l: css`
        padding-right: ${spacingValues.l};
      `,
      /** 32px right padding */
      xl: css`
        padding-right: ${spacingValues.xl};
      `,
      /** 48px right padding */
      xxl: css`
        padding-right: ${spacingValues.xxl};
      `,
      /** 64px right padding */
      xxxl: css`
        padding-right: ${spacingValues.xxxl};
      `,
      /** 96px right padding */
      xxxxl: css`
        padding-right: ${spacingValues.xxxxl};
      `,
      /** Custom right padding */
      custom: (value: string) => css`
        padding-right: ${value};
      `,
    },
  },

  margin: {
    /** 2px margin on all sides */
    xxxs: css`
      margin: ${spacingValues.xxxs};
    `,
    /** Auto margin */
    auto: css`
      margin: auto;
    `,
    /** 0 margin on all sides */
    zero: css`
      margin: 0;
    `,
    center: css`
      margin: 0 auto;
    `,
    /** 4px margin on all sides */
    xxs: css`
      margin: ${spacingValues.xxs};
    `,
    /** 6px margin on all sides */
    xs: css`
      margin: ${spacingValues.xs};
    `,
    /** 8px margin on all sides */
    s: css`
      margin: ${spacingValues.s};
    `,
    /** 16px margin on all sides */
    m: css`
      margin: ${spacingValues.m};
    `,
    /** 24px margin on all sides */
    l: css`
      margin: ${spacingValues.l};
    `,
    /** 32px margin on all sides */
    xl: css`
      margin: ${spacingValues.xl};
    `,
    /** 48px margin on all sides */
    xxl: css`
      margin: ${spacingValues.xxl};
    `,
    /** 64px margin on all sides */
    xxxl: css`
      margin: ${spacingValues.xxxl};
    `,
    /** 96px margin on all sides */
    xxxxl: css`
      margin: ${spacingValues.xxxxl};
    `,

    /** Horizontal (left & right) margin utilities */
    x: {
      /** 0 margin on left and right sides */
      zero: css`
        margin-left: 0;
        margin-right: 0;
      `,
      /** 4px horizontal margin */
      xxs: css`
        margin-left: ${spacingValues.xxs};
        margin-right: ${spacingValues.xxs};
      `,
      /** 6px horizontal margin */
      xs: css`
        margin-left: ${spacingValues.xs};
        margin-right: ${spacingValues.xs};
      `,
      /** 8px horizontal margin */
      s: css`
        margin-left: ${spacingValues.s};
        margin-right: ${spacingValues.s};
      `,
      /** 12px horizontal margin */
      sm: css`
        margin-left: ${spacingValues.sm};
        margin-right: ${spacingValues.sm};
      `,
      /** 16px horizontal margin */
      m: css`
        margin-left: ${spacingValues.m};
        margin-right: ${spacingValues.m};
      `,
      /** 24px horizontal margin */
      l: css`
        margin-left: ${spacingValues.l};
        margin-right: ${spacingValues.l};
      `,
      /** 32px horizontal margin */
      xl: css`
        margin-left: ${spacingValues.xl};
        margin-right: ${spacingValues.xl};
      `,
      /** 48px horizontal margin */
      xxl: css`
        margin-left: ${spacingValues.xxl};
        margin-right: ${spacingValues.xxl};
      `,
      /** 64px horizontal margin */
      xxxl: css`
        margin-left: ${spacingValues.xxxl};
        margin-right: ${spacingValues.xxxl};
      `,
      /** 96px horizontal margin */
      xxxxl: css`
        margin-left: ${spacingValues.xxxxl};
        margin-right: ${spacingValues.xxxxl};
      `,
      /** Auto horizontal margin (center element) */
      auto: css`
        margin-left: auto;
        margin-right: auto;
      `,
    },

    /** Vertical (top & bottom) margin utilities */
    y: {
      /** 0 margin on all sides */
      zero: css`
        margin-top: 0;
        margin-bottom: 0;
      `,
      /** 4px vertical margin */
      xxxs: css`
        margin-top: ${spacingValues.xxxs};
        margin-bottom: ${spacingValues.xxxs};
      `,
      xxs: css`
        margin-top: ${spacingValues.xxs};
        margin-bottom: ${spacingValues.xxs};
      `,
      /** 6px vertical margin */
      xs: css`
        margin-top: ${spacingValues.xs};
        margin-bottom: ${spacingValues.xs};
      `,
      /** 8px vertical margin */
      s: css`
        margin-top: ${spacingValues.s};
        margin-bottom: ${spacingValues.s};
      `,
      /** 12px vertical margin */
      sm: css`
        margin-top: ${spacingValues.sm};
        margin-bottom: ${spacingValues.sm};
      `,
      /** 16px vertical margin */
      m: css`
        margin-top: ${spacingValues.m};
        margin-bottom: ${spacingValues.m};
      `,
      /** 24px vertical margin */
      l: css`
        margin-top: ${spacingValues.l};
        margin-bottom: ${spacingValues.l};
      `,
      /** 32px vertical margin */
      xl: css`
        margin-top: ${spacingValues.xl};
        margin-bottom: ${spacingValues.xl};
      `,
      /** 48px vertical margin */
      xxl: css`
        margin-top: ${spacingValues.xxl};
        margin-bottom: ${spacingValues.xxl};
      `,
      /** 64px vertical margin */
      xxxl: css`
        margin-top: ${spacingValues.xxxl};
        margin-bottom: ${spacingValues.xxxl};
      `,
      /** 96px vertical margin */
      xxxxl: css`
        margin-top: ${spacingValues.xxxxl};
        margin-bottom: ${spacingValues.xxxxl};
      `,
    },

    /** Individual side margin utilities */
    top: {
      negative: {
        xxs: css`
          margin-top: -${spacingValues.xxs};
        `,
        xs: css`
          margin-top: -${spacingValues.xs};
        `,
      },
      /** 0 margin on top side */
      zero: css`
        margin-top: 0;
      `,
      /** 4px top margin */
      xxs: css`
        margin-top: ${spacingValues.xxs};
      `,
      /** 6px top margin */
      xs: css`
        margin-top: ${spacingValues.xs};
      `,
      /** 8px top margin */
      s: css`
        margin-top: ${spacingValues.s};
      `,
      /** 12px top margin */
      sm: css`
        margin-top: ${spacingValues.sm};
      `,
      /** 16px top margin */
      m: css`
        margin-top: ${spacingValues.m};
      `,
      /** 24px top margin */
      l: css`
        margin-top: ${spacingValues.l};
      `,
      /** 32px top margin */
      xl: css`
        margin-top: ${spacingValues.xl};
      `,
      /** 48px top margin */
      xxl: css`
        margin-top: ${spacingValues.xxl};
      `,
      /** 64px top margin */
      xxxl: css`
        margin-top: ${spacingValues.xxxl};
      `,
      /** 96px top margin */
      xxxxl: css`
        margin-top: ${spacingValues.xxxxl};
      `,
      /** Auto top margin */
      auto: css`
        margin-top: auto;
      `,
    },

    bottom: {
      negative: {
        xxs: css`
          margin-bottom: -${spacingValues.xxs};
        `,
        xs: css`
          margin-bottom: -${spacingValues.xs};
        `,
        s: css`
          margin-bottom: -${spacingValues.s};
        `,
        sm: css`
          margin-bottom: -${spacingValues.sm};
        `,
        m: css`
          margin-bottom: -${spacingValues.m};
        `,
        l: css`
          margin-bottom: -${spacingValues.l};
        `,
      },
      /** 0 margin on bottom side */
      zero: css`
        margin-bottom: 0;
      `,
      /** 4px bottom margin */
      xxs: css`
        margin-bottom: ${spacingValues.xxs};
      `,
      /** 6px bottom margin */
      xs: css`
        margin-bottom: ${spacingValues.xs};
      `,
      /** 8px bottom margin */
      s: css`
        margin-bottom: ${spacingValues.s};
      `,
      /** 16px bottom margin */
      m: css`
        margin-bottom: ${spacingValues.m};
      `,
      /** 24px bottom margin */
      l: css`
        margin-bottom: ${spacingValues.l};
      `,
      /** 32px bottom margin */
      xl: css`
        margin-bottom: ${spacingValues.xl};
      `,
      /** 48px bottom margin */
      xxl: css`
        margin-bottom: ${spacingValues.xxl};
      `,
      /** 64px bottom margin */
      xxxl: css`
        margin-bottom: ${spacingValues.xxxl};
      `,
      /** 96px bottom margin */
      xxxxl: css`
        margin-bottom: ${spacingValues.xxxxl};
      `,
    },

    left: {
      /** 0 margin on left side */
      zero: css`
        margin-left: 0;
      `,
      /** 4px left margin */
      xxs: css`
        margin-left: ${spacingValues.xxs};
      `,
      /** 6px left margin */
      xs: css`
        margin-left: ${spacingValues.xs};
      `,
      /** 8px left margin */
      s: css`
        margin-left: ${spacingValues.s};
      `,
      /** 12px left margin */
      sm: css`
        margin-left: ${spacingValues.sm};
      `,
      /** 16px left margin */
      m: css`
        margin-left: ${spacingValues.m};
      `,
      /** 24px left margin */
      l: css`
        margin-left: ${spacingValues.l};
      `,
      /** 32px left margin */
      xl: css`
        margin-left: ${spacingValues.xl};
      `,
      /** 48px left margin */
      xxl: css`
        margin-left: ${spacingValues.xxl};
      `,
      /** 64px left margin */
      xxxl: css`
        margin-left: ${spacingValues.xxxl};
      `,
      /** 96px left margin */
      xxxxl: css`
        margin-left: ${spacingValues.xxxxl};
      `,
      /** Auto left margin */
      auto: css`
        margin-left: auto;
      `,
    },

    right: {
      /** 0 margin on right side */
      zero: css`
        margin-right: 0;
      `,
      /** 4px right margin */
      xxs: css`
        margin-right: ${spacingValues.xxs};
      `,
      /** 6px right margin */
      xs: css`
        margin-right: ${spacingValues.xs};
      `,
      /** 8px right margin */
      s: css`
        margin-right: ${spacingValues.s};
      `,
      /** 16px right margin */
      m: css`
        margin-right: ${spacingValues.m};
      `,
      /** 24px right margin */
      l: css`
        margin-right: ${spacingValues.l};
      `,
      /** 32px right margin */
      xl: css`
        margin-right: ${spacingValues.xl};
      `,
      /** 48px right margin */
      xxl: css`
        margin-right: ${spacingValues.xxl};
      `,
      /** 64px right margin */
      xxxl: css`
        margin-right: ${spacingValues.xxxl};
      `,
      /** 96px right margin */
      xxxxl: css`
        margin-right: ${spacingValues.xxxxl};
      `,
      /** Auto right margin */
      auto: css`
        margin-right: auto;
      `,
    },
  },

  /**
   * Gap utilities for flexbox and grid layouts
   *
   * @example
   * ${flex.column}
   * ${spacing.gap.m}
   */
  gap: {
    /** 0 gap */
    zero: css`
      gap: 0;
    `,
    /** 2px gap */
    xxxs: css`
      gap: ${spacingValues.xxxs};
    `,
    /** 4px gap */
    xxs: css`
      gap: ${spacingValues.xxs};
    `,
    /** 6px gap */
    xs: css`
      gap: ${spacingValues.xs};
    `,
    /** 8px gap */
    s: css`
      gap: ${spacingValues.s};
    `,
    /** 12px gap */
    sm: css`
      gap: ${spacingValues.sm};
    `,
    /** 16px gap */
    m: css`
      gap: ${spacingValues.m};
    `,
    /** 24px gap */
    l: css`
      gap: ${spacingValues.l};
    `,
    /** 32px gap */
    xl: css`
      gap: ${spacingValues.xl};
    `,
    /** 40px gap */
    xmd: css`
      gap: ${spacingValues.xmd};
    `,
    /** 48px gap */
    xxl: css`
      gap: ${spacingValues.xxl};
    `,
    /** 64px gap */
    xxxl: css`
      gap: ${spacingValues.xxxl};
    `,
    /** 96px gap */
    xxxxl: css`
      gap: ${spacingValues.xxxxl};
    `,
    /** any gap */
    custom: (value: number) => css`
      gap: ${value}px;
    `,
  },
} as const;

// ============================================================================
// FLEXBOX UTILITIES
// ============================================================================

/**
 * Comprehensive flexbox utilities for layout composition
 *
 * @example
 * // Center content both horizontally and vertically
 * ${flex.center}
 *
 * // Column layout with centered items
 * ${flex.column}
 * ${flex.align.center}
 * ${flex.justify.between}
 */
export const flex = {
  one: css`
    flex: 1;
  `,
  /** Sets display: flex */
  base: css`
    display: flex;
  `,
  /** Sets display: inline-flex */
  inline: css`
    display: inline-flex;
  `,

  /** Flex container with column direction */
  column: css`
    display: flex;
    flex-direction: column;
  `,

  /** Flex container with row direction (default) */
  row: css`
    display: flex;
    flex-direction: row;
  `,

  /** Flex container with column-reverse direction */
  columnReverse: css`
    display: flex;
    flex-direction: column-reverse;
  `,

  /** Flex container with row-reverse direction */
  rowReverse: css`
    display: flex;
    flex-direction: row-reverse;
  `,

  /** Perfect centering: centers items both horizontally and vertically */
  center: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  /** Centers items horizontally (in a row) or vertically (in a column) */
  centerMain: css`
    display: flex;
    justify-content: center;
  `,

  /** Centers items vertically (in a row) or horizontally (in a column) */
  centerCross: css`
    display: flex;
    align-items: center;
  `,

  /**
   * Justify content utilities (main axis alignment)
   *
   * @example
   * ${flex.row}
   * ${flex.justify.between}
   */
  justify: {
    /** justify-content: flex-start - Align items to the start */
    start: css`
      justify-content: flex-start;
    `,

    /** justify-content: flex-end - Align items to the end */
    end: css`
      justify-content: flex-end;
    `,

    /** justify-content: center - Center items */
    center: css`
      justify-content: center;
    `,

    /** justify-content: space-between - Distribute items with space between */
    between: css`
      justify-content: space-between;
    `,

    /** justify-content: space-around - Distribute items with space around */
    around: css`
      justify-content: space-around;
    `,

    /** justify-content: space-evenly - Distribute items with equal space */
    evenly: css`
      justify-content: space-evenly;
    `,
  },

  /**
   * Align items utilities (cross axis alignment)
   *
   * @example
   * ${flex.column}
   * ${flex.align.center}
   */
  align: {
    /** align-items: flex-start - Align items to the start */
    start: css`
      align-items: flex-start;
    `,

    /** align-items: flex-end - Align items to the end */
    end: css`
      align-items: flex-end;
    `,

    /** align-items: center - Center items */
    center: css`
      align-items: center;
    `,

    /** align-items: stretch - Stretch items to fill container */
    stretch: css`
      align-items: stretch;
    `,

    /** align-items: baseline - Align items to baseline */
    baseline: css`
      align-items: baseline;
    `,
  },

  /**
   * Align self utilities (individual item cross axis alignment)
   *
   * @example
   * ${flex.self.center}
   */
  self: {
    /** align-self: flex-start */
    start: css`
      align-self: flex-start;
    `,

    /** align-self: flex-end */
    end: css`
      align-self: flex-end;
    `,

    /** align-self: center */
    center: css`
      align-self: center;
    `,

    /** align-self: stretch */
    stretch: css`
      align-self: stretch;
    `,

    /** align-self: baseline */
    baseline: css`
      align-self: baseline;
    `,

    /** align-self: auto */
    auto: css`
      align-self: auto;
    `,
  },

  /**
   * Justify self utilities (individual item main axis alignment)
   *
   * @example
   * ${flex.justifySelf.center}
   */
  justifySelf: {
    /** justify-self: flex-start */
    start: css`
      justify-self: flex-start;
    `,

    /** justify-self: flex-end */
    end: css`
      justify-self: flex-end;
    `,

    /** justify-self: center */
    center: css`
      justify-self: center;
    `,

    /** justify-self: stretch */
    stretch: css`
      justify-self: stretch;
    `,

    /** justify-self: baseline */
    baseline: css`
      justify-self: baseline;
    `,

    /** justify-self: auto */
    auto: css`
      justify-self: auto;
    `,
  },

  /**
   * Flex wrap utilities
   */
  wrap: {
    /** flex-wrap: wrap - Allow items to wrap */
    wrap: css`
      flex-wrap: wrap;
    `,

    /** flex-wrap: nowrap - Prevent wrapping (default) */
    nowrap: css`
      flex-wrap: nowrap;
    `,

    /** flex-wrap: wrap-reverse - Wrap in reverse */
    reverse: css`
      flex-wrap: wrap-reverse;
    `,
  },

  /**
   * Flex item utilities
   */
  item: {
    /** flex: 1 - Item grows and shrinks, base size 0 */
    grow: css`
      flex: 1;
    `,

    /** flex: 0 0 auto - Item neither grows nor shrinks */
    shrink0: css`
      flex-shrink: 0;
    `,

    /** flex: none - Item is inflexible */
    none: css`
      flex: none;
    `,

    /** flex: auto - Item is fully flexible */
    auto: css`
      flex: auto;
    `,
  },
} as const;

// ============================================================================
// GRID UTILITIES
// ============================================================================

/**
 * CSS Grid layout utilities
 *
 * @example
 * ${grid.base}
 * ${grid.cols(3)}
 * ${spacing.gap.m}
 */
export const grid = {
  /** Sets display: grid */
  base: css`
    display: grid;
  `,

  /** Sets display: inline-grid */
  inline: css`
    display: inline-grid;
  `,

  /**
   * Creates a grid with specified number of equal columns
   *
   * @example
   * ${grid.cols(3)} // Creates 3 equal columns
   */
  cols: (count: number) => css`
    grid-template-columns: repeat(${count}, 1fr);
  `,

  /**
   * Creates a grid with specified number of equal rows
   */
  rows: (count: number) => css`
    grid-template-rows: repeat(${count}, 1fr);
  `,

  /**
   * Creates an auto-fit responsive grid with minimum column width
   *
   * @example
   * ${grid.autoFit('250px')} // Columns auto-fit with 250px minimum
   */
  autoFit: (minWidth: string) => css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${minWidth}, 1fr));
  `,

  /**
   * Creates an auto-fill responsive grid with minimum column width
   */
  autoFill: (minWidth: string) => css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${minWidth}, 1fr));
  `,

  /** Grid item placement utilities */
  item: {
    /** Span specified number of columns */
    colSpan: (span: number) => css`
      grid-column: span ${span};
    `,

    /** Span specified number of rows */
    rowSpan: (span: number) => css`
      grid-row: span ${span};
    `,
  },
} as const;

// ============================================================================
// COLOR SYSTEM
// ============================================================================

/**
 * Standardized color palette from theme
 * Access colors consistently across the application
 *
 * @example
 * color: ${colors.text.primary};
 * background-color: ${colors.background.default};
 */
export const colors = {
  border: {
    default: '#e4e3e0',
    tagBorder: '#4A4A4A40',
    exampleLabel: '#A0750133',
    dataBlock: '#DADADA',
  },
  /** Primary brand colors */
  primary: {
    /** Primary color: #B6F0D1 */
    main: '#B6F0D1',
    /** Primary contrast text: #0E0E0E */
    contrast: '#0E0E0E',
  },

  /** Background colors */
  background: {
    /** Default background: #FBFAF3 */
    default: '#FBFAF3',
    /** Paper/card background: #FFFDEA */
    paper: '#FFFDEA',
    /** Project/content background: #FFFEFA */
    project: '#FFFEFA',
    /** Light beige background for containers: #F5F4F0 */
    light: '#F5F4F0',
    /** Dark background: #0E0E0E */
    dark: '#000000',
    /** Card and component background rgba(237, 235, 219, 1) */
    card: '#edebdbff',
    /** Components gray background rgba(246, 245, 237, 1)*/
    component: '#f6f5ed',

    /** Section background: #F6F5ED */
    section: '#F6F5ED',
    /** Secondary background: #4A4A4A0D */
    secondary: '#4A4A4A0D',
    /** Hover background: #F5F4F0 */
    hover: '#F5F4F0',
    /** Tag background: #FFFDEA */
    tagBorder: '#4A4A4A40',
    /** Accent/selected background: #F5F1D2 */
    accent: '#F5F1D2',
  },

  /** Text colors */
  text: {
    /** Primary text: #000 */
    primary: '#000',
    /** Secondary text: rgba(14, 14, 14, 0.7) */
    secondary: '#4A4A4AA6',
    /** Unselected Option rgba(23, 23, 25, 1)*/
    unselected: '#171719ff',
    /** Secondary opacity variant rgba(74, 74, 74, 0.65)*/
    variants: {
      secondary: {
        op75: '#4a4a4aBF',
        op65: '#4a4a4aa6',
        op50: '#4a4a4a80',
        op25: '#4a4a4a40',
      },
    },
    /** Alert states  */
    alert: '#a07501',
    /** Dark text: #0E0E0E */
    dark: '#1B1B21',
  },

  /** Semantic colors */
  semantic: {
    /** Success/positive states */
    success: '#63C700',
    /** Warning states */
    warning: '#FFDA1B',
    /** Alert states  */
    alert: '#EF753C',
    /** Error/danger states */
    error: '#FF3A3A',
    /** Info states */
    info: '#2196F3',
    /** Step background: #FAF7DE */
    step: '#FAF7DE',
    /** Error light states */
    errorLight: '#DA1515',
  },

  /** Neutral grayscale */
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#e4e3e0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray650: '#4A4A4A',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
  },

  /** Accent colors for label bubbles and special elements */
  accent: {
    /** Yellow accent for Crypto: #FFE55E */
    yellow: '#FFE55E',
    /** Teal accent for Oversight: #CAC200 */
    green: '#CAC200',
    /** Mint accent for Risk: #74D0A2 */
    mint: '#74D0A2',
    /** Lime accent for Entry: #63C700 */
    lime: '#63C700',
    /** Orange accent for 3 badges: #FFBB00 */
    orange: '#FFBB00',
  },

  /** Backdrop/overlay colors */
  backdrop: {
    /** Modal backdrop: rgba(0, 0, 0, 0.4) */
    modal: 'rgba(0, 0, 0, 0.4)',
  },

  /** Alert colors for notification messages */
  alert: {
    warning: {
      /** Warning background: #FCEC9A80 */
      background: '#FCEC9A80',
      /** Warning text: #A07501 */
      text: '#A07501',
    },
    info: {
      /** Info background: rgba(33, 150, 243, 0.1) */
      background: 'rgba(33, 150, 243, 0.1)',
      /** Info text: #2196F3 */
      text: '#2196F3',
    },
    error: {
      /** Error background: rgba(218, 21, 21, 0.1) */
      background: 'rgba(218, 21, 21, 0.1)',
      /** Error text: #DA1515 */
      text: '#DA1515',
    },
    success: {
      /** Success background: rgba(99, 199, 0, 0.1) */
      background: 'rgba(99, 199, 0, 0.1)',
      /** Success text: #63C700 */
      text: '#63C700',
    },
  },

  /** Status colors for progress bars and data coverage indicators */
  status: {
    /** Green for high coverage (90%+): #138B0D */
    green: '#138B0D',
    /** Yellow for medium-high coverage (50-89%): #A07501 */
    yellow: '#A07501',
    /** Orange for low coverage (30-49%): #E25919 */
    orange: '#E25919',
    /** Red for critical low coverage (<30%): #DA1515 */
    red: '#DA1515',
  },

  yellow: {
    main: '#A07501',
    background: '#FCEC9A80',
  },
  donutChart: {
    green: '#138B0D',
    lime: '#63C700',
    mint: '#74D0A2',
    olive: '#CAC200',
    teal: '#57B894',
    spring: '#5AC256',
  },

  /** Badge colors with opacity variants */
  badge: {
    /** Red badge color */
    red: {
      text: '#DA1515',
      background: '#DA15151A', // 10% opacity
      backgroundSecondary: '#DA151533', // 20% opacity when subValue exists
    },
    /** Orange badge color */
    orange: {
      text: '#E25919',
      background: '#E259191A', // 10% opacity
      backgroundSecondary: '#E2591933', // 20% opacity when subValue exists
    },
    /** Yellow badge color */
    yellow: {
      text: '#A07501',
      background: '#FFBB0026', // 15% opacity
      backgroundSecondary: '#FFBB0033', // 20% opacity when subValue exists
    },
    /** Green badge color */
    green: {
      text: '#138B0D',
      background: '#138B0D1A', // 10% opacity
      backgroundSecondary: '#138B0D33', // 20% opacity when subValue exists
    },
    /** Gray badge color */
    gray: {
      text: '#4A4A4ABF',
      background: '#4A4A4A1A', // 10% opacity
      backgroundSecondary: '#4A4A4A33', // 20% opacity when subValue exists
    },
  },

  /** Star rating colors */
  star: {
    /** Filled star color: #4A4A4A */
    filled: '#4A4A4A',
    /** Unfilled star color: #F5F1D2 */
    unfilled: '#F5F1D2',
  },
  heatMap: {
    base: '#4A4A4A',
  },
  /** Chart colors for data visualization */
  chart: {
    /** Orange-red for Security category: #FF6B35 */
    security: '#FF6B35',
    /** Red-orange for Financial category: #F7931E */
    financial: '#F7931E',
    /** Light green for Operational category: #7CB342 */
    operational: '#7CB342',
    /** Teal for Reputational category: #26A69A */
    reputational: '#26A69A',
    /** Light orange for Regulatory category: #FFB74D */
    regulatory: '#FFB74D',
    /** Green for Dependency category: #388E3C */
    dependency: '#388E3C',
    /** Red for negative values in stacked bar charts: #EF3F3C */
    negative: '#EF3F3C',
    /** Green for positive values in stacked bar charts: #63C700 */
    positive: '#63C700',
    /** Tick color for chart axes: gray650 with 50% opacity */
    tickColor: '#4A4A4A80',
  },
} as const;
// ============================================================================
// GRADIENT SYSTEM
// ============================================================================

/**
 * Reusable gradient definitions for consistent visual effects
 *
 * @example
 * background: ${gradients.authorizationRadial};
 */
export const gradients = {
  mainRadial: `radial-gradient(
    circle,
    rgba(213, 252, 146, 0.6) 0%,
    rgba(255, 249, 183, 0.8) 30%,
    rgba(255, 255, 255, 0) 70%,
    rgba(255, 255, 255, 0) 100%
  )`,

  authorizationRadial: `
  radial-gradient(
    circle,
    rgba(213, 252, 146, 0.31) 0.15%,
    rgba(255, 249, 183, 0.7) 20%,
    rgba(255, 255, 255, 0) 70%,
    rgba(255, 255, 255, 0) 100%
  ),
  linear-gradient(
    120deg,
  #FFFDEA,
  #FAF7DE
  )
`,
  comingSoonOverlay: `linear-gradient(
    to bottom,
    rgba(246, 245, 237, 0) 0%,
    rgba(246, 245, 237, 0.8) 30%,
    rgba(246, 245, 237, 1) 60%
  )`,

  /** Background replacement gradient for logo on request access page*/
  logoGradient: `linear-gradient(
    135deg,
    ${colors.primary.main} 0%,
    ${colors.accent.mint} 50%,
    ${colors.accent.lime} 100%
  )`,

  /** Chart colors for data visualization */
  chart: {
    /** Orange-red for Security category: #FF6B35 */
    security: '#FF6B35',
    /** Red-orange for Financial category: #F7931E */
    financial: '#F7931E',
    /** Light green for Operational category: #7CB342 */
    operational: '#7CB342',
    /** Teal for Reputational category: #26A69A */
    reputational: '#26A69A',
    /** Light orange for Regulatory category: #FFB74D */
    regulatory: '#FFB74D',
    /** Green for Dependency category: #388E3C */
    dependency: '#388E3C',
  },
} as const;
// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

/**
 * Typography values for use in plain JavaScript objects (e.g., React.CSSProperties)
 * Use these when you need raw string values instead of Emotion CSS-in-JS
 *
 * @example
 * const style: React.CSSProperties = {
 *   fontSize: typographyValues.fontSize.xs,
 *   fontFamily: typographyValues.fontFamily.primary,
 * };
 */
export const typographyValues = {
  /** Font family values */
  fontFamily: {
    /** Primary font: Aeonik */
    primary: 'var(--font-aeonik), sans-serif',
    /** Display font: PP Mori */
    display: 'var(--font-pp-mori), sans-serif',
    /** Monospace font: JetBrains Mono */
    mono: 'var(--font-jetbrains-mono), monospace',
  },
  /** Font size values */
  fontSize: {
    /** 0.625rem (10px) */
    '2xs': '0.625rem',
    /** 0.75rem (12px) */
    xs: '0.75rem',
    /** 0.875rem (14px) */
    sm: '0.875rem',
    /** 1rem (16px) - base size */
    base: '1rem',
    /** 1.125rem (18px) */
    lg: '1.125rem',
    /** 1.25rem (20px) */
    xl: '1.25rem',
    /** 1.5rem (24px) */
    '2xl': '1.5rem',
    /** 1.875rem (30px) */
    '3xl': '1.875rem',
    /** 2.25rem (36px) */
    '4xl': '2.25rem',
    /** 3rem (48px) */
    '5xl': '3rem',
    /** 3.75rem (60px) */
    '6xl': '3.75rem',
    /** 4.5rem (72px) */
    '7xl': '4.5rem',
  },
  /** Font weight values */
  fontWeight: {
    /** font-weight: 300 */
    light: 300,
    /** font-weight: 400 */
    normal: 400,
    /** font-weight: 500 */
    medium: 500,
    /** font-weight: 600 */
    semibold: 600,
    /** font-weight: 700 */
    bold: 700,
    /** font-weight: 800 */
    extrabold: 800,
  },
} as const;

/**
 * Typography utilities for consistent text styling
 *
 * @example
 * ${typography.fontSize.lg}
 * ${typography.fontWeight.bold}
 * ${typography.lineHeight.tight}
 */
export const typography = {
  /** Font family utilities */
  fontFamily: {
    /** Primary font: Aeonik */
    primary: css`
      font-family: var(--font-aeonik);
    `,
    /** Display font: PP Mori */
    display: css`
      font-family: var(--font-pp-mori);
    `,
    /** Monospace font: JetBrains Mono */
    mono: css`
      font-family: var(--font-jetbrains-mono), monospace;
    `,
  },

  /** Font size scale */
  fontSize: {
    /** 0.625rem (10px) */
    '2xs': css`
      font-size: 0.625rem;
    `,
    /** 0.75rem (12px) */
    xs: css`
      font-size: 0.75rem;
    `,
    /** 0.875rem (14px) */
    sm: css`
      font-size: 0.875rem;
    `,
    /** 1rem (16px) - base size */
    base: css`
      font-size: 1rem;
    `,
    /** 1.125rem (18px) */
    lg: css`
      font-size: 1.125rem;
    `,
    /** 1.25rem (20px) */
    xl: css`
      font-size: 1.25rem;
    `,
    /** 1.5rem (24px) */
    '2xl': css`
      font-size: 1.5rem;
    `,
    /** 1.875rem (30px) */
    '3xl': css`
      font-size: 1.875rem;
    `,
    /** 1.875rem (32px) */
    '3.5xl': css`
      font-size: 1.875rem;
    `,
    /** 2.25rem (36px) */
    '4xl': css`
      font-size: 2.25rem;
    `,
    /** 3rem (48px) */
    '5xl': css`
      font-size: 3rem;
    `,
    /** 3.75rem (60px) */
    '6xl': css`
      font-size: 3.75rem;
    `,
    /** 4.5rem (72px) */
    '7xl': css`
      font-size: 4.5rem;
    `,
    /** Custom font size in pixels */
    custom: (px: number) => css`
      font-size: ${px}px;
    `,
  },

  /** Font weight utilities */
  fontWeight: {
    /** font-weight: 300 */
    light: css`
      font-weight: 300;
    `,
    /** font-weight: 400 */
    normal: css`
      font-weight: 400;
    `,
    /** font-weight: 500 */
    medium: css`
      font-weight: 500;
    `,
    /** font-weight: 600 */
    semibold: css`
      font-weight: 600;
    `,
    /** font-weight: 700 */
    bold: css`
      font-weight: 700;
    `,
    /** font-weight: 800 */
    extrabold: css`
      font-weight: 800;
    `,
  },

  /** Line height utilities */
  lineHeight: {
    /** line-height: 0.8 - Tightest */
    tighter: css`
      line-height: 0.8;
    `,
    /** line-height: 1 - None */
    none: css`
      line-height: 1;
    `,
    /** line-height: 1.2 - Tight */
    tight: css`
      line-height: 1.2;
    `,
    /** line-height: 1.5 - Normal */
    normal: css`
      line-height: 1.5;
    `,
    /** line-height: 1.6 - Relaxed */
    relaxed: css`
      line-height: 1.6;
    `,
    /** line-height: 2 - Loose */
    loose: css`
      line-height: 2;
    `,
  },

  /** Letter spacing utilities */
  letterSpacing: {
    /** letter-spacing: -0.05em */
    tighter: css`
      letter-spacing: -0.05em;
    `,
    /** letter-spacing: -0.025em */
    tight: css`
      letter-spacing: -0.025em;
    `,
    /** letter-spacing: 0 */
    normal: css`
      letter-spacing: 0;
    `,
    /** letter-spacing: 0.025em */
    wide: css`
      letter-spacing: 0.025em;
    `,
    /** letter-spacing: 0.05em */
    wider: css`
      letter-spacing: 0.05em;
    `,
    /** letter-spacing: 0.1em */
    widest: css`
      letter-spacing: 0.1em;
    `,
  },

  /** Text alignment utilities */
  textAlign: {
    /** text-align: left */
    left: css`
      text-align: left;
    `,
    /** text-align: center */
    center: css`
      text-align: center;
    `,
    /** text-align: right */
    right: css`
      text-align: right;
    `,
    /** text-align: justify */
    justify: css`
      text-align: justify;
    `,
  },

  /** Text transform utilities */
  textTransform: {
    /** text-transform: uppercase */
    uppercase: css`
      text-transform: uppercase;
    `,
    /** text-transform: lowercase */
    lowercase: css`
      text-transform: lowercase;
    `,
    /** text-transform: capitalize */
    capitalize: css`
      text-transform: capitalize;
    `,
    /** text-transform: none */
    none: css`
      text-transform: none;
    `,
  },

  /** Text decoration utilities */
  textDecoration: {
    /** text-decoration: underline */
    underline: css`
      text-decoration: underline;
    `,
    /** text-decoration: line-through */
    lineThrough: css`
      text-decoration: line-through;
    `,
    /** text-decoration: none */
    none: css`
      text-decoration: none;
    `,
  },
  textOverflow: {
    ellipsis: css`
      text-overflow: ellipsis;
    `,
  },

  whiteSpace: {
    nowrap: css`
      white-space: nowrap;
    `,
    preLine: css`
      white-space: pre-line;
    `,
    normal: css`
      white-space: normal;
    `,
  },

  /** Word Break utilities  */
  wordBreak: {
    /** word-break: break-word */
    breakWord: css`
      word-break: break-word;
    `,
    /** word-break: break-all */
    breakAll: css`
      word-break: break-all;
    `,
    /** word-break: normal */
    normal: css`
      word-break: normal;
    `,
  },
} as const;

/**
 * Coloring utilities for element coloring
 *
 * @example
 * ${coloring.background.default}
 * ${coloring.text.primary}
 */
export const coloring = {
  border: {
    default: css`
      border-color: ${colors.border.default};
    `,
    tagBorder: css`
      border-color: ${colors.border.tagBorder};
    `,
  },
  status: {
    green: css`
      color: ${colors.status.green};
    `,
    yellow: css`
      color: ${colors.status.yellow};
    `,
    red: css`
      color: ${colors.status.red};
    `,
    orange: css`
      color: ${colors.status.orange};
    `,
  },
  semantic: {
    success: css`
      color: ${colors.semantic.success};
    `,
    error: css`
      color: ${colors.semantic.error};
    `,
  },
  background: {
    default: css`
      background-color: ${colors.background.default};
    `,
    paper: css`
      background-color: ${colors.background.paper};
    `,
    project: css`
      background-color: ${colors.background.project};
    `,
    neutral: {
      white: css`
        background-color: ${colors.neutral.white};
      `,
      gray100: css`
        background-color: ${colors.neutral.gray100};
      `,
      gray200: css`
        background-color: ${colors.neutral.gray200};
      `,
      gray300: css`
        background-color: ${colors.neutral.gray300};
      `,
      gray400: css`
        background-color: ${colors.neutral.gray400};
      `,
      default: css`
        background-color: ${colors.neutral.white};
      `,
      dark: css`
        background-color: ${colors.neutral.black};
      `,
    },
    primary: css`
      background-color: ${colors.text.primary};
    `,
    dark: css`
      background-color: ${colors.background.dark};
    `,
    section: css`
      background-color: ${colors.background.section};
    `,
    light: css`
      background-color: ${colors.background.light};
    `,
    yellow: css`
      background-color: ${colors.yellow.background};
    `,
    secondary: css`
      background-color: ${colors.background.secondary};
    `,
    transparent: css`
      background-color: transparent;
    `,
    chart: {
      security: css`
        background-color: ${colors.chart.security};
      `,
      financial: css`
        background-color: ${colors.chart.financial};
      `,
      operational: css`
        background-color: ${colors.chart.operational};
      `,
      reputational: css`
        background-color: ${colors.chart.reputational};
      `,
      regulatory: css`
        background-color: ${colors.chart.regulatory};
      `,
      dependency: css`
        background-color: ${colors.chart.dependency};
      `,
      negative: css`
        background-color: ${colors.chart.negative};
      `,
      positive: css`
        background-color: ${colors.chart.positive};
      `,
    },
    custom: (color: string) => css`
      background-color: ${color};
    `,
  },
  text: {
    success: css`
      color: ${colors.semantic.success};
    `,
    error: css`
      color: ${colors.semantic.error};
    `,
    primary: css`
      color: ${colors.text.primary};
    `,
    secondary: css`
      color: ${colors.text.secondary};
    `,
    variants: {
      secondary: {
        op75: css`
          color: ${colors.text.variants.secondary.op75};
        `,
        op65: css`
          color: ${colors.text.variants.secondary.op65};
        `,
        op50: css`
          color: ${colors.text.variants.secondary.op50};
        `,
        op25: css`
          color: ${colors.text.variants.secondary.op25};
        `,
      },
    },
    dark: css`
      color: ${colors.text.dark};
    `,
    yellow: css`
      color: ${colors.yellow.main};
    `,
    neutral: {
      white: css`
        color: ${colors.neutral.white};
      `,
      black: css`
        color: ${colors.neutral.black};
      `,
    },
    chart: {
      security: css`
        color: ${colors.chart.security};
      `,
      financial: css`
        color: ${colors.chart.financial};
      `,
      operational: css`
        color: ${colors.chart.operational};
      `,
      reputational: css`
        color: ${colors.chart.reputational};
      `,
      regulatory: css`
        color: ${colors.chart.regulatory};
      `,
      dependency: css`
        color: ${colors.chart.dependency};
      `,
      negative: css`
        color: ${colors.chart.negative};
      `,
      positive: css`
        color: ${colors.chart.positive};
      `,
    },
    custom: (color: string) => css`
      color: ${color};
    `,
  },

  /** Badge colors with opacity variants */
  badge: {
    /** Red badge color */
    red: {
      text: `color: ${colors.badge.red.text};`,
      background: `background-color: ${colors.badge.red.background};`, // 10% opacity
      backgroundSecondary: `background-color: ${colors.badge.red.backgroundSecondary};`, // 20% opacity when subValue exists
    },
    /** Orange badge color */
    orange: {
      text: `color: ${colors.badge.orange.text};`,
      background: `background-color: ${colors.badge.orange.background};`, // 10% opacity
      backgroundSecondary: `background-color: ${colors.badge.orange.backgroundSecondary};`, // 20% opacity when subValue exists
    },
    /** Yellow badge color */
    yellow: {
      text: `color: ${colors.badge.yellow.text};`,
      background: `background-color: ${colors.badge.yellow.background};`, // 10% opacity
      backgroundSecondary: `background-color: ${colors.badge.yellow.backgroundSecondary};`, // 20% opacity when subValue exists
    },
    /** Green badge color */
    green: {
      text: `color: ${colors.badge.green.text};`,
      background: `background-color: ${colors.badge.green.background};`, // 10% opacity
      backgroundSecondary: `background-color: ${colors.badge.green.backgroundSecondary};`, // 20% opacity when subValue exists
    },
    /** Gray badge color */
    gray: {
      text: `color: ${colors.badge.gray.text};`,
      background: `background-color: ${colors.badge.gray.background};`, // 10% opacity
      backgroundSecondary: `background-color: ${colors.badge.gray.backgroundSecondary};`, // 20% opacity when subValue exists
    },
    component: {
      background: css`
        background-color: ${colors.background.component};
      `,
      text: css`
        color: ${colors.text.primary};
      `,
      backgroundSecondary: css`
        background-color: ${colors.badge.gray.backgroundSecondary};
      `,
    },
  },
} as const;

export const overflow = {
  hidden: css`
    overflow: hidden;
  `,
  visible: css`
    overflow: visible;
  `,
  auto: css`
    overflow: auto;
  `,
  scroll: css`
    overflow: scroll;
  `,
  y: {
    hidden: css`
      overflow-y: hidden;
    `,
    scroll: css`
      overflow-y: scroll;
    `,
    auto: css`
      overflow-y: auto;
    `,
    visible: css`
      overflow-y: visible;
    `,
  },
  x: {
    hidden: css`
      overflow-x: hidden;
    `,
    scroll: css`
      overflow-x: scroll;
    `,
    auto: css`
      overflow-x: auto;
    `,
    visible: css`
      overflow-x: visible;
    `,
  },
};

// ============================================================================
// VISIBILITY UTILITIES
// ============================================================================
/**
 * Visibility utilities for element visibility control
 *
 * @example
 * ${visibility.visible}
 * ${visibility.hidden}
 */
export const visibility = {
  /** visibility: visible */
  visible: css`
    visibility: visible;
  `,
  /** visibility: hidden */
  hidden: css`
    visibility: hidden;
  `,
} as const;
/**
 * White-space utilities for text wrapping
 *
 * @example
 * ${whiteSpace.nowrap}
 * ${whiteSpace.normal}
 */
export const whiteSpace = {
  /** white-space: normal */
  normal: css`
    white-space: normal;
  `,
  /** white-space: nowrap */
  nowrap: css`
    white-space: nowrap;
  `,
  /** white-space: pre */
  pre: css`
    white-space: pre;
  `,
  /** white-space: pre-wrap */
  preWrap: css`
    white-space: pre-wrap;
  `,
  /** white-space: pre-line */
  preLine: css`
    white-space: pre-line;
  `,
  /** white-space: break-spaces */
  breakSpaces: css`
    white-space: break-spaces;
  `,
} as const;

/**
 * Display utilities for element display
 *
 * @example
 * ${display.inline}
 * ${display.block}
 * ${display.inlineBlock}
 * ${display.flex}
 * ${display.inlineFlex}
 */
export const display = {
  none: css`
    display: none;
  `,
  /** display: flex */
  flex: css`
    display: flex;
  `,
  inlineFlex: css`
    display: inline-flex;
  `,
  inline: css`
    display: inline;
  `,
  block: css`
    display: block;
  `,
  inlineBlock: css`
    display: inline-block;
  `,
  /** Sets display: -webkit-box */
  box: css`
    display: -webkit-box;
  `,
};

// ============================================================================
// POSITION UTILITIES
// ============================================================================

/**
 * Position utilities for element positioning
 *
 * @example
 * ${position.absolute}
 * ${position.inset.zero}
 */
export const position = {
  left: {
    zero: css`
      left: 0;
    `,
    full: css`
      left: 100%;
    `,
    half: css`
      left: 50%;
    `,
    unset: css`
      left: unset;
    `,
    custom: (value: string) => css`
      left: ${value};
    `,
  },
  right: {
    zero: css`
      right: 0;
    `,
    full: css`
      right: 100%;
    `,
    half: css`
      right: 50%;
    `,
    unset: css`
      right: unset;
    `,
    custom: (value: string) => css`
      right: ${value};
    `,
  },
  top: {
    zero: css`
      top: 0;
    `,
    full: css`
      top: 100%;
    `,
    half: css`
      top: 50%;
    `,
    auto: css`
      top: auto;
    `,
    custom: (value: string) => css`
      top: ${value};
    `,
  },
  bottom: {
    zero: css`
      bottom: 0;
    `,
    full: css`
      bottom: 100%;
    `,
    half: css`
      bottom: 50%;
    `,
    custom: (value: string) => css`
      bottom: ${value};
    `,
  },
  /** position: relative */
  relative: css`
    position: relative;
  `,

  /** position: absolute */
  absolute: css`
    position: absolute;
  `,

  /** position: fixed */
  fixed: css`
    position: fixed;
  `,

  /** position: sticky */
  sticky: css`
    position: sticky;
  `,

  /** position: static */
  static: css`
    position: static;
  `,

  /** Inset utilities (top, right, bottom, left) */
  inset: {
    /** Set all sides to 0 */
    zero: css`
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    `,

    /** Set all sides to auto */
    auto: css`
      top: auto;
      right: auto;
      bottom: auto;
      left: auto;
    `,

    /** Center absolute element */
    centered: css`
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `,
  },

  /** Z-index utilities */
  zIndex: {
    /** z-index: -1 */
    negative: css`
      z-index: -1;
    `,
    /** z-index: 0 */
    base: css`
      z-index: 0;
    `,
    /** z-index: 1 - Low level stacking (e.g., sticky headers within containers) */
    above: css`
      z-index: 1;
    `,
    /** z-index: 10 */
    dropdown: css`
      z-index: 10;
    `,
    /** z-index: 20 */
    sticky: css`
      z-index: 20;
    `,
    /** z-index: 30 */
    fixed: css`
      z-index: 30;
    `,
    /** z-index: 40 */
    modalBackdrop: css`
      z-index: 40;
    `,
    /** z-index: 50 */
    modal: css`
      z-index: 50;
    `,
    /** z-index: 60 */
    popover: css`
      z-index: 60;
    `,
    /** z-index: 70 */
    tooltip: css`
      z-index: 70;
    `,
    /** z-index: 100 */
    mobileOverlay: css`
      z-index: 100;
    `,
  },
} as const;

export const sizeNumberValues = {
  /** 0 */
  zero: 0,
  /** 4 */
  xxxs: 4,
  /** 8 */
  xxs: 8,
  /** 8 */
  s: 8,
  /** 12 */
  xs: 12,
  /** 16 */
  sm: 16,
  /** 20 */
  xsm: 20,
  /** 24 */
  md: 24,
  /** 32 */
  lg: 32,
  /** 48 */
  xl: 48,
  /** 64 */
  xxl: 64,
  /** 72 */
  header: 72,
  /** 96 */
  xxxl: 96,
  /** 180 */
  '2xl': 180,
  /** 240 */
  '4xl': 240,
  /** 320 */
  '5xl': 320,
  /** 400 */
  sidebar: 400,
  /** 720 */
  '6xl': 720,
  /** 800 */
  '7xl': 800,
  /** 1200 */
  '8xl': 1200,
} as const;

// ============================================================================
// SIZING UTILITIES
// ============================================================================

/**
 * Size values for width, height, and related properties
 * Uses rem units for proportional scaling with root font-size
 * sizeNumberValues still provides raw numbers for JS calculations
 */
export const sizeValues = {
  /** 0 - No size */
  zero: '0',
  /** 0.25rem (4px at 16px base) */
  xxxs: '0.25rem',
  /** 0.5rem (8px at 16px base) */
  xxs: '0.5rem',
  /** 0.5rem (8px at 16px base) */
  s: '0.5rem',
  /** 0.75rem (12px at 16px base) */
  xs: '0.75rem',
  /** 1rem (16px at 16px base) */
  sm: '1rem',
  /** 1.25rem (20px at 16px base) */
  xsm: '1.25rem',
  /** 1.5rem (24px at 16px base) */
  md: '1.5rem',
  /** 2rem (32px at 16px base) */
  lg: '2rem',
  /** 2.5rem (40px at 16px base) */
  xmd: '2.5rem',
  /** 3rem (48px at 16px base) */
  xl: '3rem',
  /** 4rem (64px at 16px base) */
  xxl: '4rem',
  /** 6rem (96px at 16px base) */
  xxxl: '6rem',
  /** 11.25rem (180px at 16px base) */
  '2xl': '11.25rem',
  /** 15rem (240px at 16px base) */
  '4xl': '15rem',
  /** 25rem (400px at 16px base) */
  sidebar: '25rem',
  /** 20rem (320px at 16px base) */
  '5xl': '20rem',
  /** 45rem (720px at 16px base) */
  '6xl': '45rem',
  /** 50rem (800px at 16px base) */
  '7xl': '50rem',
  /** 75rem (1200px at 16px base) */
  '8xl': '75rem',
  /** 100% */
  full: '100%',
  /** 100vw */
  screen: '100vw',
} as const;
/**
 * Size utilities for width and height
 *
 * @example
 * ${size.width.full}
 * ${size.height.screen}
 */
export const size = {
  /** Width utilities */
  width: {
    /** width: 0 */
    zero: css`
      width: 0;
    `,
    /** width: 1px */
    px: css`
      width: 1px;
    `,
    /** width: 4px */
    xxxs: css`
      width: ${sizeValues.xxxs};
    `,
    /** width: 8px */
    xxs: css`
      width: ${sizeValues.xxs};
    `,
    /** width: 8px */
    s: css`
      width: ${sizeValues.s};
    `,
    /** width: 12px */
    xs: css`
      width: ${sizeValues.xs};
    `,
    /** width: 16px */
    sm: css`
      width: ${sizeValues.sm};
    `,
    /** width: 20px */
    xsm: css`
      width: ${sizeValues.xsm};
    `,
    /** width: 24px */
    md: css`
      width: ${sizeValues.md};
    `,
    /** width: 32px */
    lg: css`
      width: ${sizeValues.lg};
    `,
    /** width: 48px */
    xl: css`
      width: ${sizeValues.xl};
    `,
    /** width: 64px */
    xxl: css`
      width: ${sizeValues.xxl};
    `,
    /** width: 96px */
    xxxl: css`
      width: ${sizeValues.xxxl};
    `,
    /** width: 240px */
    '4xl': css`
      width: ${sizeValues['4xl']};
    `,
    /** width: 500px */
    '4.5xl': css`
      width: 500px;
    `,
    /** width: 320px */
    '5xl': css`
      width: ${sizeValues['5xl']};
    `,
    /** width: 720px */
    '6xl': css`
      width: ${sizeValues['6xl']};
    `,
    /** width: 800px */
    '7xl': css`
      width: ${sizeValues['7xl']};
    `,
    /** width: 1200px */
    '8xl': css`
      width: ${sizeValues['8xl']};
    `,
    /** width: unset */
    unset: css`
      width: unset;
    `,
    /** width: 50% */
    half: css`
      width: 50%;
    `,
    /** width: 100% */
    full: css`
      width: 100%;
    `,
    /** width: 100vw */
    screen: css`
      width: 100vw;
    `,
    /** width: auto */
    auto: css`
      width: auto;
    `,
    /** width: fit-content */
    fit: css`
      width: fit-content;
    `,
    /** width: min-content */
    min: css`
      width: min-content;
    `,
    /** width: max-content */
    max: css`
      width: max-content;
    `,
    /** width: 400px - Sidebar width */
    sidebar: css`
      width: ${sizeValues.sidebar};
    `,
    custom: (value: string) => css`
      width: ${value};
    `,
  },

  /** Height utilities */
  height: {
    calc: (value: string) => css`
      height: calc(${value});
    `,
    /** height: 0 */
    zero: css`
      height: 0;
    `,
    /** height: 1px */
    px: css`
      height: 1px;
    `,
    /** height: 8px */
    s: css`
      height: ${sizeValues.s};
    `,
    /** height: 4px */
    xxxs: css`
      height: ${sizeValues.xxxs};
    `,
    /** height: 8px */
    xxs: css`
      height: ${sizeValues.xxs};
    `,
    /** height: 12px */
    xs: css`
      height: ${sizeValues.xs};
    `,
    /** height: 16px */
    sm: css`
      height: ${sizeValues.sm};
    `,
    /** height: 20px */
    xsm: css`
      height: ${sizeValues.xsm};
    `,
    /** height: 24px */
    md: css`
      height: ${sizeValues.md};
    `,
    /** height: 32px */
    lg: css`
      height: ${sizeValues.lg};
    `,
    /** height: 40px */
    xmd: css`
      height: ${sizeValues.xmd};
    `,
    /** height: 48px */
    xl: css`
      height: ${sizeValues.xl};
    `,
    /** height: 64px */
    xxl: css`
      height: ${sizeValues.xxl};
    `,
    /** height: 96px */
    xxxl: css`
      height: ${sizeValues.xxxl};
    `,
    /** height: 240px */
    '4xl': css`
      height: ${sizeValues['4xl']};
    `,
    /** height: 320px */
    '5xl': css`
      height: ${sizeValues['5xl']};
    `,
    /** height: 720px */
    '6xl': css`
      height: ${sizeValues['6xl']};
    `,
    /** height: 800px */
    '7xl': css`
      height: ${sizeValues['7xl']};
    `,
    /** height: 1200px */
    '8xl': css`
      height: ${sizeValues['8xl']};
    `,
    /** height: 100% */
    full: css`
      height: 100%;
    `,
    /** height: 100vh */
    screen: css`
      height: 100vh;
    `,
    /** height: auto */
    auto: css`
      height: auto;
    `,
    /** height: fit-content */
    fit: css`
      height: fit-content;
    `,
    /** height: min-content */
    min: css`
      height: min-content;
    `,
    /** height: max-content */
    max: css`
      height: max-content;
    `,
    custom: (value: string) => css`
      height: ${value};
    `,
  },

  /** Min-width utilities */
  minWidth: {
    /** min-width: 12px */
    xxs: css`
      min-width: ${sizeValues.xxs};
    `,
    /** min-width: 16px */
    sm: css`
      min-width: ${sizeValues.sm};
    `,
    /** min-width: 20px */
    xsm: css`
      min-width: ${sizeValues.xsm};
    `,
    /** min-width: 24px */
    md: css`
      min-width: ${sizeValues.md};
    `,
    /** min-width: 32px */
    lg: css`
      min-width: ${sizeValues.lg};
    `,
    /** min-width L auto */
    auto: css`
      min-width: auto;
    `,
    /** min-width: unset */
    unset: css`
      min-width: unset;
    `,
    /** min-width: 0 */
    zero: css`
      min-width: 0;
    `,
    /** min-width: 64px */
    xxl: css`
      min-width: ${sizeValues.xxl};
    `,
    /** min-width: 96px */
    xxxl: css`
      min-width: ${sizeValues.xxxl};
    `,
    /** min-width: 180px */
    '2xl': css`
      min-width: ${sizeValues['2xl']};
    `,
    /** min-width: 240px */
    '4xl': css`
      min-width: ${sizeValues['4xl']};
    `,
    /** min-width: 100% */
    full: css`
      min-width: 100%;
    `,
    /** min-width: 48px */
    xl: css`
      min-width: ${sizeValues.xl};
    `,
    custom: (value: string) => css`
      min-width: ${value};
    `,
  },

  /** Min-height utilities */
  minHeight: {
    /** min-height: unset */
    unset: css`
      min-height: unset;
    `,
    /** min-height: auto */
    auto: css`
      min-height: auto;
    `,
    /** min-height: 0 */
    zero: css`
      min-height: 0;
    `,
    /** min-height: 12px */
    xxs: css`
      min-height: ${sizeValues.xxs};
    `,
    /** min-height: 16px */
    sm: css`
      min-height: ${sizeValues.sm};
    `,
    /** min-height: 20px */
    xsm: css`
      min-height: ${sizeValues.xsm};
    `,
    /** min-height: 24px */
    md: css`
      min-height: ${sizeValues.md};
    `,
    /** min-height: 32px */
    lg: css`
      min-height: ${sizeValues.lg};
    `,
    /** min-height: 48px */
    xl: css`
      min-height: ${sizeValues.xl};
    `,
    /** min-height: 64px */
    xxl: css`
      min-height: ${sizeValues.xxl};
    `,
    /** min-height: 96px */
    xxxl: css`
      min-height: ${sizeValues.xxxl};
    `,
    /** min-height: 240px */
    '4xl': css`
      min-height: ${sizeValues['4xl']};
    `,
    /** min-height: 320px */
    '5xl': css`
      min-height: ${sizeValues['5xl']};
    `,
    /** min-height: 720px */
    '6xl': css`
      min-height: ${sizeValues['6xl']};
    `,
    /** min-height: 100% */
    full: css`
      min-height: 100%;
    `,
    /** min-height: 100vh */
    screen: css`
      min-height: 100vh;
    `,
    custom: (value: string) => css`
      min-height: ${value};
    `,
  },

  /** Max-width utilities */
  maxWidth: {
    /** max-width: 0 */
    zero: css`
      max-width: 0;
    `,
    custom: (value: string) => css`
      max-width: ${value};
    `,
    /** max-width: unset */
    unset: css`
      max-width: unset;
    `,
    /** max-width: 640px - Small container */
    xs: css`
      max-width: 480px;
    `,
    /** max-width: 640px - Small container */
    sm: css`
      max-width: 640px;
    `,
    /** max-width: 768px - Medium container */
    md: css`
      max-width: 768px;
    `,
    /** max-width: 1024px - Large container */
    lg: css`
      max-width: 1024px;
    `,
    /** max-width: 1280px - Extra large container */
    xl: css`
      max-width: 1280px;
    `,
    /** max-width: 1536px - 2X large container */
    '2xl': css`
      max-width: 1536px;
    `,
    /** max-width: 1920px - Full width container */
    '3xl': css`
      max-width: 1920px;
    `,
    /** max-width: 100% */
    full: css`
      max-width: 100%;
    `,
    /** max-width: none */
    none: css`
      max-width: none;
    `,
  },
  /** Max-height utilities */
  maxHeight: {
    /** max-height: 12px */
    xxs: css`
      max-height: ${sizeValues.xxs};
    `,
    /** max-height: 16px */
    sm: css`
      max-height: ${sizeValues.sm};
    `,
    /** max-height: 20px */
    xsm: css`
      max-height: ${sizeValues.xsm};
    `,
    /** max-height: 24px */
    md: css`
      max-height: ${sizeValues.md};
    `,
    /** max-height: 32px */
    lg: css`
      max-height: ${sizeValues.lg};
    `,
    /** max-height: 48px */
    xl: css`
      max-height: ${sizeValues.xl};
    `,
    /** max-height: 64px */
    xxl: css`
      max-height: ${sizeValues.xxl};
    `,
    /** max-height: 96px */
    xxxl: css`
      max-height: ${sizeValues.xxxl};
    `,
    /** max-height: 240px */
    '4xl': css`
      max-height: ${sizeValues['4xl']};
    `,
    /** max-height: 320px */
    '5xl': css`
      max-height: ${sizeValues['5xl']};
    `,
    /** max-height: 720px */
    '6xl': css`
      max-height: ${sizeValues['6xl']};
    `,
    /** max-height: 800px */
    '7xl': css`
      max-height: ${sizeValues['7xl']};
    `,
    /** max-height: 1200px */
    '8xl': css`
      max-height: ${sizeValues['8xl']};
    `,
    /** max-height: unset */
    unset: css`
      max-height: unset;
    `,
    /** max-height: 100% */
    full: css`
      max-height: 100%;
    `,
    /** max-height: custom */
    custom: (value: string) => css`
      max-height: ${value};
    `,
  },
} as const;

// ============================================================================
// BORDER & RADIUS UTILITIES
// ============================================================================

/**
 * Border and border-radius utilities
 *
 * @example
 * ${borders.radius.md}
 * ${borders.all}
 * ${borders.collapse.collapse}
 * ${borders.spacing.none}
 */
export const borders = {
  /** Border width utilities */
  all: css`
    border: 1px solid currentColor;
  `,
  bottom: css`
    border-bottom: 1px solid currentColor;
  `,
  top: css`
    border-top: 1px solid currentColor;
  `,
  left: css`
    border-left: 1px solid currentColor;
  `,
  right: css`
    border-right: 1px solid currentColor;
  `,
  none: css`
    border: none;
  `,
  primary: css`
    border: 1px solid ${colors.text.primary};
  `,
  tagBorder: css`
    border: 1px solid ${colors.border.tagBorder};
  `,
  gray300: css`
    border: 1px solid ${colors.neutral.gray300};
  `,

  custom: ({
    color = 'currentColor',
    width = '1px',
    style = 'solid',
  }: {
    color?: string;
    width?: string;
    style?: string;
  }) => css`
    border: ${width} ${style} ${color};
  `,
  dataBlock: css`
    border: 1px solid ${colors.border.dataBlock};
  `,

  /** Border radius utilities */
  radius: {
    /** border-radius: 0 */
    none: css`
      border-radius: 0;
    `,
    /** border-radius: 0.125rem (2px) */
    sm: css`
      border-radius: 0.125rem;
    `,
    /** border-radius: 0.25rem (4px) */
    base: css`
      border-radius: 0.25rem;
    `,
    /** border-radius: 0.375rem (6px) */
    md: css`
      border-radius: 0.375rem;
    `,
    /** border-radius: 0.5rem (8px) */
    lg: css`
      border-radius: 0.5rem;
    `,
    /** border-radius: 0.75rem (12px) */
    xl: css`
      border-radius: 0.75rem;
    `,
    /** border-radius: 1rem (16px) */
    '2xl': css`
      border-radius: 1rem;
    `,
    /** border-radius: 1.5rem (24px) */
    '3xl': css`
      border-radius: 1.5rem;
    `,
    /** border-radius: 2rem (32px) */
    '4xl': css`
      border-radius: 2rem;
    `,
    /** border-radius: 40px */
    '5xl': css`
      border-radius: 40px;
    `,
    /** border-radius: 9999px - Fully rounded (pill shape) */
    full: css`
      border-radius: 9999px;
    `,
    /** border-radius: 50% */
    circle: css`
      border-radius: 50%;
    `,
  },

  /** Border collapse utilities for tables */
  collapse: {
    /** border-collapse: collapse - Borders are collapsed into a single border */
    collapse: css`
      border-collapse: collapse;
    `,
    /** border-collapse: separate - Borders are separated (default) */
    separate: css`
      border-collapse: separate;
    `,
    /** border-collapse: inherit - Inherits from parent */
    inherit: css`
      border-collapse: inherit;
    `,
    /** border-collapse: initial - Sets to default value */
    initial: css`
      border-collapse: initial;
    `,
    /** border-collapse: unset - Resets to inherited or initial value */
    unset: css`
      border-collapse: unset;
    `,
  },
} as const;

// ============================================================================
// BACKGROUND UTILITIES
// ============================================================================

/**
 * Background utilities
 *
 * @example
 * ${background.none}
 * ${background.transparent}
 */
export const background = {
  /** background: none - No background */
  none: css`
    background: none;
  `,
  /** background: transparent - Transparent background */
  transparent: css`
    background: transparent;
  `,
  /** background-color: inherit - Inherits from parent */
  inherit: css`
    background-color: inherit;
  `,
  /** background-color: initial - Sets to default value */
  initial: css`
    background-color: initial;
  `,
  /** background-color: unset - Resets to inherited or initial value */
  unset: css`
    background-color: unset;
  `,
  /** background-color: project - Project background: #FFFEFA */
  project: css`
    background-color: ${colors.background.project};
  `,
} as const;

// ============================================================================
// SHADOW UTILITIES
// ============================================================================

/**
 * Box shadow utilities for consistent elevation and depth
 *
 * @example
 * ${boxShadow.sm}
 * ${boxShadow.md}
 */
export const boxShadow = {
  /** Extra small shadow for subtle elevation: 0 1px 3px rgba(0, 0, 0, 0.05) */
  xs: css`
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  `,
  /** Small shadow for subtle elevation: 0 1px 3px rgba(0, 0, 0, 0.1) */
  sm: css`
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  `,
  /** Medium shadow for cards and tooltips: 0 2px 8px rgba(0, 0, 0, 0.1) */
  md: css`
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `,
  /** Large shadow for elevated elements: 0 4px 12px rgba(0, 0, 0, 0.15) */
  lg: css`
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `,
  /** Extra large shadow for modals and overlays: 0 8px 24px rgba(0, 0, 0, 0.2) */
  xl: css`
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  `,
  /** No shadow */
  none: css`
    box-shadow: none;
  `,
} as const;

// ============================================================================
// SHADOW UTILITIES
// ============================================================================

/**
 * Cursor utilities
 *
 * @example
 * ${cursor.pointer}
 */
export const cursor = {
  pointer: css`
    cursor: pointer;
  `,
  /** cursor: default */
  default: css`
    cursor: default;
  `,
  /** cursor: not-allowed */
  notAllowed: css`
    cursor: not-allowed;
  `,
  /** cursor: text */
  text: css`
    cursor: text;
  `,
  /** cursor: move */
  move: css`
    cursor: move;
  `,
  /** cursor: grab */
  grab: css`
    cursor: grab;
  `,
  /** cursor: grabbing */
  grabbing: css`
    cursor: grabbing;
  `,

  /** cursor: help */
  help: css`
    cursor: help;
  `,
};

// ============================================================================
// TABLE
// ============================================================================

/**
 * Table layout utilities
 *
 * @example
 * ${tableLayout.fixed}
 * ${tableLayout.auto}
 */

export const tableLayout = {
  /** table-layout: fixed */
  fixed: css`
    table-layout: fixed;
  `,
  /** table-layout: auto */
  auto: css`
    table-layout: auto;
  `,
};

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================

/**
 * Transition and animation utilities
 *
 * @example
 * ${transitions.all}
 * ${transitions.duration.normal}
 */
export const transitions = {
  /** Transition all properties */
  all: css`
    transition: all 0.2s ease;
  `,

  /** Transition specific properties */
  colors: css`
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease;
  `,
  opacity: css`
    transition: opacity 0.2s ease;
  `,
  transform: css`
    transition: transform 0.2s ease;
  `,

  /** Transition duration utilities */
  duration: {
    /** 75ms */
    fast: css`
      transition-duration: 75ms;
    `,
    /** 150ms */
    normal: css`
      transition-duration: 150ms;
    `,
    /** 300ms */
    slow: css`
      transition-duration: 300ms;
    `,
    /** 500ms */
    slower: css`
      transition-duration: 500ms;
    `,
  },

  /** Transition timing functions */
  timing: {
    /** cubic-bezier(0.4, 0, 0.2, 1) */
    ease: css`
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    `,
    /** cubic-bezier(0.4, 0, 1, 1) */
    easeIn: css`
      transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
    `,
    /** cubic-bezier(0, 0, 0.2, 1) */
    easeOut: css`
      transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    `,
    /** cubic-bezier(0.4, 0, 0.2, 1) */
    easeInOut: css`
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    `,
  },
  /** Transition background-color */
  background: css`
    transition: background 0.2s ease;
  `,
} as const;

// ============================================================================
// OPACITY
// ============================================================================

/**
 * Opacity utilities for controlling element transparency
 *
 * @example
 * ${opacity.full}      // opacity: 1
 * ${opacity.medium}    // opacity: 0.65
 * ${opacity.moderate}  // opacity: 0.6
 * ${opacity.half}      // opacity: 0.5
 * ${opacity.hidden}    // opacity: 0
 */
export const opacity = {
  /** opacity: 0 - Fully transparent */
  hidden: css`
    opacity: 0;
  `,
  /** opacity: 0.1  */
  veryLow: css`
    opacity: 0.1;
  `,
  /** opacity: 0.25 - Quarter transparent */
  quarter: css`
    opacity: 0.25;
  `,
  /** opacity: 0.5 - Half transparent */
  half: css`
    opacity: 0.5;
  `,
  /** opacity: 0.6 - Moderate transparency */
  moderate: css`
    opacity: 0.6;
  `,
  /** opacity: 0.65 - Medium transparency */
  medium: css`
    opacity: 0.65;
  `,
  /** opacity: 0.7 - High transparency */
  high: css`
    opacity: 0.7;
  `,
  /** opacity: 0.8 - Mostly visible */
  higher: css`
    opacity: 0.8;
  `,
  /** opacity: 0.9 - Nearly full visibility */
  veryHigh: css`
    opacity: 0.9;
  `,
  /** opacity: 1 - Fully opaque */
  full: css`
    opacity: 1;
  `,
} as const;

// ============================================================================
// POINTER EVENTS
// ============================================================================

/**
 * Pointer events utilities for controlling element interaction
 *
 * @example
 * ${pointerEvents.none}        // Disable all pointer interactions
 * ${pointerEvents.auto}        // Default pointer behavior
 * ${pointerEvents.all}         // Enable all pointer interactions
 */
export const pointerEvents = {
  /** pointer-events: none - Element does not react to pointer events */
  none: css`
    pointer-events: none;
  `,
  /** pointer-events: auto - Default behavior, element reacts to pointer events */
  auto: css`
    pointer-events: auto;
  `,
  /** pointer-events: all - Element reacts to all pointer events, even through children */
  all: css`
    pointer-events: all;
  `,
  /** pointer-events: inherit - Inherits from parent */
  inherit: css`
    pointer-events: inherit;
  `,
} as const;

// ============================================================================
// USER SELECT
// ============================================================================

/**
 * User select utilities for controlling text selection
 *
 * @example
 * ${userSelect.none}        // Prevent text selection
 * ${userSelect.auto}        // Default text selection behavior
 */
export const userSelect = {
  /** user-select: none - Prevent text selection */
  none: css`
    user-select: none;
  `,
  /** user-select: auto - Default text selection behavior */
  auto: css`
    user-select: auto;
  `,
  /** user-select: all - Select all text on click */
  all: css`
    user-select: all;
  `,
  /** user-select: text - Allow text selection */
  text: css`
    user-select: text;
  `,
} as const;

// ============================================================================
// SHADOW SYSTEM
// ============================================================================

/**
 * Box shadow utilities for depth and elevation
 *
 * @example
 * ${shadow.none}      // No shadow
 * ${shadow.sm}        // Small shadow
 * ${shadow.md}        // Medium shadow
 */
export const shadow = {
  /** box-shadow: none - No shadow */
  none: css`
    box-shadow: none;
  `,
} as const;

// ============================================================================
// OUTLINE SYSTEM
// ============================================================================

/**
 * Outline utilities for focus states and accessibility
 *
 * @example
 * ${outline.none}         // No outline
 * ${outline.focus}        // Focus outline
 * ${outline.focusVisible} // Focus visible only
 */
export const outline = {
  /** outline: none - No outline (use with caution for accessibility) */
  none: css`
    outline: none;
  `,
} as const;

// ============================================================================
// COMMON PATTERNS
// ============================================================================

/**
 * Common style patterns for frequent use cases
 *
 * @example
 * ${patterns.container}
 * ${patterns.card}
 */
export const patterns = {
  /** Standard container with max-width and centered */
  container: css`
    max-width: 1920px;
    margin-left: auto;
    margin-right: auto;
  `,

  /** Card pattern with shadow and rounded corners */
  card: css`
    background-color: ${colors.background.paper};
    border-radius: 0.5rem;
    padding: ${spacingValues.l};
    box-shadow:
      0 1px 3px 0 #0000001a,
      0 1px 2px 0 rgba(0, 0, 0, 0.06);
  `,

  /** Visually hidden but accessible to screen readers */
  srOnly: css`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  `,

  /** Truncate text with ellipsis */
  truncate: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  /** Smooth scrolling */
  smoothScroll: css`
    scroll-behavior: smooth;
  `,

  /** Remove default button styles */
  resetButton: css`
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
  `,

  /** Remove default list styles */
  resetList: css`
    list-style: none;
    padding: 0;
    margin: 0;
  `,
} as const;

// ============================================================================
// SHADOW UTILITIES
// ============================================================================
/**
 * Shadow utilities for consistent box-shadow effects
 *
 * @example
 * ${shadows.sm}
 * ${shadows.lg}
 */
export const shadows = {
  /** Small shadow */
  s: css`
    box-shadow: 0 ${spacingValues.xxxs} ${spacingValues.s} #0000001a;
  `,
};

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

/**
 * Responsive breakpoint utilities
 *
 * @example
 * ${breakpoints.md} {
 *   font-size: 2rem;
 * }
 */
export const breakpoints = {
  /** @media (min-width: 600px) - Small devices and up */
  sm: '@media (min-width: 600px)',

  /** @media (min-width: 900px) - Medium devices and up */
  md: '@media (min-width: 900px)',

  /** @media (min-width: 1200px) - Large devices and up */
  lg: '@media (min-width: 1200px)',

  /** @media (min-width: 1400px) - Large devices and up */
  xlg: '@media (min-width: 1400px)',

  /** @media (min-width: 1536px) - Extra large devices and up */
  xl: '@media (min-width: 1536px)',

  /** @media (min-width: 1920px) - Extra large devices and up */
  xxl: '@media (min-width: 1920px)',

  /** @media (min-width: 2560px) - Extra large devices and up */
  xxxl: '@media (min-width: 2560px)',

  /** @media (min-width: 3840px) - Extra large devices and up */
  xxxxl: '@media (min-width: 3840px)',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create custom spacing value
 *
 * @example
 * const customSpacing = createSpacing('42px');
 */
export const createSpacing = (value: string) => css`
  padding: ${value};
`;

/**
 * Create responsive value
 *
 * @example
 * ${responsive({ base: '16px', md: '24px', lg: '32px' }, 'font-size')}
 */
export const responsive = (
  values: {
    base?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  },
  property: string
): SerializedStyles => css`
  ${values.base && `${property}: ${values.base};`}

  ${values.sm &&
  `@media (min-width: 600px) {
    ${property}: ${values.sm};
  }`}
  
  ${values.md &&
  `@media (min-width: 900px) {
    ${property}: ${values.md};
  }`}
  
  ${values.lg &&
  `@media (min-width: 1200px) {
    ${property}: ${values.lg};
  }`}
  
  ${values.xl &&
  `@media (min-width: 1536px) {
    ${property}: ${values.xl};
  }`}
`;

export const transform = {
  scale: (scale: number) => css`
    transform: scale(${scale});
  `,
  rotate: (angle: number) => css`
    transform: rotate(${angle}deg);
  `,
  translate: {
    unset: css`
      transform: unset;
    `,
    xy: (x: string, y: string) => css`
      transform: translate(${x}, ${y});
    `,
    x: (x: string) => css`
      transform: translateX(${x});
    `,
    y: (y: string) => css`
      transform: translateY(${y});
    `,
  },
};

export const blur = {
  backdrop: {
    s: css`
      backdrop-filter: blur(4px);
    `,
    sm: css`
      backdrop-filter: blur(8px);
    `,
    md: css`
      backdrop-filter: blur(12px);
    `,
    lg: css`
      backdrop-filter: blur(16px);
    `,
    custom: (value: string) => css`
      backdrop-filter: blur(${value});
    `,
  },
  value: {
    sm: css`
      filter: blur(8px);
    `,
    custom: (value: string) => css`
      filter: blur(${value});
    `,
  },
};

/**
 * Object-fit utilities for images and videos
 *
 * @example
 * ${objectFit.cover} // Makes element cover container while maintaining aspect ratio
 * ${objectFit.contain} // Makes element fit within container while maintaining aspect ratio
 */
export const objectFit = {
  /** object-fit: cover - Element fills container, may be clipped */
  cover: css`
    object-fit: cover;
  `,
  /** object-fit: contain - Element fits within container, may have empty space */
  contain: css`
    object-fit: contain;
  `,
  /** object-fit: fill - Element stretched to fill container, may distort */
  fill: css`
    object-fit: fill;
  `,
  /** object-fit: none - Element not resized */
  none: css`
    object-fit: none;
  `,
  /** object-fit: scale-down - Element scaled down to fit */
  scaleDown: css`
    object-fit: scale-down;
  `,
};
