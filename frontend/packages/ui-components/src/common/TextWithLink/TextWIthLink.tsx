/** @jsxImportSource @emotion/react */
'use client';
import * as styles from './TextWithLink.styles';

interface TextWithLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  linkLabel: string;
  linkUrl?: string;
}

const TextWithLink = ({
  text,
  linkLabel,
  linkUrl,
  ...props
}: TextWithLinkProps) => {
  return (
    <div css={styles.container} {...props}>
      <span css={styles.text}>{text} </span>
      &nbsp;
      <a css={styles.link} href={linkUrl} rel="noopener noreferrer">
        {linkLabel?.toUpperCase()}
      </a>
    </div>
  );
};

export default TextWithLink;
