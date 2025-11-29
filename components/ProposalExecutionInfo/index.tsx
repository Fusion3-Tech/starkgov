'use client';

import React from 'react';
import styles from './ProposalExecutionInfo.module.scss';

interface Props {
  executed?: boolean;
  executedAt?: number;
  executionData?: string;
  strategy?: string;
  destination?: string;
  strategyType?: string;
  txHash?: string;
}

const ProposalExecutionInfo: React.FC<Props> = ({
  executed = false,
  executedAt,
  executionData,
  strategy,
  destination,
  strategyType,
  txHash,
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Execution</h3>
      <div className={styles.statusRow}>
        <span className={`${styles.statusDot} ${executed ? styles.done : styles.pending}`} />
        <span className={styles.statusText}>{executed ? 'Executed' : 'Not executed'}</span>
      </div>
      {executedAt ? (
        <div className={styles.detail}>
          <span className={styles.label}>Executed at</span>
          <span className={styles.value}>
            {new Date(executedAt * 1000).toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      ) : null}
      <div className={styles.detail}>
        <span className={styles.label}>Execution data</span>
        <span className={styles.value}>
          {executionData ? executionData : 'No execution data available.'}
        </span>
      </div>

      {strategy ? (
        <div className={styles.detail}>
          <span className={styles.label}>Strategy</span>
          <span className={styles.value}>{strategyType ? `${strategyType} - ${strategy}` : strategy}</span>
        </div>
      ) : null}

      {destination ? (
        <div className={styles.detail}>
          <span className={styles.label}>Destination</span>
          <span className={styles.value}>{destination}</span>
        </div>
      ) : null}

      {txHash ? (
        <div className={styles.detail}>
          <span className={styles.label}>Tx hash</span>
          <span className={styles.value}>{txHash}</span>
        </div>
      ) : null}
    </div>
  );
};

export default ProposalExecutionInfo;
