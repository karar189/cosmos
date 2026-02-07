/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { motion } from 'motion/react';
import * as styles from './DataProgressList.styles';
import DataProgressListItem from './DataProgressListItem';

export interface DataProgressListItemData {
  label: string;
  value: number;
  maxValue?: number;
  tooltip?: string;
  suffix?: string;
}

export interface DataProgressListProps {
  items: DataProgressListItemData[];
  css?: Interpolation<Theme>;
}

const MotionUl = motion.ul;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
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

/**
 * DataProgressList component - Container for displaying a list of data progress items
 */
export default function DataProgressList({ items, css }: DataProgressListProps) {
  return (
    <MotionUl
      css={[styles.dataProgressList, css]}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <DataProgressListItem
          key={`data-progress-item-${index}`}
          label={item.label}
          value={item.value}
          maxValue={item.maxValue}
          tooltip={item.tooltip}
          suffix={item.suffix}
          variants={itemVariants}
        />
      ))}
    </MotionUl>
  );
}

