import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/app-form-hook';
import { z } from 'zod';
import useTranslation from './useTranslation';
import { useEffect, useState } from 'react';
import { OTP_LENGTH, REGEX_ONLY_DIGITS } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import bcrypt from 'bcryptjs';
import { OTP_CODE } from '@/constants/externalLinks';

export type UseLoginFormParams = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onMutate?: () => void;
};

export type UseAuthenticateFormParams = {
  onSuccess?: () => void;
  title?: string;
};

const createLoginSchema = (t: (key: string, fallback: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, t('login.emailRequired', 'Email is required'))
      .email(t('login.emailInvalid', 'Invalid email address')),
    password: z
      .string()
      .min(8, t('login.passwordMin', 'Password must be at least 8 characters')),
  });

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export const useLoginForm = ({
  onSuccess,
  onError,
  onMutate,
}: UseLoginFormParams) => {
  const { t } = useTranslation(['auth']);

  const schema = createLoginSchema(t);

  const defaultValues: LoginFormValues = {
    email: '',
    password: '',
  } as LoginFormValues;

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        onMutate?.();

        // TODO: Replace with actual API call
        // For now, check credentials from localStorage
        const storedEmail = localStorage.getItem('signupEmail');
        const hashedPassword = localStorage.getItem('password');

        if (
          !storedEmail ||
          !hashedPassword ||
          storedEmail !== value.email ||
          !(await bcrypt.compare(value.password, hashedPassword))
        ) {
          onError?.('Invalid credentials. Please try again.');
          console.error('Invalid credentials. Please try again.');
          return;
        }

        // TODO: Handle account status checks
        // - Check if account is active/verified
        // - If account is not verified, redirect to verification page
        // - If account is suspended, show error: "Account is suspended. Please contact support."

        // TODO: Handle successful login with API call to fetch user data
        // For now, use mock data from localStorage or set defaults
        // In production, this should fetch user profile from API
        
        // Check if user data exists in localStorage
        const storedFirstName = localStorage.getItem('firstName');
        const storedLastName = localStorage.getItem('lastName');
        const storedAccountType = localStorage.getItem('accountType');
        
        // If user data not in localStorage (e.g., different device/browser),
        // set mock data. In production, this would fetch from API.
        if (!storedFirstName || !storedLastName) {
          const emailName = value.email.split('@')[0];
          localStorage.setItem('firstName', emailName.charAt(0).toUpperCase() + emailName.slice(1));
          localStorage.setItem('lastName', 'User');
        }
        
        if (!storedAccountType) {
          localStorage.setItem('accountType', 'investor'); // Default to investor
        }
        
        // Store the email as userEmail
        localStorage.setItem('userEmail', value.email);
        
        // Set logged in flag
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log('Login successful');
        onSuccess?.();
      } catch (err) {
        // TODO: Handle specific error types
        // - Network errors: "Network error. Please check your connection."
        // - Server errors: "Server error. Please try again later."
        // - Authentication errors: "Invalid credentials. Please try again."
        onError?.(err instanceof Error ? err.message : 'Login failed');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return {
    form,
    handleSubmit,
  };
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

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
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
    // Clear error when user starts typing
    if (hasError && value.length > 0) {
      setHasError(false);
      setOtpError(null);
    }
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
