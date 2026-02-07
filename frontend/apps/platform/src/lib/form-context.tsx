/** @jsxImportSource @emotion/react */
'use client';

import { createFormHookContexts } from '@tanstack/react-form';

// Create form and field contexts
export const { formContext, fieldContext, useFieldContext } =
  createFormHookContexts();
