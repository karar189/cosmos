/** @jsxImportSource @emotion/react */
import { colors } from '@core3/ui-components/styleSystem';
import * as styles from './MobileReservesMockup.styles';

const assetColors = [
  colors.semantic.success,
  colors.chart.financial,
  colors.chart.operational,
];

const donutData = [
  { name: 'BNB', value: 31 },
  { name: 'BTC', value: 18 },
  { name: 'USDT', value: 13 },
  { name: 'USDC', value: 8 },
];

const donutColors = [
  colors.chart.operational,
  colors.chart.reputational,
  colors.chart.regulatory,
  colors.chart.security,
];

export function MobileReservesMockup() {
  return (
    <div css={styles.container}>
      {/* Table Mockup */}
      <div css={styles.tableMockup}>
        {/* Header Row */}
        <div css={styles.headerRow}>
          <span css={styles.headerCell}>Asset</span>
          <span css={styles.headerCell}>Balance</span>
          <span css={styles.headerCell}>Value</span>
        </div>
        
        {/* Data Rows */}
        {[0, 1, 2].map((index) => (
          <div key={index} css={styles.dataRow}>
            <div css={styles.assetCell}>
              <div css={styles.assetDot(assetColors[index])} />
              <span css={styles.mockupText}>Asset Name</span>
            </div>
            <span css={styles.mockupText}>248,597.58</span>
            <span css={styles.mockupText}>$28,267M</span>
          </div>
        ))}
      </div>
      
      {/* Distribution Section */}
      <div css={styles.distributionMockup}>
        <h3 css={styles.distributionTitle}>Distribution</h3>
        
        {/* Donut placeholder */}
        <div css={styles.donutPlaceholder}>
          <div css={styles.donutRing} />
        </div>
        
        {/* Legend */}
        <div css={styles.legend}>
          {donutData.map((item, index) => (
            <div key={item.name} css={styles.legendItem}>
              <div css={styles.legendLeft}>
                <div css={styles.legendDot(donutColors[index])} />
                <span css={styles.legendLabel}>{item.name}</span>
              </div>
              <span css={styles.legendValue}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
