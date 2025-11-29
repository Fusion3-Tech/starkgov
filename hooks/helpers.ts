export type ProposalState = "executed" | "closed" | "pending" | "active";

export interface ProposalMetadata {
  title?: string;
  body?: string;
  discussion?: string;
  id?: string;
}

export interface SnapshotAuthor {
  id: string;
}

export interface SnapshotProposal {
  snapshot?: string;
  id?: string;
  start?: number;
  quorum?: number;
  created?: number;
  author: SnapshotAuthor;
  proposal_id: string;
  min_end?: number;
  max_end: number;
  execution_strategy?: string;
  execution_destination?: string;
  execution_strategy_type?: string;
  execution_time?: number;
  execution_tx?: string;
  scores_total?: bigint | number | string;
  scores_1?: bigint | number | string; // aye
  scores_2?: bigint | number | string; // nay
  scores_3?: bigint | number | string; // abstain
  completed?: boolean;
  vetoed?: boolean;
  executed?: boolean;
  cancelled?: boolean;
  metadata?: ProposalMetadata;
}

export interface ProposalsQueryData {
  proposals: SnapshotProposal[];
}

export interface TransformedProposal
  extends Omit<
      SnapshotProposal,
      | "author"
      | "max_end"
      | "proposal_id"
      | "metadata"
      | "scores_total"
      | "scores_1"
      | "scores_2"
      | "scores_3"
    >,
    ProposalMetadata {
  author: string;
  end: number;
  id: string;
  ipfs?: string;
  choices: string[];
  scores_total: number;
  scores: [string, string, string];
  state: ProposalState;
}

export const transformProposalData = (
  data?: ProposalsQueryData | null
): TransformedProposal[] | ProposalsQueryData | null | undefined => {
  if (data && data.proposals && data.proposals.length) {
    return data.proposals.map((proposal) => transformProposal(proposal));
  }

  return data;
};

export const transformProposal = (
  proposal: SnapshotProposal
): TransformedProposal => {
  const timeNow = Date.now();

  return {
    ...proposal,
    ...proposal.metadata,
    author: proposal.author.id,
    end: proposal.max_end,
    id: proposal.proposal_id,
    ipfs: proposal?.metadata?.id,
    choices: ["For", "Against", "Abstain"],
    scores_total:
      parseFloat(BigInt(proposal.scores_total || 0n).toString()) /
      Math.pow(10, 18),
    scores: [
      (
        parseFloat(BigInt(proposal.scores_1 || 0n).toString()) /
        Math.pow(10, 18)
      ).toFixed(4),
      (
        parseFloat(BigInt(proposal.scores_2 || 0n).toString()) /
        Math.pow(10, 18)
      ).toFixed(4),
      (
        parseFloat(BigInt(proposal.scores_3 || 0n).toString()) /
        Math.pow(10, 18)
      ).toFixed(4),
    ],
    state: getProposalState(proposal, timeNow),
  };
};

function getProposalState(
  proposal: Pick<SnapshotProposal, "executed" | "max_end" | "start">,
  current: number
): ProposalState {
  if (proposal.executed) return "executed";
  if ((proposal.max_end || 0) * 1000 <= current) {
    return "closed";
  }
  if ((proposal.start || 0) * 1000 > current) return "pending";

  return "active";
}
