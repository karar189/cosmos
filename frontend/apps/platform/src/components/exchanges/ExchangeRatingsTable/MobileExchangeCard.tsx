/** @jsxImportSource @emotion/react */
import Image from 'next/image';
import { Stars, Icon, Core3Button, Tooltip } from '@core3/ui-components';
import { ExchangeListItem } from '@/types/api/exchangesStatistic';
import { getExchangeCertificationLevel } from '@/utils/certification';
import { formatAmount } from '@/utils/format';
import { BadgeRankScore } from '@/components/common/BadgeRankScore';
import * as styles from './MobileExchangeCard.styles';

interface MobileExchangeCardProps {
  item: ExchangeListItem;
  index: number;
  showCTA: boolean;
  t: (key: string, defaultValue: string) => string;
  onCTAClick: () => void;
  onExchangeClick: (exchangeId: string) => void;
}

export function MobileExchangeCard({
  item,
  index,
  showCTA,
  t,
  onCTAClick,
  onExchangeClick,
}: MobileExchangeCardProps) {
  const tradingVolumeDisplay = item.tradeVolume?.trade_volume_24h
    ? formatAmount(item.tradeVolume.trade_volume_24h, { prefix: '$', compact: true })
    : t('common.notAvailable', '');

  return (
    <>
      <div 
        css={styles.mobileCard}
        onClick={() => onExchangeClick(item.exchange.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onExchangeClick(item.exchange.id);
          }
        }}
      >
        <div css={styles.mobileCardHeader}>
          <span css={styles.mobileCardNumber}>#{index + 1}</span>
          <div css={styles.mobileCardExchangeInfo}>
            <div css={styles.mobileCardLogo}>
              {item.exchange.logo && (
                <Image src={item.exchange.logo} alt={item.exchange.name} fill />
              )}
            </div>
            <div css={styles.mobileCardNames}>
              <span css={styles.mobileCardName}>{item.exchange.name}</span>
            </div>
          </div>
          <BadgeRankScore score={item.security.score} level={item.security.grade} isSecurityScore />
        </div>

        <div css={styles.mobileCardMetrics}>
          <div css={styles.mobileCardMetric}>
            <div css={styles.mobileCardMetricLabel}>
              <span>{t('exchanges.table.columns.certification', 'Certification')}</span>
              <div onClick={(e) => e.stopPropagation()}>
                <Tooltip title={t('exchanges.table.tooltips.certification', 'Exchange certification level')}>
                  <Icon name="info" />
                </Tooltip>
              </div>
            </div>
            <div css={styles.mobileCardStars}>
              <Stars value={getExchangeCertificationLevel(item.certification.level)} />
            </div>
          </div>

          <div css={styles.mobileCardMetric}>
            <span css={styles.mobileCardMetricLabel}>
              {t('exchanges.table.columns.tradingVolume', 'Trading Volume')}
            </span>
            <span css={styles.mobileCardMetricValue}>{tradingVolumeDisplay}</span>
          </div>

          <div css={styles.mobileCardMetric}>
            <span css={styles.mobileCardMetricLabel}>
              {t('exchanges.table.columns.securityScore', 'Security Score')}
            </span>
            <span css={styles.mobileCardMetricValue}>{item.security.score}</span>
          </div>
        </div>
      </div>

      {showCTA && (
        <div css={styles.mobileCTACard}>
          <div css={styles.mobileCTAContent}>
            <div css={styles.mobileCTATitle}>{t('exchanges.cta.title', 'List your exchange on CORE3')}</div>
            <Core3Button size="small" onClick={onCTAClick}>
              {t('exchanges.cta.button', 'APPLY FOR LISTING')}
            </Core3Button>
          </div>
        </div>
      )}
    </>
  );
}
