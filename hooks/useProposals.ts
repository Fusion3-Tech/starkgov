import { useQuery } from "@apollo/client";
import { GET_PROPOSALS_QUERY } from "./queries";
import {transformProposalData} from "./helpers";

export function useProposals() {
  const space = process.env.NEXT_PUBLIC_SNAPSHOTX_SPACE;
  console.log(space);
  const { data, loading, refetch, error } = useQuery(GET_PROPOSALS_QUERY, {
    variables: { space }, // TODO: correct space
    context: { clientName: "snapshotX" }, // Adding context to route the query to the second link
  });

  const parsedData = transformProposalData(data);

  return { data: parsedData, loading, refetch, error };
}
