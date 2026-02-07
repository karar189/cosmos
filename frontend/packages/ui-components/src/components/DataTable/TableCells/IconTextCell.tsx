/** @jsxImportSource @emotion/react */
'use client';

import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';
import * as styles from './IconTextCell.styles';

export interface IconTextCellProps {
  /** Primary text (main label) */
  primary: string;
  
  /** Optional: Secondary text (subtitle/description) */
  secondary?: string;
  
  /** Optional: Icon URL or React element */
  icon?: string | React.ReactNode;
  
  /** Optional: Alt text for icon images */
  iconAlt?: string;
  
  /** Optional: Size of the icon/circle */
  iconSize?: 'sm' | 'md' | 'lg';
  
  /** Optional: Show skeleton loading state */
  loading?: boolean;
}

/**
 * IconTextCell - Cell component for displaying an icon with text labels
 * 
 * Shows an optional icon (or fallback circle) with primary and secondary text.
 * 
 * @example
 * ```tsx
 * // With icon URL
 * <IconTextCell 
 *   primary="Bitcoin" 
 *   secondary="BTC"
 *   icon="/images/btc.png"
 * />
 * 
 * // Without icon (shows circle)
 * <IconTextCell 
 *   primary="Ethereum" 
 *   secondary="Polygon"
 * />
 * 
 * // With React element icon
 * <IconTextCell 
 *   primary="Project" 
 *   secondary="Chain"
 *   icon={<Icon name="star" />}
 * />
 * ```
 */
export function IconTextCell({
  primary,
  secondary,
  icon,
  iconAlt,
  iconSize = 'md',
  loading = false,
}: IconTextCellProps) {
  // Show skeleton when loading
  if (loading) {
    return (
      <div css={styles.container}>
        <Skeleton variant="circular" width={32} height={32} />
        <div css={styles.textContainer}>
          <Skeleton width={100} />
          {secondary !== undefined && <Skeleton width={60} />}
        </div>
      </div>
    );
  }
  
  const renderIcon = () => {
    if (!icon) {
      return <div css={styles.fallbackCircle} />;
    }
    
    if (typeof icon === 'string') {
      // Map iconSize to pixel dimensions
      const sizeMap = { sm: 24, md: 32, lg: 40 };
      const size = sizeMap[iconSize];
      
      return (
        <Image 
          src={icon} 
          alt={iconAlt || primary}
          width={size}
          height={size}
          css={styles.iconImage}
          unoptimized // Use unoptimized for external URLs
        />
      );
    }
    
    return icon;
  };
  
  return (
    <div css={styles.container}>
      {/* Icon or fallback circle */}
      <div css={styles.iconContainer(iconSize)}>
        {renderIcon()}
      </div>
      
      {/* Text content */}
      <div css={styles.textContainer}>
        <div css={styles.primaryText}>{primary}</div>
        {secondary && (
          <div css={styles.secondaryText}>{secondary}</div>
        )}
      </div>
    </div>
  );
}

