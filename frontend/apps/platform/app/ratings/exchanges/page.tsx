/** @jsxImportSource @emotion/react */
'use client';

import { ExchangeRatingsTable, ExchangesRatingCard, LostFundsDisplay, PercentageBar, PlatformLayout } from '@/components';
import { ROUTES } from '@/constants/routes';
import BadgeRankScore from '@/components/common/BadgeRankScore/BadgeRankScore';
import { Card, DataList, DataListItemData, ThemeRegistry } from '@core3/ui-components';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import * as styles from './page.styles';
import { useExchangesStatistic } from '@/hooks/useExchangesStatistic';
import { useMemo } from 'react';
import { useExchangesWithTradeVolume } from '@/hooks/useExchangesWithTradeVolume';

const MotionDiv = motion.div;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
};

export default function ExchangesRatingsPage() {
  const { t } = useTranslation(['ratings']);
  const { data: exchangesData, isLoading, error, refetch } = useExchangesStatistic();

  const topSecurityRatings = exchangesData?.topSecurityRations;
  const transparency = exchangesData?.transparency;
  const lostFunds = exchangesData?.lostFunds;
  const exchangesList = useMemo(
      () => exchangesData?.exchangesList?.list ?? [],
      [exchangesData?.exchangesList?.list]
    );
  
  // Use custom hook to merge exchanges with trade volume data
  const { mergedExchangeList } = useExchangesWithTradeVolume(exchangesList);

  // Mock data for Top Solvency Rating (for blurred display with coming soon overlay)
  const solvencyDataList: DataListItemData[] = [
    {
      label: 'Bybit',
      value: (
        <BadgeRankScore
          score={89}
          severity="high"
          isSecurityScore={false}
        />
      ),
      logoUrl: null,
    },
    {
      label: 'OKX',
      value: (
        <BadgeRankScore
          score={88}
          severity="high"
          isSecurityScore={false}
        />
      ),
      logoUrl: null,
    },
    {
      label: 'Coinbase',
      value: (
        <BadgeRankScore
          score={87}
          severity="high"
          isSecurityScore={false}
        />
      ),
      logoUrl: null,
    },
  ];

  return (
    <ThemeRegistry>
      <PlatformLayout
        variant="with-title"
        isLoading={isLoading}
        loadingText={t('exchanges.loading', 'Loading exchanges...')}
        headerProps={{
          // searchComponent is provided by PlatformLayout with proper onOpenSearch callback
        }}
        error={error}
        refetch={refetch}
        titleSectionContent={
          <>
            <h1 css={styles.pageTitle}>
              <strong>{t('exchanges.title.explore', 'explore')}</strong>{' '}
              {t('exchanges.title.rest', '1,000+ exchanges.')}
            </h1>
            <div css={styles.listWrapper}>
              <ExchangesRatingCard
                title={t('ratings.exchanges.topSecurityRatings', 'Top Security Ratings')}
                icon="arrow-up-right"
                data={topSecurityRatings?.map((item) => ({
                  exchange: item.exchange,
                  rating: {
                    score: item.security.score,
                    grade: item.security.grade,
                  },
                }))}
                isSecurityScore={true}
              />
              <Card
                icon="check-stamp"
                titleType="secondary"
                title={t('ratings.exchanges.topSolvencyRating', 'Top Solvency Rating')}
              >
                <div css={styles.comingSoonCardWrapper}>
                  <div css={styles.blurredContent}>
                    <DataList items={solvencyDataList} contentAlign="right" />
                  </div>
                  <motion.div
                    css={styles.comingSoonOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.p css={styles.comingSoonText}>
                      {t('common.comingSoonDataBlock', 'This Data is Coming Soon')}
                    </motion.p>
                    <motion.p css={styles.comingSoonSubtitle}>
                      {t('ratings.exchanges.solvencyComingSoonSubtitle', "Gathering solvency data")}
                    </motion.p>
                  </motion.div>
                </div>
              </Card>
              <Card
                icon="stat-down"
                titleType="secondary"
                title={t('ratings.exchanges.fundsLostByCEXsThisYear', 'Funds lost by CEXs this year')}
                tooltip={t(
                  'ratings.exchanges.fundsLostByCEXsThisYearTooltip',
                  'Total loss of Centralized Exchanges this year caused by an incident'
                )}
              >
                <LostFundsDisplay
                  totalUsd={lostFunds?.totalUsd1y ?? 0}
                  deltaUsd={lostFunds?.deltaUsd1y ?? 0}
                  deltaLabel={t('ratings.exchanges.moreThanLastYear', 'more than last year')}
                />
              </Card>
              <Card
                icon="search-success"
                titleType="secondary"
                title={t('ratings.exchanges.transparency', 'Transparency')}
                tooltip={t(
                  'ratings.exchanges.transparencyTooltip',
                  'Proportion of the exchanges compliant with transparency section'
                )}
              >
                <div css={styles.comingSoonCardWrapper}>
                  <div css={styles.blurredContent}>
                    <PercentageBar
                      firstValue={transparency?.transparent.percentage ?? 0}
                      firstLabel={t('ratings.exchanges.transparent', 'Transparent')}
                      secondValue={transparency?.notTransparent.percentage ?? 0}
                      secondLabel={t('ratings.exchanges.notTransparent', 'Not Transparent')}
                    />
                  </div>
                  <motion.div
                    css={styles.comingSoonOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.p css={styles.comingSoonText}>
                      {t('common.comingSoonDataBlock', 'This Data is Coming Soon')}
                    </motion.p>
                    <motion.p css={styles.comingSoonSubtitle}>
                      {t('ratings.exchanges.transparencyComingSoonSubtitle', 'Collecting transparency metrics')}
                    </motion.p>
                  </motion.div>
                </div>
              </Card>
            </div>
          </>
        }
        activeMenuItem={ROUTES.RATINGS.EXCHANGES}
      >
        <div css={styles.container}>
          <MotionDiv
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            css={styles.contentWrapper}
          >
            <ExchangeRatingsTable data={mergedExchangeList} />
          </MotionDiv>
        </div>
      </PlatformLayout>
    </ThemeRegistry>
  );
}
