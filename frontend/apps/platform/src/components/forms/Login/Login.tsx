/** @jsxImportSource @emotion/react */
'use client';
import { Core3Button, TextWithLink, Icon } from '@core3/ui-components';
import * as styles from './Login.styles';
import { continueSection, continueTitle } from '../common.styles';
import { useRouter } from 'next/navigation';
import useTranslation from '@/hooks/useTranslation';
import { ROUTES } from '@/constants/routes';
import { useLoginForm } from '@/hooks/useLoginForm';
import { LoginStep } from '@/enums/loginEnum';

const Login = ({ setStep }: { setStep: (step: LoginStep) => void }) => {
  const router = useRouter();
  const { t } = useTranslation(['auth']);

  const { form, handleSubmit } = useLoginForm({
    onSuccess: () => {
      router.push(ROUTES.WORKSPACE.ROOT);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  const handleResetClick = () => {
    setStep(LoginStep.RESET);
  };

  return (
    <div css={styles.container}>
      <div css={styles.title}>
        {t('login.title', 'Welcome Back to CORE3')}
      </div>
      <form onSubmit={handleSubmit} css={styles.content}>
        <form.AppField name="email">
          {(field) => (
            <field.FormInput
              label={t('login.emailLabel', 'Email')}
              type="email"
              className="error"
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.FormInput
              label={t('login.passwordLabel', 'Password')}
              type="password"
              className="error"
            />
          )}
        </form.AppField>

        <button type="button" css={styles.resetLink} onClick={handleResetClick}>
          {t('login.forgotPassword', 'I FORGOT MY PASSWORD')}
        </button>

        <Core3Button
          variant="primary"
          type="submit"
          disabled={!form.state.isValid || form.state.isSubmitting}
        >
          {form.state.isSubmitting
            ? t('login.loggingIn', 'Logging in...')
            : t('login.continue', 'Continue')}
        </Core3Button>

        <TextWithLink
          text={t('login.noAccount', "Don't have an account?")}
          linkLabel={t('login.signup', 'Sign up')}
          linkUrl={ROUTES.AUTH.SIGNUP}
        />
      </form>

      <div css={continueSection}>
        <div css={continueTitle}>
          {t('login.orContinueWith', 'Or continue with')}
        </div>
        <Core3Button variant="secondary" css={styles.buttonsWrapper}>
          <Icon name="google" />
          {t('login.google', 'Google')}
        </Core3Button>
        <Core3Button variant="secondary" css={styles.buttonsWrapper}>
          <Icon name="apple" />
          {t('login.apple', 'APPLE ID')}
        </Core3Button>
      </div>
    </div>
  );
};

export default Login;
