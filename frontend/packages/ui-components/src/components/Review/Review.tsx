/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import Link, { LinkProps } from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Badge, { BadgeColor } from '../Badge/Badge';
import * as styles from './Review.styles';

export interface ReviewProps {
  /** Author name or handle (e.g., "@analyst-1") */
  author: string;
  /** Review date (e.g., "Aug 14, 2025") */
  date: string;
  /** Review content/summary text */
  content: string;
  /** Link to full review */
  href?: LinkProps['href'];
  /** Link text (defaults to "READ FULL REVIEW") */
  linkText?: string;
  /** Link text when content is expanded (defaults to "SHOW LESS") */
  collapseLinkText?: string;
  /** Badge color for author */
  badgeColor?: BadgeColor;
  /** Maximum number of lines before truncating with ellipsis */
  maxLines?: number;
  /** Custom container styles */
  css?: Interpolation<Theme>;
}

/**
 * Review component - Displays a review card with author, date, content and link
 */
export default function Review({
  author,
  date,
  content,
  href,
  linkText = 'READ FULL REVIEW',
  collapseLinkText = 'SHOW LESS',
  maxLines,
  ...props
}: ReviewProps) {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isTruncatable, setIsTruncatable] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (contentRef.current && maxLines) {
        // Temporarily remove truncation to measure full height
        const element = contentRef.current;
        const originalStyle = element.style.cssText;
        element.style.display = 'block';
        element.style.webkitLineClamp = 'unset';
        element.style.overflow = 'visible';
        
        const fullHeight = element.scrollHeight;
        
        // Restore original styles
        element.style.cssText = originalStyle;
        
        // Check if content would be truncated
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 20;
        const maxHeight = lineHeight * maxLines;
        setIsTruncatable(fullHeight > maxHeight + 2); // +2 for rounding tolerance
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [content, maxLines]);

  const showExpandButton = !href && isTruncatable;
  const showLink = href && (isTruncatable || !maxLines);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <article css={styles.reviewContainer} {...props}>
      <header css={styles.reviewHeader}>
        <Badge color='white' size="small">
          {author}
        </Badge>
        <span css={styles.reviewDate}>{date}</span>
      </header>
      <p
        ref={contentRef}
        css={[
          styles.reviewContent,
          maxLines && !isExpanded && styles.reviewContentTruncated(maxLines),
        ]}
      >
        {content}
      </p>
      {showExpandButton && (
        <button type="button" onClick={handleToggleExpand} css={styles.reviewExpandButton}>
          {isExpanded ? collapseLinkText : linkText}
        </button>
      )}
      {showLink && (
        <Link href={href} css={styles.reviewLink}>
          {linkText}
        </Link>
      )}
    </article>
  );
}

