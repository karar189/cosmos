import { css } from '@emotion/react';
import {
  flex,
  spacing,
  size,
  coloring,
  typography,
  breakpoints,
  borders,
  cursor,
} from '@core3/ui-components/styleSystem';
import { colors } from '@core3/ui-components/styleSystem';

// ===== Page layout =====
export const pageContainer = css`
  ${flex.column}
  ${spacing.gap.m}
  ${size.width.full}
  max-width: 1600px;
  margin: 0 auto;
  ${spacing.padding.x.l}
  min-height: 100vh;

  ${breakpoints.sm} {
    ${spacing.padding.x.m}
  }
`;

// ===== Header (compact) =====
export const headerSection = css`
  ${flex.column}
  ${spacing.gap.xxs}
  ${spacing.padding.bottom.s}
  ${borders.bottom.gray200}
  ${size.width.full}
`;

export const headerTitleBlock = css`
  ${flex.column}
  ${spacing.gap.xxs}
`;

/** Same row: title flex-start (left), button flex-end (right) */
export const headerTitleRow = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const pageTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xl}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
  margin: 0;
  flex-shrink: 0;
  align-self: flex-start;
`;

export const pageDescription = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.xs}
  ${coloring.text.variants.secondary.op75}
  margin: 0;
`;

/** Button on the right (flex-end) */
export const headerSaveButton = css`
  flex-shrink: 0;
  align-self: flex-end;
  margin-left: auto;
`;

// ===== Two column layout: 20% left / 80% right =====
export const twoColumnLayout = css`
  display: flex;
  gap: 16px;
  align-items: stretch;
  ${size.width.full}
  ${size.height.custom('calc(100vh - 240px)')}
  min-height: 360px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: auto;
  }
`;

export const leftColumn = css`
  ${flex.column}
  width: 24%;
  min-width: 240px;
  max-width: 380px;
  min-height: 0;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
    max-height: 400px;
  }
`;

export const rightColumn = css`
  ${flex.column}
  flex: 1;
  min-width: 0;
  min-height: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

/** Inner scroll container so the right column content scrolls */
export const rightColumnScroll = css`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`;

export const builderLayout = css`
  ${twoColumnLayout}
`;

export const widgetsPanel = css`
  ${size.height.full}
  ${size.width.full}
  min-height: 0;
`;

export const categoryFilter = css`
  ${spacing.margin.bottom.s}
`;

export const widgetsList = css`
  ${flex.column}
  ${spacing.gap.xs}
`;

export const widgetItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${spacing.padding.s}
  ${borders.radius.sm}
  ${borders.gray300}
  ${cursor.pointer}
  ${typography.fontSize.sm}
  transition: all 0.2s ease;

  & svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &:hover {
    ${borders.primary}
    ${coloring.background.neutral}
  }
`;

export const dashboardArea = css`
  ${flex.item.grow}
  ${size.height.full}
  overflow-y: auto;
`;

export const emptyDashboard = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.padding.y.xl}
  ${spacing.gap.s}
`;

export const emptyIcon = css`
  ${size.width.custom('40px')}
  ${size.height.custom('40px')}
  ${coloring.text.variants.secondary.op50}
`;

export const emptyText = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op65}
  ${typography.textAlign.center}
`;

export const widgetsGrid = css`
  ${flex.row}
  ${flex.wrap.wrap}
  ${spacing.gap.m}
`;

export const dashboardWidgetContainer = css`
  ${size.width.custom('320px')}
  ${size.minHeight.custom('240px')}

  ${breakpoints.sm} {
    ${size.width.full}
  }
`;

export const dashboardWidgetCard = css`
  ${size.height.full}
  ${flex.column}

  h3 {
    ${typography.fontSize.sm}
    ${typography.fontWeight.semibold}
  }
`;

export const widgetContent = css`
  ${flex.item.grow}
  ${spacing.padding.s}
`;

/** Small red minus button in top-right of widget card */
export const widgetRemoveButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: #dc2626;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;

  & svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background-color: #b91c1c;
  }

  &:focus-visible {
    outline: 2px solid #dc2626;
    outline-offset: 2px;
  }
`;

export const metricWidget = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.gap.xs}
  ${size.height.full}
`;

export const metricValue = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xl}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
`;

export const metricLabel = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op75}
`;

export const alertWidget = css`
  ${flex.column}
  ${spacing.gap.s}
`;

export const alertItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${spacing.padding.s}
  ${coloring.background.neutral}
  ${borders.radius.sm}
  ${typography.fontFamily.display}
  ${typography.fontSize.xs}
`;
