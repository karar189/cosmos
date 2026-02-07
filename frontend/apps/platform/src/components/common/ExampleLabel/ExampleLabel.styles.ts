import { borders, coloring, colors, cursor, flex, size, spacing, typography, transitions } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = ({ bordered }: { bordered: boolean }) => css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${coloring.background.yellow}
  ${coloring.text.yellow}
  ${borders.radius.lg}
  ${spacing.padding.x.s}
  ${spacing.padding.y.xxs}
  ${bordered && borders.custom({ color: colors.border.exampleLabel })}
  ${typography.fontSize.xs}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${cursor.help}
  ${transitions.all}
  ${borders.custom({ color: 'transparent', width: '1px', style: 'solid' })}
  
  &:hover {
    border-color: ${colors.border.exampleLabel};
  }
`;

export const icon = css`
  ${size.width.sm}
  ${size.height.sm}
`;
