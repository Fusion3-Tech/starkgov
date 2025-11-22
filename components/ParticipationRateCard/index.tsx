'use client';

import React from 'react';
import MetricStatCard from '../MetricStatCard';

const ParticipationRateCard: React.FC = () => (
  <MetricStatCard
    title="Participation rate"
    value={76}
    valueSuffix="%"
    trend="up"
    deltaLabel="8.5%"
    description="Up from yesterday"
  />
);

export default ParticipationRateCard;
