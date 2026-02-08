/** @jsxImportSource @emotion/react */
'use client';

import { useState } from 'react';
import PlatformModal from '@/components/common/PlatformModal/PlatformModal';
import { Core3Button as Button } from '@core3/ui-components';
import * as styles from './GenerateSmartContractModal.styles';

export interface GenerateSmartContractModalProps {
  open: boolean;
  onClose: () => void;
  contractType: string;
}

export default function GenerateSmartContractModal({
  open,
  onClose,
  contractType,
}: GenerateSmartContractModalProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code?: string; deployedAddress?: string | null; message?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/smart-contracts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType, description: description.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.details || 'Request failed');
        return;
      }
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDescription('');
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <PlatformModal open={open} onClose={handleClose} ariaLabelledBy="generate-smart-contract-title">
      <div id="generate-smart-contract-title" css={styles.modalContent}>
        <h2 css={styles.modalTitle}>Generate & Deploy Smart Contract</h2>

        <div css={styles.formGroup}>
          <label css={styles.label}>Contract type</label>
          <input
            type="text"
            css={styles.readOnlyField}
            value={contractType}
            readOnly
            aria-readonly
          />
        </div>

        <div css={styles.formGroup}>
          <label css={styles.label}>Additional context (optional)</label>
          <textarea
            css={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Tokenize real estate; need freeze/clawback for compliance"
            rows={3}
          />
        </div>

        {error && <p css={styles.errorMessage}>{error}</p>}
        {result?.message && !result.code && <p css={styles.successMessage}>{result.message}</p>}
        {result?.code && (
          <div css={styles.formGroup}>
            <label css={styles.label}>Generated contract (Soroban / Rust)</label>
            <pre css={styles.codeBlock}>{result.code}</pre>
            {result.message && <p css={styles.successMessage}>{result.message}</p>}
          </div>
        )}

        <div css={styles.actions}>
          <Button variant="secondary" size="medium" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating…' : 'Generate & Deploy'}
          </Button>
        </div>
      </div>
    </PlatformModal>
  );
}
