/** @jsxImportSource @emotion/react */
'use client';
import { Core3Button, InputLabel, Tag, Stepper, VerticalStepper } from '@core3/ui-components';
import { FormControl } from '@mui/material';
import useTranslation from '@/hooks/useTranslation';
import { useTelegramGroupForm } from '@/hooks/useTelegramGroupForm';
import * as styles from './TelegramGroupForm.styles';
import { OrganizationStep } from '@/enums/workspaceEnum';

interface TelegramGroupFormProps {
  onSubmit?: (data: { telegramLink: string }) => void;
  currentStep?: number;
  workspaceType?: OrganizationStep;
}

const TelegramGroupForm = ({ 
  onSubmit, 
  currentStep = 1, 
  workspaceType = OrganizationStep.Regulator 
}: TelegramGroupFormProps) => {
  const { t } = useTranslation(['auth']);
  
  const { form, handleSubmit } = useTelegramGroupForm({
    onSubmit,
    onSuccess: () => {
      // Optional: Add success handling
    },
    onError: (error) => {
      console.error('Telegram group form error:', error);
      // TODO: Add error handling (e.g., show error snackbar)
    },
  });

  return (
    <div css={styles.container}>
      <div css={styles.headings}>
        <div css={styles.tagWrapper}>
          <Tag text={workspaceType} />
        </div>
        <div css={styles.stepperWrapper}>
          <Stepper
            steps={[
              { label: t('auth:accessForm.steps.organizationInfo', 'Organization Info') },
              { label: t('auth:accessForm.steps.telegramGroup', 'Telegram Group') },
            ]}
            activeStep={currentStep}
          />
        </div>
        <div css={styles.titleSection}>
          <div css={styles.title}>{t('auth:telegramGroupForm.title', 'Create a Telegram Group')}</div>
          <div css={styles.subtitle}>
            {t('auth:telegramGroupForm.subtitle', 'To submit your request, please create a Telegram group where our representative can reach out to you.')}
          </div>
        </div>
      </div>

      <div css={styles.instructionsContainer}>
        <VerticalStepper 
          steps={[
            { title: t('auth:telegramGroupForm.steps.createGroup', 'Create a Group in Telegram') },
            { title: t('auth:telegramGroupForm.steps.addMembers', 'Add anyone necessary for the communication') },
            { title: t('auth:telegramGroupForm.steps.copyLink', 'Copy and paste link to this group below') },
          ]}
        />
      </div>

      <form
        css={styles.form}
        onSubmit={handleSubmit}
      >
        <div css={styles.fieldsContainer}>
          <form.Field name="telegramLink">
            {(field) => (
              <FormControl fullWidth>
                <InputLabel
                  label={t('auth:telegramGroupForm.labels.telegramLink', 'LINK TO TELEGRAM GROUP')}
                  value={field.state.value}
                  placeholder="t.me/"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(event.target.value)
                  }
                />
              </FormControl>
            )}
          </form.Field>
        </div>

        <div css={styles.submitButton}>
          <Core3Button
            type="submit"
            variant="primary"
            size="large"
            disabled={form.state.isSubmitting}
          >
            {t('auth:telegramGroupForm.buttons.submit', 'SUBMIT')}
          </Core3Button>
        </div>
      </form>
    </div>
  );
};

export default TelegramGroupForm;