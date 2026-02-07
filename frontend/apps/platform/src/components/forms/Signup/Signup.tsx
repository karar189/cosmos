/** @jsxImportSource @emotion/react */
'use client';
import { Core3Button, Icon, TextWithLink } from '@core3/ui-components';
import Link from 'next/link';
import * as styles from './Signup.styles';
import {
  continueSection,
  continueTitle,
  terms,
  termsLink,
} from '../common.styles';
import useTranslation from '@/hooks/useTranslation';
import { ROUTES } from '@/constants/routes';
import { useSignupForm } from '@/hooks/useSignupForm';
import { SignUpStep } from '@/enums/signupEnum';

const Signup = ({ setStep }: { setStep: (step: SignUpStep) => void }) => {
  const { t } = useTranslation(['auth']);

  const { form, handleSubmit } = useSignupForm({
    onSuccess: () => {
      form.reset();
      setStep(SignUpStep.VERIFY);
    },
    onError: (error) => {
      console.error('Signup error:', error);
      // TODO: Add error handling (e.g., show error snackbar)
    },
  });

  return (
    <div css={styles.container}>
      <div css={styles.title}>
        {t('signupStart.title', 'Get Started with CORE3')}
      </div>
      <form css={styles.form} onSubmit={handleSubmit}>
        <form.AppField name="email">
          {(field) => (
            <field.FormInput
              label={t('signupStart.emailLabel', 'Email')}
              type="email"
              className="error"
            />
          )}
        </form.AppField>
        <Core3Button type="submit" disabled={form.state.isSubmitting} fullWidth>
          {t('signupStart.continue', 'Continue')}
        </Core3Button>
        <TextWithLink
          text={t('signupStart.haveAccount', 'Have an account?')}
          linkLabel={t('signupStart.login', 'LOG IN')}
          linkUrl={ROUTES.AUTH.LOGIN}
        />
      </form>
      <div css={continueSection}>
        <div css={continueTitle}>
          {t('signupStart.orContinueWith', 'Or continue with')}
        </div>
        <Core3Button variant="secondary" css={styles.buttonsWrapper}>
          <Icon name="google" />
          {t('signupStart.google', 'Google')}
        </Core3Button>
        <Core3Button variant="secondary" css={styles.buttonsWrapper}>
          <Icon name="apple" />
          {t('signupStart.apple', 'Apple ID')}
        </Core3Button>
      </div>
      <div css={terms}>
        {t('signupStart.termsPrefix', 'By continuing you agree to our')}&nbsp;
        {/* TODO: Change to Terms and Privacy Policy links */}
        <Link href="/" css={termsLink}>
          {t('signupStart.privacyPolicy', 'Privacy Policy')}
        </Link>
        &nbsp;<span>{t('signupStart.and', 'and')}</span>&nbsp;
        <Link href="/" css={termsLink}>
          {t('signupStart.termsOfUse', 'Terms of Use')}
        </Link>
      </div>
    </div>
  );
};

export default Signup;
