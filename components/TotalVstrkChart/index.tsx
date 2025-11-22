'use client';

import React from 'react';
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

type DataPoint = {
  x: number;      // 1..7
  value: number;  // in millions
  value2: number; // background/light series
  month: string;
};

const data: DataPoint[] = [
  { x: 1, value: 155, value2: 150, month: 'Jan' },
  { x: 2, value: 170, value2: 165, month: 'Feb' },
  { x: 3, value: 180, value2: 175, month: 'Mar' },
  { x: 4, value: 220, value2: 200, month: 'Apr' },
  { x: 5, value: 250, value2: 210, month: 'May' },
  { x: 6, value: 190, value2: 180, month: 'Jun' },
  { x: 7, value: 200, value2: 190, month: 'Jul' },
];

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: number;
}> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0].payload as DataPoint;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipValue}>{point.value}M</div>
      <div className={styles.tooltipSub}>{point.month}</div>
    </div>
  );
};

const TotalVstrkChart: React.FC = () => {
  // index of the “selected” point (3 => x:4 in example)
  const selectedX = 4;

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <span className={styles.title}>Total vSTRK</span>
        <span className={styles.infoIcon}>i</span>
      </header>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, left: 0, right: 0, bottom: 0 }}>
            {/* gradients */}
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
              domain={[140, 260]}
              ticks={[140, 180, 220, 260]}
              tickFormatter={(v) => `${v}M`}
            />
            <XAxis
              dataKey="x"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />

            {/* light background line */}
            <Area
              type="monotone"
              dataKey="value2"
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

            {/* dashed vertical line at selected x */}
            <ReferenceLine
              x={selectedX}
              stroke="#6366F1"
              strokeDasharray="4 4"
              strokeWidth={1}
            />

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
