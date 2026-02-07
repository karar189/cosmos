/** @jsxImportSource @emotion/react */
'use client';

import { useForm } from '@tanstack/react-form';
import { useEffect, useRef, useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import * as styles from './CooperationForm.styles';
import { Core3Button } from '@core3/ui-components';
import { HCAPTCHA_SITE_KEY } from '@/lib/constants';
import { cooperationFormSchema } from '@/lib/validators';
import type { CooperationFormData } from '@/types/cooperation';

type HCaptchaInstance = typeof HCaptcha.prototype;

export type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'info';

export interface SelectOption {
  value: string | number;
  /**
   * Label text. Use **text** to render portions in bold.
   * Example: 'I am a **regulator** and I want **early access**'
   */
  label: string;
}

export interface FormField {
  key: keyof CooperationFormData;
  label: string | React.ReactNode;
  type: FieldType;
  placeholder?: string;
  options?: SelectOption[];
  rows?: number;
  fullWidth?: boolean | ((values: Partial<CooperationFormData>) => boolean);
  condition?: (values: Partial<CooperationFormData>) => boolean;
}

export interface DynamicFormProps {
  title?: string;
  fields: FormField[];
  defaultValues: CooperationFormData;
  onSubmit: (data: CooperationFormData) => Promise<void> | void;
  onClose: () => void;
  submitButtonText?: string;
  submitButtonLoadingText?: string;
  cancelButtonText?: string;
  infoMessage?: (values: Partial<CooperationFormData>) => string | null;
  captchaRef?: React.RefObject<HCaptchaInstance>;
  captchaToken?: string | null;
  onCaptchaChange?: (token: string | null) => void;
  submissionError?: string | null;
  isSubmitting?: boolean;
  optionsLoading?: boolean;
}

/**
 * Renders a label with Markdown-style bold syntax (**text**).
 * Example: 'I am a **regulator**' → 'I am a <strong>regulator</strong>'
 */
const renderLabelWithBold = (label: string) => {
  const parts = label.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return <strong key={index}>{boldText}</strong>;
        }
        return (
          <span key={index} style={{ whiteSpace: 'pre-wrap' }}>
            {part}
          </span>
        );
      })}
    </>
  );
};

const Check = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
  </svg>
);

