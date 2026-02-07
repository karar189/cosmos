import { useForm } from '@tanstack/react-form';
import { revalidateLogic } from '@tanstack/react-form';
import { z } from 'zod';
import useTranslation from './useTranslation';
import { useEffect, useState } from 'react';
import { OTP_LENGTH, REGEX_ONLY_DIGITS } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

const AUTHENTICATION_OTP = '123456';

export type UseAuthenticateFormParams = {
  onSuccess?: () => void;
  title?: string;
};

export const useAuthenticateForm = ({
  onSuccess,
  title,
}: UseAuthenticateFormParams = {}) => {
  const router = useRouter();
  const { t } = useTranslation(['auth']);
  
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

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      setIsVerifying(true);

      try {
        // TODO: Replace with actual API call
        const isOtpValid = value.otp === AUTHENTICATION_OTP;

        if (isOtpValid) {
          // OTP matches, proceed to next step
          setOtpError(null);
          setHasError(false);
          setIsVerifying(false);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push(ROUTES.WORKSPACE.ROOT);
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
    setHasError(false);
    setOtpError(null);
  };

  return {
    form,
    schema,
    otpValue,
    attemptsLeft,
    otpError,
    hasError,
    isVerifying,
    handleSubmit,
    handleValueChange,
  };
};

