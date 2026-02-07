/** @jsxImportSource @emotion/react */
'use client';

import { Badge, GaugeChart as UIGaugeChart } from '@core3/ui-components';
import * as styles from './GaugeChart.styles';
import useTranslation from 'src/hooks/useTranslation';
import { useChartDimensions } from '@/components/charts/shared/useChartDimensions';
import { getBadgeColorByLevel } from '@/utils/badge';

export interface GaugeChartProps {
  /**
   * Score value (0-100)
   */
  score: number;
  /**
   * Rating badge text (e.g., "AAA", "BBB", "CCC")
   */
  rating: string;
  /**
   * Confidence level
   */
  confidence: string;
  /**
   * 24h change value (can be positive or negative)
   */
  change24h: number;
  /**
   * Rating badge variant
   * @default 'alert'
   */
  ratingVariant?: 'default' | 'yellow' | 'orange' | 'green' | 'red';
  /**
   * If true, flips the color scale (for Security Score where high = good, low = bad)
   * If false, uses PoL scale (high = bad, low = good)
   * @default false
   */
  isSecurityScore?: boolean;
  /**
   * Additional CSS class name
   */
  className?: string;
}

export default function GaugeChart({
  score,
  rating,
  confidence,
  change24h,
  isSecurityScore = false,
  className,
}: GaugeChartProps) {
  const { t } = useTranslation('sidebar');
  const { sidebarGaugeSize } = useChartDimensions();

  const badgeColor = getBadgeColorByLevel(rating);

  // Color stops based on score type:
  // - PoL (Probability of Loss): 0 = green (low risk), 100 = red (high risk)
  // - Security Score: 0 = red (low security), 100 = green (high security)
  const colorStops = isSecurityScore
    ? [
        // Security Score: 0 = red (bad), 100 = green (good)
        { offset: '0%', color: '#B51A18' }, // Red at 0
        { offset: '10%', color: '#EF753C' },
        { offset: '32%', color: '#FFB675' },
        { offset: '62%', color: '#FFD665' },
        { offset: '83%', color: '#63C700' },
        { offset: '100%', color: '#138B0D' }, // Green at 100
      ]
    : [
        // PoL: 0 = green (low risk), 100 = red (high risk)
        { offset: '0%', color: '#138B0D' }, // Green at 0
        { offset: '10%', color: '#63C700' },
        { offset: '32%', color: '#FFD665' },
        { offset: '62%', color: '#FFB675' },
        { offset: '83%', color: '#EF753C' },
        { offset: '100%', color: '#B51A18' }, // Red at 100
      ];

  // Calculate container height based on gauge size (half circle + some padding)
  const containerHeight = sidebarGaugeSize / 2 + 6;

  return (
    <div 
      css={styles.container} 
      className={className} 
      data-testid="gauge-chart"
      style={{ width: sidebarGaugeSize, height: containerHeight }}
    >
      {/* Gauge Chart from ui-components - hide label and status */}
      <UIGaugeChart
        value={score}
        label=""
        status=""
        size={sidebarGaugeSize}
        colorStops={colorStops}
      />
      
      {/* Content overlaid inside gauge arc */}
      <div css={styles.overlayContent}>
        <div css={styles.scoreSection}>
          <Badge size="small" color={badgeColor} css={styles.ratingBadge}>
            {rating}
          </Badge>
          <p css={styles.score}>{score}</p>
        </div>

        <div css={styles.metaInfo}>
          <p css={styles.metaText}>
            {t('gauge.confidence', 'Confidence:')} <span css={styles.metaValue}>{confidence}</span>
          </p>
          <p css={styles.metaText}>
            {t('gauge.change24h', '24h Change:')}{' '}
            <span css={styles.metaValue}>
              {change24h > 0 ? '+' : ''}
              {change24h}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
