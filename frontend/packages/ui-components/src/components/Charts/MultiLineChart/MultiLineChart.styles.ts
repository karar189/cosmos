import { css } from '@emotion/react';
import { borders, coloring, flex, size, spacingValues } from '../../../styleSystem';

export const chartContainer = css`
  ${flex.column}
  ${size.width.full}
  ${coloring.background.neutral.default}
  ${borders.radius.base}

  .recharts-legend-wrapper {
    display: flex;
    ${flex.wrap.wrap}
    gap: ${spacingValues.l};
    line-height: 1.6;
  }

  .recharts-legend-item {
    margin-right: 0;
    margin-bottom: ${spacingValues.xs};
  }
`;
