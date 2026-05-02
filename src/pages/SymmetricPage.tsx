import { useState } from 'react';
import type { SymmetricAlgorithm, SymmetricMode } from '@/types';

interface SymmetricPageProps {
  onEncrypt: (algorithm: SymmetricAlgorithm, mode: SymmetricMode, plaintext: string, key: string) => string;
  onDecrypt: (algorithm: SymmetricAlgorithm, mode: SymmetricMode, ciphertext: string, key: string) => string;
  onGenerateKey: (algorithm: SymmetricAlgorithm) => string;
}

const algorithms: { value: SymmetricAlgorithm; label: string; desc: string; keyInfo: string }[] = [
  { value: 'AES', label: 'AES', desc: 'Advanced Encryption Standard', keyInfo: '16, 24, or 32 bytes' },
  { value: '3DES', label: '3DES', desc: 'Triple DES', keyInfo: '16 or 24 bytes' },
  { value: 'DES', label: 'DES', desc: 'Data Encryption Standard', keyInfo: '8 bytes (unsafe)' },
];

const modes: { value: SymmetricMode; label: string }[] = [
  { value: 'CBC', label: 'CBC (Cipher Block Chaining)' },
  { value: 'ECB', label: 'ECB (Electronic Codebook)' },
];

export default function SymmetricPage({ onEncrypt, onDecrypt, onGenerateKey }: SymmetricPageProps) {
  const [algorithm, setAlgorithm] = useState<SymmetricAlgorithm>('AES');
  const [mode, setMode] = useState<SymmetricMode>('CBC');
  const [plaintext, setPlaintext] = useState('');
  const [_ciphertext, _setCiphertext] = useState('');
  const [key, setKey] = useState('');
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptKey, setDecryptKey] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [copied, setCopied] = useState(false);

  const handleGenerateKey = () => {
    const generated = onGenerateKey(algorithm);
    setKey(generated);
    setDecryptKey(generated);
  };

  const handleEncrypt = () => {
    setError('');
    setResult('');
    if (!plaintext.trim()) { setError('Please enter plaintext.'); return; }
    if (!key.trim()) { setError('Please enter or generate a secret key.'); return; }
    try {
      const output = onEncrypt(algorithm, mode, plaintext, key);
      setResult(output);
    } catch (err) {
      setError(String(err));
    }
  };

  const handleDecrypt = () => {
    setError('');
    setResult('');
    if (!decryptInput.trim()) { setError('Please enter ciphertext.'); return; }
    if (!decryptKey.trim()) { setError('Please enter the secret key.'); return; }
    try {
      const output = onDecrypt(algorithm, mode, decryptInput, decryptKey);
      setResult(output);
    } catch (err) {
      setError(String(err));
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClear = () => {
    setResult('');
    setError('');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Symmetric Encryption</h1>
        <p className="page-subtitle">Encrypt and decrypt data using DES, 3DES, or AES algorithms.</p>
      </div>

      <div className="card settings-card">
        <div className="settings-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Algorithm</label>
            <select
              className="form-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as SymmetricAlgorithm)}
            >
              {algorithms.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label} — {a.desc}
                </option>
              ))}
            </select>
            <span className="key-info">Key size: {algorithms.find((a) => a.value === algorithm)?.keyInfo}</span>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Mode of Operation</label>
            <select
              className="form-select"
              value={mode}
              onChange={(e) => setMode(e.target.value as SymmetricMode)}
            >
              {modes.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <span className="key-info">{mode === 'CBC' ? 'Uses IV (more secure)' : 'No IV (less secure)'}</span>
          </div>
        </div>
      </div>

      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'encrypt' ? 'active' : ''}`}
          onClick={() => { setActiveTab('encrypt'); setResult(''); setError(''); }}
        >
          Encryption
        </button>
        <button
          className={`tab-btn ${activeTab === 'decrypt' ? 'active' : ''}`}
          onClick={() => { setActiveTab('decrypt'); setResult(''); setError(''); }}
        >
          Decryption
        </button>
      </div>

      {activeTab === 'encrypt' ? (
        <div className="card">
          <h2 className="section-title">Encrypt Plaintext</h2>

          <div className="form-group">
            <label className="form-label">Plaintext</label>
            <textarea
              className="form-textarea"
              placeholder="Enter your message here..."
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              rows={4}
            />
          </div>

          <div className="divider" />

          <div className="form-group">
            <div className="flex-between">
              <label className="form-label">Secret Key</label>
              <button className="btn btn-secondary btn-sm" onClick={handleGenerateKey}>
                Generate Random Key
              </button>
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="Enter secret key or generate one..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <span className="input-hint">For {algorithm}: key must be {algorithms.find((a) => a.value === algorithm)?.keyInfo} long.</span>
          </div>

          <div className="action-row">
            <button className="btn btn-primary btn-lg" onClick={handleEncrypt}>
              Encrypt
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <h2 className="section-title">Decrypt Ciphertext</h2>

          <div className="form-group">
            <label className="form-label">Ciphertext</label>
            <textarea
              className="form-textarea"
              placeholder="Paste the ciphertext here..."
              value={decryptInput}
              onChange={(e) => setDecryptInput(e.target.value)}
              rows={4}
            />
          </div>

          <div className="divider" />

          <div className="form-group">
            <label className="form-label">Secret Key</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter the secret key used for encryption..."
              value={decryptKey}
              onChange={(e) => setDecryptKey(e.target.value)}
            />
          </div>

          <div className="action-row">
            <button className="btn btn-primary btn-lg" onClick={handleDecrypt}>
              Decrypt
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="card result-card">
          <div className="flex-between">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Result</h2>
            <span className={`copy-badge ${copied ? 'copied' : ''}`}>
              {copied ? 'Copied!' : 'Ready'}
            </span>
          </div>
          <div className="result-box">
            <div style={{ width: '100%', wordBreak: 'break-all' }}>{result}</div>
          </div>
          <div className="result-actions">
            <button className="btn btn-success btn-sm" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleClear}>
              Try Again
            </button>
          </div>
        </div>
      )}

      <style>{`
        .settings-card {
          margin-bottom: 1.5rem;
        }

        .settings-row {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .key-info {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
        }

        .input-hint {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
        }

        .tab-bar {
          display: flex;
          gap: 0.25rem;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.25rem;
          margin-bottom: 1.5rem;
          width: fit-content;
        }

        .tab-btn {
          padding: 0.5rem 1.5rem;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--color-text-primary);
        }

        .tab-btn.active {
          background: var(--color-bg-card);
          color: var(--color-accent-light);
          box-shadow: var(--shadow-sm);
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

        .copy-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-muted);
          background: var(--color-bg-input);
          padding: 0.25rem 0.625rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          transition: all var(--transition-fast);
        }

        .copy-badge.copied {
          color: var(--color-success);
          border-color: var(--color-success);
        }
      `}</style>
    </div>
  );
}
