/** @jsxImportSource @emotion/react */
'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Typography } from '@mui/material';
import * as styles from './InfoListItem.styles';
const MotionDiv = motion.div;
const MotionTypography = motion(Typography);

export interface InfoListItemProps {
  title: string;
  description: string;
  count: string | number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.2, 1] as const,
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
};
const InfoListItem: React.FC<InfoListItemProps> = ({ title, description, count }) => {
  return (
    <MotionDiv variants={itemVariants} className="InfoListItem" css={styles.infoListItem}>
      <MotionTypography variants={childVariants} variant="body1" css={styles.number}>
        {count}
      </MotionTypography>
      <MotionTypography variants={childVariants} variant="h4" css={styles.title}>
        {title}
      </MotionTypography>
      <MotionTypography variants={childVariants} variant="body1" css={styles.description}>
        {description}
      </MotionTypography>
    </MotionDiv>
  );
};

export default InfoListItem;
