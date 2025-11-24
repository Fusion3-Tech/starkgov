'use client';

import React from 'react';
import styles from './WalletModal.module.scss';
import type { StarknetWindowObject } from '@/hooks/useStarknetWallet';

interface WalletOption {
  id: string;
  name: string;
  installUrl: string;
  description?: string;
}

interface WalletModalProps {
  open: boolean;
  installedWallets: StarknetWindowObject[];
  onClose: () => void;
  onConnect: (walletId: string) => void;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'argentX',
    name: 'Argent X',
    installUrl: 'https://www.argent.xyz/argent-x/',
    description: 'Popular Starknet browser wallet.',
  },
  {
    id: 'braavos',
    name: 'Braavos',
    installUrl: 'https://braavos.app/download/',
    description: 'Smart-account wallet for Starknet.',
  },
  {
    id: 'okx-wallet',
    name: 'OKX Wallet',
    installUrl: 'https://www.okx.com/web3',
    description: 'Multi-chain wallet with Starknet support.',
  },
];

const WalletModal: React.FC<WalletModalProps> = ({
  open,
  installedWallets,
  onClose,
  onConnect,
}) => {
  if (!open) return null;

  const installedById = (id: string) =>
    installedWallets.find(
      (w) =>
        w.id?.toLowerCase() === id.toLowerCase() ||
        w.name?.toLowerCase() === id.toLowerCase()
    );

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h3>Connect Wallet</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className={styles.walletList}>
          {WALLET_OPTIONS.map((wallet) => {
            const installed = installedById(wallet.id) || installedById(wallet.name);
            return (
              <div
                key={wallet.id}
                className={`${styles.walletRow} ${installed ? '' : styles.walletRowDisabled}`}
              >
                <div className={styles.walletInfo}>
                  <div className={styles.walletIcon}>{wallet.name.slice(0, 1)}</div>
                  <div>
                    <div className={styles.walletName}>{wallet.name}</div>
                    <div className={styles.walletDesc}>{wallet.description}</div>
                  </div>
                </div>

                <div className={styles.walletActions}>
                  <a
                    className={styles.installLink}
                    href={wallet.installUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Install / open wallet extension page"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ↗
                  </a>
                  <button
                    className={styles.connectButton}
                    type="button"
                    disabled={!installed}
                    onClick={() => onConnect(wallet.id)}
                    title={installed ? 'Connect' : 'Install to connect'}
                  >
                    {installed ? 'Connect' : 'Not installed'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
