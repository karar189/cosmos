import { css, keyframes } from '@emotion/react';
import {
  flex,
  spacing,
  size,
  coloring,
  typography,
  breakpoints,
  borders,
} from '@core3/ui-components/styleSystem';

// ===== Page Layout (match Compliance Maker) =====
export const pageContainer = css`
  ${flex.column}
  ${spacing.gap.l}
  ${size.width.full}
  max-width: 1400px;
  margin: 0 auto;
  ${spacing.padding.x.l}
  min-height: 100vh;

  ${breakpoints.sm} {
    ${spacing.padding.x.m}
  }
`;

export const pageSectionHeader = css`
  ${flex.row}
  ${flex.align.flexStart}
  ${spacing.gap.m}
  ${spacing.padding.bottom.m}
  ${borders.bottom.gray200}
`;

export const pageSectionTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize['3xl']}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
  margin: 0;
  ${spacing.margin.bottom.xs}
`;

export const sectionDescription = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op75}
  margin: 0;
`;

// ===== Agentic Builder =====
export const agenticSectionContent = css`
  ${flex.column}
  ${spacing.gap.m}
`;

export const agenticFormCard = css`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const agenticFormGrid = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const agenticFullWidth = css`
  grid-column: 1 / -1;
`;

export const formBlock = css`
  ${flex.column}
  ${spacing.gap.xs}
`;

export const label = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  margin: 0;
`;

export const required = css`
  ${coloring.text.error}
`;

export const textarea = css`
  ${size.width.full}
  ${spacing.padding.s}
  ${borders.radius.md}
  border: 1px solid rgba(0, 0, 0, 0.12);
  ${coloring.background.paper}
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${coloring.text.primary}
  resize: vertical;
  min-height: 72px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  &::placeholder {
    ${coloring.text.variants.secondary.op65}
  }
`;

export const agenticActionsRow = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.flexEnd}
  ${spacing.gap.s}
  ${spacing.margin.top.s}
  ${borders.top.gray200}
  ${spacing.padding.top.m}
`;

export const agenticError = css`
  ${typography.fontSize.sm}
  color: #b91c1c;
  margin: 0;
`;

export const hintSuggestions = css`
  ${flex.row}
  ${flex.wrap.wrap}
  ${spacing.gap.xs}
  ${spacing.margin.top.xs}
`;

export const hintSuggestionButton = css`
  appearance: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: ${coloring.background.paper};
  ${borders.radius.full}
  padding: 6px 10px;
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${coloring.text.variants.secondary.op75}
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.45);
    background: rgba(99, 102, 241, 0.06);
  }

  &:focus-visible {
    outline: 2px solid rgba(99, 102, 241, 0.35);
    outline-offset: 2px;
  }
`;

export const bundleCard = css`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const bundleHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.s}
  ${spacing.margin.bottom.s}
`;

export const bundleTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.lg}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
  margin: 0;
`;

export const bundleTotals = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${flex.wrap.wrap}
`;

export const widgetList = css`
  ${flex.column}
  ${spacing.gap.s}
  ${spacing.margin.top.s}
`;

export const widgetRow = css`
  ${flex.column}
  ${spacing.gap.xs}
  ${spacing.padding.s}
  ${borders.radius.md}
  ${coloring.background.neutral}
`;

export const widgetRowTop = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.s}
`;

export const widgetName = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  margin: 0;
`;

export const widgetWhy = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op75}
  margin: 0;
  line-height: 1.5;
`;

export const widgetBadges = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${flex.wrap.wrap}
`;

// ===== Loading state (reuse pattern) =====
const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`;

export const loadingState = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.padding.y.xl}
`;

export const loadingDots = css`
  ${flex.row}
  ${spacing.gap.s}
  ${spacing.margin.bottom.m}
`;

export const dot = css`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary, #6366f1);
  animation: ${bounce} 1.4s infinite ease-in-out both;

  &:nth-of-type(1) { animation-delay: -0.32s; }
  &:nth-of-type(2) { animation-delay: -0.16s; }
  &:nth-of-type(3) { animation-delay: 0; }
`;

export const loadingText = css`
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op65}
  margin: 0;
`;

