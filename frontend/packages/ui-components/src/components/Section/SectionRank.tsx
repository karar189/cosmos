/** @jsxImportSource @emotion/react */
'use client';

import RankValue from '../RankValue';
import * as styles from './SectionRank.styles';

/**
 * SectionRank component - Displays a value out of a maximum with description
 */
export interface SectionRankProps {
  value: number | string;
  maxValue?: number | string;
  description?: string;
}

export default function SectionRank({ value, maxValue = 100, description }: SectionRankProps) {
  return (
    <div css={styles.sectionRank}>
      <RankValue value={value} maxValue={maxValue} />
      {description && <p css={styles.sectionRankDescription}>{description}</p>}
    </div>
  );
}
