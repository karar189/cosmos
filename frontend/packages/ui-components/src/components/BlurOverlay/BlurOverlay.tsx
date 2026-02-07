/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import * as styles from './BlurOverlay.styles';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export type BlurOverlayProps = {
  /** Main text to display (default: "Coming soon") */
  text?: string;
  /** Title displayed above the text */
  title?: string;
  /** Whether to use absolute positioning */
  absolute?: boolean;
  /** Show loading spinner instead of text */
  loading?: boolean;
  /** Custom CSS styles */
  css?: Interpolation<Theme>;
};

const BlurOverlay: React.FC<BlurOverlayProps> = ({
  text = 'Coming soon',
  title,
  absolute = false,
  loading = false,
  ...props
}) => {
  return (
    <div css={styles.getBlurOverlayStyles({ absolute })} {...props}>
      <div css={styles.content}>
        {loading ? (
          <LoadingSpinner size={32} />
        ) : (
          <>
            {title && <div css={styles.title}>{title}</div>}
            <div css={styles.text}>{text}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlurOverlay;
