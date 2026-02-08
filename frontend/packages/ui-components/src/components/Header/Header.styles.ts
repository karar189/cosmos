import { css } from '@emotion/react';
import {
  flex,
  spacing,
  spacingValues,
  sizeValues,
  typography,
  colors,
  size,
  breakpoints,
  position,
  transitions,
  borders,
  patterns,
  coloring,
  display,
  opacity,
} from '../../theme/styleSystem';

export const header = css`
  ${position.relative}
  ${flex.base}
  ${flex.column}
  ${spacing.padding.y.m}
  ${spacing.padding.x.l}
  ${coloring.background.transparent}
  ${position.zIndex.sticky}

  ${breakpoints.md} {
    ${spacing.padding.x.xxl}
  }
`;

export const headerSticky = css`
  ${position.sticky}
  ${position.top.zero}
  background: #fff;
`;

export const container = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${size.width.full}
`;

export const leftSection = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.l}
  flex-shrink: 0;
`;

export const leftSectionUnauthenticated = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.m}
  flex-shrink: 0;
`;

export const logoContainer = css`
  ${flex.row}
  ${flex.align.center}
  flex-shrink: 0;
  width: auto;
  max-width: 160px;
  ${size.height.custom('20px')}
  
  ${breakpoints.md} {
    max-width: 200px;
    ${size.height.custom('24px')}
  }
  
  img {
    width: auto;
    height: 100%;
    max-width: 100%;
    object-fit: contain;
    object-position: left center;
  }
`;

export const logoLink = css`
  ${flex.row}
  ${flex.align.center}
  ${typography.textDecoration.none}
  ${transitions.opacity}

  &:hover {
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: ${spacingValues.xxs};
    ${borders.radius.base}
  }
`;

export const logoPlaceholder = css`
  ${typography.fontSize.xl}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
`;

export const separator = css`
  ${size.height.custom('36px')}
  ${size.width.px}
  background-color: ${colors.text.secondary};
  ${flex.item.shrink0}
`;

export const badgeContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.item.shrink0}
`;

export const authBadgeSection = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.zero}
  ${flex.item.shrink0}
  
  /* 16px spacing around separators */
  > *:not(:last-child) {
    margin-right: ${spacingValues.m};
  }
`;

export const desktopNav = css`
  display: none;

  ${breakpoints.md} {
    display: flex;
  }
`;

export const navList = css`
  ${patterns.resetList}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xl}
`;

export const navItem = css`
  ${flex.row}
  ${flex.align.center}
`;

export const navLink = css`
  ${patterns.resetButton}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.fontFamily.mono}
  ${typography.textTransform.uppercase}
  ${typography.letterSpacing.wide}
  ${coloring.text.primary}
  ${typography.textDecoration.none}
  ${transitions.colors}
  ${spacing.padding.y.s}
  ${coloring.background.transparent}
  ${borders.none}
  cursor: pointer;

  &:hover {
    ${typography.fontWeight.bold}
  }

  &:focus-visible {
    outline: 2px solid ${colors.text.primary};
    outline-offset: 2px;
    ${borders.radius.sm}
  }
`;

export const navLinkActive = css`
  ${typography.fontWeight.bold}
`;

export const rightSection = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.end}
  ${spacing.gap.m}
  flex-shrink: 0;
  flex-grow: 1;
  
  ${breakpoints.md} {
    flex-grow: 0;
  }
`;

export const searchPlaceholder = css`
  display: none;

  ${breakpoints.md} {
    display: flex;
  }
`;

export const ctaContainer = css`
  display: block;

  /* Override Core3Button styles to make CTA smaller */
  button {
    ${spacing.padding.y.xs}
    ${spacing.padding.x.m}
    ${typography.fontWeight.bold}
    ${typography.fontSize.xs}
    ${typography.lineHeight.tight}
  }

  ${breakpoints.md} {
    button {
      ${typography.fontSize.sm}
    }
  }
`;

export const mobileMenuToggle = css`
  ${patterns.resetButton}
  display: flex;
  ${flex.column}
  ${flex.justify.center}
  ${flex.align.center}
  ${spacing.gap.xxs}
  ${size.width.custom('40px')}
  ${size.height.custom('40px')}
  border-radius: 50px;
  border: 1.5px solid ${colors.neutral.gray700};
  ${coloring.background.transparent}
  cursor: pointer;
  ${transitions.all}

  &:hover {
    background-color: ${colors.background.hover};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
  }

  ${breakpoints.md} {
    display: none;
  }
`;

