'use client';

import React from 'react';
import RecentProposalsCard, {
  RecentProposal,
} from '../RecentProposalsCard';

interface RecentlyPassedCardProps {
  proposals?: RecentProposal[];
}

const RecentlyPassedCard: React.FC<RecentlyPassedCardProps> = ({ proposals }) => (
  <RecentProposalsCard
    title="Recently Passed"
    status="passed"
    proposals={proposals}
  />
);

export default RecentlyPassedCard;
