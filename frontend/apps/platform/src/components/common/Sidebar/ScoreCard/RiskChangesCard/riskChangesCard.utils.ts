/**
 * Utilities for transforming API data to RiskChangesCard props
 */

import { NewsFeed } from '@/types/api/project';
import { RiskChangeItem } from './RiskChangesCard';

/**
 * Transforms NewsFeed API data to RiskChangesCard props
 */
export const transformToRiskChangesProps = (data: NewsFeed) => {
  return {
    topRisks: data.topRisks.map((risk): RiskChangeItem => ({
      date: new Date(risk.date),
      description: risk.content,
    })),
    recentChanges: data.recentChanges.map((change): RiskChangeItem => ({
      date: new Date(change.date),
      description: change.content,
    })),
  };
};
