'use client';

import React from 'react';
import styles from './ProposalQuorum.module.scss';
import { formatCompactNumber } from '@/lib/format';

interface Props {
  quorum?: number;
  scoresTotal?: number;
}

const ProposalQuorum: React.FC<Props> = ({ quorum = 0, scoresTotal = 0 }) => {
  const reached = scoresTotal >= quorum;
  const pct = quorum > 0 ? Math.min(100, (scoresTotal / quorum) * 100) : 0;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Quorum</h3>
      <div className={styles.meta}>
        <div>
          <div className={styles.label}>Required</div>
          <div className={styles.value}>{formatCompactNumber(quorum)}</div>
        </div>
        <div>
          <div className={styles.label}>Current</div>
          <div className={`${styles.value} ${reached ? styles.success : styles.neutral}`}>
            {formatCompactNumber(scoresTotal)}
          </div>
        </div>
      </div>
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${reached ? styles.fillSuccess : ''}`}
          style={{ width: `${Math.max(4, pct)}%` }}
        />
      </div>
      <div className={styles.footer}>
        {reached ? 'Quorum reached' : 'Quorum not reached yet'}
      </div>
    </div>
  );
};

export default ProposalQuorum;
