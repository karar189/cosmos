/** @jsxImportSource @emotion/react */
'use client';

import {
  Badge,
  Card,
  ReviewList,
  ReviewListItemData,
  ReviewNavigation,
} from '@core3/ui-components';
import { useState } from 'react';
import * as styles from './ExpertReviewsCard.styles';

export interface ExpertReviewsCardProps {
  /** Card title */
  title: string;
  /** Array of review items to display */
  items: ReviewListItemData[];
  /** Number of items to show per row */
  itemsPerRow?: number;
  /** Maximum number of items to display at once */
  maxItemsToSee?: number;
  /** Maximum number of lines for review content before truncating with ellipsis */
  maxContentLines?: number;
  /** Text for "read full review" link/button */
  readMoreText?: string;
  /** Text for "show less" button when expanded */
  showLessText?: string;
}

const ExpertReviewsCard: React.FC<ExpertReviewsCardProps> = ({
  title,
  items,
  itemsPerRow = 3,
  maxItemsToSee,
  maxContentLines,
  readMoreText,
  showLessText,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = maxItemsToSee ?? items.length;
  const totalPages = Math.ceil(items.length / pageSize);

  const visibleItems = (() => {
    if (maxItemsToSee === undefined || maxItemsToSee >= items.length) {
      return items;
    }
    const start = currentPage * pageSize;
    return items.slice(start, start + pageSize);
  })();

  const prevDisabled = currentPage === 0;
  const nextDisabled = currentPage >= totalPages - 1;

  const onPrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const onNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <Card
      title={title}
      rightContentProps={{
        style: {
          flex: 1,
        },
      }}
      rightContent={
        <div css={styles.headerContent}>
          <Badge color="gray" css={styles.headerBadge}>
            {items.length}
          </Badge>
          <ReviewNavigation
            onPrev={onPrev}
            onNext={onNext}
            prevDisabled={prevDisabled}
            nextDisabled={nextDisabled}
          />
        </div>
      }
    >
      <ReviewList
        horizontal
        items={visibleItems}
        itemsPerRow={itemsPerRow}
        maxLines={maxContentLines}
        linkText={readMoreText}
        collapseLinkText={showLessText}
      />
    </Card>
  );
};

export default ExpertReviewsCard;
