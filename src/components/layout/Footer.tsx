export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-text">
          Cryptography Toolkit — Educational Project for Information Security
        </span>
        <span className="footer-badge">Lab 5</span>
      </div>

      <style>{`
        .footer {
          border-top: 1px solid var(--color-border);
          padding: 1.25rem 1rem;
          margin-top: auto;
        }

        .footer-inner {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .footer-text {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }

        .footer-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-accent-light);
          background: rgba(124, 58, 237, 0.12);
          padding: 0.25rem 0.625rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(124, 58, 237, 0.2);
        }
      `}</style>
    </footer>
  );
}
