/** @jsxImportSource @emotion/react */
'use client';
import { ReactNode, useState, useRef, useEffect } from 'react';
import { Badge, ExpandableBadgeList } from '@core3/ui-components/components';
import * as styles from './BadgesRowCard.styles';
import useTranslation from 'src/hooks/useTranslation';

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
  /** URL to navigate to when clicked */
  href?: string;
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
      href?: string;
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
}

const renderRowValue = (value: BadgesRowCardRowValue): ReactNode => {
  switch (value.type) {
    case 'text':
      return <p css={styles.infoValue}>{value.value}</p>;

    case 'badge': {
      const badgeStyle = value.badgeStyle ?? 'text-icon';
      const showText = badgeStyle === 'text' || badgeStyle === 'text-icon';
      const showIcon = badgeStyle === 'icon' || badgeStyle === 'text-icon';

      return (
        <Badge
          size="small"
          iconSrc={showIcon ? value.iconSrc : undefined}
          iconComponent={showIcon ? value.iconComponent : undefined}
          href={value.href}
        >
          {showText ? value.value : ''}
        </Badge>
      );
    }

    case 'badges': {
      const badgeStyle = value.badgeStyle ?? 'text-icon';
      const showText = badgeStyle === 'text' || badgeStyle === 'text-icon';
      const showIcon = badgeStyle === 'icon' || badgeStyle === 'text-icon';

      return (
        <div css={styles.infoBadges}>
          <ExpandableBadgeList
            items={value.badges.map((badge, idx) => (
              <Badge
                key={idx}
                size="small"
                iconSrc={showIcon ? badge.iconSrc : undefined}
                iconComponent={showIcon ? badge.iconComponent : undefined}
                href={badge.href}
              >
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

const MAX_VISIBLE_LINES = 4;

export default function BadgesRowCard({
  title,
  rows,
  description,
  onReadMoreClick,
  className,
  showDivider = true,
}: BadgesRowCardProps) {
  const { t } = useTranslation('sidebar');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!descriptionRef.current || !description) return;

    const element = descriptionRef.current;
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 20;
    const maxHeight = lineHeight * MAX_VISIBLE_LINES;
    
    setShowReadMoreButton(element.scrollHeight > maxHeight);
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
          {rows.map((row: BadgesRowCardRow, index: number) => (
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
                onKeyPress={() => {
                  return;
                }}
              >
                {isExpanded ? t('badges.showLess', 'Show Less') : t('badges.readMore', 'Read More')}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}
