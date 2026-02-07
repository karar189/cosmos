import { dotSvg } from './lib/icons';
import { breakpoints, position, size, transform } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${position.relative};
  ${position.zIndex.base};

  ${size.width.screen};
  ${position.left.half};
  ${transform.translate.x('-50%')};
  min-width: 800px;
  max-height: 320px;
  min-height: 700px;

  ${breakpoints.md} {
    ${position.left.unset};
    ${transform.translate.unset};
  }
`;

export const canvas = css`
  ${size.width.full};
  ${size.height.full};
  ${position.absolute};
  ${position.inset.zero};

  cursor:
    url('${dotSvg}') 8 8,
    auto;
`;
