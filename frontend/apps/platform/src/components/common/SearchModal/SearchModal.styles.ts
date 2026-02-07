import { css } from "@emotion/react";
import { borders, breakpoints, colors, display, flex, size, spacing, spacingValues, typography, transitions, coloring, position, overflow } from "@core3/ui-components/styleSystem";

export const modalContainer = css`
  padding: 0;
`;

export const modalBox = css`
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  margin: 0;
  padding: 0;
  border: none;
  ${borders.radius.none}
  background-color: ${colors.neutral.white};

  ${breakpoints.md} {
    width: auto;
    height: auto;
    max-width: ${size.width['4.5xl']};
    max-height: none;
    margin: 0 auto;
    padding: ${spacingValues.zero};
    ${borders.radius['2xl']}
  }
`;

export const container = css`
  ${flex.column}
  ${size.width.full}
  ${size.height.full}
  ${transitions.all}
  background-color: ${colors.neutral.white};
  border: none;

  ${breakpoints.md} {
    ${size.height.auto}
    overflow: hidden;
  }
`;

export const content = css`
  ${spacing.padding.x.m}
  ${spacing.padding.bottom.m}
  ${size.width.full}
  flex: 1;
  overflow-y: auto;

  ${breakpoints.md} {
    ${spacing.padding.m}
    ${size.width["4.5xl"]}
    ${size.maxWidth.sm}
    flex: none;
  }
`;

export const contentWrapper = css`
  ${spacing.padding.zero}
`;

export const navHelper = css`
  display: none;

  ${breakpoints.md} {
    ${display.flex}
    ${flex.base}
    ${flex.justify.between}
    ${spacing.gap.l}
    ${spacing.padding.x.xxl}
    ${spacing.padding.y.m}
    ${borders.top}
    border-color: ${colors.badge.gray.background};
    ${coloring.text.secondary}
    ${typography.fontSize.sm}
  }
`;

export const navHelperItem = css`
  ${flex.centerCross}
  ${spacing.gap.xxs}

  span {
    ${spacing.margin.left.xxs}
  }
`;

export const keyIcon = css`
  background-color: ${colors.badge.gray.background};
  ${coloring.text.primary}
  ${flex.center}
  ${size.height.md}
  ${size.width.lg}
  ${borders.radius.base}
  ${typography.fontSize.xs}
  ${typography.fontWeight.semibold}
  ${typography.lineHeight.normal}

  svg {
    ${size.width.sm}
    ${size.height.sm}
  }
`;

export const visuallyHidden = css`
  ${position.absolute}
  ${size.width.px}
  ${size.height.px}
  ${spacing.padding.zero}
  ${overflow.hidden}
  ${typography.whiteSpace.nowrap}
  margin: -1px;
  clip: rect(0, 0, 0, 0);
  border-width: 0;
`;