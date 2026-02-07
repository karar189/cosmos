/** @jsxImportSource @emotion/react */
'use client';
import { Core3Button, Tag, FormHeader } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import * as styles from './Request.styles';
import Image from 'next/image';
import { OrganizationStep } from '@/enums/workspaceEnum';

interface Project {
  projectName: string;
  projectLogo: string;
}

interface RequestAccessProps {
  onContinue?: (data: {
    corporateEmail: string;
    fullName: string;
    projectName: string;
    numberOfLicensedProjects?: string;
  }) => void;
  currentStep?: number;
  workspaceType?: OrganizationStep;
  project: Project;
}

const RequestAccess = ({
  workspaceType,
  onContinue,
  project,
}: RequestAccessProps) => {
  const { t } = useTranslation(['auth']);

  const handleRequestAccess = () => {
    if (onContinue) {
      onContinue({
        corporateEmail: '',
        fullName: '',
        projectName: '',
      });
    }
  };

  return (
    <div css={styles.container}>
      <div css={styles.headings}>
        {workspaceType && (
          <div css={styles.tagWrapper}>
            <Tag text={workspaceType} />
          </div>
        )}

        <FormHeader
          title={t('auth:accessForm.title', 'Fill the form to get access')}
        >
          {t(
            'auth:accessForm.subtitle',
            'After submitting, our team will reach out to you within 3 business days'
          )}
        </FormHeader>
      </div>
      <div css={styles.logo}>
        {project?.projectLogo ? (
          <Image
            src={project.projectLogo}
            alt={project?.projectName}
            width={88}
            height={88}
            css={styles.logoImage}
          />
        ) : (
          <div css={styles.logoGradient} />
        )}
        <span css={styles.label}>{project?.projectName}</span>
      </div>
      <Core3Button variant="primary" onClick={handleRequestAccess}>
        {t('auth:requestAccess.button', 'Request Access')}
      </Core3Button>
    </div>
  );
};

export default RequestAccess;
