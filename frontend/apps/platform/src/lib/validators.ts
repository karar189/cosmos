import { z } from 'zod';

// Comprehensive Cooperation Form Schema
export const cooperationFormSchema = z
  .object({
    role: z.enum(['individual', 'organization'], {
      required_error: 'Role is required',
    }),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters'),
    companyName: z.string().optional(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    reasonForInterest: z.string().optional(),
    reasonForInterestComment: z.string().optional(),
    agreeToTerms: z.boolean({
      required_error: 'You must agree to the terms to continue',
    }),
  })
  .superRefine((data, ctx) => {
    // Conditional validation for organization role
    if (data.role === 'organization') {
      if (!data.companyName || data.companyName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company is required',
          path: ['companyName'],
        });
      }
      if (!data.reasonForInterest) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select a reason',
          path: ['reasonForInterest'],
        });
      }
    }

    // Validate reasonForInterestComment length if provided
    if (data.reasonForInterestComment && data.reasonForInterestComment.length > 0) {
      if (data.reasonForInterestComment.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide at least 10 characters',
          path: ['reasonForInterestComment'],
        });
      }
    }

    // Validate agreeToTerms is true
    if (!data.agreeToTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'You must agree to the terms to continue',
        path: ['agreeToTerms'],
      });
    }
  });

export type CooperationFormData = z.infer<typeof cooperationFormSchema>;

