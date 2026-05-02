import { useState } from 'react';
import type { HashAlgorithm } from '@/types';
import { getHashAlgorithmDescription } from '@/crypto';

interface HashPageProps {
  onComputeHash: (algorithm: HashAlgorithm, text: string) => string;
}

export default function HashPage({ onComputeHash }: HashPageProps) {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [inputText, setInputText] = useState('');
  const [hashResult, setHashResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [computed, setComputed] = useState(false);

  const handleCompute = () => {
    setError('');
    if (!inputText.trim()) { setError('Please enter text to hash.'); return; }
    const hash = onComputeHash(algorithm, inputText);
    setHashResult(hash);
    setComputed(true);
  };

  const handleCopy = () => {
    if (!hashResult) return;
    navigator.clipboard.writeText(hashResult).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClear = () => {
    setInputText('');
    setHashResult('');
    setError('');
    setComputed(false);
  };

  const algorithms: { value: HashAlgorithm; label: string }[] = [
    { value: 'SHA-256', label: 'SHA-256' },
    { value: 'MD5', label: 'MD5 (unsafe)' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Hash Functions</h1>
        <p className="page-subtitle">Compute MD5 or SHA-256 hash digest of any text.</p>
      </div>

      <div className="card">
        <div className="form-group">
          <label className="form-label">Hash Algorithm</label>
          <select
            className="form-select"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}
          >
            {algorithms.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
          <span className="algo-desc">{getHashAlgorithmDescription(algorithm)}</span>
        </div>

        <div className="divider" />

        <div className="form-group">
          <label className="form-label">Input Text</label>
          <textarea
            className="form-textarea"
            placeholder="Enter text to hash..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
          />
        </div>

        <div className="action-row">
          <button className="btn btn-primary btn-lg hash-btn" onClick={handleCompute}>
            Compute Hash
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginTop: '1rem' }}>{error}</div>}

      {computed && hashResult && (
        <div className="card result-card">
          <div className="flex-between">
            <div>
              <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>Hash Digest</h2>
              <span className="hash-meta">
                {algorithm} — {hashResult.length} characters
              </span>
            </div>
            <span className={`copy-badge ${copied ? 'copied' : ''}`}>
              {copied ? 'Copied!' : 'Ready'}
            </span>
          </div>
          <div className="hash-output">
            {hashResult}
          </div>
          <div className="result-actions">
            <button className="btn btn-success btn-sm" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Hash'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleClear}>
              Hash New Text
            </button>
          </div>

          <div className="hash-info-row">
            <div className="hash-info-item">
              <span className="hash-info-label">Input length</span>
              <span className="hash-info-value">{inputText.length} characters</span>
            </div>
            <div className="hash-info-item">
              <span className="hash-info-label">Output length</span>
              <span className="hash-info-value">{hashResult.length} hex characters</span>
            </div>
            <div className="hash-info-item">
              <span className="hash-info-label">Algorithm</span>
              <span className="hash-info-value">{algorithm}</span>
            </div>
            <div className="hash-info-item">
              <span className="hash-info-label">Output bits</span>
              <span className="hash-info-value">
                {algorithm === 'SHA-256' ? '256 bits' : '128 bits'}
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .algo-desc {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
          line-height: 1.5;
        }

        .hash-btn {
          background: #059669;
        }

        .hash-btn:hover {
          background: #047857;
          box-shadow: 0 0 20px rgba(5, 150, 105, 0.3);
        }

        .action-row {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .result-card {
          margin-top: 1.5rem;
        }

        .hash-meta {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          font-family: var(--font-mono);
        }

        .hash-output {
          background: var(--color-bg-input);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1rem;
          font-family: var(--font-mono);
          font-size: 0.9375rem;
          color: #34d399;
          word-break: break-all;
          line-height: 1.7;
          margin-top: 1rem;
          user-select: all;
        }

        .copy-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-muted);
          background: var(--color-bg-input);
          padding: 0.25rem 0.625rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .copy-badge.copied {
          color: var(--color-success);
          border-color: var(--color-success);
        }

        .hash-info-row {
          display: flex;
          gap: 1rem;
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--color-border);
          flex-wrap: wrap;
        }

        .hash-info-item {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .hash-info-label {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
        }

        .hash-info-value {
          font-size: 0.875rem;
          color: var(--color-text-primary);
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}
