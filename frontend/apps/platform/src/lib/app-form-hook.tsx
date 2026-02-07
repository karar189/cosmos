/** @jsxImportSource @emotion/react */
'use client';

import { createFormHook } from '@tanstack/react-form';
import { formContext, fieldContext } from './form-context';
import { TextField } from '@/components/forms/TextField';
import { OTPField } from '@/components/forms/OTPField';
import FormInput from '@/components/forms/FormInput';

/**
 * Common form hook for the application with all pre-bound field components registered.
 * This hook provides form composition with TextField, OTPField, and FormInput components available.
 */
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    OTPField,
    FormInput,
  },
  formComponents: {},
});

export { useAppForm };
