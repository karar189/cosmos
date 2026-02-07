/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { motion } from 'motion/react';
import * as styles from './DataList.styles';
import DataListItem, { DataListItemProps } from './DataListItem';

export interface DataListItemData extends DataListItemProps {}

export interface DataListProps {
  items: DataListItemData[];
  css?: Interpolation<Theme>;
  contentAlign?: 'left' | 'right';
  checkPosition?: 'left' | 'right';
  horizontal?: boolean;
  bulletPoint?: boolean;
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
 * DataList component - Container for displaying a list of data items
 * Supports both 'info' and 'check' item types
 */
export default function DataList({
  items,
  css,
  contentAlign = 'right',
  checkPosition = 'left',
  horizontal = false,
  bulletPoint = false,
  ...props
}: DataListProps) {
  return (
    <MotionUl
      css={[styles.dataList({ horizontal }), css]}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {items.map(({ ...item }, index) => (
        <DataListItem
          key={`data-item-${index}`}
          {...item}
          checkPosition={checkPosition}
          contentAlign={contentAlign}
          variants={itemVariants}
          bulletPoint={bulletPoint}
        />
      ))}
    </MotionUl>
  );
}
