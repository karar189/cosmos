/** @jsxImportSource @emotion/react */

import { motion } from "motion/react";
import Image from "next/image";
import * as styles from "./RecentSearches.styles";
import { useTranslation } from "@/hooks";

type RecentSearchItemType = {
  id: string; // Changed from number to string
  name: string;
  type: 'project' | 'exchange';
  chain?: string;
  logo?: string;
  pol: { score: number; grade: string };
  timestamp: number;
};

interface RecentSearchItemProps {
  item: RecentSearchItemType;
  onClick: () => void;
  isSelected?: boolean;
  index?: number;
}

const MotionDiv = motion.div;

export function RecentSearchItem({ item, onClick, isSelected = false, index = 0 }: RecentSearchItemProps) {
  const { t } = useTranslation('search');

  const renderIcon = (name: string, icon?: string | React.ReactNode) => {
    if (!icon) return <div css={styles.fallbackCircle} aria-hidden="true" />;
    if (typeof icon === 'string') {
      return (
        <Image 
          src={icon} 
          alt={name} 
          width={24} 
          height={24} 
          css={styles.iconImage}
          unoptimized // Use unoptimized for external URLs
        />
      );
    }
    return icon;
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        delay: index * 0.03,
        ease: [0.4, 0, 0.2, 1],
      }}
      layout="position" 
      css={[styles.selector, isSelected && styles.selectorSelected]} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      data-navigable="true"
      aria-label={`${t('aria.recentSearch', 'Recent search')}: ${item.name}, ${item.type}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div css={styles.iconContainer}>
        {renderIcon(item.name, item.logo)}
      </div>
      <span css={styles.selectorText}>{item.name}</span>
    </MotionDiv>
  );
}

