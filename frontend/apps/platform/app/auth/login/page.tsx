/** @jsxImportSource @emotion/react */
'use client';
import React, { useEffect, useState } from 'react';
import { Login } from '@/components/forms/Login';
import {
  Core3Button,
  FormBox,
  FormHeader,
  TextWithLink,
} from '@core3/ui-components';
import { Reset } from '@/components/forms/Reset';
import * as styles from './page.styles';
import { title } from '@/components/forms/common.styles';
import useTranslation from '@/hooks/useTranslation';
import CreateNewPassword from '@/components/forms/Password/CreateNewPassword';
import Info from '@/components/forms/Password/Info';
import { ROUTES } from '@/constants/routes';
import { OTP_LENGTH, REGEX_ONLY_DIGITS } from '@/utils/validations';
import { LoginStep } from '@/enums/loginEnum';
import { OTP_CODE } from '@/constants/externalLinks';
import { z } from 'zod';
import { revalidateLogic } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { useAppForm as useAuthenticateForm } from '@/lib/app-form-hook';

export default function LoginFlow() {
  // TEMPORARY: Redirect to homepage - auth is disabled
  const router = useRouter();
  useEffect(() => {
    router.push(ROUTES.HOME);
  }, [router]);
  
  return null; // Render nothing while redirecting
  
  // Original code below - will be re-enabled when auth is restored
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [step, setStep] = useState<LoginStep>(LoginStep.LOGIN);
  const { t } = useTranslation(['auth']);

  const handleSetStep = (step: LoginStep) => {
    setStep(step);
  };

  const renderForm = () => {
    switch (step) {
      case LoginStep.LOGIN:
        return <Login setStep={handleSetStep} />;
      case LoginStep.RESET:
        return <Reset setStep={handleSetStep} />;
      case LoginStep.RECOVERY:
        return <Recovery setStep={setStep} />;
      case LoginStep.NEW_PASSWORD:
        return <CreateNewPassword setStep={handleSetStep} />;
      case LoginStep.INFO:
        return (
          <Info
            setStep={handleSetStep}
            title={t('createPassword.infoTitle', 'Password Was Changed')}
            subtitle={t(
              'createPassword.infoSubtitle',
              'Now you can log in to your account'
            )}
          />
        );
      case LoginStep.AUTHENTICATE:
        return (
          <Authenticate
            setStep={setStep}
            title={t(
              'recovery.authenticate.title',
              'Enter your authentication code'
            )}
            subtitle={
              <>
                {t(
                  'recovery.authenticate.subtitle',
                  'Enter the 6-digit code sent to '
                )}{' '}
                <span css={styles.bold}>
                  {t('recovery.authenticate.phoneNumber', '+1*******23')}
                </span>
              </>
            }
            showTextWithLink={true}
          />
        );
      case LoginStep.BACKUP:
        return (
          <Authenticate
            setStep={setStep}
            title={t('backup.title', 'Use Your Passkey to Verify Yourself')}
            subtitle={t(
              'backup.subtitle',
              'Your device will ask you for fingerprint, face, screen lock, or scan QR a code'
            )}
            showTextWithLink={false}
          />
        );
      default:
        return null;
    }
  };

  return <FormBox>{renderForm()}</FormBox>;
}

const Recovery = ({ setStep }: { setStep: (step: LoginStep) => void }) => {
  const [email, setEmail] = useState('');
  const { t } = useTranslation(['auth']);

  useEffect(() => {
    const storedEmail = localStorage.getItem('signupEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Auto-advance to new password step to simulate clicking recovery email link
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(LoginStep.NEW_PASSWORD);
    }, 2000); // 2 seconds to read the "recovery link sent" message

    return () => {
      clearTimeout(timer);
    };
  }, [setStep]);

  return (
    <div css={styles.container}>
      <div css={styles.heading}>
        <div css={title} style={{ fontSize: '2rem' }}>
          {t('recovery.title', 'Recovery link has been sent')}
        </div>

        <div css={styles.subtitle}>
          {t('recovery.subtitlePrefix', 'If an account with email ')}{' '}
          <span css={styles.bold}>{email}</span>{' '}
          {t(
            'recovery.subtitleSuffix',
            ' exists, you will receive a link with recovery instructions.'
          )}
        </div>
      </div>

      <TextWithLink
        text={t('recovery.notReceived', 'Have not received an email?')}
        linkLabel={t('recovery.resend', 'RESEND')}
        linkUrl={ROUTES.AUTH.LOGIN}
      />
    </div>
  );
};

