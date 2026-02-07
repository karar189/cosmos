/** @jsxImportSource @emotion/react */
'use client';
import * as styles from './FormHeader.styles';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

const Header = ({ title, children }: HeaderProps) => {
  return (
    <div css={styles.header}>
      <div css={styles.title}>{title}</div>
      {children && <div css={styles.subtitle}>{children}</div>}
    </div>
  );
};

export default Header;
