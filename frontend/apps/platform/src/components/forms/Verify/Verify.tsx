/** @jsxImportSource @emotion/react */
'use client';
import { Core3Button, Icon, TextWithLink } from '@core3/ui-components';
import * as styles from './Verify.styles';
import { useState, useEffect } from 'react';
import { OTP_LENGTH } from '@/utils/validations';
import useTranslation from '@/hooks/useTranslation';
import { ROUTES } from '@/constants/routes';
import FormOTPBox from '../FormOTPBox';
import { useVerifyForm } from '@/hooks/useVerifyForm';
import { useMounted } from '@/hooks/useMounted';
import { SignUpStep } from '@/enums/signupEnum';

const Verify = ({
  setStep,
}: {
  setStep: (step: SignUpStep) => void;
}) => {
  const { t } = useTranslation(['auth']);
  const mounted = useMounted();

  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(60);

  const {
    form,
    handleSubmit,
    otpValue,
    otpError,
    hasError,
    isVerifying,
    handleValueChange,
    handleResend: handleResendOtp,
    schema: otpSchema,
  } = useVerifyForm({
    onSuccess: () => {
      setStep(SignUpStep.PASSWORD);
    },
    onError: (error) => {
      console.error('OTP verification error:', error);
    },
  });

  useEffect(() => {
    if (mounted) {
      const storedEmail = localStorage.getItem('signupEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [mounted]);

  const handleResend = () => {
    setTimer(60);
    handleResendOtp();
  };

  const handleBackClick = () => {
    setStep(SignUpStep.SIGNUP);
  };

  return (
    <>
      <button type="button" css={styles.header} onClick={handleBackClick}>
        <Icon name="chevron-left" />
        {t('verify.changeEmail', 'Change Email')}
      </button>
      <div css={styles.container}>
        <div css={styles.content}>
          <div css={styles.headings}>
            <h1 css={styles.title}>{t('verify.title', 'Verify your email')}</h1>
            <div css={styles.subtitle}>
              {t('verify.subtitlePrefix', 'A 6-digit code was sent to')}&nbsp;
              <span css={styles.boldText}>{email}</span>
            </div>
          </div>

          <form css={styles.form} onSubmit={handleSubmit}>
            <FormOTPBox
              form={form as Parameters<typeof FormOTPBox>[0]['form']}
              name="otp"
              schema={otpSchema}
              errorMessages={{
                length: t('verify.errors.otpLength', 'Code must be 6 digits'),
                digits: t(
                  'verify.errors.otpDigits',
                  'Code must contain only digits'
                ),
              }}
              onValueChange={handleValueChange}
              externalError={otpError}
              externalHasError={hasError}
            />

            {otpError && <div css={styles.errorMessage}>{otpError}</div>}

            <Core3Button
              variant="primary"
              type="submit"
              disabled={otpValue.length !== OTP_LENGTH || isVerifying}
            >
              {isVerifying
                ? t('verify.verifying', 'Verifying...')
                : t('verify.continue', 'Continue')}
            </Core3Button>

            <div css={styles.resendContainer}>
              {timer > 0 ? (
                <TextWithLink
                  text={t('verify.notReceived', 'Have not received a code?')}
                  linkLabel={t('verify.resend', 'RESEND')}
                  linkUrl={ROUTES.AUTH.LOGIN}
                />
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  css={styles.resendButton}
                >
                  {t('verify.resendCode', 'Resend Code')}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Verify;
