'use client';

import { useCallback, useState } from 'react';

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

export function useStarknetWallet() {
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string | undefined>();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async (): Promise<StarknetWalletConnection | null> => {
    if (typeof window === 'undefined') {
      setError('Wallet connection is only available in the browser.');
      return null;
    }

    const candidate = window.starknet;
    const target = Array.isArray(candidate) ? candidate[0] : candidate;

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

      return { wallet: target, accounts: accountsResult, chainId: currentChain };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Starknet wallet.');
      return null;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setAccounts([]);
    setChainId(undefined);
    setError(null);
  }, []);

  return {
    wallet,
    accounts,
    chainId,
    connecting,
    error,
    connectWallet,
    disconnectWallet,
  };
}
