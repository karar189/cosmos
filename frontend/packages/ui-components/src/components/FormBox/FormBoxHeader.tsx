/** @jsxImportSource @emotion/react */
'use client';
import * as styles from './FormBoxHeader.styles';
import Avatar from '@mui/material/Avatar';
import Icon from '../Icon/Icon';

export interface FormBoxHeaderProps {
  email?: string;
  backText?: string;
  onBackClick?: () => void;
}

const FormBoxHeader: React.FC<FormBoxHeaderProps> = ({
  email,
  backText,
  onBackClick,
}) => {
  return (
    <div css={styles.StyledFormBoxHeader}>
      <div css={styles.StyledFormHeaderLeft}>
        {backText && (
          <button
            css={styles.StyledBackButton}
            onClick={onBackClick}
            aria-label="Go back"
          >
            <Icon 
              name="chevron-left"
              css={styles.StyledBackIcon}
            />
            <span css={styles.StyledBackText}>{backText}</span>
          </button>
        )}
      </div>
      <div css={styles.StyledFormHeaderRight}>
        {email && (
          <>
            <Avatar alt={email} css={styles.StyledAvatar}>
              {email.charAt(0).toUpperCase()}
            </Avatar>
            <span css={styles.StyledEmailText}>{email}</span>
            <button css={styles.StyledDropdownButton} aria-label="Open menu">
              <Icon name="chevron-down" css={styles.StyledDropdownIcon} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FormBoxHeader;
