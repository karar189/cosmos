/** @jsxImportSource @emotion/react */
'use client';

import { Icon } from '@core3/ui-components';
import { formatCompactNumber } from '@/utils/format';
import * as styles from './LostFundsDisplay.styles';

export interface LostFundsDisplayProps {
  totalUsd: number;
  deltaUsd: number;
  deltaLabel: string;
}

export default function LostFundsDisplay({ totalUsd, deltaUsd, deltaLabel }: LostFundsDisplayProps) {
  return (
    <div css={styles.container}>
      <span css={styles.totalValue}>${formatCompactNumber(totalUsd).replace('.', ',')}</span>
      <div css={styles.deltaRow}>
        <Icon name="delta" css={styles.deltaIcon} />
        <span css={styles.deltaText}>
          {formatCompactNumber(deltaUsd)} {deltaLabel}
        </span>
      </div>
    </div>
  );
}
