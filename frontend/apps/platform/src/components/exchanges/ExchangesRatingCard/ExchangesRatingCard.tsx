/** @jsxImportSource @emotion/react */
'use client';

import { Card, DataList, DataListItemData, IconName } from '@core3/ui-components';
import BadgeRankScore from '@/components/common/BadgeRankScore/BadgeRankScore';
import { ROUTES } from '@/constants/routes';

interface Exchange {
  id: string;
  name: string;
  logo: string | null;
}

interface RatingValue {
  /** Score value to display */
  score: number;
  /** Grade/level label (e.g. "A", "B+") - displays as secondary value */
  grade?: string;
  /** Severity level - used for color coding when grade is not provided */
  severity?: string;
}

interface ExchangesRatingCardData {
  exchange: Exchange;
  rating: RatingValue;
}

export interface ExchangesRatingCardProps {
  title: string;
  icon: IconName;
  data?: ExchangesRatingCardData[];
  /** If true, treats scores as Security Score (high = good, low = bad) */
  isSecurityScore?: boolean;
}

/**
 * ExchangesRatingCard component
 * Displays a card with a list of exchanges and their ratings
 * Used for Top Security Ratings and Top Solvency Ratings
 * Exchange items are clickable and navigate to their detail pages
 */
export default function ExchangesRatingCard({ title, icon, data, isSecurityScore = false }: ExchangesRatingCardProps) {
  const dataList: DataListItemData[] = data?.map((item) => ({
    label: item.exchange.name,
    value: (
      <BadgeRankScore
        score={item.rating.score}
        level={item.rating.grade}
        severity={item.rating.severity}
        isSecurityScore={isSecurityScore}
      />
    ),
    logoUrl: item.exchange.logo,
    href: ROUTES.EXCHANGES.DETAILS(item.exchange.id),
  })) ?? [];

  return (
    <Card title={title} icon={icon} titleType="secondary">
      <DataList items={dataList} contentAlign="right" />
    </Card>
  );
}

