/** @jsxImportSource @emotion/react */
'use client';
import { useState } from 'react';
import { OptionCard, Core3Button } from '@core3/ui-components';
import { Tag } from '@core3/ui-components';
import { Icon } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import * as styles from './WorkspaceType.styles';
import { OrganizationStep } from '@/enums/workspaceEnum';

interface WorkspaceTypeProps {
  onContinue?: (type: OrganizationStep) => void;
}

const WorkspaceType = ({ onContinue }: WorkspaceTypeProps) => {
  const { t } = useTranslation(['auth']);
  const [selectedType, setSelectedType] = useState<OrganizationStep>(OrganizationStep.Regulator);

  const handleRegulatorClick = () => {
    setSelectedType(OrganizationStep.Regulator);
  };

  const handleProjectClick = () => {
    setSelectedType(OrganizationStep.Project);
  };

  const handleExchangeClick = () => {
    setSelectedType(OrganizationStep.CREATE_EXCHANGE);
  };

  const handleContinue = () => {
    onContinue?.(selectedType);
  };

  return (
    <div css={styles.container}>
      <div css={styles.headings}>
        <div css={styles.tagWrapper}>
          <Tag text={t('auth:accountType.organization.title', 'Organization')} />
        </div>
        <div css={styles.title}>{t('auth:workspaceType.title', 'Select Workspace Type')}</div>
        <div css={styles.subtitle}>
          {t('auth:workspaceType.subtitle', 'Every workspace has unique features')}
        </div>
      </div>

      <div css={styles.optionsContainer}>
        <OptionCard
          icon={<Icon name="bank" />}
          title={t('auth:workspaceType.regulator.title', 'Regulator')}
          description={t('auth:workspaceType.regulator.description', 'Detailed dashboard for all your licensed projects and exchanges')}
          actionType="radio"
          selected={selectedType === OrganizationStep.Regulator}
          onClick={handleRegulatorClick}
        />
        
        <div>
          <div css={styles.tagsContainer}>
          </div>
          <OptionCard
            icon={<Icon name="project" />}
            title={t('auth:workspaceType.project.title', 'Project')}
            description={t('auth:workspaceType.project.description', 'Detailed dashboard for all your project metrics')}
            actionType="radio"
            selected={selectedType === OrganizationStep.Project}
            onClick={handleProjectClick}
          />
        </div>

        <OptionCard
          icon={<Icon name="candle-stick" />}
          title={t('auth:workspaceType.exchange.title', 'Exchange')}
          description={t('auth:workspaceType.exchange.description', 'Dashboard for your Proof of Reserves, listed projects, and various metrics')}
          actionType="radio"
          selected={selectedType === OrganizationStep.CREATE_EXCHANGE}
          onClick={handleExchangeClick}
        />
      </div>

      <div css={styles.continueButton}>
        <Core3Button
          variant="primary"
          size="large"
          onClick={handleContinue}
        >
          {t('auth:workspaceType.buttons.continueAs', 'CONTINUE AS {{type}}', { type: selectedType })}
        </Core3Button>
      </div>
    </div>
  );
};

export default WorkspaceType;