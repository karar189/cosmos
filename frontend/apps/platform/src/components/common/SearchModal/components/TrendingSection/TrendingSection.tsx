/** @jsxImportSource @emotion/react */

import { ResultsTable } from "../ResultsTable";
import * as styles from "./TrendingSection.styles";
import useTranslation from "@/hooks/useTranslation";
import type { ProjectData, ExchangeData } from "../../types";

interface TrendingSectionProps {
  projects: ProjectData[];
  exchanges: ExchangeData[];
  onItemClick: (item: ProjectData | ExchangeData, type: 'project' | 'exchange') => void;
  selectedIndex?: number;
}

export function TrendingSection({ projects, exchanges, onItemClick, selectedIndex = -1 }: TrendingSectionProps) {
  const { t } = useTranslation('search');

  return (
    <>
      <div css={styles.categorySubtitle}>{t('sections.trendingProjects')}</div>
      <ResultsTable 
        items={projects} 
        type="project" 
        limit={3} 
        onItemClick={onItemClick}
        selectedIndex={selectedIndex}
        startIndex={0}
      />

      <div css={styles.categorySubtitle}>{t('sections.trendingExchanges')}</div>
      <ResultsTable 
        items={exchanges} 
        type="exchange" 
        limit={3} 
        onItemClick={onItemClick}
        selectedIndex={selectedIndex}
        startIndex={3}
      />
    </>
  );
}

