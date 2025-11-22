"use client";

import ActiveProposalsTable from "@/components/ActiveProposalsTable";
import DelegatesCountCard from "@/components/DelegatesCountCard";
import ParticipationRateCard from "@/components/ParticipationRateCard";
import RecentlyPassedCard from "@/components/RecentlyPassedCard";
import RecentlyRejectedCard from "@/components/RecentlyRejected";
import { useProposals } from "@/hooks/useProposals";

export default function Page() {
  const { data, loading, error } = useProposals();

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);
  return (
    <div>
      {data.map((proposal: any) => (
        <div key={proposal.snapshot}>{proposal.metadata.title}</div>
      ))}
      <ActiveProposalsTable />
      <RecentlyPassedCard />
      <RecentlyRejectedCard />
      <ParticipationRateCard />
      <DelegatesCountCard />
    </div>
  );
}
