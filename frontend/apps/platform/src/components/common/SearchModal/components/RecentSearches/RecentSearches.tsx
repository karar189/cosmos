/** @jsxImportSource @emotion/react */

import { DeleteIcon } from "@core3/ui-components";
import { RecentSearchItem } from "./RecentSearchItem";
import * as styles from "./RecentSearches.styles";
import useTranslation from "@/hooks/useTranslation";

type RecentSearchItemType = {
  id: string; // Changed from number to string
  name: string;
  type: 'project' | 'exchange';
  chain?: string;
  logo?: string;
  pol: { score: number; grade: string };
  timestamp: number;
};

interface RecentSearchesProps {
  items: RecentSearchItemType[];
  onItemClick: (item: RecentSearchItemType) => void;
  onClear: () => void;
  selectedIndex?: number;
}

export function RecentSearches({ items, onItemClick, onClear, selectedIndex = -1 }: RecentSearchesProps) {
  const { t } = useTranslation('search');
  
  if (items.length === 0) return null;

  return (
    <>
      <div css={styles.recentSearchesHeader}>
        <div css={styles.categorySubtitle}>{t('sections.recentSearches', 'Recent searches')}</div>
        <button
          css={styles.clearButton}
          onClick={onClear}
          aria-label={t('aria.clearRecent', 'Clear recent searches')}
        >
          <DeleteIcon />
        </button>
      </div>
      <div css={styles.recentSearchesList}>
        {items.map((item, index) => (
          <RecentSearchItem 
            key={`${item.type}-${item.id}`}
            item={item}
            onClick={() => onItemClick(item)}
            isSelected={selectedIndex === index}
          />
        ))}
      </div>
    </>
  );
}

