'use client';

import React from 'react';
import MetricStatCard from '../MetricStatCard';

const DelegatesCountCard: React.FC = () => (
  <MetricStatCard
    title="Number of delegates"
    value={203}
    trend="down"
    deltaLabel="4.3%"
    description="Down from yesterday"
  />
);

export default DelegatesCountCard;
