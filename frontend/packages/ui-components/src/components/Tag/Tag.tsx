/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './Tag.styles';

interface TagProps {
  text: string;
  backgroundColor?: string;
}

export default function Tag({
  text,
  backgroundColor = 'transparent',
}: TagProps) {
  return (
    <div
      css={styles.tag}
      style={{
        backgroundColor,
      }}
    >
      {text}
    </div>
  );
}
