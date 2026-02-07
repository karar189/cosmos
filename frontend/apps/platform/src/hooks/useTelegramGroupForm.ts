import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/app-form-hook';
import { z } from 'zod';
import useTranslation from './useTranslation';

// telegram group form params
export type UseTelegramGroupFormParams = {
  onSubmit?: (data: { telegramLink: string }) => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

// zod schema for telegram group form
const createTelegramGroupSchema = (
  t: (key: string, fallback: string) => string
) =>
  z.object({
    telegramLink: z
      .string()
      .url(t('auth:telegramGroupForm.errors.invalidUrl', 'Invalid URL'))
      .min(
        1,
        t(
          'auth:telegramGroupForm.errors.telegramLinkRequired',
          'Telegram link is required'
        )
      ),
  });

// telegram group form values
type TelegramGroupFormValues = z.infer<
  ReturnType<typeof createTelegramGroupSchema>
>;

// hook to use telegram group form
export const useTelegramGroupForm = ({
  onSubmit,
  onSuccess,
  onError,
}: UseTelegramGroupFormParams) => {
  const { t } = useTranslation(['auth']);

  const schema = createTelegramGroupSchema(t); // telegram group form schema with translations

  const defaultValues: TelegramGroupFormValues = {
    telegramLink: '',
  } as TelegramGroupFormValues;

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        console.log('Form submitted:', value);
        onSubmit?.(value);
        onSuccess?.();
      } catch (err) {
        onError?.(
          err instanceof Error ? err.message : 'Form submission failed'
        );
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
