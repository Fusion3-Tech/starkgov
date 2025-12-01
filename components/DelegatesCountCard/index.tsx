'use client';

import React, { useMemo } from 'react';
import MetricStatCard from '../MetricStatCard';
import { usePolls } from '@/hooks/usePolls';

const DelegatesCountCard: React.FC = () => {
  const { polls } = usePolls();

  const totalPolls = useMemo(() => {
    if (!Array.isArray(polls)) return 0;
    return polls.length;
  }, [polls]);

  const activePolls = useMemo(() => {
    if (!Array.isArray(polls)) return 0;
    return polls.filter((p) => p.state === 'active').length;
  }, [polls]);

  const closedPolls = useMemo(() => {
    if (!Array.isArray(polls)) return 0;
    return polls.filter((p) => p.state === 'closed' || p.state === 'executed').length;
  }, [polls]);

  return (
    <MetricStatCard
      title="Total polls"
      value={totalPolls}
      trend="down"
      deltaLabel={`Active: ${activePolls} • Closed: ${closedPolls}`}
      description=""
    />
  );
};

export default DelegatesCountCard;