export default function CooperationForm({
  title = 'Form',
  fields,
  defaultValues,
  onSubmit,
  onClose,
  submitButtonText = 'Send Request',
  cancelButtonText = 'Cancel',
  infoMessage,
  captchaRef,
  captchaToken,
  onCaptchaChange,
  submissionError,
  isSubmitting: externalIsSubmitting,
  optionsLoading,
}: DynamicFormProps) {
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
    validators: {
      onChange: cooperationFormSchema,
    },
  });

  const isSubmitting = externalIsSubmitting ?? form.state.isSubmitting;

  // Focus first field when form opens
  useEffect(() => {
    const timer = setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Update submit status based on isSubmitting
  useEffect(() => {
    if (isSubmitting) {
      setSubmitStatus('loading');
    } else if (submitStatus === 'loading' && !isSubmitting && !submissionError) {
      setSubmitStatus('success');
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    } else if (submissionError && submitStatus === 'loading') {
      setSubmitStatus('idle');
    }
  }, [isSubmitting, submissionError, submitStatus, onClose]);

  const renderField = (field: FormField, index: number) => {
    const fieldId = `form-field-${String(field.key)}`;
    const isFirstField = index === 0;
    const isRequired = true; // All fields shown are effectively required based on Zod schema

    return (
      <form.Field
        key={String(field.key)}
        name={field.key}
      >
        {(fieldApi) => {
          // Extract error message from TanStack Form error object
          const errorObj = fieldApi.state.meta.errors?.[0];
          let error: string | undefined;
          if (errorObj) {
            if (typeof errorObj === 'string') {
              error = errorObj;
            } else if (typeof errorObj === 'object' && errorObj !== null && 'message' in errorObj) {
              error = String((errorObj as { message: unknown }).message);
            } else {
              error = String(errorObj);
            }
          }
          const value = fieldApi.state.value;

          switch (field.type) {
            case 'select':
              return (
                <div css={styles.fieldWrapper}>
                  <label htmlFor={fieldId} css={styles.fieldLabel}>
                    {field.label} {isRequired && '*'}
                  </label>
                  <FormControl fullWidth error={!!error} disabled={isSubmitting}>
                    <Select
                      id={fieldId}
                      value={value || ''}
                      onChange={(e) => fieldApi.handleChange(e.target.value)}
                      onBlur={fieldApi.handleBlur}
                      displayEmpty
                      inputRef={isFirstField ? firstFieldRef : undefined}
                      inputProps={{
                        'aria-required': isRequired,
                      }}
                      onClose={() => {
                        setTimeout(() => {
                          (document.activeElement as HTMLElement)?.blur();
                        }, 0);
                      }}
                      MenuProps={{
                        sx: styles.selectMenuStyles,
                      }}
                    >
                      {field.options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {renderLabelWithBold(option.label)}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error}</FormHelperText>}
                  </FormControl>
                </div>
              );

            case 'radio':
              return (
                <FormControl error={!!error} disabled={isSubmitting}>
                  <RadioGroup
                    value={value || ''}
                    onChange={(e) => fieldApi.handleChange(e.target.value)}
                    css={styles.radioGroup}
                    aria-required={isRequired}
                  >
                    {field.options?.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                  {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
              );

            case 'textarea':
              return (
                <TextField
                  id={fieldId}
                  value={value || ''}
                  onChange={(e) => fieldApi.handleChange(e.target.value)}
                  onBlur={fieldApi.handleBlur}
                  placeholder={field.placeholder}
                  multiline
                  rows={field.rows || 4}
                  error={!!error}
                  helperText={error}
                  fullWidth
                  disabled={isSubmitting}
                  inputRef={isFirstField ? firstFieldRef : undefined}
                  inputProps={{
                    'aria-required': isRequired,
                  }}
                />
              );

            case 'checkbox':
              return (
                <FormControl error={!!error} disabled={isSubmitting} css={styles.checkboxWrapper}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!value}
                        onChange={(e) => fieldApi.handleChange(e.target.checked)}
                        css={error ? styles.checkboxError : undefined}
                      />
                    }
                    label={field.label}
                  />
                  {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
              );

            default:
              // text
              return (
                <div css={styles.fieldWrapper}>
                  <label htmlFor={fieldId} css={styles.fieldLabel}>
                    {field.label} {isRequired && '*'}
                  </label>
                  <TextField
                    id={fieldId}
                    value={value || ''}
                    onChange={(e) => fieldApi.handleChange(e.target.value)}
                    onBlur={fieldApi.handleBlur}
                    type="text"
                    placeholder={field.placeholder}
                    error={!!error}
                    helperText={error}
                    fullWidth
                    disabled={isSubmitting}
                    inputRef={isFirstField ? firstFieldRef : undefined}
                    inputProps={{
                      'aria-required': isRequired,
                    }}
                  />
                </div>
              );
          }
        }}
      </form.Field>
    );
  };

  const renderFieldWithGridColumn = (field: FormField, index: number) => {
    const fieldElement = renderField(field, index);
    const formValues = form.state.values;

    const isFullWidth =
      typeof field.fullWidth === 'function' ? field.fullWidth(formValues) : field.fullWidth;

    if (isFullWidth) {
      return (
        <div key={String(field.key)} css={styles.fullWidthField}>
          {fieldElement}
        </div>
      );
    }

    return <div key={String(field.key)}>{fieldElement}</div>;
  };

  const formValues = form.state.values;
  const visibleFields = fields.filter((field) => {
    if (!field.condition) return true;
    return field.condition(formValues);
  });

  const currentInfoMessage = infoMessage ? infoMessage(formValues) : null;
  const isSubmitDisabled = isSubmitting || !captchaToken || optionsLoading;

  return (
    <form
      css={styles.formStyles}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      aria-label={title || 'Form'}
    >
      {title && <h2 css={styles.titleStyles}>{title}</h2>}

      {currentInfoMessage && <p css={styles.infoMessage}>{currentInfoMessage}</p>}

      {optionsLoading && (
        <div css={styles.loadingContainer}>
          <CircularProgress size={24} />
          <span css={styles.loadingText}>Loading form options...</span>
        </div>
      )}

      {!optionsLoading && (
        <>
          <div css={styles.fieldsGrid}>
            {visibleFields.map((field, index) => renderFieldWithGridColumn(field, index))}
          </div>

          {captchaRef && onCaptchaChange && HCAPTCHA_SITE_KEY && (
            <div css={styles.captchaContainer}>
              <HCaptcha
                ref={captchaRef}
                sitekey={HCAPTCHA_SITE_KEY}
                onVerify={(token) => onCaptchaChange(token)}
                onExpire={() => onCaptchaChange(null)}
                onError={() => onCaptchaChange(null)}
              />
            </div>
          )}

          {submissionError && <div css={styles.errorContainer}>{submissionError}</div>}

          <div css={styles.buttonGroup}>
            <Core3Button
              onClick={onClose}
              variant="secondary"
              type="button"
              disabled={isSubmitting}
            >
              {cancelButtonText}
            </Core3Button>
            <Core3Button disabled={isSubmitDisabled || submitStatus !== 'idle'} type="submit">
              <AnimatePresence mode="wait" initial={false}>
                {submitStatus === 'idle' && (
                  <motion.span
                    key="submit-text"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {submitButtonText}
                  </motion.span>
                )}
                {submitStatus === 'loading' && (
                  <motion.div
                    key="loading"
                    css={styles.iconWrapper}
                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{ opacity: 1, scale: 1, rotate: 360 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                      duration: 0.3,
                      rotate: { duration: 1, repeat: Infinity, ease: [0, 0, 1, 1] as const },
                    }}
                  >
                    <CircularProgress size={32} color="inherit" />
                  </motion.div>
                )}
                {submitStatus === 'success' && (
                  <motion.div
                    key="success"
                    css={styles.iconWrapper}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    <Check />
                  </motion.div>
                )}
              </AnimatePresence>
            </Core3Button>
          </div>
        </>
      )}
    </form>
  );
}
