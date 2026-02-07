/** @jsxImportSource @emotion/react */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import * as styles from './OTPBox.styles';
import {
  OTP_LENGTH,
  REGEX_ONLY_DIGITS,
  REGEX_SINGLE_DIGIT,
} from '@/utils/validations';

// Type for TanStack Form instance - using a flexible type that works with TanStack Form's generics
// This allows the component to accept any TanStack Form instance while maintaining type safety
// Using a structural type that matches the required methods
interface FormInstance {
  setFieldValue: (name: string, value: string) => void;
  Field: (props: {
    name: string;
    children: (field: FieldApi) => React.ReactNode;
  }) => React.ReactNode;
  getFieldValue?: (name: string) => string | undefined;
  reset?: () => void;
}

// Type for field API from TanStack Form
// Using a flexible type that matches TanStack Form's FieldApi structure
type FieldApi = {
  state: {
    value: string | undefined;
    meta: {
      errors: ReadonlyArray<string | { message?: string } | undefined>;
    };
  };
};

export interface OTPBoxProps {
  /**
   * Optional form instance. If provided, the component will use this form.
   * If not provided, the component will create its own form instance.
   */
  form?: FormInstance;

  /**
   * Field name for the OTP in the form. Defaults to 'otp'.
   */
  fieldName?: string;

  /**
   * Length of the OTP code. Defaults to 6.
   */
  length?: number;

  /**
   * Optional Zod schema for validation. If not provided, a default schema will be used.
   */
  schema?: z.ZodObject<z.ZodRawShape>;

  /**
   * Optional validation error messages
   */
  errorMessages?: {
    length?: string;
    digits?: string;
  };

  /**
   * Callback fired when the OTP value changes
   */
  onValueChange?: (value: string) => void;

  /**
   * Callback fired when all OTP digits are filled
   */
  onComplete?: (value: string) => void;

  /**
   * Whether to auto-focus the first input on mount
   */
  autoFocus?: boolean;

  /**
   * CSS class name for the container
   */
  className?: string;

  /**
   * Whether to show error state (red borders)
   */
  hasError?: boolean;
}

/**
 * Reusable OTP input component with integrated form and validation.
 * Can be used standalone (creates its own form) or integrated with an existing form.
 */
export default function OTPBox({
  form: externalForm,
  fieldName = 'otp',
  length = OTP_LENGTH,
  schema: externalSchema,
  errorMessages,
  onValueChange,
  onComplete,
  autoFocus = true,
  className,
  hasError = false,
}: OTPBoxProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Create default schema if not provided
  const defaultSchema = z.object({
    [fieldName]: z
      .string()
      .length(length, errorMessages?.length || `Code must be ${length} digits`)
      .regex(
        REGEX_ONLY_DIGITS,
        errorMessages?.digits || 'Code must contain only digits'
      ),
  });

  const validationSchema = externalSchema || defaultSchema;

  // Create internal form if no external form is provided
  const internalForm = useForm({
    defaultValues: {
      [fieldName]: '',
    },
    validators: {
      onChange: validationSchema,
    },
  });

  // Type assertion needed because TanStack Form's generic types are complex
  // but we know the form instance has the methods we need
  const form = (externalForm as FormInstance) || internalForm;

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, value: string) => {
    const newValue = value.slice(-1);

    if (newValue && !REGEX_SINGLE_DIGIT.test(newValue)) return;

    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);

    const otpString = newOtp.join('');
    form.setFieldValue(fieldName, otpString);

    // Call onValueChange callback
    onValueChange?.(otpString);

    // Call onComplete callback if all digits are filled
    if (otpString.length === length && !newOtp.some((digit) => !digit)) {
      onComplete?.(otpString);
    }

    // Auto-focus next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);

        const otpString = newOtp.join('');
        form.setFieldValue(fieldName, otpString);
        onValueChange?.(otpString);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (REGEX_SINGLE_DIGIT.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);

    const otpString = newOtp.join('');
    form.setFieldValue(fieldName, otpString);
    onValueChange?.(otpString);

    // Call onComplete if all digits are filled
    if (otpString.length === length && !newOtp.some((digit) => !digit)) {
      onComplete?.(otpString);
    }

    // Focus next empty input or last input
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <form.Field name={fieldName}>
      {(field: FieldApi) => {
        // Sync OTP state with form field value (for external resets)
        const formValue = field.state.value || '';
        const currentOtpString = otp.join('');

        if (formValue === '' && currentOtpString !== '') {
          // Form was reset externally, sync internal state
          setOtp(Array(length).fill(''));
        } else if (
          formValue !== '' &&
          formValue !== currentOtpString &&
          formValue.length === length
        ) {
          // Form value was set externally (e.g., paste), sync internal state
          setOtp(formValue.split('').slice(0, length));
        }

        return (
          <div css={styles.container} className={className}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                css={[styles.input, hasError && styles.inputError]}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
        );
      }}
    </form.Field>
  );
}

/**
 * Hook to create an OTP form with schema.
 * Useful when you want to create a form instance separately.
 */
export function useOTPForm({
  fieldName = 'otp',
  length = OTP_LENGTH,
  schema: externalSchema,
  errorMessages,
}: {
  fieldName?: string;
  length?: number;
  schema?: z.ZodObject<z.ZodRawShape>;
  errorMessages?: {
    length?: string;
    digits?: string;
  };
} = {}) {
  const defaultSchema = z.object({
    [fieldName]: z
      .string()
      .length(length, errorMessages?.length || `Code must be ${length} digits`)
      .regex(
        REGEX_ONLY_DIGITS,
        errorMessages?.digits || 'Code must contain only digits'
      ),
  });

  const validationSchema = externalSchema || defaultSchema;

  const form = useForm({
    defaultValues: {
      [fieldName]: '',
    },
    validators: {
      onChange: validationSchema,
    },
  });

  return { form, schema: validationSchema };
}
