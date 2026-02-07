/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './LabelBubble.styles';
import { colors } from '../../theme/styleSystem';

interface LabelBubbleProps {
  text: string;
  backgroundColor: string;
  textColor?: string;
}

export default function LabelBubble({
  text,
  backgroundColor,
  textColor = colors.text.primary,
}: LabelBubbleProps) {
  return (
    <div
      css={styles.bubble}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {text}
    </div>
  );
}
