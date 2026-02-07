/** @jsxImportSource @emotion/react */
'use client';

import Image from 'next/image';
import useTranslation from '@/hooks/useTranslation';
import * as styles from './MobileOverlay.styles';
import MobileToDesktopImage from './MobileToDesktopImage';

const MobileOverlay = () => {
  const { t } = useTranslation('common');

  return (
    <div css={styles.overlay}>
      <div css={styles.gradientOverlay} />
      <div css={styles.content}>
        <Image src="/images/core3-logo.svg" alt="CORE3" width={125} height={15.15} />
        
        <MobileToDesktopImage />

        <div>
          <h3 css={styles.title}>{t('mobileOverlay.title')}</h3>
          <p css={styles.description}>{t('mobileOverlay.description')}</p>
        </div>
      </div>
    </div>
  );
};

export default MobileOverlay;

