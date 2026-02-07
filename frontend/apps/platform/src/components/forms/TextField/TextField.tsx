/** @jsxImportSource @emotion/react */
'use client';

import { InputLabel, InputProps } from '@core3/ui-components';
import { FormControl } from '@mui/material';
import { useFieldContext } from '@/lib/form-context';
import { extractFormFieldError, type FieldInstance } from '@/utils/formUtils';

export interface TextFieldProps extends Omit<
  InputProps,
  'value' | 'onChange' | 'error' | 'form' | 'color'
> {
  /**
   * Label text for the input field
   */
  label: string;

  /**
   * Whether the form control should take full width
   */
  fullWidth?: boolean;
}

/**
 * Pre-bound text field component that uses form context.
 * Must be used within a form created with createFormHook that includes this component.
 */
export function TextField({
  label,
  fullWidth = true,
  ...inputProps
}: TextFieldProps) {
  // Get field from context - this is the key part of the composition pattern
  const field = useFieldContext<string>();

  // Extract form field error
  const error = extractFormFieldError(field as FieldInstance);

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel
        label={label}
        value={String(field.state.value ?? '')}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          field.handleChange(event.target.value)
        }
        onBlur={field.handleBlur}
        error={error}
        {...inputProps}
      />
    </FormControl>
  );
}
