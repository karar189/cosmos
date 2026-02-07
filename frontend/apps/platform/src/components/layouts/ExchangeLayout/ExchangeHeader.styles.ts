import { css } from '@emotion/react';
import { flex, spacing, typography, colors, borders, transitions, spacingValues, sizeValues, size, background, cursor, overflow, objectFit, position } from '@core3/ui-components/styleSystem';

// Custom size for 88px icon (14px gap also)
const ICON_GAP = '14px'; // Gap between icon and text
const STAR_SIZE = '14px';

export const header = css`
  ${position.sticky}
  ${position.top.zero}
  ${position.zIndex.fixed}
  ${flex.column}
  ${spacing.gap.l}
  ${spacing.padding.y.xxl}
  ${spacing.padding.x.l}
  ${background.project}
`;

export const backButton = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${background.none}
  ${borders.none}
  ${spacing.padding.zero}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.fontFamily.primary}
  color: ${colors.text.secondary};
  ${cursor.pointer}
  ${transitions.all}

  &:hover {
    color: ${colors.text.primary};
  }

  &:focus-visible {
    outline: ${spacingValues.xxxs} solid ${colors.primary.main};
    outline-offset: ${spacingValues.xxs};
    ${borders.radius.base}
  }
`;

export const backIcon = css`
  width: ${sizeValues.sm};
  height: ${sizeValues.sm};
`;

export const projectInfo = css`
  ${flex.row}
  ${flex.align.center}
  gap: ${ICON_GAP};
  ${flex.wrap.wrap}
`;

export const iconWrapper = css`
  ${borders.radius.full}
  ${overflow.hidden}
  ${flex.item.shrink0}
  background: ${colors.background.paper};
  border: ${spacingValues.hairline} solid ${colors.neutral.gray200};
  ${position.relative}
  ${transitions.all}

  img {
    ${size.width.full}
    ${size.height.full}
    ${objectFit.cover}
  }
`;

export const iconGradient = css`
  ${size.width.full}
  ${size.height.full}
  ${flex.center}
  ${typography.fontSize['3xl']}
  ${typography.fontWeight.bold}
  color: white;
`;

export const mainInfo = css`
  ${flex.column}
  ${spacing.gap.s}
  ${flex.item.grow}
  ${size.minWidth.zero}
`;

export const projectNameRow = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${flex.wrap.wrap}
`;

export const projectName = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.bold}
  ${typography.lineHeight.tight}
  ${typography.textTransform.uppercase}
  color: ${colors.text.primary};
  ${spacing.margin.zero}
  ${transitions.all}
`;

export const projectTicker = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.normal}
  ${typography.lineHeight.tight}
  color: ${colors.text.secondary};
  ${spacing.margin.zero}
  ${transitions.all}
`;

export const badgesWrapper = css`
  ${overflow.hidden}
  ${transitions.all}
`;

export const badges = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.m}
  ${flex.wrap.wrap}
  ${transitions.opacity}
`;

export const projectBadge = css`
  ${flex.centerCross}
  ${spacing.gap.xs}
  ${spacing.padding.x.s}
  ${spacing.padding.y.xxxs}
  ${typography.fontSize.xs}
  border: ${spacingValues.hairline} solid ${colors.border.tagBorder};
  color: ${colors.text.secondary};
  ${borders.radius.full}

  & b {
   color: ${colors.text.primary};
   ${typography.fontWeight.medium}
  }

  .stars-container {
    ${size.minWidth.unset}
  }
`;

export const certificationLabel = css`
  ${typography.fontSize.xs}
  ${typography.fontWeight.normal}
  color: ${colors.text.secondary};
`;

export const starsWrapper = css`
  div {
    ${spacing.gap.xxs}
  }
  
  svg {
    width: ${STAR_SIZE};
    height: ${STAR_SIZE};
  }
`;
