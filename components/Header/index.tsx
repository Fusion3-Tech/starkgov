'use client';

import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Search */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="9" cy="9" r="6" />
            <line x1="14" y1="14" x2="19" y2="19" />
          </svg>
        </span>
      </div>

      <div className={styles.rightSection}>
        {/* Date */}
        <div className={styles.dateBox}>15 May 2020 8:00 am</div>

        {/* Bell */}
        <button className={styles.bellButton}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z" />
            <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16l-2-2z" />
          </svg>
        </button>

        {/* Avatar */}
        <div className={styles.avatar}>
          <img src="/avatar.png" alt="User" />
        </div>
      </div>
    </header>
  );
}
