'use client';

import { useCallback, useEffect, useState } from 'react';

export interface StarknetWindowObject {
  id: string;
  name: string;
  version: string;
  icon: string | { dark: string; light: string };
  request: <T = unknown>(call: { type: string; params?: unknown }) => Promise<T>;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string, listener: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    starknet?: StarknetWindowObject | StarknetWindowObject[];
  }
}

export interface StarknetWalletConnection {
  wallet: StarknetWindowObject;
  accounts: string[];
  chainId?: string;
}

const getWindowWallets = (): StarknetWindowObject[] => {
  if (typeof window === 'undefined') return [];
  const candidate = window.starknet;
  if (!candidate) return [];
  return (Array.isArray(candidate) ? candidate : [candidate]).filter(
    (w): w is StarknetWindowObject => !!w
  );
};

export function useStarknetWallet() {
  const STORAGE_KEY = 'starknet:lastWalletId';
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string | undefined>();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<StarknetWindowObject[]>(() =>
    getWindowWallets()
  );
  const [hasAttemptedReconnect, setHasAttemptedReconnect] = useState(false);

  const connectWallet = useCallback(
    async (preferredId?: string): Promise<StarknetWalletConnection | null> => {
      const detectedWallets = getWindowWallets();
      setAvailableWallets(detectedWallets);

      if (typeof window === 'undefined') {
        setError('Wallet connection is only available in the browser.');
        return null;
      }

      const target =
        (preferredId &&
          detectedWallets.find(
            (w) =>
              w.id?.toLowerCase() === preferredId.toLowerCase() ||
              w.name?.toLowerCase() === preferredId.toLowerCase()
          )) ||
        detectedWallets[0];

      if (!target) {
        setError('No Starknet wallet detected.');
        return null;
      }

      setConnecting(true);
      setError(null);

      try {
        const accountsResultRaw = await target.request<string[]>({
          type: 'wallet_requestAccounts',
        });
        const accountsResult = Array.isArray(accountsResultRaw)
          ? accountsResultRaw.filter((a): a is string => typeof a === 'string')
          : [];
        const currentChain = await target
          .request<string>({ type: 'wallet_requestChainId' })
          .catch(() => undefined);

        setWallet(target);
        setAccounts(accountsResult);
        setChainId(currentChain);

        if (typeof window !== 'undefined' && target.id) {
          localStorage.setItem(STORAGE_KEY, target.id);
        }

        return { wallet: target, accounts: accountsResult, chainId: currentChain };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect Starknet wallet.');
        return null;
      } finally {
        setConnecting(false);
      }
    },
    []
  );

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setAccounts([]);
    setChainId(undefined);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (hasAttemptedReconnect || connecting || wallet) return;
    setHasAttemptedReconnect(true);
    if (typeof window === 'undefined') return;
    const lastId = localStorage.getItem(STORAGE_KEY);
    if (lastId) {
      void connectWallet(lastId);
    }
  }, [hasAttemptedReconnect, connecting, wallet, connectWallet]);

  return {
    wallet,
    accounts,
    chainId,
    connecting,
    error,
    availableWallets,
    connectWallet,
    disconnectWallet,
  };
}
