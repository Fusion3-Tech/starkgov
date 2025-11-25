'use client';

import React from 'react';
import styles from './Sidebar.module.scss';

interface NavItem {
  label: string;
  key: string;
  hasBadge?: boolean;
  badgeCount?: number;
  section?: 'main' | 'settings';
  active?: boolean;
}

const mainItems: NavItem[] = [
  { label: 'Dashboard', key: 'dashboard', active: true },
  { label: 'Proposals', key: 'proposals' },
  { label: 'Delegates', key: 'delegates' },
  { label: 'Submit Proposal', key: 'submit-proposal' },
  { label: 'Voting Power', key: 'voting-power' },
  { label: 'Analytics', key: 'analytics' },
];

const settingsItems: NavItem[] = [
  { label: 'Notifications', key: 'notifications', hasBadge: true, badgeCount: 8 },
  { label: 'Docs', key: 'docs' },
  { label: 'Settings', key: 'settings' },
];

const Sidebar: React.FC = () => {
  // later you can lift this state up and set active by route
  const handleClick = (key: string) => {
    console.log('Clicked:', key);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brand}>StarkGov</div>

      {/* Main nav */}
      <nav className={styles.nav}>
        {mainItems.map((item: NavItem) => (
          <button
            key={item.key}
            className={`${styles.navItem} ${
              item.active ? styles.navItemActive : ''
            }`}
            onClick={() => handleClick(item.key)}
          >
            <span className={styles.iconWrapper}>
              {renderIcon(item.key, item.active || false)}
            </span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Settings section */}
      <div className={styles.settingsSection}>
        <div className={styles.settingsTitle}>Other</div>
        <nav className={styles.nav}>
          {settingsItems.map((item) => (
            <button
              key={item.key}
              className={styles.navItem}
              onClick={() => handleClick(item.key)}
            >
              <span className={styles.iconWrapper}>
                {renderIcon(item.key, false)}
              </span>
              <span className={styles.label}>{item.label}</span>

              {item.hasBadge && item.badgeCount && (
                <span className={styles.badge}>{item.badgeCount}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

/* simple inline icons just to mimic the design */
function renderIcon(key: string, filled: boolean) {
  switch (key) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon} aria-hidden="true">
          <rect x="2" y="2" width="7" height="7" rx="2" />
          <rect x="11" y="2" width="7" height="5" rx="2" />
          <rect x="11" y="9" width="7" height="9" rx="2" />
          <rect x="2" y="11" width="7" height="7" rx="2" />
        </svg>
      );
    case 'analytics':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <rect x="2" y="11" width="3" height="7" rx="1" />
          <rect x="8.5" y="8" width="3" height="10" rx="1" />
          <rect x="15" y="5" width="3" height="13" rx="1" />
        </svg>
      );
    case 'proposals':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon} aria-hidden="true">
          <rect x="4" y="3" width="10" height="14" rx="2" />
          <path d="M14 5h2v10c0 1.1-.9 2-2 2H8v-2" />
          <path d="M6.5 7.5h5" />
          <path d="M6.5 10h3" />
        </svg>
      );
    case 'delegates':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon} aria-hidden="true">
          <path d="M10 3 2.5 6.5 10 10l7.5-3.5L10 3Z" />
          <path d="M5 9v3.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V9" />
          <path d="M5 6.5 10 9l5-2.5" />
        </svg>
      );
    case 'submit-proposal':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon} aria-hidden="true">
          <rect x="4" y="3" width="10" height="14" rx="2" />
          <path d="M9 7h4" />
          <path d="M9 10h4" />
          <path d="M9 13h2.5" />
          <path d="M4 9h-2" />
          <path d="M4 6h-2" />
          <path d="M4 12h-2" />
          <path d="M9 4 7 4c-1.1 0-2 .9-2 2v8" />
        </svg>
      );
    case 'voting-power':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon} aria-hidden="true">
          <circle cx="5.5" cy="7" r="2.3" />
          <circle cx="13" cy="6" r="2.3" />
          <circle cx="10.5" cy="13" r="2.3" />
          <path d="M7 8.7 9 11.2" />
          <path d="M12 7.8l-1 3" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <circle cx="10" cy="10" r="3" />
          <path d="M4 10h-2m16 0h-2M10 4V2m0 16v-2M5.5 5.5 4 4m12 12-1.5-1.5M5.5 14.5 4 16m12-12-1.5 1.5" />
        </svg>
      );
    case 'notifications':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon} aria-hidden="true">
          <path d="M10 17a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Z" />
          <path d="M15 7a5 5 0 1 0-10 0c0 4-1.5 5-1.5 5H16.5S15 11 15 7Z" />
        </svg>
      );
    case 'docs':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon} aria-hidden="true">
          <path d="M5 4h6.5a3.5 3.5 0 0 1 3.5 3.5V16" />
          <path d="M5 4v12" />
          <path d="M5 16h10" />
          <path d="M5 7h7.5" />
        </svg>
      );
    default:
      return null;
  }
}
