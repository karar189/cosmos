/** @jsxImportSource @emotion/react */
'use client';

import { Card, Section } from '@core3/ui-components';
import { useTranslation } from 'react-i18next';
import * as styles from './ProjectRegistrySection.styles';

interface ProjectRegistrySectionProps {
  id: string;
}

const MOCK_REGISTRY = [
  { label: 'Whitelisted Wallets', value: '124' },
  { label: 'Pending KYC', value: '3' },
  { label: 'Frozen Wallets', value: '0' },
  { label: 'Region Distribution', value: 'UAE 45%, EU 30%, Other 25%' },
  { label: 'Last Compliance Check', value: 'Feb 8, 2026' },
];

export default function ProjectRegistrySection({ id }: ProjectRegistrySectionProps) {
  const { t } = useTranslation(['projects']);

  return (
    <div css={styles.section}>
      <Section id={id} title={t('details.cosmos.registry.title', 'Investor / Wallet Registry')} iconName="organization">
        <div css={styles.grid}>
          {MOCK_REGISTRY.map((item) => (
            <Card key={item.label} title={item.label}>
              <span css={styles.value}>{item.value}</span>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
