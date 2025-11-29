'use client';

import React from 'react';
import styles from './ProposalChoices.module.scss';
import { formatCompactNumber } from '@/lib/format';

interface Props {
  choices: string[];
  scores: number[];
  totalVotes: number;
}

const ProposalChoices: React.FC<Props> = ({ choices, scores, totalVotes }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Choices</h3>
      <ul className={styles.choiceList}>
        {choices.map((choice, idx) => {
          const normalizedChoice = choice.toLowerCase();
          const choiceTone =
            normalizedChoice.includes('for') || normalizedChoice.includes('yes')
              ? 'for'
              : normalizedChoice.includes('against') || normalizedChoice.includes('no')
              ? 'against'
              : 'neutral';

          return (
            <li key={choice} className={`${styles.choiceRow} ${styles[`choice-${choiceTone}`]}`}>
              <div className={styles.choiceHeader}>
                <span className={styles.choiceName}>{choice}</span>
                <div className={styles.choiceMeta}>
                  <span className={styles.choiceValue}>{formatCompactNumber(scores[idx] || 0)}</span>
                  <span className={styles.choicePercent}>
                    {totalVotes > 0
                      ? `${Math.round(((scores[idx] || 0) / totalVotes) * 100)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
              <div className={styles.choiceBar}>
                <span
                  className={styles.choiceBarFill}
                  style={{
                    width: totalVotes
                      ? `${Math.max(
                          4,
                          Math.min(100, ((scores[idx] || 0) / totalVotes) * 100)
                        )}%`
                      : '4%',
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProposalChoices;
