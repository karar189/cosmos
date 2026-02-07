/** @jsxImportSource @emotion/react */
'use client';

import { z } from 'zod';
import OTPBox, { OTPBoxProps } from '../OTPBox';
import { extractFormFieldError, type FieldInstance } from '@/utils/formUtils';

interface FormOTPBoxProps extends Omit<
  OTPBoxProps,
  'form' | 'fieldName' | 'schema' | 'hasError'
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: {
    setFieldValue: (name: string, value: unknown, ...args: unknown[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Field: (props: any) => React.ReactNode;
  };
  name?: string;
  schema: z.ZodObject<z.ZodRawShape>;
  errorMessages?: {
    length?: string;
    digits?: string;
  };
  onValueChange?: (value: string) => void;
  /**
   * Additional error state from form submission or custom validation
   * This will be combined with form field errors
   */
  externalError?: string | null;
  /**
   * Whether to show error state based on external error
   */
  externalHasError?: boolean;
}

/**
 * FormOTPBox is a wrapper component that connects OTPBox to TanStack Form.
 * It handles field state, validation errors, and value changes automatically.
 *
 * @example
 * ```tsx
 * <FormOTPBox
 *   form={form}
 *   name="otp"
 *   schema={otpSchema}
 *   errorMessages={{
 *     length: 'Code must be 6 digits',
 *     digits: 'Code must contain only digits',
 *   }}
 *   onValueChange={handleValueChange}
 *   externalError={otpError}
 *   externalHasError={hasError}
 * />
 * ```
 */
const FormOTPBox = ({
  form,
  name = 'otp',
  schema,
  errorMessages,
  onValueChange,
  externalHasError = false,
  ...otpBoxProps
}: FormOTPBoxProps) => {
  return (
    <form.Field name={name}>
      {(field: unknown) => {
        const typedField = field as FieldInstance;
        const formError = extractFormFieldError(typedField);

        const hasError = externalHasError || !!formError;

        return (
          <OTPBox
            form={form as Parameters<typeof OTPBox>[0]['form']}
            fieldName={name}
            schema={schema}
            errorMessages={errorMessages}
            onValueChange={onValueChange}
            hasError={hasError}
            {...otpBoxProps}
          />
        );
      }}
    </form.Field>
  );
};

export default FormOTPBox;
