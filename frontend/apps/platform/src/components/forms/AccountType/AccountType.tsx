/** @jsxImportSource @emotion/react */
'use client';
import { OptionCard } from '@core3/ui-components';
import { Icon } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import * as styles from './AccountType.styles';
import { AccountStep } from '@/enums/accountEnum';

interface AccountTypeProps {
  onSelect?: (type: AccountStep) => void;
}

const AccountType = ({ onSelect }: AccountTypeProps) => {
  const { t } = useTranslation(['auth']);

  const handleOrganizationClick = () => {
    console.log('Organization selected');
    onSelect?.(AccountStep.Organization);
  };

  const handleIndividualClick = () => {
    console.log('Individual selected');
    onSelect?.(AccountStep.Individual);
  };

  return (
    <div css={styles.container}>
      <div css={styles.headings}>
        <div css={styles.title}>
          {t('auth:accountType.title', 'Select Account Type')}
        </div>
        <div css={styles.subtitle}>
          {t(
            'auth:accountType.subtitle',
            'Select an account type to choose a workspace that fits your needs'
          )}
        </div>
      </div>

      <div css={styles.optionsContainer}>
        <OptionCard
          icon={<Icon name="organization" />}
          title={t('auth:accountType.organization.title', 'Organization')}
          description={t(
            'auth:accountType.organization.description',
            'For crypto projects, exchanges and organizations'
          )}
          actionType="arrow"
          onClick={handleOrganizationClick}
        />

        <OptionCard
          icon={<Icon name="individual" />}
          title={t('auth:accountType.individual.title', 'Individual')}
          description={t(
            'auth:accountType.individual.description',
            'For investors and researchers'
          )}
          actionType="arrow"
          onClick={handleIndividualClick}
        />
      </div>
    </div>
  );
};

export default AccountType;
