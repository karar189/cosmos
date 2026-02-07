/** @jsxImportSource @emotion/react */
'use client';

import Image from 'next/image';
import { LoadingSpinner } from '@core3/ui-components';
import * as styles from './Loading.styles';

export interface LoadingScreenProps {
  text?: string;
  spinnerSize?: number;
  logoSrc?: string;
}

export default function Loading({
  text = 'Setting up your workspace...',
  spinnerSize = 48,
  logoSrc = '/images/core3-logo.svg',
}: LoadingScreenProps) {
  return (
    <div css={styles.container}>
      <Image
        src={logoSrc}
        alt="Core3 Logo"
        width={120}
        height={40}
        css={styles.logo}
        priority
      />
      <div css={styles.loadingWrapper}>
        <LoadingSpinner size={spinnerSize} />
      </div>
      {text && <p css={styles.text}>{text}</p>}
    </div>
  );
}

