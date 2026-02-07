import {
  borders,
  blur,
  breakpoints,
  coloring,
  colors,
  cursor,
  display,
  flex,
  opacity,
  overflow,
  pointerEvents,
  position,
  gradients,
  size,
  spacing,
  transitions,
  typography,
  userSelect,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const reservesCardWrapper = css`
  ${position.relative}
  ${overflow.hidden}
`;

export const comingSoonOverlay = css`
  ${position.absolute}
  ${position.top.custom('100px')}
  ${position.left.custom('-20px')}
  ${position.right.custom('-20px')}
  ${position.bottom.custom('-20px')}
  ${flex.column}
  ${flex.center}
  ${flex.justify.center}
  ${spacing.padding.x.l}
  ${spacing.padding.y.custom('40px')}
  background: ${gradients.comingSoonOverlay};
  ${position.zIndex.dropdown}
  ${spacing.gap.m}
  ${typography.textAlign.center}
  ${blur.backdrop.custom('7.5px')}
`;

export const comingSoonTitle = css`
  ${typography.fontSize.xl}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const comingSoonSubtitle = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
`;

export const comingSoonButtonWrapper = css`
  ${borders.radius.full}
  ${borders.custom({
    width: '1.5px',
    style: 'solid',
    color: colors.neutral.black,
  })}
  ${spacing.padding.xxs}
  ${display.inlineBlock}
`;

export const comingSoonButton = css`
  ${typography.fontFamily.mono}
  ${typography.fontSize.sm}
  ${typography.fontWeight.bold}
  ${spacing.padding.y.s}
  ${spacing.padding.x.m}
  ${borders.radius.full}
  ${coloring.background.neutral.dark}
  ${coloring.text.neutral.white}
  ${typography.textTransform.uppercase}
  ${cursor.pointer}
  ${transitions.all}
  ${borders.none}
  ${typography.lineHeight.normal}

  &:hover {
    ${opacity.veryHigh}
  }
`;

export const blurredContent = css`
  ${blur.value.custom('10px')}
  ${pointerEvents.none}
  ${userSelect.none}
`;

export const distributionCard = css`
  ${borders.radius['2xl']}
  ${borders.gray300}
  ${flex.column}
  ${flex.center}
  ${spacing.gap.m}
  ${spacing.padding.m}
  ${size.height.full}
  ${flex.item.shrink0}
  ${overflow.hidden}
`;

export const assetRowWrapper = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.m}
`;

export const assetIcon = css`
  ${size.width.md}
  ${size.height.md}
  ${borders.radius.circle}
`;

export const assetIconWithColor = (color: string) => css`
  ${assetIcon}
  background-color: ${color};
`;

export const assetInfoWrapper = css`
  ${flex.column}
  ${spacing.gap.xxs}
  ${blurredContent}
`;

export const assetName = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const assetAddress = css`
  ${typography.fontSize.xs}
  ${coloring.text.secondary}
`;

export const balanceCell = css`
  ${typography.fontFamily.mono}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
  ${coloring.text.primary}
  ${blurredContent}
  ${typography.textAlign.right}
`;

export const valueCell = css`
  ${typography.fontFamily.mono}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
  ${coloring.text.primary}
  ${blurredContent}
  ${typography.textAlign.right}
`;

export const lastLiabilitiesDateWrapper = css`
  ${spacing.margin.top.xxs}
`;

export const lastLiabilitiesDate = css`
  ${typography.fontSize.xs}
  ${coloring.text.secondary}
`;

export const reservesCard = css`
  ${reservesCardWrapper}
  ${size.width.full}
  ${size.height.full}
  ${size.minWidth.zero}
  ${size.minHeight.zero}
  ${size.maxWidth.none}
  ${flex.self.stretch}
  ${flex.justifySelf.stretch}
`;

export const reservesContentWrapper = css`
  ${position.relative}
  ${size.width.full}
  ${flex.one}
  ${flex.column}
  ${size.minHeight.zero}
`;

export const reservesTableWrapper = css`
  ${flex.row}
  ${spacing.gap.xl}
  ${position.relative}
  ${size.width.full}
  ${flex.one}
  ${size.minHeight.zero}
`;

export const tableContainer = css`
  ${flex.one}
  ${size.minWidth.zero}
  ${size.minHeight.zero}
`;

export const distributionTitle = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const donutChartWrapper = css`
  ${blurredContent}
`;

export const legendWrapper = css`
  ${flex.column}
  ${spacing.gap.xxs}
  ${size.width.full}
  ${size.maxWidth.custom('187px')}
  ${blurredContent}
`;

export const legendItem = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${size.height.custom('28px')}
`;

export const legendItemLeft = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
`;

export const legendDot = css`
  ${size.width.s}
  ${size.height.s}
  ${borders.radius.circle}
`;

export const legendDotWithColor = (color: string) => css`
  ${legendDot}
  background-color: ${color};
`;

export const legendLabel = css`
  ${typography.fontSize.sm}
  ${coloring.text.primary}
`;

export const legendValue = css`
  ${typography.fontFamily.mono}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
  ${coloring.text.primary}
`;

export const desktopReserves = css`
  ${display.none}
  
  ${breakpoints.md} {
    ${display.flex}
    ${flex.one}
    ${size.minHeight.zero}
  }
`;

export const mobileReserves = css`
  ${display.flex}
  ${flex.column}
  ${spacing.gap.m}
  ${size.width.full}
  
  ${breakpoints.md} {
    ${display.none}
  }
`;

