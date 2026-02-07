/** @jsxImportSource @emotion/react */
'use client';

import { Core3Button } from '@core3/ui-components';
import * as styles from './ScoreCardCTA.styles';

export interface ScoreCardCTAProps {
  title: string;
  buttonLabel: string;
  onClick?: () => void;
}

export default function ScoreCardCTA({ title, buttonLabel, onClick }: ScoreCardCTAProps) {
  return (
    <div css={styles.container}>
      <span css={styles.title}>{title}</span>
      <Core3Button size="small" onClick={onClick}>
        {buttonLabel}
      </Core3Button>
    </div>
  );
}

