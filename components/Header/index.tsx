"use client";

import { useMemo, useState, useEffect } from "react";
import styles from "./Header.module.scss";
import { useStarknetWallet } from "@/hooks/useStarknetWallet";
import WalletModal from "../WalletModal";
import ProposalSearchModal from "../ProposalSearchModal";
import { getBlockieDataUrl } from "@/lib/blockies";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const {
    wallet,
    accounts,
    connecting,
    connectWallet,
    availableWallets,
    disconnectWallet,
  } = useStarknetWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [accountIcon, setAccountIcon] = useState("");

  const isConnected = !!wallet && accounts.length > 0;
  const primaryAccount = accounts[0];

  const shortAccount = useMemo(() => {
    if (!primaryAccount) return "";
    if (primaryAccount.length <= 10) return primaryAccount;
    return `${primaryAccount.slice(0, 10)}...${primaryAccount.slice(-10)}`;
  }, [primaryAccount]);

  useEffect(() => {
    if (!primaryAccount) {
      setAccountIcon("");
      return;
    }
    const loadIcon = () => setAccountIcon(getBlockieDataUrl(primaryAccount));
    loadIcon();
    const retry = setTimeout(loadIcon, 200);
    return () => clearTimeout(retry);
  }, [primaryAccount]);

  const accountAvatarStyle = accountIcon
    ? { backgroundImage: `url(${accountIcon})`, backgroundSize: 'cover' as const }
    : undefined;

  return (
    <header className={styles.header}>
      {onMenuClick ? (
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Open menu"
        >
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
            className={styles.accountChip}
            type="button"
            onClick={() => setShowWalletModal(true)}
            aria-label={`Connected account ${primaryAccount}`}
          >
            <span className={styles.accountAddress}>
              <span className={styles.accountFull}>{primaryAccount}</span>
              <span className={styles.accountShort}>{shortAccount}</span>
            </span>
            <span className={styles.accountAvatar} key={primaryAccount || "no-account"}>
              <span
                className={styles.accountAvatarFill}
                style={accountAvatarStyle}
                aria-hidden="true"
              />
              {!accountIcon ? (
                <span className={styles.accountInitials}>
                  {shortAccount || primaryAccount || "??"}
                </span>
              ) : null}
            </span>
          </button>
        ) : (
          <button
            className={styles.connectButton}
            type="button"
            onClick={() => setShowWalletModal(true)}
            disabled={connecting}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
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
