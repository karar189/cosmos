import { css } from '@emotion/react';
import { colors, flex, overflow, size, spacing } from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.column};
  ${spacing.gap.m};
  ${spacing.padding.l};
  border-left: 1px solid ${colors.text.variants.secondary.op25};
  ${size.height.full}
  ${size.width.full};
  ${size.maxWidth.full};
  ${overflow.y.auto};
  ${overflow.x.hidden};
  background-color: ${colors.background.default};
  box-sizing: border-box;
`;

export const launchReadinessList = css`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const launchReadinessItem = css`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
`;

export const launchReadinessIconDone = css`
  color: #16a34a;
  flex-shrink: 0;
`;

export const launchReadinessIconPending = css`
  color: #dc2626;
  flex-shrink: 0;
`;
