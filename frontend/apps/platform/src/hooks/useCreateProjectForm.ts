import { revalidateLogic } from '@tanstack/react-form';
import { z } from 'zod';
import useTranslation from './useTranslation';
import { useAppForm } from '@/lib/app-form-hook';
import { OrganizationStep } from '@/enums/workspaceEnum';

export type UseCreateProjectFormParams = {
  onContinue?: (data: {
    corporateEmail: string;
    fullName: string;
    projectName: string;
    numberOfLicensedProjects?: string;
  }) => void;
  workspaceType?: OrganizationStep;
};

const createCreateProjectSchema = (
  t: (key: string, fallback: string) => string,
  workspaceType: OrganizationStep
) => {
  let projectNameErrorMessage: string;
  if (workspaceType === OrganizationStep.Project) {
    projectNameErrorMessage = t(
      'auth:accessForm.errors.projectNameRequired',
      'Project name is required'
    );
  } else if (workspaceType === OrganizationStep.CREATE_EXCHANGE) {
    projectNameErrorMessage = t(
      'auth:accessForm.errors.exchangeNameRequired',
      'Exchange name is required'
    );
  } else {
    projectNameErrorMessage = t(
      'auth:accessForm.errors.organizationNameRequired',
      'Organization name is required'
    );
  }

  return z.object({
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
    projectName: z.string().min(1, projectNameErrorMessage),
    numberOfLicensedProjects: z.string().optional(),
  });
};

type CreateProjectFormValues = z.infer<
  ReturnType<typeof createCreateProjectSchema>
>;

export const useCreateProjectForm = ({
  onContinue,
  workspaceType = OrganizationStep.Project,
}: UseCreateProjectFormParams) => {
  const { t } = useTranslation(['auth']);

  const schema = createCreateProjectSchema(t, workspaceType);

  const defaultValues: CreateProjectFormValues = {
    corporateEmail: '',
    fullName: '',
    projectName: '',
    numberOfLicensedProjects: '',
  } as CreateProjectFormValues;

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      console.log('value', value);
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
