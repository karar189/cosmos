/** @jsxImportSource @emotion/react */
'use client';
import { ReactNode, useState, useRef, useEffect } from 'react';
import { Badge, ExpandableBadgeList } from '@core3/ui-components/components';
import * as styles from './BadgesRowCard.styles';

// Row value types
export type BadgeStyle = 'text' | 'icon' | 'text-icon';

export type BadgeInfo = {
  value: string;
  /** @deprecated Use iconSrc or iconComponent */
  icon?: string;
  /** Image URL from server */
  iconSrc?: string;
  /** React icon component */
  iconComponent?: React.ReactNode;
};

export type BadgesRowCardRowValue =
  | { type: 'text'; value: string }
  | {
      type: 'badge';
      value: string;
      icon?: string;
      iconSrc?: string;
      iconComponent?: React.ReactNode;
      badgeStyle?: BadgeStyle;
    }
  | {
      type: 'badges';
      badges: Array<BadgeInfo>;
      badgeStyle?: BadgeStyle;
    };

export interface BadgesRowCardRow {
  label: string;
  value: BadgesRowCardRowValue;
}

export interface BadgesRowCardProps {
  /**
   * Title of the about section (e.g., "About Binance")
   */
  title: string;
  /**
   * Array of rows to display with label and configurable values
   */
  rows: BadgesRowCardRow[];
  /**
   * Description text to show at the bottom
   */
  description?: string;
  /**
   * Callback when Read More is clicked
   */
  onReadMoreClick?: () => void;
  /**
   * Optional className for custom styling
   */
  className?: string;
  /**
   * Show divider at the top
   * @default true
   */
  showDivider?: boolean;
  /**
   * Text for "Read More" button
   * @default 'Read More'
   */
  readMoreText?: string;
  /**
   * Text for "Show Less" button
   * @default 'Show Less'
   */
  showLessText?: string;
}

const renderRowValue = (value: BadgesRowCardRowValue): ReactNode => {
  switch (value.type) {
    case 'text':
      return <p css={styles.infoValue}>{value.value}</p>;

    case 'badge': {
      const badgeStyle = value.badgeStyle ?? 'text-icon';
      const showText = badgeStyle === 'text' || badgeStyle === 'text-icon';

      return (
        <Badge size="small">
          {showText ? value.value : ''}
        </Badge>
      );
    }

    case 'badges': {
      const badgeStyle = value.badgeStyle ?? 'text-icon';
      const showText = badgeStyle === 'text' || badgeStyle === 'text-icon';

      return (
        <div css={styles.infoBadges}>
          <ExpandableBadgeList
            items={value.badges.map((badge, idx) => (
              <Badge key={idx} size="small">
                {showText ? badge.value : ''}
              </Badge>
            ))}
          />
        </div>
      );
    }

    default:
      return null;
  }
};

export default function BadgesRowCard({
  title,
  rows,
  description,
  onReadMoreClick,
  className,
  showDivider = true,
  readMoreText = 'Read More',
  showLessText = 'Show Less',
}: BadgesRowCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (descriptionRef.current && description) {
      const element = descriptionRef.current;
      // Check if content exceeds 48px height
      const isOverflowing = element.scrollHeight > 48;
      setShowReadMoreButton(isOverflowing);
    }
  }, [description]);

  const handleReadMoreClick = () => {
    setIsExpanded(!isExpanded);
    onReadMoreClick?.();
  };

  return (
    <>
      {showDivider && <div css={styles.divider} />}
      <div css={styles.section} className={className}>
        <p css={styles.sectionTitle}>{title}</p>
        <div css={styles.infoGrid}>
          {rows.map((row, index) => (
            <div key={index} css={styles.infoRow}>
              <p css={styles.infoLabel}>{row.label}</p>
              {renderRowValue(row.value)}
            </div>
          ))}
        </div>
        {description && (
          <div>
            <p
              ref={descriptionRef}
              css={[styles.projectDescription, !isExpanded && styles.projectDescriptionCollapsed]}
            >
              {description}
            </p>
            {showReadMoreButton && (
              <span 
                css={styles.readMore}
                onClick={handleReadMoreClick}
                role="button"
                tabIndex={0}
              >
                {isExpanded ? showLessText : readMoreText}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}
