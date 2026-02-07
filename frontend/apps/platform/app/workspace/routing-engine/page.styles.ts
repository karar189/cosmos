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

export const pageContainer = css`
  ${flex.column}
  ${spacing.gap.xl}
  ${size.width.full}
`;

export const headerSection = css`
  ${flex.column}
  ${spacing.gap.s}
`;

export const pageTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize['4xl']}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
`;

export const pageDescription = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.base}
  ${coloring.text.variants.secondary.op75}
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

// ===== Left: Route configuration (section style) =====
export const configSection = css`
  ${flex.column}
  ${size.width.full}
  ${spacing.padding.m}
  ${borders.radius.md}
  ${borders.bottom.gray200}
  padding-bottom: 24px;
`;

export const configSectionTitle = css`
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

/** Full-width Routing Mode toggle; options fill container evenly (no empty space) */
export const routingModeToggleWrapper = css`
  ${size.width.full}

  & > div {
    width: 100% !important;
    display: flex !important;
  }
  & button {
    flex: 1;
    min-width: 0;
  }
`;

export const submitButtonWrapper = css`
  ${spacing.margin.top.xs}

  button {
    ${size.width.full}
    ${flex.row}
    ${flex.align.center}
    ${flex.justify.center}
    ${spacing.gap.s}
    box-sizing: border-box;
  }
`;

// ===== Right: Results section =====
export const resultsSection = css`
  ${flex.column}
  ${size.width.full}
`;

export const label = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const routingForm = css`
  ${size.width.full}
`;

export const formGrid = css`
  ${flex.row}
  ${flex.wrap.wrap}
  ${spacing.gap.m}
  ${spacing.margin.bottom.l}

  ${breakpoints.sm} {
    ${flex.column}
  }
`;

export const formField = css`
  ${flex.column}
  ${spacing.gap.xs}
  ${flex.item.grow}
  ${size.minWidth.custom('200px')}
`;

export const findRouteButton = css`
  ${size.width.full}
`;

export const selectedRouteSection = css`
  ${size.width.full}
`;

export const routeDetails = css`
  ${flex.column}
  ${spacing.gap.l}
`;

export const routePath = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.wrap.wrap}
  ${spacing.gap.s}
  ${spacing.padding.s}
  ${coloring.background.neutral}
  ${borders.radius.md}
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  ${spacing.margin.bottom.s}
`;

export const routeMetrics = css`
  ${flex.row}
  ${flex.wrap.wrap}
  ${spacing.gap.m}
`;

export const routesComparison = css`
  ${size.width.full}
`;

export const allRoutesSection = css`
  ${size.width.full}
`;

export const routesList = css`
  ${flex.column}
  ${spacing.gap.m}
`;

export const routeCard = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.l}
  ${borders.radius.lg}
  ${borders.gray300}
  ${cursor.pointer}
  transition: all 0.2s ease;
  
  &:hover {
    ${borders.primary}
    ${coloring.background.neutral}
  }
`;

export const routeCardSelected = css`
  ${borders.primary}
  ${coloring.background.neutral}
  border-width: 2px;
`;

export const routeCardHeader = css`
  ${flex.row}
  ${flex.justify.spaceBetween}
  ${flex.align.center}
`;

export const routeCardTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.lg}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
`;

export const routeCardPath = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${typography.fontFamily.display}
  ${typography.fontSize.base}
  ${coloring.text.variants.secondary.op75}
`;

export const routeCardMetrics = css`
  ${flex.row}
  ${flex.wrap.wrap}
  ${spacing.gap.l}
`;

export const routeMetric = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${typography.fontFamily.display}
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op65}
`;

export const riskBlock = css`
  ${flex.column}
`;

export const routesSection = css`
  ${spacing.margin.bottom.xl}
`;

export const sectionTitle = css`
  ${typography.fontSize.xl}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  ${spacing.margin.bottom.m}
`;

export const errorMessage = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${spacing.padding.m}
  ${borders.radius.md}
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  ${spacing.margin.bottom.m}
`;

export const loadingMessage = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${spacing.padding.m}
  ${borders.radius.md}
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  ${coloring.text.primary}
  ${spacing.margin.bottom.m}
`;

export const emptyState = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.padding.xl}
  ${coloring.text.variants.secondary.op75}
  text-align: center;
  
  svg {
    width: 48px;
    height: 48px;
    ${spacing.margin.bottom.m}
    opacity: 0.5;
  }
`;

export const routeHeader = css`
  ${flex.row}
  ${flex.justify.spaceBetween}
  ${flex.align.center}
  ${spacing.margin.bottom.s}
`;

export const routeName = css`
  ${typography.fontSize.lg}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
`;

export const assetName = css`
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const pathArrow = css`
  ${spacing.margin.left.xs}
  ${spacing.margin.right.xs}
  width: 16px;
  height: 16px;
  opacity: 0.5;
`;

export const metric = css`
  ${flex.column}
  ${flex.align.center}
  text-align: center;
`;

export const metricLabel = css`
  ${typography.fontSize.xs}
  ${coloring.text.variants.secondary.op75}
  ${spacing.margin.bottom.xs}
`;

export const metricValue = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
`;

export const routeAmount = css`
  ${flex.row}
  ${flex.justify.spaceBetween}
  ${flex.align.center}
  ${spacing.padding.s}
  ${borders.radius.sm}
  background-color: #f8fafc;
`;

export const amountLabel = css`
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op75}
`;

export const amountValue = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
`;

export const analyticsSection = css`
  ${spacing.margin.top.xl}
`;

export const metricsGrid = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  ${spacing.gap.m}
  ${spacing.margin.bottom.xl}
`;

export const chartCard = css`
  ${spacing.margin.bottom.xl}
`;

export const chartPlaceholder = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.padding.xl}
  ${coloring.text.variants.secondary.op75}
  text-align: center;
  
  svg {
    width: 48px;
    height: 48px;
    ${spacing.margin.bottom.m}
    opacity: 0.5;
  }
`;

export const executionSection = css`
  ${spacing.margin.top.xl}
`;

export const executionCard = css`
  max-width: 500px;
`;

export const executionSummary = css`
  ${spacing.margin.bottom.l}
`;

export const summaryRow = css`
  ${flex.row}
  ${flex.justify.spaceBetween}
  ${flex.align.center}
  ${spacing.padding.top.s}
  ${spacing.padding.bottom.s}
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const executeButton = css`
  ${size.width.full}
  ${spacing.margin.bottom.m}
  /* Single clean button: remove wrapper border/padding so it doesn’t look double-bordered */
  border: none !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  button {
    box-shadow: none !important;
  }
  button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

export const executionNote = css`
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op75}
  text-align: center;
  font-style: italic;
`;
