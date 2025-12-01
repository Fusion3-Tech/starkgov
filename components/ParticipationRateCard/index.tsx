'use client';

import React, { useMemo } from 'react';
import MetricStatCard from '../MetricStatCard';
import { useProposals } from '@/hooks/useProposals';

const ParticipationRateCard: React.FC = () => {
  const { data } = useProposals();

  const proposalCount = useMemo(() => {
    if (!Array.isArray(data)) return 0;
    return data.length;
  }, [data]);

  const activeCount = useMemo(() => {
    if (!Array.isArray(data)) return 0;
    return data.filter((p) => p.state === 'active').length;
  }, [data]);

  const closedCount = useMemo(() => {
    if (!Array.isArray(data)) return 0;
    return data.filter((p) => p.state === 'closed' || p.state === 'executed').length;
  }, [data]);

  return (
    <MetricStatCard
      title="Total proposals"
      value={proposalCount}
      valueSuffix=""
      trend="neutral"
      deltaLabel={`Active: ${activeCount} • Closed: ${closedCount}`}
      description=""
    />
  );
};

export default ParticipationRateCard;
