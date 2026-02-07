/** @jsxImportSource @emotion/react */

import { ChevronRightIcon } from "@core3/ui-components";
import * as styles from "./CategoryLink.styles";

interface CategoryLinkProps {
  label: string;
  count: number;
  onClick: () => void;
  isSelected?: boolean;
}

export function CategoryLink({ label, count, onClick, isSelected = false }: CategoryLinkProps) {
  const isClickable = count > 3;

  return (
    <div 
      css={styles.categoryLink(isClickable, isSelected)} 
      onClick={isClickable ? onClick : undefined}
      onKeyDown={isClickable ? (event) => event.key === 'Enter' && onClick() : undefined}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? "button" : undefined}
      data-navigable={isClickable ? "true" : undefined}
    >
      <span>
        {label} <span css={styles.resultCount}>{count}</span>
      </span>
      {isClickable && <ChevronRightIcon css={styles.chevronIcon} className="chevron-icon" />}
    </div>
  );
}
