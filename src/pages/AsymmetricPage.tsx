import { useState } from "react";

interface AsymmetricPageProps {
  onGenerateKeyPair: (bits: number) => RSAKeyPairResult;
  onEncrypt: (plaintext: string, publicKey: string) => AsymmetricResult;
  onDecrypt: (ciphertext: string, privateKey: string) => AsymmetricResult;
}

export default function AsymmetricPage({
  onGenerateKeyPair,
  onEncrypt,
  onDecrypt,
}: AsymmetricPageProps) {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [keyBits, setKeyBits] = useState(2048);
  const [keysGenerated, setKeysGenerated] = useState(false);

  const [plaintext, setPlaintext] = useState("");
  const [_ciphertext, _setCiphertext] = useState("");
  const [decryptInput, setDecryptInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt">("encrypt");
  const [copiedKey, setCopiedKey] = useState<"public" | "private" | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateKeys = () => {
    setError("");
    const res = onGenerateKeyPair(keyBits);
    if (res.success) {
      setPublicKey(res.publicKey || "");
      setPrivateKey(res.privateKey || "");
      setKeysGenerated(true);
    } else {
      setError(res.error || "Error");
    }
  };

  const handleCopyKey = (type: "public" | "private") => {
    const text = type === "public" ? publicKey : privateKey;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(type);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const handleEncrypt = () => {
    setError("");
    setResult("");
    if (!keysGenerated) {
      setError("Please generate RSA key pair first.");
      return;
    }
    if (!plaintext.trim()) {
      setError("Please enter plaintext.");
      return;
    }
    const output = onEncrypt(plaintext, publicKey);
    if (output && output.success) {
      setResult(output.data || "");
    } else {
      setError(output?.error || "Encryption failed");
    }
  };

  const handleDecrypt = () => {
    setError("");
    setResult("");
    if (!keysGenerated) {
      setError("Please generate RSA key pair first.");
      return;
    }
    if (!decryptInput.trim()) {
      setError("Please enter ciphertext.");
      return;
    }

    const output = onDecrypt(decryptInput, privateKey);
    if (output && output.success) {
      setResult(output.data || "");
    } else {
      setError(output?.error || "Decryption failed");
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
    setResult("");
    setError("");
    setPlaintext("");
    _setCiphertext("");
    setDecryptInput("");
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Asymmetric Encryption</h1>
        <p className="page-subtitle">
          RSA encryption using public/private key pairs.
        </p>
      </div>

      <div className="card">
        <h2 className="section-title">RSA Key Pair Generation</h2>

        <div className="key-gen-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Key Size (bits)</label>
            <select
              className="form-select"
              value={keyBits}
              onChange={(e) => setKeyBits(Number(e.target.value))}
            >
              <option value={1024}>1024 bits (faster, less secure)</option>
              <option value={2048}>2048 bits (recommended)</option>
              <option value={4096}>4096 bits (slower, more secure)</option>
            </select>
          </div>
          <div className="key-gen-action">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleGenerateKeys}
            >
              Generate Key Pair
            </button>
          </div>
        </div>

        {keysGenerated && (
          <div className="keys-display">
            <div className="key-block">
              <div className="flex-between">
                <span className="key-label">Public Key</span>
                <button
                  className={`btn btn-secondary btn-sm ${copiedKey === "public" ? "copied" : ""}`}
                  onClick={() => handleCopyKey("public")}
                >
                  {copiedKey === "public" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="key-display" style={{ maxHeight: 160 }}>
                {publicKey || "(empty)"}
              </div>
            </div>

            <div className="key-block">
              <div className="flex-between">
                <span className="key-label">Private Key</span>
                <button
                  className={`btn btn-secondary btn-sm ${copiedKey === "private" ? "copied" : ""}`}
                  onClick={() => handleCopyKey("private")}
                >
                  {copiedKey === "private" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="key-display" style={{ maxHeight: 160 }}>
                {privateKey || "(empty)"}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === "encrypt" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("encrypt");
            setResult("");
            setError("");
          }}
        >
          Encryption (Public Key)
        </button>
        <button
          className={`tab-btn ${activeTab === "decrypt" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("decrypt");
            setResult("");
            setError("");
          }}
        >
          Decryption (Private Key)
        </button>
      </div>

      {activeTab === "encrypt" ? (
        <div className="card">
          <h2 className="section-title">Encrypt with Public Key</h2>
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
          <div className="action-row">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleEncrypt}
              disabled={!keysGenerated}
            >
              Encrypt
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <h2 className="section-title">Decrypt with Private Key</h2>
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
          <div className="action-row">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleDecrypt}
              disabled={!keysGenerated}
            >
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
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Result
            </h2>
            <span className={`copy-badge ${copied ? "copied" : ""}`}>
              {copied ? "Copied!" : "Ready"}
            </span>
          </div>
          <div
            className="result-box"
            style={{ maxHeight: 200, overflowY: "auto" }}
          >
            <div
              style={{
                width: "100%",
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
              }}
            >
              {result}
            </div>
          </div>
          <div className="result-actions">
            <button className="btn btn-success btn-sm" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy Result"}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleClear}>
              Try Again
            </button>
          </div>
        </div>
      )}

      <style>{`
        .key-gen-row {
          display: flex;
          gap: 1.5rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .key-gen-action {
          flex-shrink: 0;
        }

        .keys-display {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .key-block {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tab-bar {
          display: flex;
          gap: 0.25rem;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.25rem;
          margin: 1.5rem 0;
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
          color: #0891b2;
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

        .btn.copied {
          color: var(--color-success);
          border-color: var(--color-success);
        }
      `}</style>
    </div>
  );
}
