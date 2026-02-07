/** @jsxImportSource @emotion/react */
'use client';

import { ToggleButton, ToggleButtonGroup, Button } from '@mui/material';
import * as styles from './Toggle.styles';
import { Interpolation, Theme } from '@emotion/react';

export type ToggleOption<TValue extends string | number> = {
  /** Value of the option */
  value: TValue;
  /** Display label for the option */
  label: string;
  /** Aria label for accessibility */
  ariaLabel?: string;
};

export type ToggleProps<TValue extends string | number> = {
  /** Current selected value */
  value: TValue;
  /** Callback when value changes */
  onChange: (value: TValue) => void;
  /** Available options */
  options: readonly ToggleOption<TValue>[];
  /** Use button style instead of toggle button style. Default: false */
  useButtonStyle?: boolean;
  /** Aria label for the toggle group (required for ToggleButtonGroup style) */
  ariaLabel?: string;
  size?: 'small' | 'medium';
  css?: Interpolation<Theme>;
};

/**
 * Reusable Toggle component that can be used for chart type selection,
 * time range selection, or any other toggle use case.
 *
 * @example
 * // For chart type toggle
 * <Toggle
 *   value={chartType}
 *   onChange={setChartType}
 *   options={[
 *     { value: 'price', label: 'Price Chart', ariaLabel: 'price chart' },
 *     { value: 'marketCap', label: 'Market Cap Chart', ariaLabel: 'market cap chart' },
 *   ]}
 *   ariaLabel="Chart type"
 * />
 *
 * @example
 * // For time range selector (button style)
 * <Toggle
 *   value={timeRange}
 *   onChange={setTimeRange}
 *   options={PRICE_CHART_TIME_RANGES.map(range => ({ value: range, label: range }))}
 *   useButtonStyle={true}
 * />
 */
export default function Toggle<TValue extends string | number>({
  value,
  onChange,
  options,
  useButtonStyle = false,
  ariaLabel,
  size = 'medium',
  ...props
}: ToggleProps<TValue>) {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: TValue | null) => {
    if (!newValue) return; // prevents deselect
    onChange(newValue);
  };

  if (useButtonStyle) {
    return (
      <div css={styles.container(size)}>
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <Button
              key={option.value}
              onClick={() => onChange(option.value)}
              css={[styles.baseButton(size), isActive && styles.activeButton]}
              variant="text"
              disableRipple
              aria-pressed={isActive}
              aria-label={option.ariaLabel || option.label}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label={ariaLabel || 'Toggle options'}
      css={styles.container(size)}
      fullWidth={false}
      {...props}
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          aria-label={option.ariaLabel || option.label}
          css={styles.baseButton(size)}
          disableRipple
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
