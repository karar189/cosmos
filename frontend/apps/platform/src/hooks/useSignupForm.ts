import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/app-form-hook';
import { z } from 'zod';
import useTranslation from './useTranslation';

export type UseSignupFormParams = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onMutate?: () => void;
};

const createSignupSchema = (t: (key: string, fallback: string) => string) =>
  z.object({
    email: z
      .string()
      .email(t('signupStart.errors.emailInvalid', 'Invalid email address')),
  });

type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>;

export const useSignupForm = ({
  onSuccess,
  onError,
  onMutate,
}: UseSignupFormParams) => {
  const { t } = useTranslation(['auth']);

  const schema = createSignupSchema(t);

  const defaultValues: SignupFormValues = {
    email: '',
  } as SignupFormValues;

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
        // For now, directly save to localStorage
        localStorage.setItem('signupEmail', value.email);

        onSuccess?.();
      } catch (err) {
        onError?.(err instanceof Error ? err.message : 'Signup failed');
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
