"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export interface PollSimple {
  id: string;
  author: string;
  title?: string;
  body?: string;
  choices?: string[];
  votes?: number;
  scores?: number[];
  quorum?: number;
  quorumType?: string;
  start?: number;
  end?: number;
  snapshot?: string;
  state?: string;
}

interface UsePollsArgs {
  first?: number;
  skip?: number;
  space?: string;
}

interface UsePollsResult {
  polls: PollSimple[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const POLLS_QUERY = `
  query Proposals($first: Int!, $skip: Int!, $space: String!) {
    proposals(
      first: $first,
      skip: $skip,
      where: { space_in: [$space] },
      orderBy: "created",
      orderDirection: desc
    ) {
      id
      author
      title
      body
      choices
      votes
      scores
      quorum
      start
      end
      snapshot
      state
    }
  }
`;

export function usePolls({
  first = 20,
  skip = 0,
  space = "starknet.eth",
}: UsePollsArgs = {}): UsePollsResult {
  const [polls, setPolls] = useState<PollSimple[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SNAPSHOT_ENDPOINT,
    [],
  );

  const fetchPolls = useCallback(async () => {
    if (!endpoint) {
      setError("Snapshot endpoint is not configured.");
      setPolls(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: POLLS_QUERY,
          variables: { first, skip, space },
        }),
      });

      if (!res.ok) {
        throw new Error(`Snapshot API responded with ${res.status}`);
      }

      const json = await res.json();
      if (json.errors?.length) {
        throw new Error(json.errors[0]?.message || "Snapshot query failed.");
      }

      setPolls(json.data?.proposals ?? []);
    } catch (err: any) {
      console.error("Snapshot polls fetch error:", err);
      setError(err?.message || "Failed to fetch polls.");
      setPolls(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint, first, skip, space]);

  useEffect(() => {
    void fetchPolls();
  }, [fetchPolls]);

  return {
    polls,
    loading,
    error,
    refetch: fetchPolls,
  };
}
