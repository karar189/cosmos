/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './FilterTabs.styles';

export interface FilterTabOption {
  value: string;
  label: string;
}

export interface FilterTabsProps {
  options: FilterTabOption[];
  /** Selected values array (supports multiple selections) */
  value: string[];
  /** Same signature as multiselect filters */
  onChange: (values: string[]) => void;
  disabled?: boolean;
}

/**
 * FilterTabs Component
 *
 * Tab-style filter buttons that support multiple selections.
 * Uses the same API as multiselect filters (string[]) for consistency.
 * Clicking a tab toggles its selection state; multiple tabs can be selected simultaneously.
 *
 * @param options - Array of tab options to display
 * @param value - Array of selected values (supports multiple selections)
 * @param onChange - Callback when selection changes (returns array of selected values)
 * @param disabled - Whether the tabs are disabled
 */
export default function FilterTabs({
  options,
  value,
  onChange,
  disabled = false,
}: FilterTabsProps) {
  const handleClick = (optionValue: string) => {
    if (disabled) return;
    // Toggle: if already selected, remove it; otherwise add it
    const isSelected = value.includes(optionValue);
    if (isSelected) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div css={styles.tabsContainer}>
      {options.map((option) => {
        const isSelected = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            css={styles.tabButton(isSelected)}
            onClick={() => handleClick(option.value)}
            disabled={disabled}
            aria-pressed={isSelected}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}


