import { revalidateLogic } from '@tanstack/react-form';
import { z } from 'zod';
import useTranslation from './useTranslation';
import { useAppForm } from '@/lib/app-form-hook';
import { OrganizationStep } from '@/enums/workspaceEnum';

export type UseAccessFormParams = {
  onContinue?: (data: {
    corporateEmail: string;
    fullName: string;
    projectName: string;
    numberOfLicensedProjects?: string;
  }) => void;
  workspaceType?: OrganizationStep;
};

const createAccessFormSchema = (
  t: (key: string, fallback: string) => string,
  workspaceType: OrganizationStep
) =>
  z.object({
    corporateEmail: z
      .string()
      .min(1, t('auth:accessForm.errors.emailRequired', 'Email is required'))
      .email(t('auth:accessForm.errors.emailInvalid', 'Invalid email address')),
    fullName: z
      .string()
      .min(
        1,
        t('auth:accessForm.errors.fullNameRequired', 'Full name is required')
      ),
    projectName: z
      .string()
      .min(
        1,
        workspaceType === OrganizationStep.Project
          ? t(
              'auth:accessForm.errors.projectNameRequired',
              'Project name is required'
            )
          : workspaceType === OrganizationStep.CREATE_EXCHANGE
            ? t(
                'auth:accessForm.errors.exchangeNameRequired',
                'Exchange name is required'
              )
            : t(
                'auth:accessForm.errors.organizationNameRequired',
                'Organization name is required'
              )
      ),
    numberOfLicensedProjects: z.string().optional(),
  });

type AccessFormValues = z.infer<ReturnType<typeof createAccessFormSchema>>;

export const useAccessForm = ({
  onContinue,
  workspaceType = OrganizationStep.Project,
}: UseAccessFormParams) => {
  const { t } = useTranslation(['auth']);

  const schema = createAccessFormSchema(t, workspaceType);

  const defaultValues: AccessFormValues = {
    corporateEmail: '',
    fullName: '',
    projectName: '',
    numberOfLicensedProjects: '',
  } as AccessFormValues;

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      onContinue?.({
        ...value,
        numberOfLicensedProjects: value.numberOfLicensedProjects || undefined,
      });
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
