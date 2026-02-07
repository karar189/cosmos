/** @jsxImportSource @emotion/react */

import { AnimatePresence } from "motion/react";
import { SearchResultRow } from "./SearchResultRow";
import * as styles from "./ResultsTable.styles";
import useTranslation from "@/hooks/useTranslation";
import type { ProjectData, ExchangeData } from "../../types";

interface ResultsTableProps {
  items: ProjectData[] | ExchangeData[];
  type: 'project' | 'exchange';
  limit?: number;
  onItemClick: (item: ProjectData | ExchangeData, type: 'project' | 'exchange') => void;
  selectedIndex?: number;
  startIndex?: number;
}

export function ResultsTable({ items, type, limit, onItemClick, selectedIndex = -1, startIndex = 0 }: ResultsTableProps) {
  const { t } = useTranslation('search');
  const displayItems = limit ? items.slice(0, limit) : items;
  
  if (displayItems.length === 0) {
    return (
      <div css={styles.noResults} role="status" aria-live="polite">
        {t('noResults.found', 'No results found')}
      </div>
    );
  }
  
  const tableLabel = type === 'project' ? t('tabs.projects') : t('tabs.exchanges');
  
  return (
    <table css={styles.resultsTable} role="grid" aria-label={`${tableLabel} search results`}>
      <tbody>
        <AnimatePresence mode="sync" initial={false}>
          {displayItems.map((item, index) => (
            <SearchResultRow 
              key={`${type}-${item.id}`}
              item={item}
              type={type}
              onClick={() => onItemClick(item, type)}
              isSelected={selectedIndex === startIndex + index}
              index={index}
            />
          ))}
        </AnimatePresence>
      </tbody>
    </table>
  );
}

