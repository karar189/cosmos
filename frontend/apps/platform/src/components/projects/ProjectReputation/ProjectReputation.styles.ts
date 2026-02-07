import {
  borders,
  coloring,
  flex,
  overflow,
  position,
  size,
  spacing,
  typography,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const projectReputation = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const projectReputationName = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.primary}
`;

export const projectReputationLogo = css`
  ${size.width.md}
  ${size.height.md}
  ${borders.radius.full}
  ${overflow.hidden}
  ${coloring.background.secondary}
  ${position.relative}
`;
