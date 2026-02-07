/** @jsxImportSource @emotion/react */
'use client';
import { Tag, Core3Button, Icon } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import * as styles from './Request.styles';
import { OrganizationStep } from '@/enums/workspaceEnum';

interface RequestedAccessProps {
  workspaceType?: OrganizationStep;
  onBackToHome?: () => void;
}

const RequestedAccess = ({
  workspaceType = OrganizationStep.Project,
  onBackToHome,
}: RequestedAccessProps) => {
  const { t } = useTranslation(['auth']);

  return (
    <div css={styles.container}>
      <div css={styles.headings}>
        <div css={styles.tagWrapper}>
          <Tag text={workspaceType} />
        </div>
        <div css={styles.intro}>
          <Icon name="check" />
          <span css={styles.title}>
            {t('auth:requestedAccess.title', 'Access Request Submitted')}
          </span>
          <span css={styles.subtitle}>
            {t(
              'auth:requestedAccess.subtitle',
              'Once admin accept your request to join Uniswap team, you’ll receive an email and will be able to log in'
            )}
          </span>
        </div>
      </div>
      <Core3Button variant="primary" onClick={onBackToHome}>
        {t('auth:requestedAccess.button', 'Back to Home Page')}
      </Core3Button>
    </div>
  );
};

export default RequestedAccess;
