import { gql } from "@apollo/client";

// TODO: filter based on `space`.
export const GET_PROPOSALS_QUERY = gql`
  query ProposalsSnapshotX {
    proposals {
      snapshot
      id
      start
      quorum
      created
      author {
        id
      }
      proposal_id
      min_end
      max_end
      scores_total
      scores_1
      scores_2
      scores_3
      completed
      vetoed
      executed
      cancelled
      metadata {
        title
        body
        discussion
      }
    }
  }
`;
