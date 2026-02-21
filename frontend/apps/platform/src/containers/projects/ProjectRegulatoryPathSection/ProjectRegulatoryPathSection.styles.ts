/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const section = css`
  padding: 0;
`;

export const progressWrap = css`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const progressLabel = css`
  font-weight: 600;
  font-size: 1rem;
`;

export const progressNote = css`
  font-size: 0.8125rem;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
`;

export const checklist = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

export const row = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const statusTag = css`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  &[data-status='configured'] {
    background: #dcfce7;
    color: #166534;
  }
  &[data-status='inprogress'] {
    background: #fef3c7;
    color: #92400e;
  }
  &[data-status='pending'] {
    background: #f3f4f6;
    color: #374151;
  }
  &[data-status='—'] {
    background: transparent;
    color: #6b7280;
  }
`;

export const value = css`
  font-size: 0.875rem;
  color: var(--color-text-primary, #111827);
`;
