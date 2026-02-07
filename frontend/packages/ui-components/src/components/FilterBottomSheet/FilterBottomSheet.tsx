/** @jsxImportSource @emotion/react */
'use client';

import { useEffect, useState } from 'react';
import { Icon } from '../Icon';
import { CheckboxList, CheckboxOption } from '../CheckboxList';
import { BottomSheet } from '../BottomSheet';
import * as styles from './FilterBottomSheet.styles';

export interface FilterCategory {
  key: string;
  label: string;
  options: CheckboxOption[];
}

export interface FilterValues {
  [key: string]: string[];
}

export interface FilterBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  categories: FilterCategory[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onApply: () => void;
  onClear: () => void;
  clearAllText?: string;
  clearText?: string;
  applyText?: string;
  ariaCloseLabel?: string;
  ariaBackLabel?: string;
}

export default function FilterBottomSheet({
  open,
  onClose,
  title,
  categories,
  values,
  onChange,
  onApply,
  onClear,
  clearAllText,
  clearText,
  applyText,
  ariaCloseLabel,
  ariaBackLabel,
}: FilterBottomSheetProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Reset active category when closing
  useEffect(() => {
    if (!open) {
      setActiveCategory(null);
    }
  }, [open]);

  const handleCategoryClick = (key: string) => {
    setActiveCategory(key);
  };

  const handleBack = () => {
    setActiveCategory(null);
  };

  const handleCategoryChange = (categoryKey: string, selectedValues: string[]) => {
    onChange({
      ...values,
      [categoryKey]: selectedValues,
    });
  };

  const handleClearCategory = () => {
    if (activeCategory) {
      onChange({
        ...values,
        [activeCategory]: [],
      });
    }
  };

  const getTotalSelectedCount = () => {
    return Object.values(values).reduce((total, arr) => total + arr.length, 0);
  };

  const getCategorySelectedCount = (key: string) => {
    return values[key]?.length || 0;
  };

  const activeCategoryData = categories.find((c) => c.key === activeCategory);
  const currentTitle = activeCategory ? activeCategoryData?.label || title : title;
  const hasSelections = getTotalSelectedCount() > 0;
  const hasCategorySelections = activeCategory ? getCategorySelectedCount(activeCategory) > 0 : false;

  const customHeader = activeCategory ? (
    <>
      <button css={styles.backButton} onClick={handleBack} aria-label={ariaBackLabel}>
        <Icon name="chevron-left" />
      </button>
      <h2 css={styles.title}>{currentTitle}</h2>
      <button
        css={styles.closeButton}
        onClick={onClose}
        aria-label={ariaCloseLabel}
      >
        <Icon name="close" />
      </button>
    </>
  ) : undefined;

  return (
    <BottomSheet 
      open={open} 
      onClose={onClose} 
      title={activeCategory ? undefined : currentTitle}
      header={customHeader}
      ariaCloseLabel={ariaCloseLabel}
    >
      <div css={styles.contentWrapper}>
        {!activeCategory ? (
          <div css={styles.categoryList}>
            {categories.map((category) => {
              const count = getCategorySelectedCount(category.key);
              return (
                <div
                  key={category.key}
                  css={styles.categoryItem}
                  onClick={() => handleCategoryClick(category.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCategoryClick(category.key);
                    }
                  }}
                >
                  <span css={styles.categoryLabel}>{category.label}</span>
                  <div css={styles.categoryRight}>
                    {count > 0 && <span css={styles.categoryBadge}>{count}</span>}
                    <span css={styles.categoryChevron}>
                      <Icon name="chevron-right" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div css={styles.optionsList}>
            {activeCategoryData && (
              <CheckboxList
                options={activeCategoryData.options}
                value={values[activeCategory] || []}
                onChange={(selected) => handleCategoryChange(activeCategory, selected)}
                name={activeCategory}
              />
            )}
          </div>
        )}
      </div>

      <div css={styles.actions}>
        {!activeCategory ? (
          <>
            <button css={styles.clearButton} onClick={onClear} disabled={!hasSelections}>
              {clearAllText}
            </button>
            <button css={styles.applyButton} onClick={onApply}>
              <span>{applyText}</span>
            </button>
          </>
        ) : (
          <>
            <button
              css={styles.clearButton}
              onClick={handleClearCategory}
              disabled={!hasCategorySelections}
            >
              {clearText}
            </button>
            <button css={styles.applyButton} onClick={onApply}>
              <span>{applyText}</span>
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  );
}

