/**
 * Utility functions for working with TanStack Form
 */

type FieldInstance = {
  state: {
    value: unknown;
    meta: {
      errors?: ReadonlyArray<unknown>;
    };
  };
  handleChange: (updater: unknown) => void;
  handleBlur: () => void;
};

/**
 * Extracts error message from TanStack Form field error object.
 * Handles different error formats: string, object with message property, or other types.
 *
 * @param field - The TanStack Form field instance
 * @returns The extracted error message as a string, or undefined if no error
 *
 * @example
 * ```tsx
 * <form.Field name="email">
 *   {(field) => {
 *     const error = extractFormFieldError(field as FieldInstance);
 *     return <Input error={error} />;
 *   }}
 * </form.Field>
 * ```
 */
export const extractFormFieldError = (
  field: FieldInstance
): string | undefined => {
  const errorObj = field.state.meta.errors?.[0];

  if (!errorObj) {
    return undefined;
  }

  if (typeof errorObj === 'string') {
    return errorObj;
  }

  if (
    typeof errorObj === 'object' &&
    errorObj !== null &&
    'message' in errorObj
  ) {
    return String((errorObj as { message: unknown }).message);
  }

  return String(errorObj);
};

export type { FieldInstance };