export const hamburgerLine = css`
  width: ${sizeValues.xsm};
  height: ${spacingValues.xxxs};
  background: ${colors.text.primary};
  ${transitions.all}
  ${borders.radius.sm}
`;

export const hamburgerLineOpen = css`
  &:nth-of-type(1) {
    transform: translateY(${spacingValues.xs}) rotate(45deg);
  }

  &:nth-of-type(2) {
    ${opacity.hidden}
  }

  &:nth-of-type(3) {
    transform: translateY(-${spacingValues.xs}) rotate(-45deg);
  }
`;

export const mobileMenuBackdrop = css`
  ${position.fixed}
  ${position.inset.zero}
  ${position.zIndex.fixed}
  background-color: rgba(0, 0, 0, 0.5);
  ${transitions.opacity}
  opacity: 0;
  animation: fadeIn 0.2s ease-out forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  ${breakpoints.md} {
    display: none;
  }
`;

export const mobileNav = css`
  ${position.fixed}
  ${position.top.zero}
  ${position.right.zero}
  ${position.zIndex.modal}
  ${size.width.full}
  ${size.height.custom('100vh')}
  background-color: ${colors.background.paper};
  ${flex.column}
  ${spacing.padding.x.l}
  ${spacing.padding.y.m}
  transform: translateX(100%);
  ${transitions.transform}
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
  overflow-y: auto;
  overflow-x: hidden;

  ${breakpoints.md} {
    display: none;
  }
`;

export const mobileNavOpen = css`
  transform: translateX(0);
`;

export const mobileNavHeader = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.margin.bottom.l}
`;

export const mobileCloseButton = css`
  ${patterns.resetButton}
  ${size.width.custom('48px')}
  ${size.height.custom('48px')}
  ${display.flex}
  ${flex.center}
  ${borders.radius.circle}
  border: 1.5px solid ${colors.neutral.gray400};
  ${coloring.background.transparent}
  cursor: pointer;
  ${transitions.all}
  
  svg {
    width: ${sizeValues.md};
    height: ${sizeValues.md};
    color: ${colors.text.primary};
  }
  
  &:hover {
    background-color: ${colors.background.hover};
  }
  
  &:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
  }
`;

export const mobileNavContent = css`
  ${flex.column}
  ${size.height.full}
  ${flex.justify.between}
`;

export const mobileNavList = css`
  ${patterns.resetList}
  ${flex.column}
`;

export const mobileNavItem = css`
  ${flex.row}
`;

export const mobileNavLink = css`
  ${patterns.resetButton}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.fontFamily.mono}
  ${typography.textTransform.uppercase}
  ${typography.letterSpacing.wide}
  ${coloring.text.primary}
  ${typography.textDecoration.none}
  ${transitions.colors}
  ${spacing.padding.bottom.l}
  ${size.width.full}
  ${display.block}
  ${coloring.background.transparent}
  ${borders.none}
  cursor: pointer;
  text-align: left;

  &:hover {
    ${typography.fontWeight.bold}
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
    ${borders.radius.base}
  }
`;

export const mobileNavLinkActive = css`
  ${typography.fontWeight.bold}
`;

export const mobileSearchContainer = css`
  ${spacing.margin.bottom.l}
  ${size.width.full}

  ${breakpoints.md} {
    ${display.none}
  }
  
  /* Make search button full width and left-align content */
  button {
    ${size.width.full}
    justify-content: flex-start !important;
    gap: ${spacingValues.s} !important;
  }
  
  /* Left-align the search text span, let it grow */
  button > span {
    flex: 1;
    text-align: left !important;
  }
  
  /* Push slash key to the right */
  button > kbd {
    margin-left: auto;
    flex-shrink: 0;
  }
`;

export const mobileCta = css`
  ${spacing.margin.top.auto}
  ${spacing.padding.bottom.xl}
`;

export const mobileCtaContainer = css`
  ${flex.column}
  ${spacing.padding.top.m}
`;

export const mobileUserMenuContainer = css`
  ${flex.column}
  ${spacing.padding.top.m}
`;

export const mobileCtaText = css`
  ${display.block}

  ${breakpoints.sm} {
    ${display.none}
  }
`;

export const ctaText = css`
  ${display.none}

  ${breakpoints.sm} {
    ${display.block}
  }
`
