"use client";

import React, { useEffect, useMemo } from "react";
import styles from "./Sidebar.module.scss";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  label: string;
  key: string;
  href?: string;
  hasBadge?: boolean;
  badgeCount?: number;
  disabled?: boolean;
}

const mainItems: NavItem[] = [
  { label: "Dashboard", key: "dashboard", href: "/" },
  { label: "Proposals", key: "proposals", href: "/proposals" },
  { label: "Delegates", key: "delegates", disabled: true },
  { label: "Submit Proposal", key: "submit-proposal", disabled: true },
  { label: "Voting Power", key: "voting-power", disabled: true },
  { label: "Analytics", key: "analytics", disabled: true },
];

const settingsItems: NavItem[] = [
  { label: "Docs", key: "docs", disabled: true },
  { label: "Settings", key: "settings", disabled: true },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isMobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileOpen]);

  const activeKey = useMemo(() => {
    if (pathname === "/") return "dashboard";
    if (pathname.startsWith("/proposals")) return "proposals";
    return "";
  }, [pathname]);

  const handleClick = (item: NavItem) => {
    if (item.disabled) return;
    if (item.href) {
      router.push(item.href);
    }
    if (onClose) onClose();
  };

  const renderNav = (items: NavItem[]) =>
    items.map((item) => (
      <button
        key={item.key}
        className={`${styles.navItem} ${
          activeKey === item.key ? styles.navItemActive : ""
        } ${item.disabled ? styles.navItemDisabled : ""}`}
        onClick={() => handleClick(item)}
        disabled={item.disabled}
      >
        <span className={styles.iconWrapper}>
          {renderIcon(item.key, activeKey === item.key)}
        </span>
        <span className={styles.label}>{item.label}</span>
        {item.hasBadge && item.badgeCount ? (
          <span className={styles.badge}>{item.badgeCount}</span>
        ) : null}
      </button>
    ));

  return (
    <div className={styles.sidebarContainer}>
      <aside
        className={`${styles.sidebar} ${
      isMobileOpen ? styles.sidebarOpen : ""
    }`}
    aria-hidden={
      !isMobileOpen &&
      typeof window !== "undefined" &&
      window.innerWidth < 1200
    }
  >
    <div className={styles.brandHeader}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          <img src="/logoStarkGov.svg" alt="" />
        </span>
        <div className={styles.brandCopy}>
          <span className={styles.brandText}>StarkGov</span>
          <span className={styles.brandTagline}>Governance Hub</span>
        </div>
      </div>
    </div>

    {onClose ? (
      <button
        type="button"
        className={styles.closeButton}
            onClick={onClose}
            aria-label="Close menu"
          >
            <img
              src="/close.png"
              alt="Close menu"
              className={styles.closeIcon}
            />
          </button>
        ) : null}

        <nav className={styles.nav}>{renderNav(mainItems)}</nav>

        <div className={styles.settingsSection}>
          <div className={styles.settingsTitle}>Other</div>
          <nav className={styles.nav}>{renderNav(settingsItems)}</nav>
        </div>

        <div className={styles.reportBox}>
          <div className={styles.reportLabel}>Report an issue</div>
          <div className={styles.reportActions}>
            <a href="mailto:contact@fusion3.tech" className={styles.reportLink}>
              <span className={styles.reportIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16v12H4z" />
                  <path d="m4 7 8 5 8-5" />
                </svg>
              </span>
              Email
            </a>
            <a
              href="https://github.com/Fusion3-Tech/starkgov"
              target="_blank"
              rel="noreferrer"
              className={styles.reportLink}
            >
              <span className={styles.reportIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.94c.57.1.78-.25.78-.56 0-.28-.01-1.03-.02-2.02-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.71 1.25 3.37.95.1-.75.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.45.11-3.03 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.91-.39c.99 0 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.58.23 2.74.11 3.03.74.8 1.19 1.83 1.19 3.08 0 4.41-2.7 5.38-5.27 5.66.41.36.77 1.08.77 2.19 0 1.58-.01 2.85-.01 3.23 0 .31.21.67.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </span>
              GitHub
            </a>
          </div>
        </div>
      </aside>

      {onClose ? (
        <button
          type="button"
          className={`${styles.backdrop} ${
            isMobileOpen ? styles.backdropVisible : ""
          }`}
          aria-label="Close menu overlay"
          onClick={onClose}
        />
      ) : null}
    </div>
  );
};

export default Sidebar;

/* simple inline icons just to mimic the design */
function renderIcon(key: string, filled: boolean) {
  switch (key) {
    case "dashboard":
      return (
        <svg viewBox="0 0 20 20" className={styles.icon} aria-hidden="true">
          <rect x="2" y="2" width="7" height="7" rx="2" />
          <rect x="11" y="2" width="7" height="5" rx="2" />
          <rect x="11" y="9" width="7" height="9" rx="2" />
          <rect x="2" y="11" width="7" height="7" rx="2" />
        </svg>
      );
    case "analytics":
      return (
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <rect x="2" y="11" width="3" height="7" rx="1" />
          <rect x="8.5" y="8" width="3" height="10" rx="1" />
          <rect x="15" y="5" width="3" height="13" rx="1" />
        </svg>
      );
    case "proposals":
      return (
        <svg viewBox="0 0 20 20" className={styles.icon} aria-hidden="true">
          <rect x="4" y="3" width="10" height="14" rx="2" />
          <path d="M14 5h2v10c0 1.1-.9 2-2 2H8v-2" />
          <path d="M6.5 7.5h5" />
          <path d="M6.5 10h3" />
        </svg>
      );
    case "delegates":
      return (
        <svg viewBox="0 0 20 20" className={styles.icon} aria-hidden="true">
          <path d="M10 3 2.5 6.5 10 10l7.5-3.5L10 3Z" />
          <path d="M5 9v3.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V9" />
          <path d="M5 6.5 10 9l5-2.5" />
        </svg>
      );
    case "submit-proposal":
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
    case "voting-power":
      return (
        <svg viewBox="0 0 20 20" className={styles.icon} aria-hidden="true">
          <circle cx="5.5" cy="7" r="2.3" />
          <circle cx="13" cy="6" r="2.3" />
          <circle cx="10.5" cy="13" r="2.3" />
          <path d="M7 8.7 9 11.2" />
          <path d="M12 7.8l-1 3" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <circle cx="10" cy="10" r="3" />
          <path d="M4 10h-2m16 0h-2M10 4V2m0 16v-2M5.5 5.5 4 4m12 12-1.5-1.5M5.5 14.5 4 16m12-12-1.5 1.5" />
        </svg>
      );
    case "notifications":
      return null;
    case "docs":
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
