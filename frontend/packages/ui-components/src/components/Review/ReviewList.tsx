/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { motion } from 'motion/react';
import { Divider } from '../Divider';
import Review, { ReviewProps } from './Review';
import * as styles from './ReviewList.styles';
import { Fragment } from 'react';

export interface ReviewListItemData extends ReviewProps {}

export interface ReviewListProps {
  /** Array of review items to display */
  items: ReviewListItemData[];
  /** Custom container styles */
  css?: Interpolation<Theme>;
  horizontal?: boolean;
  itemsPerRow?: number;
  /** Maximum number of lines for content before truncating (applies to all items) */
  maxLines?: number;
  /** Link text for "read more" action (applies to all items) */
  linkText?: string;
  /** Link text when content is expanded (applies to all items) */
  collapseLinkText?: string;
}

const MotionUl = motion.ul;
const MotionLi = motion.li;

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
 * ReviewList component - Container for displaying a list of reviews
 */
export default function ReviewList({
  items,
  css,
  horizontal = false,
  itemsPerRow = 3,
  maxLines,
  linkText,
  collapseLinkText,
}: ReviewListProps) {
  return (
    <MotionUl
      css={[styles.reviewList({ horizontal, itemsPerRow }), css]}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <Fragment key={`review-${index}`}>
          <MotionLi css={styles.reviewListItem} variants={itemVariants}>
            <Review
              maxLines={maxLines}
              linkText={linkText}
              collapseLinkText={collapseLinkText}
              {...item}
            />
          </MotionLi>
          {index < items.length - 1 && index % itemsPerRow !== itemsPerRow - 1 && (
            <MotionLi className="review-list-divider">
              <Divider vertical={horizontal} insets={false} />
            </MotionLi>
          )}
        </Fragment>
      ))}
    </MotionUl>
  );
}
