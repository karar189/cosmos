import { css } from '@emotion/react';
import { flex, spacing, typography, coloring, borders } from '@core3/ui-components/styleSystem';

export const modalContent = css`
  ${flex.column}
  ${spacing.gap.l}
`;

export const modalTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xl}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  margin: 0;
`;

export const formGroup = css`
  ${flex.column}
  ${spacing.gap.s}
`;

export const label = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const input = css`
  ${spacing.padding.s}
  ${spacing.padding.x.m}
  ${borders.radius.md}
  border: 1px solid rgba(0, 0, 0, 0.12);
  ${typography.fontSize.base}
  ${coloring.background.paper}
  width: 100%;
  box-sizing: border-box;
`;

export const textarea = css`
  ${input}
  min-height: 100px;
  resize: vertical;
`;

export const readOnlyField = css`
  ${input}
  ${coloring.background.neutral}
  opacity: 0.9;
`;

export const actions = css`
  ${flex.row}
  ${flex.justify.end}
  ${spacing.gap.m}
  ${spacing.margin.top.m}
`;

export const codeBlock = css`
  ${flex.column}
  ${spacing.gap.s}
  max-height: 300px;
  overflow: auto;
  ${coloring.background.neutral}
  ${borders.radius.md}
  ${spacing.padding.m}
  white-space: pre-wrap;
  ${typography.fontFamily.mono}
  ${typography.fontSize.xs}
  word-break: break-all;
`;

export const successMessage = css`
  ${typography.fontSize.sm}
  ${coloring.text.primary}
  margin: 0;
`;

export const errorMessage = css`
  ${typography.fontSize.sm}
  color: #b91c1c;
  margin: 0;
`;
