import { css } from '@emotion/react';
import { borders, coloring, cursor, flex, overflow, position, size, spacing, tableLayout, transitions, typography } from '@core3/ui-components/styleSystem';

export const tableContainer = css`
  ${size.width.full}
  ${coloring.background.neutral.white}
  ${spacing.padding.m}
  ${borders.radius['2xl']}
  ${overflow.x.auto}
  
  table {
    ${size.width.full}
    ${tableLayout.fixed}
  }
`;

export const clickableAsset = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${cursor.pointer}
  ${transitions.all}
  
  &:hover {
    opacity: 0.7;
  }
  
  &:focus-visible {
    outline: 2px solid;
    outline-offset: 2px;
    ${borders.radius.base}
  }
`;

export const assetLogo = css`
  ${position.relative}
  ${size.width.md}
  ${size.height.md}
  ${borders.radius.full}
  ${overflow.hidden}
  flex-shrink: 0;
`;

export const assetLogoPlaceholder = css`
  ${flex.center}
  ${size.width.md}
  ${size.height.md}
  ${borders.radius.full}
  ${coloring.background.neutral.gray200}
  flex-shrink: 0;
`;

export const placeholderText = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.bold}
  ${coloring.text.secondary}
`;

export const assetInfo = css`
  ${flex.column}
  ${spacing.gap.xxxs}
  min-width: 0;
`;

export const assetName = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${typography.lineHeight.tight}
`;

export const assetTicker = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.normal}
  ${coloring.text.secondary}
  ${typography.lineHeight.tight}
`;

export const balanceValue = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const comingSoonText = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
`;

export const marketCapValue = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const tokenAuditsCell = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
`;

export const checkIcon = css`
  ${size.width.sm}
  ${size.height.sm}
  ${coloring.text.neutral.black}
`;

export const redCrossIcon = css`
  ${size.width.sm}
  ${size.height.sm}
  ${coloring.status.red}
`;

export const auditText = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const noData = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
`;

export const categoryText = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  white-space: normal;
  word-break: break-word;
`;

