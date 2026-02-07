import { css } from '@emotion/react';
import { colors, typography, flex, size, spacing, spacingValues, opacity, overflow, display, cursor } from '@core3/ui-components/styleSystem';

export const divider = css`
  ${size.width.full};
  height: ${spacingValues.hairline};
  background-color: ${colors.neutral.gray400};
  ${opacity.veryLow};
`;

export const section = css`
  ${flex.column};
  ${spacing.gap.sm}
  ${size.width.full};
`;

export const sectionTitle = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.base};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.relaxed};
  color: ${colors.neutral.black};
`;

export const infoGrid = css`
  ${flex.column};
  ${spacing.gap.xs};
`;

export const infoRow = css`
  ${flex.row};
  ${flex.align.center};
  ${flex.justify.between};
  ${size.width.full};
  flex-wrap: nowrap;
  gap: ${spacingValues.xs};
  min-width: 0;
`;

export const infoLabel = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.relaxed};
  color: ${colors.neutral.gray600};
  ${opacity.medium};
  flex-shrink: 0;
  white-space: nowrap;
`;

export const infoValue = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.relaxed};
  color: ${colors.neutral.black};
  text-align: right;
  flex-shrink: 0;
`;

export const infoBadges = css`
  ${flex.row};
  ${flex.wrap.nowrap};
  ${spacing.gap.xs};
  ${flex.align.center};
  flex: 1;
  min-width: 0;
`;

export const projectDescription = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.sm};
  ${typography.fontWeight.normal};
  ${typography.lineHeight.tight};
  color: ${colors.neutral.gray600};
  white-space: pre-wrap;
`;

export const projectDescriptionCollapsed = css`
  ${size.maxHeight.xl};
  ${overflow.hidden};
  ${display.box};
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

export const readMore = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.tight};
  color: ${colors.neutral.black};
  ${typography.textDecoration.underline};
  text-underline-position: from-font;
  ${cursor.pointer};
  ${display.inlineBlock};
  ${spacing.margin.top.xxs};
  
  &:hover {
    ${opacity.high};
  }
`;
