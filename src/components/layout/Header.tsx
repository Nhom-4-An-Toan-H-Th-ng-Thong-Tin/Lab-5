import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/symmetric', label: 'Symmetric' },
  { path: '/asymmetric', label: 'Asymmetric' },
  { path: '/hash', label: 'Hash' },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-brand">
          <span className="header-brand-icon">🔐</span>
          <span className="header-brand-text">Crypto Toolkit</span>
        </Link>

        <nav className="header-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`header-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <style>{`
        .header {
          background: rgba(15, 17, 23, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          text-decoration: none;
        }

        .header-brand-icon {
          font-size: 1.5rem;
        }

        .header-brand-text {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          letter-spacing: -0.01em;
        }

        .header-nav {
          display: flex;
          gap: 0.25rem;
        }

        .header-nav-link {
          padding: 0.375rem 0.875rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .header-nav-link:hover {
          color: var(--color-text-primary);
          background: var(--color-bg-secondary);
        }

        .header-nav-link.active {
          color: var(--color-accent-light);
          background: rgba(124, 58, 237, 0.12);
        }

        @media (max-width: 480px) {
          .header-brand-text {
            display: none;
          }
          .header-nav-link {
            padding: 0.375rem 0.625rem;
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </header>
  );
}
