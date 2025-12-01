'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

const STORAGE_KEY = 'starknet:lastWalletId';
const RETRY_DELAY_MS = 400;
const MAX_RETRIES = 6;

const safeGetItem = (key: string) => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
};

const safeRemoveItem = (key: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};

const getWindowWallets = (): StarknetWindowObject[] => {
  if (typeof window === 'undefined') return [];
  const candidate = window.starknet;
  if (!candidate) return [];
  return (Array.isArray(candidate) ? candidate : [candidate]).filter(
    (w): w is StarknetWindowObject => !!w
  );
};

const findWallet = (wallets: StarknetWindowObject[], preferredId?: string) => {
  if (!preferredId) return wallets[0];
  const lowered = preferredId.toLowerCase();
  return (
    wallets.find(
      (w) =>
        w.id?.toLowerCase() === lowered ||
        w.name?.toLowerCase() === lowered
    ) || wallets[0]
  );
};

export function useStarknetWallet() {
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string | undefined>();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<StarknetWindowObject[]>(() =>
    getWindowWallets()
  );
  const [hasAttemptedReconnect, setHasAttemptedReconnect] = useState(false);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetState = useCallback(() => {
    setWallet(null);
    setAccounts([]);
    setChainId(undefined);
    setError(null);
  }, []);

  const connectWallet = useCallback(
    async (preferredId?: string): Promise<StarknetWalletConnection | null> => {
      const detected = getWindowWallets();
      setAvailableWallets(detected);

      if (typeof window === 'undefined') {
        setError('Wallet connection is only available in the browser.');
        return null;
      }

      const target = findWallet(detected, preferredId);
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

        if (target.id || target.name) {
          safeSetItem(STORAGE_KEY, target.id || target.name);
        }

        return { wallet: target, accounts: accountsResult, chainId: currentChain };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect Starknet wallet.');
        resetState();
        return null;
      } finally {
        setConnecting(false);
      }
    },
    [resetState]
  );

  const disconnectWallet = useCallback(() => {
    resetState();
    safeRemoveItem(STORAGE_KEY);
  }, [resetState]);

  useEffect(() => {
    if (hasAttemptedReconnect || connecting || wallet) return;
    setHasAttemptedReconnect(true);
    if (typeof window === 'undefined') return;

    let attempts = 0;
    const attemptReconnect = () => {
      const storedId = safeGetItem(STORAGE_KEY);
      if (!storedId) return;

      const detected = getWindowWallets();
      if (!detected.length && attempts < MAX_RETRIES) {
        attempts += 1;
        reconnectTimer.current = setTimeout(attemptReconnect, RETRY_DELAY_MS);
        return;
      }

      if (detected.length) {
        void connectWallet(storedId);
      }
    };

    attemptReconnect();

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [hasAttemptedReconnect, connecting, wallet, connectWallet]);

  const connected = useMemo(() => !!wallet && accounts.length > 0, [wallet, accounts]);

  return {
    wallet,
    accounts,
    chainId,
    connecting,
    connected,
    error,
    availableWallets,
    connectWallet,
    disconnectWallet,
  };
}
