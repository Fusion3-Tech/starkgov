'use client';

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import styles from './TotalVstrkChart.module.scss';
import { useProposals } from '@/hooks/useProposals';
import type { TransformedProposal } from '@/hooks/helpers';

type DataPoint = {
  x: number; // sequential index
  value: number; // in millions
  dateLabel: string;
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: number;
}> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0].payload as DataPoint | undefined;
  if (!point) return null;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipValue}>{point.value.toFixed(2)}M</div>
      <div className={styles.tooltipSub}>{point.dateLabel}</div>
    </div>
  );
};

const TotalVstrkChart: React.FC = () => {
  const { data: proposals, loading } = useProposals();

  const chartData: DataPoint[] = useMemo(() => {
    const source: TransformedProposal[] = Array.isArray(proposals)
      ? proposals
      : [];

    return source
      .filter(
        (p) =>
          typeof p.created === 'number' &&
          typeof p.scores_total === 'number' &&
          p.scores_total > 0
      )
      .sort((a, b) => (a.created || 0) - (b.created || 0))
      .map((p, idx) => ({
        x: idx + 1,
        value: (p.scores_total || 0) / 1_000_000,
        dateLabel: new Date((p.created || 0) * 1000).toLocaleDateString(
          'en-US',
          {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          }
        ),
      }));
  }, [proposals]);

  const yDomain = useMemo(() => {
    if (!chartData.length) return [0, 1];
    const values = chartData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min || max || 1) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [chartData]);

  const selectedX = chartData.length;

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <span className={styles.title}>vSTRK Used in Voting</span>
        <span className={styles.infoIcon}>i</span>
      </header>

      {!chartData.length && !loading ? (
        <div className={styles.empty}>No proposal voting data yet.</div>
      ) : null}

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, left: 0, right: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="vstrkMain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4338CA" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#4338CA" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="vstrkBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CBD5F5" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#CBD5F5" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={35}
              domain={yDomain as any}
              tickFormatter={(v) => `${v.toFixed(0)}M`}
            />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />

            {/* subtle background fill */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#CBD5F5"
              strokeWidth={2}
              fill="url(#vstrkBg)"
              activeDot={false}
            />

            {/* main line */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#312E81"
              strokeWidth={3}
              fill="url(#vstrkMain)"
            />

            {selectedX ? (
              <ReferenceLine
                x={selectedX}
                stroke="#6366F1"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            ) : null}

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'transparent' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default TotalVstrkChart;
