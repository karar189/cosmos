/** @jsxImportSource @emotion/react */
'use client';
import * as styles from './Password.styles';
import { Core3Button, FormHeader } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import { useEffect } from 'react';
import { LoginStep } from '@/enums/loginEnum';

const Info = ({
  setStep,
  title,
  subtitle,
}: {
  setStep: (step: LoginStep) => void;
  title?: string;
  subtitle?: string;
}) => {
  const { t } = useTranslation(['auth']);

  // TODO: Remove this after the authentication is implemented
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(LoginStep.AUTHENTICATE);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [setStep]);

  return (
    <div css={styles.container}>
      <div css={styles.headers}>
        <FormHeader
          title={title || t('createPassword.infoTitle', 'Password Was Changed')}
        >
          {subtitle ||
            t(
              'createPassword.infoSubtitle',
              'Now you can log in to your account'
            )}
        </FormHeader>
      </div>

      <Core3Button
        variant="primary"
        type="submit"
        onClick={() => setStep(LoginStep.LOGIN)}
      >
        {t('createPassword.backToLogin', 'Back to Login')}
      </Core3Button>
    </div>
  );
};

export default Info;
