import { css } from '@emotion/react';
import {
  flex,
  spacing,
  size,
  coloring,
  typography,
  breakpoints,
  borders,
  colors,
  cursor,
} from '@core3/ui-components/styleSystem';

export const pageContainer = css`
  ${flex.column}
  ${spacing.gap.m}
  ${size.width.full}
  max-width: 1600px;
  margin: 0 auto;
  ${spacing.padding.x.l}
  ${spacing.padding.y.l}
  min-height: calc(100vh - 120px);

  ${breakpoints.sm} {
    ${spacing.padding.x.m}
    ${spacing.padding.y.m}
  }
`;

export const headerRow = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.m}
  ${spacing.padding.bottom.s}
  ${borders.bottom.gray200}
`;

export const titleBlock = css`
  ${flex.column}
  ${spacing.gap.xxs}
`;

export const pageTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xl}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
  margin: 0;
`;

export const pageSubtitle = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op75}
  margin: 0;
`;

export const headerActions = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const editorLayout = css`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 16px;
  align-items: stretch;
  min-height: 600px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const panelCard = css`
  ${size.height.full}
  min-height: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const panelInner = css`
  ${flex.column}
  ${spacing.gap.s}
`;

export const panelTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.base}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
  margin: 0;
`;

export const smallNote = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.xs}
  ${coloring.text.variants.secondary.op65}
  margin: 0;
  line-height: 1.5;
`;

export const field = css`
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

export const canvasCard = css`
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  min-height: 620px;
`;

export const canvasScroll = css`
  width: 100%;
  height: 920px;
  min-height: 720px;
  overflow: auto;

  @media (max-width: 1080px) {
    height: 760px;
  }
`;

export const canvasStage = css`
  position: relative;
  width: 100%;
  min-height: 1600px; /* bigger whiteboard */
  padding: 8px;
  border: 1px solid ${colors.neutral.gray200};
  border-radius: 12px;
  background:
    linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px);
  background-size: calc(100% / 12) 40px;
  background-position: 8px 8px;
`;

export const widgetBox = css`
  border-radius: 12px;
  border: 1px solid ${colors.neutral.gray200};
  background: ${colors.neutral.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  ${cursor.pointer}
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.55);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  }
`;

export const widgetBoxSelected = css`
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.18), 0 6px 16px rgba(0, 0, 0, 0.08);
`;

export const widgetHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.s}
  ${spacing.padding.s}
  border-bottom: 1px solid ${colors.neutral.gray200};
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%);
  cursor: move;
`;

export const widgetTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  margin: 0;
`;

export const widgetBody = css`
  ${spacing.padding.s}
`;

export const widgetPlaceholder = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.sm}
  ${coloring.text.variants.secondary.op75}
  margin: 0;
  line-height: 1.5;
`;

export const widgetList = css`
  ${flex.column}
  ${spacing.gap.xs}
`;

export const widgetListItem = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.s}
  ${spacing.padding.s}
  border: 1px solid ${colors.neutral.gray200};
  ${borders.radius.md}
  background: ${colors.neutral.white};
`;

export const widgetListItemLeft = css`
  ${flex.column}
  ${spacing.gap.xxxs}
  min-width: 0;
`;

export const widgetListItemTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const widgetListItemMeta = css`
  ${typography.fontFamily.display}
  ${typography.fontSize.xs}
  ${coloring.text.variants.secondary.op65}
  margin: 0;
`;

export const controlRow = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${flex.wrap.wrap}
`;

export const dangerButton = css`
  border: 1px solid rgba(185, 28, 28, 0.25);
`;

// Resize hit-areas (invisible, but large and reliable)
export const resizeHandleBase = css`
  position: absolute;
  z-index: 300;
  background: transparent;
  pointer-events: auto;
`;

export const resizeHandleTop = css`
  ${resizeHandleBase}
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  cursor: ns-resize;
`;

export const resizeHandleBottom = css`
  ${resizeHandleBase}
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  cursor: ns-resize;
`;

export const resizeHandleLeft = css`
  ${resizeHandleBase}
  left: 0;
  top: 0;
  bottom: 0;
  width: 18px;
  cursor: ew-resize;
`;

export const resizeHandleRight = css`
  ${resizeHandleBase}
  right: 0;
  top: 0;
  bottom: 0;
  width: 18px;
  cursor: ew-resize;
`;

export const resizeHandleCornerTL = css`
  ${resizeHandleBase}
  top: 0;
  left: 0;
  width: 22px;
  height: 22px;
  cursor: nwse-resize;
`;

export const resizeHandleCornerTR = css`
  ${resizeHandleBase}
  top: 0;
  right: 0;
  width: 22px;
  height: 22px;
  cursor: nesw-resize;
`;

export const resizeHandleCornerBL = css`
  ${resizeHandleBase}
  bottom: 0;
  left: 0;
  width: 22px;
  height: 22px;
  cursor: nesw-resize;
`;

export const resizeHandleCornerBR = css`
  ${resizeHandleBase}
  bottom: 0;
  right: 0;
  width: 22px;
  height: 22px;
  cursor: nwse-resize;
`;

