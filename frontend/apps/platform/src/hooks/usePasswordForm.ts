import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/app-form-hook';
import { z } from 'zod';
import useTranslation from './useTranslation';
import {
  PASSWORD_MIN_LENGTH,
  REGEX_NUMBER,
  REGEX_SYMBOL,
} from '@/utils/validations';
import bcrypt from 'bcryptjs';

export type UsePasswordFormParams = {
  onSubmit: (password: string) => void | Promise<void>;
};

const createPasswordSchema = (t: (key: string, fallback: string) => string) =>
  z.object({
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        t(
          'createPassword.errors.passwordMin',
          'Password must be at least 8 characters'
        )
      )
      .regex(
        REGEX_NUMBER,
        t(
          'createPassword.errors.passwordNumber',
          'Password must contain at least 1 number'
        )
      )
      .regex(
        REGEX_SYMBOL,
        t(
          'createPassword.errors.passwordSymbol',
          'Password must contain at least 1 symbol'
        )
      ),
  });

type PasswordFormValues = z.infer<ReturnType<typeof createPasswordSchema>>;

export const usePasswordForm = ({ onSubmit }: UsePasswordFormParams) => {
  const { t } = useTranslation(['auth']);

  const schema = createPasswordSchema(t);

  const defaultValues: PasswordFormValues = {
    password: '',
  } as PasswordFormValues;

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(value.password, salt);

      localStorage.setItem('password', hash);
      await onSubmit(hash);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const isPasswordValid = (password: string): boolean => {
    const result = schema.shape.password.safeParse(password);
    return result.success;
  };

  return {
    form,
    handleSubmit,
    schema,
    isPasswordValid,
  };
};
