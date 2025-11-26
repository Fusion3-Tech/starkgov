'use client';

import React from 'react';
import RecentProposalsCard from '../RecentProposalsCard';
import { useProposals } from '@/hooks/useProposals';
import type { TransformedProposal } from '@/hooks/helpers';

const RecentlyPassedCard: React.FC = () => {
  const { data } = useProposals();

  console.log(data);

  const proposals = Array.isArray(data)
    ? (data as TransformedProposal[])
        .filter((p) => p.state === 'closed' && p.scores[0] > p.scores[1])
        .sort((a, b) => (b.created || 0) - (a.created || 0))
        .slice(0, 5)
    : [];

  return (
    <RecentProposalsCard
      title="Recently Passed"
      status="passed"
      proposals={proposals}
    />
  );
};

export default RecentlyPassedCard;
