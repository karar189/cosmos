/** @jsxImportSource @emotion/react */
import Image from 'next/image';
import { ProgressCell, Stars, Icon, Core3Button, Tooltip } from '@core3/ui-components';
import { ProjectListItem } from '@/types/api/projectsStatistic';
import { getProjectCertificationLevel } from '@/utils/certification';
import { formatAmount } from '@/utils/format';
import { BadgeRankScore } from '@/components/common/BadgeRankScore';
import * as styles from './MobileProjectCard.styles';

interface MobileProjectCardProps {
  item: ProjectListItem;
  index: number;
  showCTA: boolean;
  t: (key: string, defaultValue: string) => string;
  onCTAClick: () => void;
  onProjectClick: (projectId: string) => void;
}

export function MobileProjectCard({
  item,
  index,
  showCTA,
  t,
  onCTAClick,
  onProjectClick,
}: MobileProjectCardProps) {
  const marketCapDisplay = item.marketData?.market_cap
    ? formatAmount(item.marketData.market_cap, { prefix: '$' })
    : t('common.notAvailable', '');

  return (
    <>
      <div 
        css={styles.mobileCard}
        onClick={() => onProjectClick(item.project.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onProjectClick(item.project.id);
          }
        }}
      >
        <div css={styles.mobileCardHeader}>
          <span css={styles.mobileCardNumber}>#{index + 1}</span>
          <div css={styles.mobileCardProjectInfo}>
            <div css={styles.mobileCardLogo}>
              <Image src={item.project.logo} alt={item.project.name} fill />
            </div>
            <div css={styles.mobileCardNames}>
              <span css={styles.mobileCardName}>{item.project.name}</span>
              <span css={styles.mobileCardTicker}>{item.project.ticker}</span>
            </div>
          </div>
          <BadgeRankScore score={item.pol.score} level={item.pol.grade} isPol />
        </div>

        <div css={styles.mobileCardMetrics}>
          <div css={styles.mobileCardMetric}>
            <div css={styles.mobileCardMetricLabel}>
              <span>{t('projects.table.columns.certification', '')}</span>
              <div onClick={(e) => e.stopPropagation()}>
                <Tooltip title={t('projects.table.tooltips.certification', '')}>
                  <Icon name="info" />
                </Tooltip>
              </div>
            </div>
            <div css={styles.mobileCardStars}>
              <Stars value={getProjectCertificationLevel(item.certification.level)} />
            </div>
          </div>

          <div css={styles.mobileCardMetric}>
            <span css={styles.mobileCardMetricLabel}>
              {t('projects.table.columns.marketCap', '')}
            </span>
            <span css={styles.mobileCardMetricValue}>{marketCapDisplay}</span>
          </div>

          <div css={styles.mobileCardMetric}>
            <div css={styles.mobileCardMetricLabel}>
              <span>{t('projects.table.columns.dataCoverage', '')}</span>
              <div onClick={(e) => e.stopPropagation()}>
                <Tooltip title={t('projects.table.tooltips.dataCoverage', '')}>
                  <Icon name="info" />
                </Tooltip>
              </div>
            </div>
            <div css={styles.mobileCardProgress}>
              <ProgressCell value={item.dataCoverage.percentage} loading={false} />
            </div>
          </div>
        </div>
      </div>

      {/* CTA removed (Apply for listing) */}
    </>
  );
}

