'use client';

import { useState } from 'react';
import styles from './Header.module.scss';
import { useStarknetWallet } from '@/hooks/useStarknetWallet';
import WalletModal from '../WalletModal';
import ProposalSearchModal from '../ProposalSearchModal';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { wallet, accounts, connecting, connectWallet, availableWallets, disconnectWallet } =
    useStarknetWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const isConnected = !!wallet && accounts.length > 0;

  return (
    <header className={styles.header}>
      {onMenuClick ? (
        <button type="button" className={styles.menuButton} onClick={onMenuClick} aria-label="Open menu">
          ☰
        </button>
      ) : null}

      {/* Search */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
          onFocus={() => setShowSearchModal(true)}
          onClick={() => setShowSearchModal(true)}
          readOnly
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

        {/* Avatar / Connect */}
        {isConnected ? (
          <button
            className={styles.avatar}
            title={accounts[0]}
            type="button"
            onClick={() => setShowWalletModal(true)}
          >
            <img src="/avatar.png" alt="Wallet connected" />
          </button>
        ) : (
          <button
            className={styles.connectButton}
            type="button"
            onClick={() => setShowWalletModal(true)}
            disabled={connecting}
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>

      <WalletModal
        open={showWalletModal}
        installedWallets={availableWallets}
        onClose={() => setShowWalletModal(false)}
        onConnect={(walletId) => {
          connectWallet(walletId);
          setShowWalletModal(false);
        }}
        connectedWalletId={wallet?.id}
        onDisconnect={() => {
          disconnectWallet();
          setShowWalletModal(false);
        }}
      />

      <ProposalSearchModal
        open={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </header>
  );
}
