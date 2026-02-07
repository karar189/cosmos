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

// ===== Page Layout (project-overview style) =====
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

// ===== Two Column Layout (40% / 60%) =====
export const twoColumnLayout = css`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const leftColumn = css`
  ${flex.column}
  ${spacing.gap.l}
  width: 40%;
  min-width: 0;
  position: sticky;
  top: 16px;
  
  @media (max-width: 640px) {
    width: 100%;
    position: static;
  }
`;

export const rightColumn = css`
  ${flex.column}
  ${spacing.gap.l}
  width: 60%;
  min-width: 0;
  
  @media (max-width: 640px) {
    width: 100%;
  }
`;

// ===== Institution Onboarding (section style, no white box) =====
export const institutionOnboardingSection = css`
  ${flex.column}
  ${size.width.full}
  ${spacing.padding.m}
  ${borders.radius.md}
  ${borders.bottom.gray200}
  padding-bottom: 24px;
`;

export const institutionOnboardingTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xl}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  margin: 0;
  ${spacing.margin.bottom.m}
`;

export const formContent = css`
  ${flex.column}
  ${spacing.gap.l}
`;

export const formBlock = css`
  ${flex.column}
  ${spacing.gap.xs}
`;

export const formField = css`
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

export const submitButtonWrapper = css`
  ${spacing.margin.top.xs}
  
  /* Fix button outline height and make it fit content */
  button {
    ${size.width.full}
    ${flex.row}
    ${flex.align.center}
    ${flex.justify.center}
    ${spacing.gap.s}
    box-sizing: border-box;
  }
`;

// ===== Analysis Section =====
export const analysisSectionContent = css`
  ${flex.column}
  ${spacing.gap.m}
  min-height: 320px;
`;

export const emptyStateCard = css`
  min-height: 320px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const loadingCard = css`
  min-height: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const analysisResultCard = css`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const analysisContent = css`
  ${flex.column}
  ${spacing.gap.l}
`;

// ===== Loading State =====
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

// ===== AI Analysis Block =====
export const aiAnalysisBlock = css`
  ${flex.column}
  ${borders.radius.md}
  overflow: hidden;
`;

export const aiAnalysisHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${spacing.padding.m}
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
  ${borders.bottom.gray200}
`;

export const aiAnalysisIcon = css`
  ${size.width.custom('18px')}
  ${size.height.custom('18px')}
  color: #6366f1;
`;

export const aiAnalysisLabel = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
  flex: 1;
`;

export const aiAnalysisBody = css`
  ${flex.column}
  ${spacing.padding.m}
  ${coloring.background.paper}
  ${borders.gray300}
  ${borders.radius.md}
  overflow-y: auto;
`;

// ===== Markdown-style Analysis =====
export const analysisH2 = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.lg}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
  margin: 0;
  ${spacing.margin.top.m}
  ${spacing.margin.bottom.s}
  ${spacing.padding.bottom.xs}
  ${borders.bottom.gray200}
  
  &:first-of-type {
    margin-top: 0;
  }
`;

export const analysisH3 = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.base}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
  margin: 0;
  ${spacing.margin.top.m}
  ${spacing.margin.bottom.xs}
`;

export const analysisParagraph = css`
  ${typography.fontSize.sm}
  ${coloring.text.primary}
  margin: 0;
  line-height: 1.6;
`;

export const analysisBullet = css`
  ${flex.row}
  ${spacing.gap.s}
  ${spacing.padding.y.xs}
  ${typography.fontSize.sm}
  ${coloring.text.primary}
  line-height: 1.6;
  
  strong {
    ${coloring.text.primary}
    ${typography.fontWeight.semibold}
  }
`;

export const bulletDot = css`
  color: #6366f1;
  ${typography.fontWeight.bold}
  ${flex.item.shrink0}
`;

export const analysisNumbered = css`
  ${flex.row}
  ${flex.align.flexStart}
  ${spacing.gap.s}
  ${spacing.padding.s}
  ${borders.radius.md}
  ${coloring.background.neutral}
  ${spacing.margin.y.xs}
  ${typography.fontSize.sm}
  line-height: 1.6;
  
  strong {
    ${coloring.text.primary}
    ${typography.fontWeight.bold}
  }
`;

export const numberedIcon = css`
  ${flex.item.shrink0}
  ${spacing.margin.top.xs}
`;

export const numberedCheckIcon = css`
  ${size.width.custom('16px')}
  ${size.height.custom('16px')}
  color: #22c55e;
`;

export const analysisSpacer = css`
  height: 6px;
`;

// ===== Checklist Section (project-overview style) =====
export const checklistSectionNote = css`
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op75}
  margin: 0;
  ${spacing.margin.left.s}
`;

export const checklistGrid = css`
  display: contents;
`;

// Selectable card wrapper (click to toggle selection)
export const widgetCardWrapper = css`
  cursor: pointer;
  outline: none;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.3);
  }
  &:focus-visible {
    border-color: rgba(99, 102, 241, 0.6);
  }
`;

export const widgetCardWrapperSelected = css`
  border-color: #6366f1;
  box-shadow: 0 0 0 1px #6366f1;
`;

export const widgetCardSelectIndicator = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${spacing.margin.bottom.s}
  ${typography.fontSize.xs}
  ${coloring.text.variants.secondary.op75}
`;

export const widgetCardSelectIcon = css`
  ${size.width.custom('16px')}
  ${size.height.custom('16px')}
  color: #22c55e;
`;

export const widgetCardSelectEmpty = css`
  ${size.width.custom('16px')}
  ${size.height.custom('16px')}
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  display: inline-block;
`;

export const widgetCardSelectLabel = css`
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Widget cards in checklist grid (each = one Card block)
export const widgetCard = css`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const widgetCardDescription = css`
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op75}
  margin: 0;
  line-height: 1.5;
  ${spacing.margin.bottom.s}
`;

export const widgetCardBadges = css`
  ${flex.row}
  ${spacing.gap.xs}
  ${flex.align.center}
`;

// Single Import button at end of checklist
export const importButtonContainer = css`
  ${flex.row}
  ${flex.justify.flexEnd}
  ${spacing.margin.top.m}
  ${spacing.padding.top.m}
  ${borders.top.gray200}
`;

export const importButtonIcon = css`
  ${size.width.custom('14px')}
  ${size.height.custom('14px')}
  ${spacing.margin.right.xs}
`;

// Legacy checklist styles (kept for any refs)
export const checklistCard = css``;
export const checklistHeader = css``;
export const checklistNote = css``;
export const priorityLegend = css``;
export const checklistItems = css``;
export const checklistItem = css``;
export const checklistItemTop = css``;
export const checklistItemLeft = css``;
export const checklistItemRight = css``;
export const checklistIcon = css``;
export const checklistItemTitle = css``;
export const checklistItemDescription = css``;

// ===== Empty State =====
export const emptyState = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.padding.y.xl}
  ${spacing.padding.x.l}
  text-align: center;
  min-height: 400px;
`;

export const emptyStateIcon = css`
  ${size.width.custom('48px')}
  ${size.height.custom('48px')}
  ${spacing.margin.bottom.l}
  opacity: 0.2;
  ${coloring.text.variants.secondary.op65}
`;

export const emptyStateText = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  margin: 0;
  ${spacing.margin.bottom.s}
`;

export const emptyStateSubtext = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op65}
  margin: 0;
  max-width: 320px;
`;
