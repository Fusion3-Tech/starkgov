// TODO: specify types.

export const transformProposalData = (data: any) => {
  if (data && data.proposals && data.proposals.length) {
    return data.proposals.map((proposal: any) => transformProposal(proposal));
  } else {
    return data;
  }
};

export const transformProposal = (proposal: any) => {
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

function getProposalState(proposal: any, current: number) {
  if (proposal.executed) return "executed";
  if (proposal.max_end * 1000 <= current) {
    return "closed";
  }
  if (proposal.start * 1000 > current) return "pending";

  return "active";
}
