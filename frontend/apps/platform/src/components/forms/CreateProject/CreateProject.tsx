/** @jsxImportSource @emotion/react */
'use client';
import { Core3Button, Tag, Stepper } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import { useCreateProjectForm } from '@/hooks/useCreateProjectForm';
import * as styles from './CreateProject.styles';
import { OrganizationStep } from '@/enums/workspaceEnum';

interface CreateProjectProps {
  onContinue?: (data: {
    corporateEmail: string;
    fullName: string;
    projectName: string;
    numberOfLicensedProjects?: string;
  }) => void;
  currentStep?: number;
  workspaceType?: OrganizationStep;
}

const CreateProject = ({
  onContinue,
  currentStep = 0,
  workspaceType = OrganizationStep.Project,
}: CreateProjectProps) => {
  const { t } = useTranslation(['auth']);

  const { form, handleSubmit } = useCreateProjectForm({
    onContinue,
    workspaceType,
  });

  const getWorkspaceLabel = () => {
    if (workspaceType === OrganizationStep.CREATE_EXCHANGE) {
      return t(
        'auth:accessForm.labels.exchangeName',
        'EXCHANGE NAME'
      );
    } else if (workspaceType === OrganizationStep.Regulator) {
      return t(
        'auth:accessForm.labels.organizationName',
        'ORGANIZATION NAME'
      );
    } else {
      return t(
        'auth:accessForm.labels.projectName',
        'PROJECT NAME'
      );
    }
  };

  const workspaceLabel = getWorkspaceLabel();

  return (
    <div css={styles.container}>
      <div css={styles.headings}>
        <div css={styles.tagWrapper}>
          <Tag text={workspaceType} />
        </div>
        <div css={styles.stepperWrapper}>
          <Stepper
            steps={[
              {
                label:
                  workspaceType === OrganizationStep.Project
                    ? t('auth:accessForm.steps.projectInfo', 'Project Info')
                    : t(
                        'auth:accessForm.steps.organizationInfo',
                        'Organization Info'
                      ),
              },
              {
                label: t(
                  'auth:accessForm.steps.telegramGroup',
                  'Telegram Group'
                ),
              },
            ]}
            activeStep={currentStep}
          />
        </div>
        <div css={styles.titleSection}>
          <div css={styles.title}>
            {t(
              'auth:createProject.title',
              'After submitting, our team will reach out to you within 3 business days'
            )}
          </div>
          <div css={styles.subtitle}>
            {t(
              'auth:accessForm.subtitle',
              'After submitting, our team will reach out to you within 3 business days'
            )}
          </div>
        </div>
      </div>

      <form css={styles.form} onSubmit={handleSubmit}>
        <div css={styles.fieldsContainer}>
          <form.AppField name="projectName">
            {(field) => (
              <field.TextField label={workspaceLabel} />
            )}
          </form.AppField>

          <form.AppField name="corporateEmail">
            {(field) => (
              <field.TextField
                label={t(
                  'auth:accessForm.labels.corporateEmail',
                  'CORPORATE EMAIL'
                )}
              />
            )}
          </form.AppField>

          <form.AppField name="fullName">
            {(field) => (
              <field.TextField
                label={t('auth:accessForm.labels.fullName', 'YOUR FULL NAME')}
              />
            )}
          </form.AppField>

          {workspaceType === OrganizationStep.Regulator && (
            <form.AppField name="numberOfLicensedProjects">
              {(field) => (
                <field.TextField
                  label={t(
                    'auth:accessForm.labels.numberOfLicensedProjects',
                    'NUMBER OF LICENSED PROJECTS (OPTIONAL)'
                  )}
                />
              )}
            </form.AppField>
          )}
        </div>

        <div css={styles.continueButton}>
          <Core3Button
            type="submit"
            variant="primary"
            size="large"
            disabled={form.state.isSubmitting}
          >
            {t('auth:accessForm.buttons.continue', 'CONTINUE')}
          </Core3Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
