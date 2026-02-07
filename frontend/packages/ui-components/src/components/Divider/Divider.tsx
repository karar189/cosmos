/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './Divider.styles';

export interface DividerProps {
  /**
   * If true, renders a vertical divider. If false, renders a horizontal divider.
   * @default false
   */
  vertical?: boolean;
  /**
   * If false, removes margins. For vertical dividers, removes horizontal margins.
   * For horizontal dividers, removes vertical margins.
   * @default true
   */
  insets?: boolean;
}

export default function Divider({ vertical = false, insets = true }: DividerProps) {
  return (
    <div
      css={[
        styles.divider,
        vertical ? styles.dividerVertical : styles.dividerHorizontal,
        !insets && (vertical ? styles.dividerNoHorizontalMargin : styles.dividerNoVerticalMargin),
      ]}
      role="separator"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
    />
  );
}
