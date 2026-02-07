/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './FormBox.styles';
import FormBoxHeader, { FormBoxHeaderProps } from './FormBoxHeader';

export interface FormBoxProps {
  children?: React.ReactNode;
  footer?: string;
  boldText?: string;
  headerProps?: FormBoxHeaderProps;
}

const FormBox: React.FC<FormBoxProps> = ({
  children,
  footer = 'Have issues?',
  boldText = 'Contact us',
  headerProps,
}) => {
  return (
    <div css={styles.StyledFormBox}>
      {headerProps && <FormBoxHeader {...headerProps} />}
      {children}
      {footer && (
        <div css={styles.StyledFormBoxFooter}>
          <span css={styles.StyledFormBoxSpanText}>{footer}</span>&nbsp;
          {/* TODO: Change to Contact us link */}
          <a href="/" css={styles.StyledFormBoxSpanBold}>
            {boldText}
          </a>
        </div>
      )}
    </div>
  );
};

export default FormBox;
