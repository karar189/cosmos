/**
 * Rem Utilities
 *
 * Converts rem values to pixels accounting for responsive root font-size.
 * The root font-size scales based on screen size (see createTheme.ts):
 * - Default: 16px
 * - 2560px+ (1440p/4K): 24px
 * - 3840px+ (true 4K): 32px
 */

const BASE_FONT_SIZE = 16;

/**
 * Get the current root font-size in pixels.
 * Returns 16 during SSR or if document is unavailable.
 */
export function getRootFontSize(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return BASE_FONT_SIZE;
  }
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || BASE_FONT_SIZE;
}

/**
 * Convert a rem value (string like "2rem" or number like 2) to pixels.
 * Uses the current root font-size for responsive scaling.
 *
 * @example
 * remToPx('2rem')     // → 32 at 16px base, 48 at 24px base
 * remToPx(2)          // → 32 at 16px base, 48 at 24px base
 * remToPx(spacingValues.xl) // → 32 at 16px base
 */
export function remToPx(rem: string | number): number {
  const remValue = typeof rem === 'string' ? parseFloat(rem) : rem;
  return remValue * getRootFontSize();
}

/**
 * Convert a pixel value to rem at the standard 16px base.
 * Useful for defining constants in rem terms.
 *
 * @example
 * pxToRem(88)  // → 5.5
 * pxToRem(40)  // → 2.5
 */
export function pxToRem(px: number): number {
  return px / BASE_FONT_SIZE;
}

/**
 * Convert a pixel value (at 16px base) to actual pixels at current root font-size.
 * This is shorthand for: remToPx(pxToRem(px))
 *
 * Use this when you have a design spec in pixels but want responsive scaling.
 *
 * @example
 * // Design says 88px, but should scale on 4K
 * scalePx(88) // → 88 at 16px base, 132 at 24px base, 176 at 32px base
 */
export function scalePx(px: number): number {
  return (px / BASE_FONT_SIZE) * getRootFontSize();
}

/**
 * Common spacing values in pixels (at 16px base) for JS calculations.
 * These values will scale with root font-size when used with scalePx().
 *
 * Maps to spacingValues from styleSystem.ts
 */
export const spacingPx = {
  hairline: 1,
  xxxs: 2,
  xxs: 4,
  xs: 6,
  s: 8,
  sm: 12,
  m: 16,
  l: 24,
  xl: 32,
  xmd: 40,
  xxl: 48,
  xxxl: 64,
  xxxxl: 96,
} as const;

