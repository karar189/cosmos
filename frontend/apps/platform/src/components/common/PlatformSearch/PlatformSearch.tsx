/** @jsxImportSource @emotion/react */
'use client';

import { SearchIcon } from '@core3/ui-components';
import * as styles from './PlatformSearch.styles';
import useTranslation from '@/hooks/useTranslation';

interface PlatformSearchProps {
  /**
   * Callback to open the search modal.
   * When provided, the component renders only the button (no modal, no keyboard listener).
   * The parent is responsible for managing the SearchModal.
   */
  onOpenSearch: () => void;
}

/**
 * PlatformSearch Component
 * Renders the search button for the platform.
 * The SearchModal is managed by the parent component (PlatformLayout).
 */
export default function PlatformSearch({ onOpenSearch }: PlatformSearchProps) {
  const { t } = useTranslation('search');

  const handleClick = () => {
    onOpenSearch();
  };

  return (
    <button
      type="button"
      css={styles.searchButton}
      onClick={handleClick}
      aria-label={t('aria.search')}
      title={t('button.pressToSearch')}
    >
      <SearchIcon css={styles.searchIconLeft} />
      <span css={styles.searchText}>{t('placeholder')}</span>
      <kbd css={styles.slashKey}>/</kbd>
    </button>
  );
}

