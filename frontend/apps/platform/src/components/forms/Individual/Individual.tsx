/** @jsxImportSource @emotion/react */
'use client';
import { Core3Button, OptionCard, Tag } from '@core3/ui-components';
import { useState } from 'react';
import { Icon } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import * as styles from './Individual.styles';
import { IndividualStep } from '@/enums/workspaceEnum';


interface IndividualProps {
  onContinue?: (workspaceType: IndividualStep) => void;
  defaultSelection?: IndividualStep;
}

const Individual = ({ 
  onContinue, 
  defaultSelection = IndividualStep.Investor
}: IndividualProps) => {
  const { t } = useTranslation(['auth']);
  const [selectedWorkspace, setSelectedWorkspace] = useState<IndividualStep>(defaultSelection);

  const handleContinue = () => {
    onContinue?.(selectedWorkspace);
  };

  return (
    <div css={styles.container}>
      <div css={styles.headings}>

        {/* Tag */}
        <div css={styles.tagWrapper}>
          <Tag text="Individual" />
        </div>

        {/* Title Section */}
        <div css={styles.titleSection}>
          <div css={styles.title}>{t('auth:individual.title', 'Select Workspace Type')}</div>
          <div css={styles.subtitle}>
            {t('auth:individual.subtitle', 'Every workspace has unique features')}
          </div>
        </div>
      </div>

      <div css={styles.optionsContainer}>
        <OptionCard
          icon={<Icon name="piggy-bank" />}
          title={t('auth:individual.investor.title', 'Investor')}
          description={t('auth:individual.investor.description', 'Workspace to track your portfolio and watchlist')}
          actionType="radio"
          selected={selectedWorkspace === IndividualStep.Investor}
          onClick={() => setSelectedWorkspace(IndividualStep.Investor)}
        />
      </div>

      {/* Continue Button */}
      <div css={styles.continueButton}>
        <Core3Button
          variant="primary"
          size="large"
          onClick={handleContinue}
        >
          {t('auth:individual.buttons.continueAs', 'CONTINUE AS {{type}}', { type: selectedWorkspace.toUpperCase() })}
        </Core3Button>
      </div>
    </div>
  );
};

export default Individual;