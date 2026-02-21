/** @jsxImportSource @emotion/react */
'use client';

import { Card, Section } from '@core3/ui-components';
import { useTranslation } from 'react-i18next';
import * as styles from './ProjectRoutingSection.styles';

interface ProjectRoutingSectionProps {
  id: string;
}

const MOCK_ROUTE = [
  { label: 'Selected Corridor', value: 'USDC → XLM → EUR' },
  { label: 'Multi-hop Path', value: 'Anchor A → Stellar → Anchor B' },
  { label: 'Estimated Fees', value: '0.1%' },
  { label: 'Settlement Speed', value: '1–2 ledger closes' },
  { label: 'Required Memo', value: 'Yes' },
  { label: 'Liquidity Depth', value: 'High' },
  { label: 'Compliance Requirements for Route', value: 'KYC verified, No sanctioned jurisdictions' },
];

export default function ProjectRoutingSection({ id }: ProjectRoutingSectionProps) {
  const { t } = useTranslation(['projects']);

  return (
    <div css={styles.section}>
      <Section id={id} title={t('details.cosmos.routing.title', 'Routing Engine')} iconName="data-flow">
        <div css={styles.grid}>
          {MOCK_ROUTE.map((item) => (
            <Card key={item.label} title={item.label}>
              <span css={styles.value}>{item.value}</span>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
