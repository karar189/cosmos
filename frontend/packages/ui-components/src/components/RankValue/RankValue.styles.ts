/**
 * RankValue Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { borders, coloring, display, spacing, typography } from '../../theme/styleSystem';

type RankValueColor = 'green' | 'yellow' | 'orange' | 'red' | 'gray';

/**
 * Rank value container with dynamic color based on score
 */
export const rankValue = (color: RankValueColor) => css`
  ${display.inlineBlock}
  ${spacing.padding.x.sm}
  ${spacing.padding.y.s}
  ${borders.radius['3xl']}

  ${typography.fontFamily.mono}
  ${typography.fontSize.sm}
  ${typography.fontWeight.bold}
  ${typography.lineHeight.tight}
  ${typography.letterSpacing.normal}
  
  ${coloring.badge[color].text}
  ${coloring.badge[color].background}
`;
