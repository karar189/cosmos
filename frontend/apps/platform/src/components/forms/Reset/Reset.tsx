/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './Reset.styles';

import { Core3Button, FormHeader, InputLabel, Icon } from '@core3/ui-components';
import { container } from '../Signup/Signup.styles';
import z from 'zod';
import { useForm } from '@tanstack/react-form';
import useTranslation from '@/hooks/useTranslation';
import { LoginStep } from '@/enums/loginEnum';

const Reset = ({
  setStep,
}: {
  setStep: (step: LoginStep) => void;
}) => {
  const { t } = useTranslation(['auth']);

  const schema = z.object({
    email: z
      .string()
      .min(1, t('resetPassword.errors.emailRequired', 'Email is required'))
      .email(t('resetPassword.errors.emailInvalid', 'Invalid email address')),
  });

  const form = useForm({
    defaultValues: { email: '' },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      console.log('Reset email:', value);
      setStep(LoginStep.LOGIN);
    },
  });

  const Form = form;
  return (
    <div css={[container, styles.resetContainer]}>
      <button 
        css={styles.backButton}
        onClick={() => setStep(LoginStep.LOGIN)}
        type="button"
      >
        <Icon name="chevron-left" css={styles.backIcon} />
        {t('resetPassword.backToLogin', 'Back to Log In')}
      </button>
      <div css={styles.headerWrapper}>
        <FormHeader title={t('resetPassword.title', 'Reset Password')}>
          <div>
            {t(
              'resetPassword.subtitle',
              'Enter your email to reset your password'
            )}
          </div>
        </FormHeader>
      </div>

      <form
        css={styles.resetContent}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Form.Field
          name="email"
          validators={{
            onChange: z
              .string()
              .min(1, t('resetPassword.emailRequired', 'Email is required'))
              .email(t('resetPassword.emailInvalid', 'Invalid email address')),
          }}
        >
          {(field) => (
            <InputLabel
              label={t('resetPassword.emailLabel', 'Email')}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </Form.Field>

        <Core3Button
          variant="primary"
          type="submit"
          disabled={!form.state.isValid || form.state.isSubmitting}
          onClick={() => setStep(LoginStep.RECOVERY)}
        >
          {form.state.isSubmitting
            ? t('resetPassword.sending', 'Sending...')
            : t('resetPassword.sendLink', 'Send Recovery Link')}
        </Core3Button>
      </form>
    </div>
  );
};

export default Reset;
