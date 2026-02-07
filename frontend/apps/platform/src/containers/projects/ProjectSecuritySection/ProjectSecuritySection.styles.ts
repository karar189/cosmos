import { css } from '@emotion/react';

import { coloring, flex, size, spacing, breakpoints, display, typography, colors, borders, position, overflow } from '@core3/ui-components/styleSystem';

export const desktopLayout = css`
  ${display.none}

  ${breakpoints.lg} {
    ${display.block}
  }
`;

export const mobileLayout = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.m}
  ${spacing.margin.top.l}
  ${borders.radius['2xl']}
  ${coloring.background.section}

  ${breakpoints.lg} {
    ${display.none}
  }
`;

export const mobileHeader = css`
  ${flex.column}
  ${spacing.gap.s}
  ${spacing.padding.left.zero}
  ${spacing.padding.right.l}
`;

export const mobileHeaderLeft = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const mobileHeaderIcon = css`
  ${size.width.lg}
  ${size.height.lg}
  ${coloring.text.primary}
`;

export const mobileHeaderTitle = css`
  ${typography.fontSize.lg}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${spacing.margin.zero}
`;

export const scoreBadge = css`
  ${spacing.padding.x.s}
  ${spacing.padding.y.xxxs}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  background-color: ${colors.yellow.background};
  color: ${colors.text.primary};
  ${borders.radius.base}
`;

export const mobileHeaderDescription = css`
  ${typography.fontSize.sm}
  ${coloring.text.secondary}
  ${spacing.margin.zero}
`;

export const mobileSectionCard = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.m}
  ${borders.radius['2xl']}
  ${coloring.background.neutral.default}
`;

export const toggle = css`
  ${flex.self.start}
`;

export const tableCard = css`
  ${spacing.gap.s}
`;

export const chevronRightIcon = css`
  ${size.width.sm}
  ${size.height.sm}
  ${coloring.text.primary}
`;

export const mobileAuditCard = css`
  ${flex.column}
  ${spacing.gap.xs}
  ${spacing.padding.zero}
  ${spacing.padding.bottom.m}
  ${coloring.background.neutral.default}
  border-bottom: 1px solid ${colors.neutral.gray200};

  &:last-child {
    border-bottom: none;
  }
`;

export const auditHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${spacing.padding.bottom.xs}
`;

export const auditorLogoMobile = css`
  ${position.relative}
  ${size.width.lg}
  ${size.height.lg}
  ${borders.radius.full}
  ${overflow.hidden}
  ${coloring.background.secondary}
  flex-shrink: 0;

  img {
    ${size.width.full}
    ${size.height.full}
    object-fit: cover;
  }
`;

export const auditorNameMobile = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.primary}
`;

export const auditRow = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.s}
  ${spacing.padding.y.xxs}
`;

export const auditLabel = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.secondary}
`;

export const auditLabelWithTooltip = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
`;

export const infoIcon = css`
  ${size.width.sm}
  ${size.height.sm}
  ${coloring.text.secondary}
`;

export const auditValue = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.primary}
`;

export const presentCellMobile = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.primary}
`;

export const checkIconMobile = css`
  ${size.width.sm}
  ${size.height.sm}
  ${coloring.text.primary}
`;

export const negativeIconMobile = css`
  ${coloring.status.red}
`;

export const warningIconMobile = css`
  ${coloring.status.orange}
`;

export const naText = css`
  ${typography.fontSize.sm}
  ${coloring.text.secondary}
`;
