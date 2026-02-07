/** @jsxImportSource @emotion/react */
'use client';
import { useState } from 'react';
import { SegmentedControl } from '@core3/ui-components';
import * as styles from './RiskChangesCard.styles';
import useTranslation from 'src/hooks/useTranslation';
import { formatDate } from 'src/utils/formatters/date-format';
import { NewsFeed } from '@/types/api/project';
import { transformToRiskChangesProps } from './riskChangesCard.utils';

export interface RiskChangeItem {
  date: Date;
  description: string;
}

export type TabValue = 'topRisks' | 'recentChanges';

export interface RiskChangesCardProps {
  /**
   * API data for news feed
   */
  data: NewsFeed;
  /**
   * Initially selected tab
   * @default 'topRisks'
   */
  initialTab?: TabValue;
  /**
   * Callback fired when tab changes
   */
  onTabChange?: (tab: TabValue) => void;
  /**
   * Maximum number of items to display
   * @default 3
   */
  maxItems?: number;
  /**
   * Optional className for custom styling
   */
  className?: string;
  /**
   * Function to format dates
   */
  formatDate?: (date: Date) => string;
}

export default function RiskChangesCard({
  data,
  initialTab = 'topRisks',
  onTabChange,
  maxItems = 3,
  className,
  formatDate: customFormatDate = formatDate,
}: RiskChangesCardProps) {
  const {t} = useTranslation('sidebar');
  const [selectedTab, setSelectedTab] = useState<TabValue>(initialTab);

  // Transform API data
  const { topRisks, recentChanges } = transformToRiskChangesProps(data);

  const handleTabChange = (value: string) => {
    const tabValue = value as TabValue;
    setSelectedTab(tabValue);
    onTabChange?.(tabValue);
  };

  const currentData = selectedTab === 'topRisks' ? topRisks : recentChanges;
  const displayData = currentData.slice(0, maxItems);

  if (displayData.length === 0) return null;

  return (
    <div css={styles.container} className={className}>
      <SegmentedControl
        options={[
          { label: t('risks.topRisks', 'Top Risks')!, value: 'topRisks' },
          { label: t('risks.recentChanges', 'Recent Changes')!, value: 'recentChanges' },
        ]}
        value={selectedTab}
        onChange={handleTabChange}
      />
      <div css={styles.itemsList}>
        {displayData.map((item: RiskChangeItem, index: number) => (
          <div key={index}>
            <div css={styles.item}>
              <p css={styles.itemDate}>{customFormatDate(item.date)}</p>
              <p css={styles.itemDescription}>{item.description}</p>
            </div>
            {index < displayData.length - 1 && <div css={styles.separator} />}
          </div>
        ))}
      </div>
    </div>
  );
}
