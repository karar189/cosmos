import { css } from '@emotion/react';
import {
  flex,
  spacing,
  size,
  coloring,
  typography,
  breakpoints,
  borders,
} from '@core3/ui-components/styleSystem';

export const pageContainer = css`
  ${flex.column}
  ${spacing.gap.l}
  ${size.width.full}
  max-width: 1600px;
  margin: 0 auto;
  ${spacing.padding.x.l}
  ${spacing.padding.y.l}
  min-height: 100vh;

  ${breakpoints.sm} {
    ${spacing.padding.x.m}
  }
`;

export const pageHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.padding.bottom.m}
  ${borders.bottom.gray200}
  flex-wrap: wrap;
  gap: 16px;
`;

export const titleBlock = css`
  ${flex.column}
  ${spacing.gap.xxs}
`;

export const pageTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize['2xl']}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
  margin: 0;
  letter-spacing: -0.02em;
`;

export const pageSubtitle = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op75}
  margin: 0;
`;

export const mainLayout = css`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  align-items: start;
  min-height: 480px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const tableCard = css`
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  ${borders.radius.lg}
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

export const tableHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.padding.m}
  ${coloring.background.neutral}
  ${borders.bottom.gray200}
`;

export const tableTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.base}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  margin: 0;
`;

export const tableWrapper = css`
  overflow-x: auto;
`;

export const table = css`
  width: 100%;
  border-collapse: collapse;
  ${typography.fontSize.sm}
`;

export const th = css`
  text-align: left;
  ${spacing.padding.s}
  ${spacing.padding.x.m}
  ${typography.fontWeight.semibold}
  ${coloring.text.variants.secondary.op75}
  ${borders.bottom.gray200}
  background: rgba(0, 0, 0, 0.02);
`;

export const td = css`
  ${spacing.padding.s}
  ${spacing.padding.x.m}
  ${borders.bottom.gray200}
  ${coloring.text.primary}
  vertical-align: middle;
`;

export const tableRow = css`
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.04);
  }

  &:last-child td {
    border-bottom: none;
  }
`;

export const tableRowSelected = css`
  background: rgba(99, 102, 241, 0.08);

  &:hover {
    background: rgba(99, 102, 241, 0.1);
  }
`;

export const dashboardNameCell = css`
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const metaCell = css`
  ${coloring.text.variants.secondary.op75}
  ${typography.fontSize.xs}
`;

export const actionsCell = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
`;

export const viewPanel = css`
  ${flex.column}
  ${spacing.gap.m}
  position: sticky;
  top: 24px;

  @media (max-width: 900px) {
    position: static;
  }
`;

export const viewPanelCard = css`
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  ${borders.radius.lg}
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  ${coloring.background.paper}
`;

export const viewPanelHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.padding.m}
  ${borders.bottom.gray200}
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.04) 100%);
`;

export const viewPanelTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.lg}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
  margin: 0;
`;

export const viewPanelActions = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const dashboardGrid = css`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
  ${spacing.padding.m}
  min-height: 400px;
  align-content: start;
`;

export const widgetCard = css`
  ${flex.column}
  ${spacing.gap.s}
  ${spacing.padding.m}
  ${borders.radius.md}
  border: 1px solid rgba(0, 0, 0, 0.08);
  ${coloring.background.paper}
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-height: 80px;
  overflow: hidden;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: rgba(99, 102, 241, 0.2);
  }
`;

export const widgetCardHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.s}
`;

export const widgetCardTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  margin: 0;
  line-height: 1.3;
`;

export const widgetCardBody = css`
  ${flex.column}
  ${flex.justify.center}
  flex: 1;
  ${coloring.background.neutral}
  ${borders.radius.sm}
  ${spacing.padding.s}
  min-height: 48px;
`;

export const widgetPlaceholder = css`
  ${typography.fontSize.xs}
  ${coloring.text.variants.secondary.op65}
  margin: 0;
  font-style: italic;
`;

export const emptyTable = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.padding.y.xl}
  ${spacing.padding.x.l}
  text-align: center;
`;

export const emptyTableIcon = css`
  ${size.width.custom('48px')}
  ${size.height.custom('48px')}
  ${spacing.margin.bottom.m}
  opacity: 0.3;
`;

export const emptyTableText = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.base}
  ${coloring.text.variants.secondary.op75}
  margin: 0;
`;

export const emptyView = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.padding.y.xl}
  ${spacing.padding.x.l}
  text-align: center;
  min-height: 320px;
  ${coloring.background.neutral}
  ${borders.radius.md}
`;

export const emptyViewText = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op65}
  margin: 0;
`;
