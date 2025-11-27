'use client';

import React, { useMemo } from 'react';
import styles from './ProposalSummaryGauge.module.scss';

interface Props {
  forPercent: number;
  againstPercent: number;
  abstainPercent: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, n || 0));

const ProposalSummaryGauge: React.FC<Props> = ({
  forPercent,
  againstPercent,
  abstainPercent,
}) => {
  const { forPct, againstPct, abstainPct, arcLength, radius, cx, cy } = useMemo(() => {
    const forPct = clamp(forPercent);
    const againstPct = clamp(againstPercent);
    const abstainPct = clamp(abstainPercent);
    const radius = 78;
    const cx = 100;
    const cy = 100;
    const arcLength = Math.PI * radius;
    return { forPct, againstPct, abstainPct, arcLength, radius, cx, cy };
  }, [forPercent, againstPercent, abstainPercent]);

  const pathD = useMemo(() => {
    const startX = 100 - radius;
    const endX = 100 + radius;
    return `M${startX} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${cy}`;
  }, [radius, cy]);

  const seg = (pct: number, offsetPct: number, color: string) => {
    const len = (pct / 100) * arcLength;
    const offset = (offsetPct / 100) * arcLength;
    return (
      <path
        d={pathD}
        className={styles.segment}
        stroke={color}
        strokeDasharray={`${len} ${arcLength}`}
        strokeDashoffset={-offset}
      />
    );
  };

  return (
    <div className={styles.gaugeCard}>
      <div className={styles.gaugeArc}>
        <svg viewBox="0 0 200 120" className={styles.svg}>
          <path d={pathD} className={styles.base} />
          {seg(forPct, 0, '#4ade80')}
          {seg(abstainPct, forPct, '#6b7280')}
          {seg(againstPct, forPct + abstainPct, '#f87171')}
        </svg>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>For</span>
          <span className={styles.valueFor}>{forPct}%</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.label}>Abstain</span>
          <span className={styles.valueAbstain}>{abstainPct}%</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.label}>Against</span>
          <span className={styles.valueAgainst}>{againstPct}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProposalSummaryGauge;
