"use client";

import { useCallback, useEffect, useState } from "react";

export type CommentSort = "date" | "upvotes";

export interface ProposalComment {
  id: number;
  content?: string;
  parentId?: number | null;
  upvotes?: number;
  downvotes?: number;
  netVotes?: number;
  replies?: ProposalComment[];
  remainingReplies?: number;
  isDeleted?: boolean;
  votes?: { voteType?: "upvote" | "downvote" };
  createdAt?: string;
  author?:
    | string
    | {
        id?: string;
        address?: string;
        walletName?: string;
        publicIdentifier?: string;
        name?: string;
        username?: string;
        ethAddress?: string;
        starknetAddress?: string;
      };
  [key: string]: unknown;
}

interface UseProposalCommentsArgs {
  proposalId?: string;
  sort?: CommentSort;
  limit?: number;
  offset?: number;
}

interface UseProposalCommentsResult {
  comments: ProposalComment[] | null;
  loading: boolean;
  error: string | null;
  moreCommentsAvailable: boolean;
  refetch: () => Promise<void>;
}

const API_BASE =
  process.env.NEXT_PUBLIC_STARKNET_GOV_API ??
  "https://api.governance.starknet.io";

export function useProposalComments({
  proposalId,
  sort = "date",
  limit = 5,
  offset = 1,
}: UseProposalCommentsArgs): UseProposalCommentsResult {
  const [comments, setComments] = useState<ProposalComment[] | null>(null);
  const [moreCommentsAvailable, setMoreCommentsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!proposalId) {
      setComments(null);
      setMoreCommentsAvailable(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const input = {
        json: {
          proposalId,
          sort,
          limit,
          offset,
        },
      };

      const url = `${API_BASE}/trpc/comments.getProposalComments?input=${encodeURIComponent(
        JSON.stringify(input),
      )}`;

      const res = await fetch(url, { method: "GET" });

      if (!res.ok) {
        throw new Error(`API responded with ${res.status}`);
      }

      const json = await res.json();
      const result = json?.result?.data ?? json[0]?.result?.data;
      const payload = result?.json ?? result;

      setComments(payload?.comments ?? []);
      setMoreCommentsAvailable(Boolean(payload?.moreCommentsAvailable));
    } catch (err: any) {
      console.error("Proposal comments fetch error:", err);
      setError(err?.message || "Failed to fetch proposal comments.");
      setComments(null);
      setMoreCommentsAvailable(false);
    } finally {
      setLoading(false);
    }
  }, [proposalId, sort, limit, offset]);

  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    moreCommentsAvailable,
    refetch: fetchComments,
  };
}
