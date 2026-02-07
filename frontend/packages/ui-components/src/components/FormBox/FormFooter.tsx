/** @jsxImportSource @emotion/react */
'use client';
import * as styles from './FormFooter.styles';

export interface FormFooterProps {
  footer?: string;
  linkLabel?: string;
  linkHref?: string;
}

const FormFooter: React.FC<FormFooterProps> = ({
  footer,
  linkLabel,
  linkHref,
}) => {
  return (
    <div css={styles.StyledFormBoxFooter}>
      <span css={styles.StyledFormBoxSpanText}>{footer}</span>
      <pre> </pre>
      <a href={linkHref ?? '/'} css={styles.StyledFormBoxSpanBold}>
        {linkLabel}
      </a>
    </div>
  );
};

export default FormFooter;
