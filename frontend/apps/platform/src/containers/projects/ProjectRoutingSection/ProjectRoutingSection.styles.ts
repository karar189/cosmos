/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const section = css`
  padding: 0;
`;

export const grid = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`;

export const value = css`
  font-size: 0.875rem;
  color: var(--color-text-primary, #111827);
`;
