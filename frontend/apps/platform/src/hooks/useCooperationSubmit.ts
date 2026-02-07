import { useMutation } from '@tanstack/react-query';
import {
  submitCooperationFormForIndividual,
  submitCooperationFormForOrganization,
  ApiError,
} from '@/lib/api/cooperation';
import type { CooperationFormData } from '@/types/cooperation';

interface SubmitParams {
  formData: CooperationFormData;
  captchaToken: string;
}

export function useCooperationSubmit() {
  const mutation = useMutation({
    mutationFn: async ({ formData, captchaToken }: SubmitParams) => {
      if (formData.role === 'individual') {
        await submitCooperationFormForIndividual(
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
          },
          captchaToken
        );
      } else {
        // Organization
        if (!formData.companyName || !formData.reasonForInterest) {
          throw new ApiError('Missing required fields for organization.');
        }

        await submitCooperationFormForOrganization(
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyName: formData.companyName,
            email: formData.email,
            reasonForInterest: formData.reasonForInterest,
            reasonForInterestComment: formData.reasonForInterestComment || null,
          },
          captchaToken
        );
      }
    },
    retry: false, // Don't retry on failure
  });

  // Prettify error message
  const getErrorMessage = (): string | null => {
    if (!mutation.error) return null;

    if (mutation.error instanceof ApiError) {
      return mutation.error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  };

  return {
    submit: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: getErrorMessage(),
    reset: mutation.reset,
  };
}
