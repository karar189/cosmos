/** @jsxImportSource @emotion/react */
'use client';
import * as styles from './Password.styles';
import { useEffect, useState } from 'react';
import { Core3Button, PasswordSpecs } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import { usePasswordForm } from '@/hooks/usePasswordForm';
import { SignUpStep } from '@/enums/signupEnum';

const Password = ({
  setStep: _setStep,
  onContinue,
}: {
  setStep?: (step: SignUpStep) => void;
  onContinue?: () => void;
}) => {
  const { t } = useTranslation(['auth']);
  const [email, setEmail] = useState('');

  const { form, handleSubmit, isPasswordValid } = usePasswordForm({
    onSubmit: async (password) => {
      console.log('Password:', password);
      if (onContinue) {
        onContinue();
      } else if (_setStep) {
        _setStep(SignUpStep.VERIFY);
      }
    },
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem('signupEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div css={styles.container}>
      <div css={styles.headers}>
        <span css={styles.title}>
          {t('createPassword.title', 'Create Password')}
        </span>
        <span css={styles.subtitle}>
          {t(
            'createPassword.subtitlePrefix',
            'Create a strong password for account'
          )}
          &nbsp;
          <span css={styles.boldText}>{email}</span>
        </span>
      </div>
      <form css={styles.form} onSubmit={handleSubmit}>
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

export default Password;
