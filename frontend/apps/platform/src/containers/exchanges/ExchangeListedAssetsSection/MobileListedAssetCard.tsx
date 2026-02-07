/** @jsxImportSource @emotion/react */
import Image from 'next/image';
import { BadgeRankScore } from '@/components/common/BadgeRankScore';
import { formatAmount } from '@/utils/format';
import { ListedAssetsSection } from '@/types/api/exchange';
import * as styles from './MobileListedAssetCard.styles';

interface MobileListedAssetCardProps {
  item: ListedAssetsSection['list'][0];
  t: (key: string, defaultValue: string) => string;
}

export function MobileListedAssetCard({
  item,
  t,
}: MobileListedAssetCardProps) {
  const marketCapDisplay = item.marketCap
    ? formatAmount(item.marketCap, { prefix: '$', compact: true, decimalPlaces: 2 })
    : t('common.notAvailable', 'N/A');

  const categoryDisplay = item.category || t('common.notAvailable', 'N/A');

  return (
    <div css={styles.mobileCard}>
      <div css={styles.mobileCardHeader}>
        <div css={styles.mobileCardAssetInfo}>
          {item.logo && (
            <div css={styles.mobileCardLogo}>
              <Image src={item.logo} alt={item.ticker} fill />
            </div>
          )}
          <div css={styles.mobileCardNames}>
            <span css={styles.mobileCardTicker}>{item.ticker}</span>
          </div>
        </div>
      </div>

      <div css={styles.mobileCardMetrics}>
        <div css={styles.mobileCardMetric}>
          <span css={styles.mobileCardMetricLabel}>
            {t('exchanges.listedAssets.table.columns.marketCap', 'Market Cap')}
          </span>
          <span css={styles.mobileCardMetricValue}>{marketCapDisplay}</span>
        </div>

        <div css={styles.mobileCardMetric}>
          <span css={styles.mobileCardMetricLabel}>
            {t('exchanges.listedAssets.table.columns.tokenAudits', 'Token Audits')}
          </span>
          <span css={styles.mobileCardMetricValue}>{item.tokenAudits}</span>
        </div>

        <div css={styles.mobileCardMetric}>
          <span css={styles.mobileCardMetricLabel}>
            {t('exchanges.listedAssets.table.columns.pol', 'PoL')}
          </span>
          {item.pol ? (
            <BadgeRankScore score={item.pol.score} level={item.pol.grade} isPol />
          ) : (
            <span css={styles.mobileCardMetricValue}>{t('common.notAvailable', 'N/A')}</span>
          )}
        </div>

        <div css={styles.mobileCardMetric}>
          <span css={styles.mobileCardMetricLabel}>
            {t('exchanges.listedAssets.table.columns.category', 'Category')}
          </span>
          <span css={styles.mobileCardMetricValue}>{categoryDisplay}</span>
        </div>
      </div>
    </div>
  );
}
