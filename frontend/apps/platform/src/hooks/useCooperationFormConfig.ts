'use client';

import useTranslation from './useTranslation';
import type { FormField } from '@/components/forms/CooperationForm';
import type { CooperationFormData } from '@/types/cooperation';

export interface CooperationFormConfig {
  title: string;
  fields: FormField[];
  defaultValues: CooperationFormData;
  submitButtonText: string;
  cancelButtonText: string;
}

/**
 * useCooperationFormConfig Hook
 *
 * Hook to get translated cooperation form configuration.
 * Returns all form fields with translated labels and options.
 *
 * @example
 * ```tsx
 * const { title, fields, defaultValues } = useCooperationFormConfig();
 * <CooperationForm title={title} fields={fields} defaultValues={defaultValues} />
 * ```
 */
export function useCooperationFormConfig(): CooperationFormConfig {
  const { t } = useTranslation('cooperation');

  const defaultValues: CooperationFormData = {
    role: 'organization',
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    reasonForInterest: '',
    reasonForInterestComment: '',
    agreeToTerms: false,
  };

  const fields: FormField[] = [
    {
      key: 'role',
      label: t('form.fields.role.label', 'Role'),
      type: 'radio',
      fullWidth: true,
      options: [
        { 
          value: 'organization', 
          label: t('form.fields.role.options.organization', 'Organization') 
        },
        { 
          value: 'individual', 
          label: t('form.fields.role.options.individual', 'Individual') 
        },
      ],
    },
    {
      key: 'firstName',
      label: t('form.fields.firstName.label', 'First Name'),
      type: 'text',
    },
    {
      key: 'lastName',
      label: t('form.fields.lastName.label', 'Last Name'),
      type: 'text',
    },
    {
      key: 'companyName',
      label: t('form.fields.companyName.label', 'Company'),
      type: 'text',
      condition: (values) => values.role === 'organization',
    },
    {
      key: 'email',
      label: t('form.fields.email.label', 'Email'),
      type: 'text',
      fullWidth: (values) => values.role === 'individual',
    },
    {
      key: 'reasonForInterest',
      label: t('form.fields.reasonForInterest.label', 'Reason for Interest'),
      type: 'select',
      fullWidth: true,
      options: [], // Will be populated dynamically from API
      condition: (values) => values.role === 'organization',
    },
    {
      key: 'reasonForInterestComment',
      label: t('form.fields.reasonForInterestComment.label', 'Additional Information (Optional)'),
      type: 'textarea',
      rows: 4,
      fullWidth: true,
      placeholder: t('form.fields.reasonForInterestComment.placeholder', 'Tell us more about your interest...'),
      condition: (values) => values.role === 'organization' && !!values.reasonForInterest,
    },
    {
      key: 'agreeToTerms',
      label: t(
        'form.fields.agreeToTerms.label',
        'I agree to my data being used for communication, marketing purposes and project updates.'
      ),
      type: 'checkbox',
      fullWidth: true,
    },
  ];

  return {
    title: t('form.title', "Let's build the future of Web3 trust together."),
    fields,
    defaultValues,
    submitButtonText: t('form.buttons.submit', 'Send Request'),
    cancelButtonText: t('form.buttons.cancel', 'Cancel'),
  };
}

