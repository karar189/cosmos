/** @jsxImportSource @emotion/react */
'use client';

import { InputLabel, InputProps } from '@core3/ui-components';
import { FormControl } from '@mui/material';
import { useFieldContext } from '@/lib/form-context';
import { extractFormFieldError, type FieldInstance } from '@/utils/formUtils';

export interface FormInputProps extends Omit<
  InputProps,
  'value' | 'onChange' | 'error' | 'form' | 'color'
> {
  label: string;
  fullWidth?: boolean;
}

export function FormInput({
  label,
  fullWidth = true,
  ...inputProps
}: FormInputProps) {
  const field = useFieldContext<string>();

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

export default FormInput;
