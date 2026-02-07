/** @jsxImportSource @emotion/react */
'use client';

import { ProofOfOpinion } from '@/types/api/project';
import { formatDate } from '@/utils/format';
import {
  Card,
  CardHeader,
  DataList,
  DataListItemData,
  Divider,
  Icon,
  ReviewListItemData,
  Section,
  StackedBarChart,
  StackedBarChartDataPoint,
  Toggle,
  ToggleOption,
} from '@core3/ui-components';
import { colors } from '@core3/ui-components/styleSystem';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExpertReviewsCard from './ExpertReviewsCard';
import * as styles from './ProjectProofOfOpinionSection.styles';
import { ExampleLabel } from '@/components/common/ExampleLabel';

interface ProjectProofOfOpinionSectionProps {
  id: string;
  data?: ProofOfOpinion;
}

const COMMUNITY_SENTIMENT_CHART_HEIGHT = 220;

/** Time range values */
type TimeRangeValue = '1M' | '1Y' | 'All';

/** Days mapping for each time range */
const TIME_RANGE_DAYS: Record<TimeRangeValue, number | 'all'> = {
  '1M': 30,
  '1Y': 365,
  All: 'all',
};

/**
 * Filter sentiment data points by time range
 */
const filterByTimeRange = (
  points: NonNullable<ProofOfOpinion['communitySentiment']>['points'],
  range: TimeRangeValue
): typeof points => {
  const days = TIME_RANGE_DAYS[range];
  if (days === 'all') {
    return points;
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return points.filter((point) => new Date(point.date) >= cutoffDate);
};

const ProjectProofOfOpinionSection: React.FC<ProjectProofOfOpinionSectionProps> = ({
  id,
  data: proofOfOpinionData,
}) => {
  const { t } = useTranslation(['projects', 'common']);
  const timeRangeOptions: ToggleOption<TimeRangeValue>[] = [
    { label: t('common:timeRange.1M', '1M'), value: '1M' },
    { label: t('common:timeRange.1Y', '1Y'), value: '1Y' },
    { label: t('common:timeRange.all', 'All'), value: 'All' },
  ];
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('1Y');

  const prosList: DataListItemData[] =
    proofOfOpinionData?.prosAndCons?.pros?.map((pro) => ({
      value: pro,
      positive: true,
      valueWeight: 'normal',
    })) || [];
  const consList: DataListItemData[] =
    proofOfOpinionData?.prosAndCons?.cons?.map((cons) => ({
      value: cons,
      negative: true,
      valueWeight: 'normal',
    })) || [];

  const reviewList: ReviewListItemData[] =
    proofOfOpinionData?.expertReviews?.reviews?.map((review) => ({
      author: review.reviewer.tag,
      date: formatDate(review.date),
      content: review.text,
      href: review.url ?? undefined,
    })) || [];

  const filteredData: StackedBarChartDataPoint[] = useMemo(() => {
    if (!proofOfOpinionData?.communitySentiment?.points?.length) {
      return [];
    }

    const filtered = filterByTimeRange(proofOfOpinionData.communitySentiment.points, timeRange);

    return filtered.map((point) => ({
      name: point.date,
      positive: point.positive,
      negative: point.negative,
    }));
  }, [proofOfOpinionData?.communitySentiment?.points, timeRange]);

  return (
    <>
      {/* Desktop Layout */}
      <div css={styles.desktopLayout}>
        <Section id={id} iconName="chat" title={t('details.proofOfOpinion.title', 'Proof of Opinion')}>
          <Card css={styles.prosConsCard}>
        <div css={styles.prosConsCardItem}>
          <CardHeader
            title={t('details.proofOfOpinion.communitySentiment', 'Community Sentiment')}
            rightContentProps={{
              css: styles.exampleLabelContainer,
            }}
            rightContent={
              <>
                <ExampleLabel
                  label={t('common:exampleData.label', 'Example')}
                  tooltip={t('common:exampleData.tooltip', 'Example Tooltip')}
                  tooltipTitle={t('common:exampleData.tooltipTitle', 'Data Example')}
                />
                <Toggle
                  size="small"
                  value={timeRange}
                  onChange={setTimeRange}
                  options={timeRangeOptions}
                />
              </>
            }
          />
          <div>
            <StackedBarChart
              data={filteredData}
              height={COMMUNITY_SENTIMENT_CHART_HEIGHT}
              positiveColor={colors.semantic.success}
              negativeColor={colors.status.red}
              xAxisLabelFormatter={(label) => formatDate(label, { month: 'short' })}
            />
            <div css={styles.legendContainer}>
              <div css={styles.legendItem}>
                <Icon name="emoji-smile" css={styles.legendIcon({ positive: true })} />
                <p>{t('common:positive', 'Positive')}</p>
              </div>
              <div css={styles.legendItem}>
                <Icon name="emoji-sad" css={styles.legendIcon({ positive: false })} />
                <p>{t('common:negative', 'Negative')}</p>
              </div>
            </div>
          </div>
        </div>
        <Divider vertical insets={false} />
        <div css={[styles.prosConsListContainer, styles.prosConsCardItem]}>
          <div css={styles.prosConsList}>
            <p css={styles.prosConsListTitle}>{t('common:pros', 'Pros')}</p>
            <DataList contentAlign="left" items={prosList} />
          </div>
          <div css={styles.prosConsList}>
            <p css={styles.prosConsListTitle}>{t('common:cons', 'Cons')}</p>
            <DataList contentAlign="left" items={consList} />
          </div>
        </div>
      </Card>
          <ExpertReviewsCard
            title={t('details.proofOfOpinion.reviews', 'Expert Reviews')}
            items={reviewList}
            itemsPerRow={3}
            maxItemsToSee={3}
            maxContentLines={3}
            readMoreText={t('common:readFullReview', 'READ FULL REVIEW')}
            showLessText={t('common:showLess', 'SHOW LESS')}
          />
        </Section>
      </div>

      {/* Mobile Layout */}
      <div css={styles.mobileLayout}>
        {/* Section Header */}
        <div css={styles.mobileHeader}>
          <div css={styles.mobileHeaderLeft}>
            <Icon name="chat" css={styles.mobileHeaderIcon} />
            <h2 css={styles.mobileHeaderTitle}>{t('details.proofOfOpinion.title', 'Proof of Opinion')}</h2>
          </div>
        </div>

        {/* Community Sentiment Card */}
        <Card title={t('details.proofOfOpinion.communitySentiment', 'Community Sentiment')}>
          <div css={styles.mobileToggleWrapper}>
            <Toggle
              size="small"
              value={timeRange}
              onChange={setTimeRange}
              options={timeRangeOptions}
            />
          </div>
          <div css={styles.chartWrapper}>
            <StackedBarChart
              data={filteredData}
              height={COMMUNITY_SENTIMENT_CHART_HEIGHT}
              positiveColor={colors.semantic.success}
              negativeColor={colors.status.red}
              xAxisLabelFormatter={(label) => formatDate(label, { month: 'short' })}
            />
          </div>
          <div css={styles.legendContainer}>
            <div css={styles.legendItem}>
              <Icon name="emoji-smile" css={styles.legendIcon({ positive: true })} />
              <p>{t('common:positive', 'Positive')}</p>
            </div>
            <div css={styles.legendItem}>
              <Icon name="emoji-sad" css={styles.legendIcon({ positive: false })} />
              <p>{t('common:negative', 'Negative')}</p>
            </div>
          </div>
        </Card>

        {/* Pros Card */}
        <Card title={t('common:pros', 'Pros')}>
          <DataList contentAlign="left" items={prosList} />
        </Card>

        {/* Cons Card */}
        <Card title={t('common:cons', 'Cons')}>
          <DataList contentAlign="left" items={consList} />
        </Card>

        {/* Expert Reviews Card */}
        <ExpertReviewsCard
          title={t('details.proofOfOpinion.reviews', 'Expert Reviews')}
          items={reviewList}
          itemsPerRow={1}
          maxItemsToSee={1}
          maxContentLines={3}
          readMoreText={t('common:readFullReview', 'READ FULL REVIEW')}
          showLessText={t('common:showLess', 'SHOW LESS')}
        />
      </div>
    </>
  );
};

export default ProjectProofOfOpinionSection;
