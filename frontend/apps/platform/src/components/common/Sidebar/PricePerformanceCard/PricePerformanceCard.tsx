/** @jsxImportSource @emotion/react */
'use client';
import { BadgeSelect } from '@core3/ui-components';
import { StatDownIcon, StatUpIcon } from '@core3/ui-components';
import * as styles from './PricePerformanceCard.styles';
import useTranslation from 'src/hooks/useTranslation';
import { daysDifference, formatDate } from '@/utils/formatters/date-format';
import { TokenPriceData } from '@/data/api/types/coin_gecko/coin_details';
import { formatAmount, formatPercentage } from '@/utils/format';
export interface PricePerformanceCardProps {
  priceData: TokenPriceData;
  highLowData: {
    low: number;
    high: number;
  };
  period: {label: string; value: string};
  setPeriod: (period: {label: string; value: string}) => void;
  /**
   * Function to format dates
   */
  formatDate?: (date: Date) => string;
}



export default function PricePerformanceCard({ 
  priceData,
  highLowData,
  period,
  setPeriod,
  formatDate: customFormatDate,
}: PricePerformanceCardProps) {
  
  const {t} = useTranslation('sidebar');
  const periods = [{label: '24h', value: '1'}, {label: '7d', value: '7'}, {label: '30d', value: '30'}, {label: '90d', value: '90'}, {label: '1y', value: '365'}, {label: t('common.all', 'All'), value: 'max'}];

  
  // Use custom format function or default
  // This function use formatters and date  diff functions from utils but is not directly there because it need i18n
  const defaultFormatDate = (date: Date): string => {
    const formattedDate = formatDate(date);
    const daysDiff = daysDifference(date);
    let normalizedDifference = '';
    // If the days difference is 0, 1, more than 30 days or more than 365 days, show relative time
    // Today when daysDifference is 0
    if (daysDiff === 0) {
      normalizedDifference = t('date.today', 'Today');
    // Yesterday when daysDifference is 1
    } else if (daysDiff === 1) {
      normalizedDifference = t('date.yesterday', 'Yesterday');
    // If more than 30 days and less than or equal to 365 days, show in months
    } else if (daysDiff > 30 && daysDiff <= 365) {
      const months = Math.floor(daysDiff / 30);
      normalizedDifference = t('date.monthsAgo', '{{count}} months ago', { count: months });
    // If more than 365 days, show in years
    } else if (daysDiff > 365) {
      const years = Math.floor(daysDiff / 365);
      normalizedDifference = t('date.yearsAgo', '{{count}} years ago', { count: years });
    } else {
      normalizedDifference = formattedDate;
    }
    return `${formattedDate} (${normalizedDifference})`;
  };
  const barValue = ((priceData.current_price - priceData.low) / (priceData.high - priceData.low)) * 100;

  const dateFormatter = customFormatDate || defaultFormatDate;

  return (
    <>
      <div css={styles.divider} />
      <div css={styles.section} data-testid="price-performance-card">
        <div css={styles.priceHeader}>
          <p css={styles.sectionTitle}>{t('price.title', 'Price Performance')}</p>
          <BadgeSelect
            color="default"
            size='small'
            value={period.label}
            onChange={(value) => {setPeriod(periods.find((p) => p.value === value)!);}}
            options={periods.map((period) => ({
              label: period.label,
              value: period.value,
            }))}
          />
        </div>
        
        <div css={styles.priceRange}>
          <div css={styles.priceRangeItem}>
            <p css={styles.priceRangeLabel}>{t('price.low', 'Low')}</p>
            <p css={styles.priceRangeValue}>{formatAmount(highLowData.low, {prefix: '$'})}</p>
          </div>
          <div css={{...styles.priceRangeItem, ...styles.priceRangeItemEnd}} >
            <p css={styles.priceRangeLabel}>{t('price.high', 'High')}</p>
            <p css={styles.priceRangeValue}>{formatAmount(highLowData.high, {prefix: '$'})}</p>
          </div>
        </div>

        <div css={styles.priceBarWrapper}>
          <div css={styles.priceBar} />
          <div css={styles.priceBarIndicator} style={{ left: `${barValue}%` }} />
        </div>

        <div css={styles.priceStatsContainer}>
          <div css={styles.priceStat}>
            <div css={styles.priceStatLeft}>
              <div css={styles.priceStatHeader}>
                <StatUpIcon />
                <p css={styles.priceStatTitle}>{t('price.allTimeHigh', 'All-time High')}</p>
              </div>
              <p css={styles.priceStatDate}>{dateFormatter(priceData.allTimeHigh.date)}</p>
            </div>
            <div css={styles.priceStatRight}>
              <p css={styles.priceStatPrice}>{priceData.allTimeHigh.price}</p>
              <p css={styles.priceStatChangeNegative}>{formatPercentage(priceData.allTimeHigh.changePercent)}</p>
            </div>
          </div>

          <div css={styles.priceStat}>
            <div css={styles.priceStatLeft}>
              <div css={styles.priceStatHeader}>
                <StatDownIcon />
                <p css={styles.priceStatTitle}>{t('price.allTimeLow', 'All-time Low')}</p>
              </div>
              <p css={styles.priceStatDate}>{dateFormatter(priceData.allTimeLow.date)}</p>
            </div>
            <div css={styles.priceStatRight}>
              <p css={styles.priceStatPrice}>{priceData.allTimeLow.price}</p>
              <p css={styles.priceStatChangePositive}>{formatPercentage(priceData.allTimeLow.changePercent)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
