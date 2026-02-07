/** @jsxImportSource @emotion/react */

import { Core3Button, SearchIcon, Icon } from "@core3/ui-components";
import { TextField } from "@mui/material";
import * as styles from "./SearchInput.styles";
import useTranslation from "@/hooks/useTranslation";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export function SearchInput({ value, onChange, onClose, inputRef }: SearchInputProps) {
  const { t } = useTranslation('search');

  const handleClear = () => {
    onChange('');
  };

  return (
    <div css={styles.inputContainer} role="search">
      <SearchIcon css={styles.searchIcon} aria-hidden="true" />
      <TextField
        placeholder={t('placeholder', 'Search projects and exchanges')}
        fullWidth
        size="small"
        css={styles.searchInput}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputRef={inputRef}
        inputProps={{
          'aria-label': t('aria.search', 'Search projects and exchanges'),
          'role': 'searchbox',
        }}
      />
      {value && (
        <Core3Button 
          variant="secondary" 
          size="extraSmall" 
          onClick={handleClear}
          aria-label={t('button.clear', 'Clear')}
        >
          {t('button.clear', 'Clear')}
        </Core3Button>
      )}
      <button 
        css={styles.closeButton} 
        onClick={onClose}
        aria-label={t('button.close', 'Close search')}
        type="button"
      >
        <Icon name="close" />
      </button>
    </div>
  );
}

