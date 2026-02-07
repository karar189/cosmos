import { css } from '@emotion/react';
import {
  typography,
  spacingValues,
  borders,
  colors,
  flex,
  position,
} from '../../theme/styleSystem';

export const container = css`
  background: ${colors.semantic.step};
  border-radius: ${borders.radius.xl};
  padding: ${spacingValues.m};
`;

export const stepList = css`
  ${flex.column};
`;

export const stepItem = css`
  display: grid;
  grid-template-columns: 32px 1fr;
  column-gap: ${spacingValues.sm};
  ${flex.align.center};
`;

export const firstColumn = css`
  ${flex.column};
  ${flex.align.center};
`;

export const numberCircle = css`
  width: ${spacingValues.xl};
  height: ${spacingValues.xl};
  ${borders.radius.circle};
  background: ${colors.background.dark};
  color: ${colors.neutral.white};
  ${flex.center};
  font-size: ${typography.fontSize.sm};
  line-height: ${typography.lineHeight.relaxed};
  font-weight: ${typography.fontWeight.medium};
  font-family: ${typography.fontFamily.primary};
`;

export const connectorLine = css`
  ${stepItem}:last-child & {
    display: none;
  }

  width: ${spacingValues.xl};
  height: 23px;
  ${position.relative};
`;

export const connectorLineContent = css`
  ${position.absolute};
  ${position.top.half};
  ${position.left.half};
  transform: translate(-50%, -50%) rotate(-90deg);

  width: ${spacingValues.m};
  height: 0;
  ${borders.top}
`;

export const textContent = css`
  ${flex.column};
  gap: ${spacingValues.s};
`;

export const title = css`
  font-size: ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  line-height: ${typography.lineHeight.tight};
  color: ${colors.text.primary};
  font-family: ${typography.fontFamily.primary};
`;
