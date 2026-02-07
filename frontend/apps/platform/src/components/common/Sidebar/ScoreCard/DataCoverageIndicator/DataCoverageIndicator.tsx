/** @jsxImportSource @emotion/react */
'use client';

import { Tooltip } from '@core3/ui-components';
import { colors } from '@core3/ui-components/styleSystem';
import useTranslation from 'src/hooks/useTranslation';
import * as styles from './DataCoverageIndicator.styles';

export interface DataCoverageIndicatorProps {
  /**
   * Percentage value (0-100)
   */
  percentage: number;
  /**
   * Label text
   * @default 'Data Coverage'
   */
  label?: string;
  /**
   * Color variant for the progress ring
   * @default 'success'
   */
  color?: 'success' | 'warning' | 'error' | 'info' | 'black';
  /**
   * Additional CSS class name
   */
  className?: string;
}

export default function DataCoverageIndicator({
  percentage,
  className,
}: DataCoverageIndicatorProps) {
  const { t } = useTranslation('sidebar');

  // SVG circle calculations
  const size = 40;
  const center = size / 2;
  const radius = 18; // ~18px radius for 40x40 circle
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <div css={styles.container} className={className} data-testid="data-coverage-indicator">
      {/* SVG Donut Chart */}
      <div css={styles.donutWrapper}>
        <svg css={styles.donutSvg} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.neutral.gray200}
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.primary.contrast}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>
        {/* Percentage text in center */}
        <div css={styles.percentageText}>{percentage}%</div>
      </div>

      {/* Label */}
      <div css={styles.labelSection}>
        <p css={styles.label}>{t('dataCoverage', 'Data Coverage')}</p>
        <Tooltip title={t('dataCoverageTooltip', 'The percentage of metrics our team was able to cover through open-source research')} />
      </div>
    </div>
  );
}
