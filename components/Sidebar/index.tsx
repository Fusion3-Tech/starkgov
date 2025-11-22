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
  { label: 'Analytics', key: 'analytics' },
  { label: 'Sales', key: 'sales' },
  { label: 'Product', key: 'product' },
  { label: 'Customer', key: 'customer' },
  { label: 'Payout', key: 'payout' },
];

const settingsItems: NavItem[] = [
  { label: 'Profile', key: 'profile' },
  { label: 'Inbox', key: 'inbox', hasBadge: true, badgeCount: 8 },
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
        <div className={styles.settingsTitle}>Settings</div>
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

      {/* Bottom controls */}
      <div className={styles.bottomSection}>
        <div className={styles.themeToggle}>
          <span className={styles.themeIcon}>☀️</span>
          <label className={styles.toggle}>
            <input type="checkbox" />
            <span className={styles.toggleTrack}>
              <span className={styles.toggleThumb} />
            </span>
          </label>
          <span className={styles.themeIcon}>🌙</span>
        </div>

        <div className={styles.footer}>
          <span className={styles.copyrightIcon}>©</span>
          <span className={styles.footerText}>Copyright StarkGov 2025</span>
        </div>
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
    case 'sales':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <polyline points="2 14 7 9 11 12 18 4" fill="none" strokeWidth="2" />
          <polyline points="13 4 18 4 18 9" fill="none" strokeWidth="2" />
        </svg>
      );
    case 'product':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <rect x="3" y="4" width="14" height="12" rx="2" />
          <rect x="3" y="4" width="14" height="3" />
        </svg>
      );
    case 'customer':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <circle cx="7" cy="7" r="3" />
          <path d="M2 16c1.2-2 2.9-3 5-3s3.8 1 5 3" />
          <circle cx="15" cy="8" r="2" />
          <path d="M12.5 15c.7-1.2 1.6-2 2.5-2s1.8.8 2.5 2" />
        </svg>
      );
    case 'payout':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <rect x="3" y="4" width="14" height="12" rx="2" />
          <circle cx="9" cy="10" r="2.2" />
          <path d="M11.5 10h3.5" />
        </svg>
      );
    case 'profile':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <circle cx="10" cy="7" r="3" />
          <path d="M4 16c1.5-2 3.5-3 6-3s4.5 1 6 3" />
        </svg>
      );
    case 'inbox':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <rect x="3" y="5" width="14" height="10" rx="2" />
          <path d="M3 11h4l2 3h2l2-3h4" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <circle cx="10" cy="10" r="3" />
          <path d="M4 10h-2m16 0h-2M10 4V2m0 16v-2M5.5 5.5 4 4m12 12-1.5-1.5M5.5 14.5 4 16m12-12-1.5 1.5" />
        </svg>
      );
    default:
      return null;
  }
}
