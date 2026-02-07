/** @jsxImportSource @emotion/react */
'use client';

import { useState, useMemo } from 'react';
import { Select, MenuItem, SelectChangeEvent, Checkbox, InputAdornment, TextField } from '@mui/material';
import * as styles from './FilterMultiSelect.styles';
import { motion } from 'motion/react';
import ChevronUpIcon from '../Icon/icons/ChevronUpIcon';
import ChevronDownIcon from '../Icon/icons/ChevronDownIcon';
import SearchIcon from '../Icon/icons/SearchIcon';

const MotionDiv = motion.div;

export interface FilterMultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterMultiSelectProps {
  options: FilterMultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Enable search inside dropdown (default: true) */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
}

const iconVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
};

/**
 * FilterMultiSelect Component
 *
 * A multi-select dropdown component with integrated search functionality
 *
 * @param options - Array of options to display
 * @param value - Array of selected values
 * @param onChange - Callback when selection changes
 * @param placeholder - Placeholder text when no selection
 * @param disabled - Whether the select is disabled
 * @param searchable - Enable search inside dropdown (default: true)
 * @param searchPlaceholder - Search input placeholder
 */
export default function FilterMultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search...',
}: FilterMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options based on search query and sort selected to top
  const filteredOptions = useMemo(() => {
    let result = options;
    
    // Filter by search query if searchable
    if (searchable && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(option => 
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query)
      );
    }
    
    // Sort selected options to the top
    return [...result].sort((a, b) => {
      const aSelected = value.includes(a.value);
      const bSelected = value.includes(b.value);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [options, searchQuery, searchable, value]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selectedValue = event.target.value;
    onChange(typeof selectedValue === 'string' ? [selectedValue] : selectedValue);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery(''); // Clear search on close
  };

  const renderValue = (selected: string[]) => {
    return (
      <span css={styles.placeholder}>
        {placeholder}
        {selected.length > 0 && (
          <span css={styles.selectedValuesChip}>
            {selected.length}
          </span>
        )}
      </span>
    );
  };

  return (
    <div>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        displayEmpty
        renderValue={renderValue}
        disabled={disabled}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={handleClose}
        css={styles.select}
        IconComponent={() => 
          open ? (
            <MotionDiv css={styles.selectIcon} variants={iconVariants} initial="hidden" animate="visible">
              <ChevronUpIcon />
            </MotionDiv>
          ) : (
            <MotionDiv css={styles.selectIcon} variants={iconVariants} initial="hidden" animate="visible">
              <ChevronDownIcon />
            </MotionDiv>
          )
        }
        MenuProps={{
          sx: styles.selectMenuStyles,
          disableScrollLock: true,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          autoFocus: false,
        }}
      >
        {/* Search Input - only show if searchable */}
        {searchable && (
          <div
            css={styles.searchMenuItem}
          >
            <TextField
              fullWidth
              size="small"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon css={styles.searchIcon} />
                  </InputAdornment>
                ),
              }}
              css={styles.searchInput}
            />
          </div>
        )}

        {/* Options List */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                checked={value.includes(option.value)}
                onChange={handleChange}
                css={styles.checkbox}
              />
              <span css={styles.optionLabel}>
                {option.label}
                {option.count !== undefined && (
                  <span css={styles.optionCount}>{option.count}</span>
                )}
              </span>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled css={styles.noResults}>
            No results found
          </MenuItem>
        )}
      </Select>
    </div>
  );
}

