/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import * as styles from './SectionHeader.styles';
import { Icon, IconName } from '../Icon';
import { motion } from 'motion/react';

/**
 * SectionHeader component - Header for sections with icon, title, and content
 */
export interface SectionHeaderProps {
  /**
   * Custom icon element (overrides iconName if provided)
   */
  icon?: React.ReactNode;
  /**
   * Icon name from the icon registry (used if icon is not provided)
   */
  iconName?: IconName;
  title: string;
  content?: React.ReactNode;
  animated?: boolean;
}

export default function SectionHeader({
  icon,
  iconName,
  title,
  content,
  animated = true,
}: SectionHeaderProps) {
  const renderContent = () => {
    return (
      <>
        {icon && <div css={styles.sectionHeaderIcon}>{icon}</div>}
        {iconName && <Icon name={iconName} css={styles.sectionHeaderIcon} />}
        <h2 css={styles.sectionHeaderTitle}>{title}</h2>
        {content}
      </>
    );
  };
  if (animated) {
    return (
      <motion.div
        css={styles.sectionHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    );
  }
  return <div css={styles.sectionHeader}>{renderContent()}</div>;
}
