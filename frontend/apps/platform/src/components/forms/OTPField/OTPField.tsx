/** @jsxImportSource @emotion/react */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useFieldContext } from '@/lib/form-context';
import * as styles from '../OTPBox/OTPBox.styles';
import { OTP_LENGTH, REGEX_SINGLE_DIGIT } from '@/utils/validations';
import { extractFormFieldError } from '@/utils/formUtils';

export interface OTPFieldProps {
  /**
   * Length of the OTP code. Defaults to 6.
   */
  length?: number;

  onValueChange?: (value: string) => void;

  /**
   * Callback fired when all OTP digits are filled
   */
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
  externalError?: string | null;
  externalHasError?: boolean;
}

export function OTPField({
  length = OTP_LENGTH,
  onValueChange,
  onComplete,
  autoFocus = true,
  className,
  externalHasError = false,
}: OTPFieldProps) {
  // Get field from context - this is the key part of the composition pattern
  const field = useFieldContext();

  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Extract form field error
  const formError = extractFormFieldError(field);
  const currentValue = String(field.state.value || '');
  const isComplete = currentValue.length === length;
  const hasError = externalHasError || (isComplete && !!formError);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  // Sync OTP state with form field value (for external resets)
  useEffect(() => {
    const formValue = field.state.value || '';
    const currentOtpString = otp.join('');

    if (formValue === '' && currentOtpString !== '') {
      setOtp(Array(length).fill(''));
    } else if (
      formValue !== '' &&
      formValue !== currentOtpString &&
      (formValue as string).length === length
    ) {
      setOtp((formValue as string).split('').slice(0, length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.state.value, length]);

  const handleChange = (index: number, value: string) => {
    const newValue = value.slice(-1);

    if (newValue && !REGEX_SINGLE_DIGIT.test(newValue)) return;

    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);

    const otpString = newOtp.join('');
    field.handleChange(otpString);

    onValueChange?.(otpString);

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
        field.handleChange(otpString);
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
    field.handleChange(otpString);
    onValueChange?.(otpString);

    if (otpString.length === length && !newOtp.some((digit) => !digit)) {
      onComplete?.(otpString);
    }

    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
  };

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
}
