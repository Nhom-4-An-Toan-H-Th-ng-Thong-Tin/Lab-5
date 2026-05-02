import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/symmetric', label: 'Symmetric Encryption', icon: '🔑', color: '#7c3aed' },
  { path: '/asymmetric', label: 'Asymmetric Encryption', icon: '🔐', color: '#0891b2' },
  { path: '/hash', label: 'Hash Functions', icon: '📋', color: '#059669' },
];

export default function MainMenu() {
  const location = useLocation();

  return (
    <div className="main-menu">
      <div className="menu-intro">
        <div className="menu-icon-large">🔐</div>
        <h1 className="menu-title">Cryptography Toolkit</h1>
        <p className="menu-desc">
          A practical toolkit for symmetric encryption, asymmetric encryption, and hash functions.
          Select a feature below to get started.
        </p>
      </div>

      <div className="menu-grid">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className="menu-card-link">
            <div
              className={`menu-card ${location.pathname === item.path ? 'active' : ''}`}
              style={{ '--card-accent': item.color } as React.CSSProperties}
            >
              <div className="menu-card-icon">{item.icon}</div>
              <div className="menu-card-content">
                <h2 className="menu-card-title">{item.label}</h2>
                <p className="menu-card-desc">
                  {item.path === '/symmetric' && 'DES, 3DES, AES encryption & decryption'}
                  {item.path === '/asymmetric' && 'RSA key generation, encryption & decryption'}
                  {item.path === '/hash' && 'MD5 and SHA-256 hash computation'}
                </p>
              </div>
              <div className="menu-card-arrow">→</div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .main-menu {
          padding: 3rem 1rem;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .menu-intro {
          margin-bottom: 3rem;
        }

        .menu-icon-large {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
        }

        .menu-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }

        .menu-desc {
          font-size: 1.0625rem;
          color: var(--color-text-secondary);
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .menu-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
        }

        .menu-card-link {
          text-decoration: none;
          display: block;
        }

        .menu-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .menu-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--card-accent);
          border-radius: var(--radius-sm) 0 0 var(--radius-sm);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .menu-card:hover {
          border-color: var(--card-accent);
          transform: translateX(4px);
          box-shadow: var(--shadow-md);
        }

        .menu-card:hover::before {
          opacity: 1;
        }

        .menu-card.active {
          border-color: var(--card-accent);
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.15);
        }

        .menu-card-icon {
          font-size: 2.25rem;
          flex-shrink: 0;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-input);
          border-radius: var(--radius-md);
        }

        .menu-card-content {
          flex: 1;
        }

        .menu-card-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }

        .menu-card-desc {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .menu-card-arrow {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          flex-shrink: 0;
          transition: transform var(--transition-fast), color var(--transition-fast);
        }

        .menu-card:hover .menu-card-arrow {
          transform: translateX(4px);
          color: var(--color-text-primary);
        }

        @media (min-width: 640px) {
          .main-menu {
            padding: 4rem 2rem;
          }
          .menu-title {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}
