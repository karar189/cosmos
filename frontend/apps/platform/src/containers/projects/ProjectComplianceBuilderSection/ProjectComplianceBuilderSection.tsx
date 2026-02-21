/** @jsxImportSource @emotion/react */
'use client';

import { Card, Section, Core3Button as Button, Icon } from '@core3/ui-components';
import { useTranslation } from 'react-i18next';
import * as styles from './ProjectComplianceBuilderSection.styles';

interface ProjectComplianceBuilderSectionProps {
  id: string;
}

const CONTROLS = [
  { key: 'kyc', label: 'KYC Enforcement', status: 'Enabled' },
  { key: 'kyt', label: 'KYT Monitoring', status: 'Enabled' },
  { key: 'transfer', label: 'Transfer Restrictions', status: 'Active' },
  { key: 'geo', label: 'Geo-blocking', status: 'Active' },
  { key: 'freeze', label: 'Freeze Authority', status: 'Configured' },
  { key: 'reporting', label: 'Reporting Frequency', status: 'Quarterly' },
];

export default function ProjectComplianceBuilderSection({ id }: ProjectComplianceBuilderSectionProps) {
  const { t } = useTranslation(['projects']);

  return (
    <div css={styles.section}>
      <Section id={id} title={t('details.cosmos.complianceBuilder.title', 'Compliance Controls')} iconName="tools">
        <div css={styles.controlsGrid}>
          {CONTROLS.map((item) => (
            <Card key={item.key} title={item.label}>
              <div css={styles.controlRow}>
                <span css={styles.statusBadge} data-on={item.status !== '—'}>
                  {item.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
        <Card title={t('details.cosmos.complianceBuilder.soroban', 'Enforcement Contract')}>
          <p css={styles.sorobanNote}>
            {t('details.cosmos.complianceBuilder.sorobanNote', 'Generate a Soroban contract that enforces the controls above on-chain.')}
          </p>
          <Button variant="primary" size="medium">
            <Icon name="data-transfer" />
            {t('details.cosmos.complianceBuilder.generate', 'Generate Soroban Enforcement Contract')}
          </Button>
        </Card>
      </Section>
    </div>
  );
}
