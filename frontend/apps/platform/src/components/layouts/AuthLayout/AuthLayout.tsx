/** @jsxImportSource @emotion/react */
'use client';

import { Typography } from '@mui/material';
import { motion } from 'motion/react';
import Image from 'next/image';
import { ReactNode, useState, useEffect } from 'react';
import * as styles from './AuthLayout.styles';
import { Strings } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import { useAuthLayout } from './AuthLayoutContext';
import { Loading } from '@/components/forms/Loading';

const MotionDiv = motion.div;
const MotionTypography = motion(Typography);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
};

// Right side children animation - appears after left side content finishes animating
// Left side: logo (0.1s) -> heading (0.25s) -> description (0.4s)
// Right side appears at 0.5s to create smooth flow
const rightSideVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.5,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation(['auth']);
  const { isLoading } = useAuthLayout();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading text={t('auth:loading.settingUpWorkspace', 'Setting up your workspace...')} />
      ) : (
        <div css={styles.container}>
          <div css={styles.gradientBackground} />
          <div css={styles.contentContainer}>
            <div css={styles.contentSection}>
              <MotionDiv
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                css={styles.leftSide}
              >
                <MotionDiv variants={itemVariants} css={styles.logoWrapper}>
                  <Image
                    src="/images/core3-logo.svg"
                    alt="CORE3"
                    width={120}
                    height={13.15}
                    priority
                  />
                </MotionDiv>

                <div css={styles.mainContent}>
                  <MotionDiv variants={itemVariants}>
                    <MotionTypography css={styles.mainHeading}>
                      {t('auth.pageTitle', 'MEASURE RISK.')}
                      <br />
                    </MotionTypography>
                    <MotionTypography css={styles.subheading}>
                      {t('auth.pageSubtitle', 'BUILD TRUST.')}
                    </MotionTypography>
                  </MotionDiv>

                  <MotionDiv variants={itemVariants}>
                    <MotionTypography css={styles.description}>
                      {t(
                        'auth.description',
                        'Get Started and experience the full suite of CORE3 features.'
                      )}
                    </MotionTypography>
                  </MotionDiv>
                </div>
              </MotionDiv>
              {mounted && (
                <MotionDiv
                  variants={rightSideVariants}
                  initial="hidden"
                  animate="visible"
                  css={styles.rightSide}
                >
                  {children}
                </MotionDiv>
              )}
            </div>
          </div>
          <MotionDiv
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            css={styles.stringsContainer}
          >
            <Strings
              css={styles.strings}
              config={{
                dots: { enabled: false },
                distribution: {
                  ySpread: 3.5,
                  xSpreadPercent: 1.7,
                },
              }}
            />
          </MotionDiv>
        </div>
      )}
    </>
  );
}
