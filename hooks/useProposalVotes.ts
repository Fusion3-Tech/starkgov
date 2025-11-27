"use client";

import { useEffect, useState, useCallback } from "react";

export interface ProposalVote {
  voter: string;
  choice: "for" | "against" | "abstain";
  votingPower: number;
  comment?: string;
  createdAt?: string;
}

export interface UseProposalVotesResult {
  votes: ProposalVote[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const API_BASE =
  process.env.NEXT_PUBLIC_STARKNET_GOV_API ??
  "https://api.governance.starknet.io";

export function useProposalVotes(proposalId?: string): UseProposalVotesResult {
  const [votes, setVotes] = useState<ProposalVote[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVotes = useCallback(async () => {
    if (!proposalId) return;
    setLoading(true);
    setError(null);

    try {
      // NOTE: adjust endpoint if needed
      const url = `${API_BASE}/trpc/votes.getAll?input=${encodeURIComponent(
        JSON.stringify({ json: { proposalId } })
      )}`;
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) {
        throw new Error(`API responded with ${res.status}`);
      }
      const json = await res.json();
      const result = json?.result?.data;
      const list: ProposalVote[] = Array.isArray(result?.json)
        ? result.json
            .filter((v: any) => v.proposalId === proposalId)
            .map((v: any) => {
              const rawChoice = v.vote?.toLowerCase?.();
              const choice: ProposalVote["choice"] =
                rawChoice === "against"
                  ? "against"
                  : rawChoice === "abstain"
                  ? "abstain"
                  : "for";
              return {
                voter: v.voterAddress || v.voter || v.address || v.userId || "",
                choice,
                votingPower: Number(v.votingPower ?? v.power ?? 0),
                comment: v.comment,
                createdAt: v.createdAt,
              };
            })
        : [];

      console.log(list);

      setVotes(list);
    } catch (err: any) {
      console.error("Proposal votes fetch error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [proposalId]);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  return { votes, loading, error, refetch: fetchVotes };
}
