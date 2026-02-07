/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './Step.styles';

interface StepProps {
  index: number;
  title: string;
  isLast?: boolean;
}

export default function Step({ index, title, isLast = false }: StepProps) {
  return (
    <>
      <div css={styles.stepItem}>
        <div css={styles.firstColumn}>
          <div css={styles.numberCircle}>{index + 1}</div>
        </div>
        <div css={styles.textContent}>
          <div css={styles.title}>{title}</div>
        </div>
      </div>
      {!isLast && (
        <div css={styles.connectorLine}>
          <div css={styles.connectorLineContent}></div>
        </div>
      )}
    </>
  );
}