interface AuthenticateProps {
  setStep: (step: LoginStep) => void;
  title: string;
  subtitle: React.ReactNode;
  showTextWithLink?: boolean;
  onSuccess?: () => void;
}

const Authenticate = ({
  setStep,
  title,
  subtitle,
  showTextWithLink = true,
  onSuccess,
}: AuthenticateProps) => {
  const { t } = useTranslation(['auth']);
  const router = useRouter();
  const [otpValue, setOtpValue] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Reset error state when component mounts (e.g., when switching to backup step)
  useEffect(() => {
    setOtpError(null);
    setHasError(false);
    setAttemptsLeft(3);
    setOtpValue('');
    setIsVerifying(false);
  }, [title]);

  const createOtpSchema = () =>
    z.object({
      otp: z
        .string()
        .length(
          OTP_LENGTH,
          t('verify.errors.otpLength', 'Code must be 6 digits')
        )
        .regex(
          REGEX_ONLY_DIGITS,
          t('verify.errors.otpDigits', 'Code must contain only digits')
        ),
    });

  const schema = createOtpSchema();

  type AuthenticateFormValues = z.infer<typeof schema>;

  const defaultValues: AuthenticateFormValues = {
    otp: '',
  } as AuthenticateFormValues;

  const form = useAuthenticateForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }: { value: AuthenticateFormValues }) => {
      setIsVerifying(true);

      try {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 500);
        });

        const isOtpValid = value.otp === OTP_CODE;

        if (isOtpValid) {
          // OTP matches, proceed to next step
          setOtpError(null);
          setHasError(false);
          setIsVerifying(false);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push(ROUTES.RATINGS.PROJECTS);
          }
        } else {
          // OTP doesn't match
          const newAttempts = attemptsLeft - 1;
          setAttemptsLeft(newAttempts);
          setHasError(true);
          setIsVerifying(false);

          if (newAttempts > 0) {
            const errorMessage = t(
              'recovery.authenticate.error',
              "Incorrect code. You have 3 attempts left. If you don't have access to authentication app, try login with backup code or contact support."
            );
            // Replace the number in the error message with the actual attempts left
            setOtpError(errorMessage.replace('3', newAttempts.toString()));
          } else {
            setOtpError(
              t(
                'recovery.authenticate.error',
                "Incorrect code. You have 3 attempts left. If you don't have access to authentication app, try login with backup code or contact support."
              ).replace('3 attempts left', 'No attempts left')
            );
          }

          // Reset OTP input
          form.setFieldValue('otp', '');
          setOtpValue('');
        }
      } catch (err) {
        setIsVerifying(false);
        setHasError(true);
        setOtpError(err instanceof Error ? err.message : 'Verification failed');
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit();
  };

  const handleValueChange = (value: string) => {
    setOtpValue(value);
    // Clear error when user starts typing
    if (hasError && value.length > 0) {
      setHasError(false);
      setOtpError(null);
    }
  };

  return (
    <>
      <div css={styles.authContainer}>
        <div css={styles.heading}>
          <FormHeader title={title}>{subtitle}</FormHeader>
        </div>

        <form onSubmit={handleSubmit}>
          <div css={styles.authContent}>
            <form.AppField name="otp">
              {(field) => (
                <field.OTPField
                  onValueChange={handleValueChange}
                  externalError={otpError}
                  externalHasError={hasError}
                />
              )}
            </form.AppField>
            {otpError && <div css={styles.errorMessage}>{otpError}</div>}
            <Core3Button
              variant="primary"
              type="submit"
              disabled={otpValue.length !== OTP_LENGTH || isVerifying}
            >
              {isVerifying
                ? t('recovery.authenticate.verifying', 'VERIFYING...')
                : t('recovery.authenticate.continue', 'CONTINUE')}
            </Core3Button>
            {showTextWithLink &&
              (!hasError ? (
                <TextWithLink
                  text={t(
                    'recovery.authenticate.notReceived',
                    'Have not received a code?'
                  )}
                  linkLabel={t('recovery.authenticate.resend', 'RESEND')}
                  linkUrl={ROUTES.AUTH.LOGIN}
                />
              ) : (
                <TextWithLink
                  text={t(
                    'recovery.authenticate.backup',
                    "Don't have access to authentication app?"
                  )}
                  linkLabel={t(
                    'recovery.authenticate.useBackup',
                    'USE BACKUP CODE'
                  )}
                  onClick={() => setStep(LoginStep.BACKUP)}
                />
              ))}
          </div>
        </form>
      </div>
    </>
  );
};
