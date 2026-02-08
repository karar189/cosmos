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
  const [step, setStep] = useState<'idle' | 'generating' | 'deploying'>('idle');
  const [result, setResult] = useState<{ code?: string; message?: string } | null>(null);
  const [deployResult, setDeployResult] = useState<{
    contractId?: string | null;
    output?: string;
    message?: string;
    explorerUrl?: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setDeployResult(null);
    setStep('generating');
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
      if (!data.code) {
        setLoading(false);
        setStep('idle');
        return;
      }
      setStep('deploying');
      const deployRes = await fetch('/api/smart-contracts/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rustCode: data.code }),
      });
      const deployData = await deployRes.json();
      if (!deployRes.ok) {
        setError(deployData.error || deployData.details || 'Deploy failed');
        setDeployResult(null);
      } else {
        setDeployResult({
          contractId: deployData.contractId ?? null,
          output: deployData.output,
          message: deployData.message,
          explorerUrl: deployData.explorerUrl ?? (deployData.contractId ? `https://testnet.steexp.com/contract/${deployData.contractId}` : null),
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoading(false);
      setStep('idle');
    }
  };

  const handleClose = () => {
    setDescription('');
    setResult(null);
    setDeployResult(null);
    setError(null);
    setStep('idle');
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
            {step === 'deploying' && <p css={styles.deployingMessage}>Deploying to Stellar testnet…</p>}
            {deployResult != null && (
              <div css={styles.formGroup}>
                <label css={styles.label}>Deployment</label>
                {deployResult.contractId && (
                  <>
                    <p css={styles.deploySuccessBadge}>Contract deployed successfully</p>
                    <p css={styles.contractId}>
                      Contract ID: <code css={styles.contractIdCode}>{deployResult.contractId}</code>
                    </p>
                    {(deployResult.explorerUrl ?? (deployResult.contractId ? `https://testnet.steexp.com/contract/${deployResult.contractId}` : null)) && (
                      <a
                        href={deployResult.explorerUrl ?? `https://testnet.steexp.com/contract/${deployResult.contractId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        css={styles.explorerLink}
                      >
                        View on Stellar Explorer (testnet) →
                      </a>
                    )}
                  </>
                )}
                {deployResult.message && <p css={styles.successMessage}>{deployResult.message}</p>}
                {deployResult.output && !deployResult.contractId && (
                  <pre css={styles.codeBlock}>{deployResult.output}</pre>
                )}
              </div>
            )}
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
            {loading
              ? step === 'generating'
                ? 'Generating…'
                : 'Deploying…'
              : 'Generate & Deploy'}
          </Button>
        </div>
      </div>
    </PlatformModal>
  );
}
