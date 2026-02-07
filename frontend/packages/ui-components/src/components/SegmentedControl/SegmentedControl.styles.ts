import { css } from '@emotion/react';
import { borders, coloring, colors, cursor, flex, opacity, spacing, spacingValues, transitions, typography } from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.inline};
  ${flex.align.center};
  ${spacing.padding.xxs};
  background-color: ${colors.background.component};
  border-radius: 40px;
`;

export const button = css`
  ${flex.base};
  ${flex.align.center};
  ${flex.justify.center};
  ${spacing.gap.s};
  padding: ${spacingValues.xxs} ${spacingValues.s};
  ${borders.none};
  ${coloring.background.transparent};
  ${borders.radius['3xl']};
  ${typography.fontFamily.primary};
  ${typography.fontSize.xs};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.tight};
  color: ${colors.text.unselected};
  ${cursor.pointer};
  ${transitions.all}
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    ${opacity.high}
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
  }
`;

export const buttonActive = css`
  background-color: ${colors.neutral.white};
  color: ${colors.neutral.black};
`;
