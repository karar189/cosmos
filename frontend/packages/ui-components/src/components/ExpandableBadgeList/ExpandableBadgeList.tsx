/** @jsxImportSource @emotion/react */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Badge } from '../Badge';
import { container, dropdownButton, measureContainer } from './ExpandableBadgeList.styles';
import { spacingValues } from '@core3/ui-components/styleSystem';
import { BadgeSize } from '../Badge/Badge';
import { Icon } from '../Icon';

export interface ExpandableBadgeListProps {
  items: React.ReactNode[];
  variant?: 'default' | 'yellow' | 'orange' | 'green' | 'red';
  size?: BadgeSize;
  maxVisible?: number;
}

export default function ExpandableBadgeList({
  items,
  size = 'small',
  maxVisible,
}: ExpandableBadgeListProps) {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(maxVisible ?? items.length);
  const [measuring, setMeasuring] = useState(!maxVisible);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (maxVisible !== undefined) {
      setVisibleCount(maxVisible);
      setMeasuring(false);
      return;
    }

    const calculateVisibleItems = () => {
      if (!containerRef.current || !measureRef.current) return;

      const expandButtonWidth = 70; // Width for +N button
      const containerWidth = containerRef.current.offsetWidth - expandButtonWidth;
      const measureItems = measureRef.current.children;
      const gap = parseInt(spacingValues.xxs.replace('px', '')); // Gap between items
      let totalWidth = 0;
      let count = 0;

      for (let i = 0; i < measureItems.length; i++) {
        const item = measureItems[i] as HTMLElement;
        const itemWidth = item.offsetWidth + gap;

        // If this is not the last item, check if we need space for expand button
        const requiredWidth = totalWidth + itemWidth;

        if (requiredWidth > containerWidth) {
          break;
        }

        totalWidth += itemWidth;
        count++;
      }

      // If all items fit, show all
      if (count === items.length) {
        setVisibleCount(items.length);
      } else {
        // Otherwise show as many as fit with the expand button
        setVisibleCount(Math.max(1, count));
      }

      setMeasuring(false);
    };

    // Wait for render then measure
    const timer = setTimeout(calculateVisibleItems, 0);

    const resizeObserver = new ResizeObserver(() => {
      setMeasuring(true);
      setTimeout(calculateVisibleItems, 0);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [items.length, maxVisible, items]);

  const shouldShowExpandButton = items.length > visibleCount;
  const displayItems = expanded ? items : items.slice(0, visibleCount);
  const remainingCount = items.length - visibleCount;

  return (
    <>
      {/* Hidden measuring container */}
      {measuring && (
        <div ref={measureRef} css={measureContainer}>
          {items.map((item, index) => (
            <span key={`measure-${index}`}>{item}</span>
          ))}
        </div>
      )}

      {/* Actual container */}
      <div ref={containerRef} css={container}>
        {displayItems.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
        {shouldShowExpandButton && !expanded && (
          <div css={dropdownButton} onClick={() => setExpanded(true)}>
            <Badge
              size={size}
              iconComponent={<Icon name="chevron-down" />}
              iconPosition="right"
            >{`+${remainingCount}`}</Badge>
          </div>
        )}
        {expanded && (
          <div css={dropdownButton} onClick={() => setExpanded(false)}>
            <Badge size={size} iconComponent={<Icon name="chevron-up" />} iconPosition="right" />
          </div>
        )}
      </div>
    </>
  );
}
