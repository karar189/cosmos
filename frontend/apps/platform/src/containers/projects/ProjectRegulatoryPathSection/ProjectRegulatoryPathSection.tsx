/** @jsxImportSource @emotion/react */
'use client';

import { Card, Section, Icon, ProgressCell } from '@core3/ui-components';
import { useTranslation } from 'react-i18next';
import * as styles from './ProjectRegulatoryPathSection.styles';

interface ProjectRegulatoryPathSectionProps {
  id: string;
}

const MOCK_COMPLETION = 68;
const MOCK_ITEMS = [
  { label: 'Required Licenses', status: 'Pending', value: 'VARA (UAE)' },
  { label: 'Required Certifications', status: 'In Progress', value: 'KYC Policy, Audit Cert' },
  { label: 'Mandatory Controls', status: 'Configured', value: 'KYC, KYT' },
  { label: 'Registration Status', status: 'In Progress', value: 'UAE registration' },
  { label: 'Missing Steps', status: 'Pending', value: 'Audit cert, Memo required' },
  { label: 'Estimated Timeline', status: '—', value: 'Q2 2026' },
];

export default function ProjectRegulatoryPathSection({ id }: ProjectRegulatoryPathSectionProps) {
  const { t } = useTranslation(['projects']);

  return (
    <div css={styles.section}>
      <Section id={id} title={t('details.cosmos.regulatoryPath.title', 'Regulatory Path')} iconName="bank">
        <Card title={t('details.cosmos.regulatoryPath.completion', 'Compliance Completion')}>
          <div css={styles.progressWrap}>
            <ProgressCell value={MOCK_COMPLETION} loading={false} />
            <span css={styles.progressLabel}>{MOCK_COMPLETION}%</span>
          </div>
          <p css={styles.progressNote}>
            {t('details.cosmos.regulatoryPath.progressNote', 'Progress ≠ Risk Score. Completion status only.')}
          </p>
        </Card>
        <div css={styles.checklist}>
          {MOCK_ITEMS.map((item) => (
            <Card key={item.label} title={item.label}>
              <div css={styles.row}>
                <span css={styles.statusTag} data-status={item.status.toLowerCase().replace(' ', '')}>
                  {item.status}
                </span>
                <span css={styles.value}>{item.value}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
