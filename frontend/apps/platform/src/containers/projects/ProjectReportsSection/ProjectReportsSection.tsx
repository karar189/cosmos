/** @jsxImportSource @emotion/react */
'use client';

import { Card, Section, Core3Button as Button, Icon } from '@core3/ui-components';
import { useTranslation } from 'react-i18next';
import * as styles from './ProjectReportsSection.styles';

interface ProjectReportsSectionProps {
  id: string;
}

const ACTIONS = [
  { key: 'report', label: 'Generate Compliance Report', icon: 'documentation' as const },
  { key: 'blueprint', label: 'Export Regulatory Blueprint', icon: 'data-transfer' as const },
  { key: 'logs', label: 'Download Enforcement Logs', icon: 'data-transfer' as const },
];

export default function ProjectReportsSection({ id }: ProjectReportsSectionProps) {
  const { t } = useTranslation(['projects']);

  return (
    <div css={styles.section}>
      <Section id={id} title={t('details.cosmos.reports.title', 'Reporting & Export')} iconName="documentation">
        <div css={styles.grid}>
          {ACTIONS.map((item) => (
            <Card key={item.key} title={item.label}>
              <Button variant="secondary" size="small">
                <Icon name={item.icon} />
                {t('details.cosmos.reports.download', 'Download')}
              </Button>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
