import { gql } from "@apollo/client";

export const GET_PROPOSALS_QUERY = gql`
  query ProposalsSnapshotX($space: String!) {
      proposals(where: { space_in: [$space] }) {
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
      execution_strategy
      execution_destination
      execution_strategy_type
      execution_time
      execution_tx
      cancelled
      metadata {
        title
        body
        discussion
      }
    }
  }
`;
