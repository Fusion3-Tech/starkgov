"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

export interface DelegateFilters {
  filters?: any[];         // Eg: ["active"], depends on their schema
  searchQuery?: string;    // Eg: "alice"
  sortBy?: string;         // Eg: "delegatedVotingPower"
  limit?: number;
  offset?: number;
}

export interface Delegate {
  address: string;
  bio?: string;
  votingPower: number;
  participationRate: number;
  // Add more fields once you inspect the API response
}

interface UseDelegatesResult {
  delegates: Delegate[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_STARKNET_GOV_API 
  ?? "https://api.governance.starknet.io"; // default

export function useDelegates({
  filters = [],
  searchQuery = "",
  sortBy = "",
  limit = 20,
  offset = 0,
}: DelegateFilters = {}): UseDelegatesResult {
  
  const filtersKey = useMemo(
    () => JSON.stringify(filters ?? []),
    [filters]
  );

  const normalizedFilters = useMemo(
    () => (filtersKey ? JSON.parse(filtersKey) : []),
    [filtersKey]
  );

  const [delegates, setDelegates] = useState<Delegate[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDelegates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare input for the tRPC call
      const input = {
        json: {
          filters: normalizedFilters,
          searchQuery,
          limit,
          offset,
          sortBy
        }
      };

      const url = `${API_BASE}/trpc/delegates.getDelegatesWithSortingAndFilters?input=${encodeURIComponent(
        JSON.stringify(input)
      )}`;

      const res = await fetch(url, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`API responded with ${res.status}`);
      }

      const json = await res.json();

      // tRPC batch always returns as array with index 0 for input 0
      const result = json?.result?.data ?? json[0]?.result?.data;


      setDelegates(result.json || []);
    } catch (err: any) {
      console.error("Delegate fetch error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filtersKey, normalizedFilters, searchQuery, sortBy, limit, offset]);

  useEffect(() => {
    fetchDelegates();
  }, [fetchDelegates]);

  return {
    delegates,
    loading,
    error,
    refetch: fetchDelegates,
  };
}
