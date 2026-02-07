/** @jsxImportSource @emotion/react */
'use client';
import * as styles from './Password.styles';
import { Core3Button, PasswordSpecs } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import { usePasswordForm } from '@/hooks/usePasswordForm';
import { LoginStep } from '@/enums/loginEnum';

const CreateNewPassword = ({
  setStep,
}: {
  setStep: (step: LoginStep) => void;
}) => {
  const { t } = useTranslation(['auth']);

  const { form, handleSubmit, isPasswordValid } = usePasswordForm({
    onSubmit: async (password) => {
      console.log('Password:', password);
      setStep(LoginStep.INFO);
    },
  });

  return (
    <div css={styles.container}>
      <div css={styles.headers}>
        <span css={styles.title}>
          {t('createPassword.newTitle', 'Create New Password')}
        </span>
        <span css={styles.subtitle}>
          {t(
            'createPassword.newSubtitle',
            "We'll send you an email to reset your password"
          )}
        </span>
      </div>
      <form css={styles.newPasswordForm} onSubmit={handleSubmit}>
        <form.AppField name="password">
          {(field) => (
            <field.FormInput
              label={t('createPassword.passwordLabel', 'Password')}
              type="password"
              className="error"
            />
          )}
        </form.AppField>
        <form.Subscribe selector={(state) => [state.values.password]}>
          {([password]) => (
            <PasswordSpecs
              password={password}
              labels={{
                minLength: '8 characters minimum',
                number: 'at least 1 number',
                symbol: 'at least 1 symbol',
              }}
            />
          )}
        </form.Subscribe>
        <form.Subscribe
          selector={(state) => [
            state.values.password,
            state.fieldMeta.password?.errors,
          ]}
        >
          {([password, errors]) => {
            const passwordValue = typeof password === 'string' ? password : '';
            return (
              <Core3Button
                variant="primary"
                type="submit"
                disabled={
                  !passwordValue ||
                  !isPasswordValid(passwordValue) ||
                  !!(errors && errors.length > 0)
                }
              >
                {t('createPassword.continue', 'CONTINUE')}
              </Core3Button>
            );
          }}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default CreateNewPassword;
