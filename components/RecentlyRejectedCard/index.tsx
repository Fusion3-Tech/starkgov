'use client';

import React from 'react';
import RecentProposalsCard, {
  RecentProposal,
} from '../RecentProposalsCard';

interface RecentlyRejectedCardProps {
  proposals?: RecentProposal[];
}

const RecentlyRejectedCard: React.FC<RecentlyRejectedCardProps> = ({ proposals }) => (
  <RecentProposalsCard
    title="Recently Rejected"
    status="rejected"
    proposals={proposals}
  />
);

export default RecentlyRejectedCard;
