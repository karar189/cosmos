import { useForm } from '@tanstack/react-form';
import { revalidateLogic } from '@tanstack/react-form';
import { z } from 'zod';
import { useState } from 'react';
import useTranslation from './useTranslation';
import { OTP_LENGTH, REGEX_ONLY_DIGITS } from '@/utils/validations';
import { OTP_CODE } from '@/constants/externalLinks';

export type UseVerifyFormParams = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  initialAttempts?: number;
};

const createOtpSchema = (t: (key: string, fallback: string) => string) =>
  z.object({
    otp: z
      .string()
      .length(OTP_LENGTH, t('verify.errors.otpLength', 'Code must be 6 digits'))
      .regex(
        REGEX_ONLY_DIGITS,
        t('verify.errors.otpDigits', 'Code must contain only digits')
      ),
  });

type VerifyFormValues = z.infer<ReturnType<typeof createOtpSchema>>;

export const useVerifyForm = ({
  onSuccess,
  onError,
  initialAttempts = 3,
}: UseVerifyFormParams) => {
  const { t } = useTranslation(['auth']);

  const schema = createOtpSchema(t);

  const [otpValue, setOtpValue] = useState<string>(OTP_CODE);
  const [attemptsLeft, setAttemptsLeft] = useState(initialAttempts);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const defaultValues: VerifyFormValues = {
    otp: '',
  } as VerifyFormValues;

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      setIsVerifying(true);

      try {
        // TODO: Replace with actual API call
        // For now, validate OTP against the correct code from constants
        const isValidOtp = value.otp === OTP_CODE;

        if (isValidOtp) {
          // OTP is valid (mocked), proceed to next step
          setOtpError(null);
          setHasError(false);
          setIsVerifying(false);
          onSuccess?.();
        } else {
          // OTP format is invalid
          const newAttempts = attemptsLeft - 1;
          setAttemptsLeft(newAttempts);
          setHasError(true);
          setIsVerifying(false);

          if (newAttempts > 0) {
            setOtpError(
              `Incorrect code. You have ${newAttempts} attempt${newAttempts !== 1 ? 's' : ''} left. If you don't have access to authentication app, try login with backup code or contact support.`
            );
          } else {
            setOtpError(
              `Incorrect code. No attempts left. If you don't have access to authentication app, try login with backup code or contact support.`
            );
          }

          // Reset OTP input
          form.setFieldValue('otp', '');
          setOtpValue('');

          onError?.('OTP verification failed');
        }
      } catch (err) {
        setIsVerifying(false);
        setHasError(true);
        setOtpError(err instanceof Error ? err.message : 'Verification failed');
        onError?.(err instanceof Error ? err.message : 'Verification failed');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleResend = () => {
    setOtpValue('');
    form.setFieldValue('otp', '');
    setHasError(false);
    setOtpError(null);
  };

  return {
    form,
    handleSubmit,
    otpValue,
    attemptsLeft,
    otpError,
    hasError,
    isVerifying,
    handleValueChange,
    handleResend,
    schema,
  };
};
