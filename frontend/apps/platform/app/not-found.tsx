/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Core3Button } from '@core3/ui-components';
import { ThemeRegistry } from '@core3/ui-components';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from 'react-i18next';
import * as styles from './not-found.styles';

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

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation(['common']);
  
  return (
    <ThemeRegistry>
      <div css={styles.container}>
        <div css={styles.gradientBackground} />
        <div css={styles.notFoundSection}>
          <div css={styles.notFoundContainer}>
            <MotionDiv
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              css={styles.notFoundContent}
            >
              <MotionDiv variants={itemVariants} css={styles.logoWrapper}>
                <Image
                  src="/images/core3-logo.svg"
                  alt="CORE3"
                  width={125}
                  height={15.15}
                  priority
                />
              </MotionDiv>

              <MotionDiv variants={itemVariants} css={styles.errorCodeWrapper}>
                <MotionTypography variant="h1" css={styles.errorCode}>
                  {t('notFound.errorCode', '404')}
                </MotionTypography>
                <MotionTypography variant="body2" css={styles.errorLabel}>
                  {t('notFound.errorLabel', 'ERROR')}
                </MotionTypography>
              </MotionDiv>

              <div>
                <MotionDiv variants={itemVariants}>
                  <MotionTypography variant="h2" css={styles.heading}>
                    {t('notFound.heading', 'Signal lost, trust intact.')}
                  </MotionTypography>
                </MotionDiv>

                <MotionDiv variants={itemVariants}>
                  <MotionTypography variant="body1" css={styles.description}>
                    {t('notFound.description', "We couldn't find that page. The link may have changed or expired.\nNavigate back and keep exploring with confidence.")
                      .split('\n')
                      .map((line, index, array) => (
                        <React.Fragment key={index}>
                          {line}
                          {index < array.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                  </MotionTypography>
                </MotionDiv>
              </div>

              <MotionDiv variants={itemVariants}>
                <Core3Button onClick={() => router.push(ROUTES.RATINGS.PROJECTS)} animated>
                  {t('notFound.button', 'GO TO PROJECT RATINGS')}
                </Core3Button>
              </MotionDiv>
            </MotionDiv>
          </div>
        </div>
      </div>
    </ThemeRegistry>
  );
}
