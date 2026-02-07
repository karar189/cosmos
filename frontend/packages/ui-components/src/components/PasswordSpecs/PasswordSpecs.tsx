/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './PasswordSpecs.styles';

interface PasswordSpecsProps {
  password?: string;
  minLength?: number;
  regexNumber?: RegExp;
  regexSymbol?: RegExp;
  labels: {
    minLength: string;
    number: string;
    symbol: string;
  };
}

const PasswordSpecs = ({ 
  password = '', 
  minLength = 8,
  regexNumber = /[0-9]/,
  regexSymbol = /[!@#$%^&*(),.?":{}|<>]/,
  labels,
}: PasswordSpecsProps) => {
  const hasMinLength = password.length >= minLength;
  const hasNumber = regexNumber.test(password);
  const hasSymbol = regexSymbol.test(password);

  return (
    <div css={styles.container}>
      <ul>
        <li css={hasMinLength ? styles.specMet : styles.specNotMet}>
          {labels.minLength}
        </li>
        <li css={hasNumber ? styles.specMet : styles.specNotMet}>
          {labels.number}
        </li>
        <li css={hasSymbol ? styles.specMet : styles.specNotMet}>
          {labels.symbol}
        </li>
      </ul>
    </div>
  );
};

export default PasswordSpecs;
