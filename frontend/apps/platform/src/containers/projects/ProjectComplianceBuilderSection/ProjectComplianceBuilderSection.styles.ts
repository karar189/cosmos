/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const section = css`
  padding: 0;
`;

export const controlsGrid = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const controlRow = css`
  display: flex;
  align-items: center;
`;

export const statusBadge = css`
  font-size: 0.875rem;
  font-weight: 500;
  &[data-on='true'] {
    color: #166534;
  }
`;

export const sorobanNote = css`
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6b7280);
  margin: 0 0 16px 0;
`;
