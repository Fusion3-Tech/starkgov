'use client';

import React from 'react';
import styles from './ProposalTimeline.module.scss';
import { formatDate } from '@/lib/format';

interface Props {
  start?: number;
  end?: number;
}

const ProposalTimeline: React.FC<Props> = ({ start, end }) => {
  const now = Date.now() / 1000;
  const position = (() => {
    if (!start || !end || end <= start) return null;
    const clamped = Math.min(Math.max(now, start), end);
    const pct = ((clamped - start) / (end - start)) * 100;
    return pct;
  })();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Timeline</h3>
      <div className={styles.line}>
        <div className={styles.dotStart} />
        <div className={styles.track}>
          <div className={styles.fill} />
        </div>
        <div className={styles.dotEnd} />
        {position !== null ? (
          <div
            className={styles.nowDot}
            style={{ left: `${position}%` }}
            title="Now"
          >
            <span className={styles.nowLabel}>Now</span>
          </div>
        ) : null}
      </div>
      <div className={styles.labels}>
        <div className={styles.label}>
          <span className={styles.labelHeading}>Start</span>
          <span className={styles.labelValue}>{formatDate(start)}</span>
        </div>
        <div className={styles.labelEnd}>
          <span className={styles.labelHeading}>End</span>
          <span className={styles.labelValue}>{formatDate(end)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProposalTimeline;
