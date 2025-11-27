'use client';

import React from 'react';
import styles from './TopDelegationsCard.module.scss';

export interface DelegateItem {
  id: number;
  name: string;
  votes: string; // formatted string, e.g. "7M"
  rank: number;
  avatarUrl?: string;
}

interface TopDelegationsCardProps {
  delegates?: DelegateItem[];
}

const DEFAULT_DELEGATES: DelegateItem[] = [
  { id: 1, name: '0xlenny',       votes: '7M',  rank: 1 },
  { id: 2, name: 'Paco Villetard', votes: '5.8M', rank: 2 },
  { id: 3, name: 'chqrles',       votes: '4.9M', rank: 3 },
  { id: 4, name: '0xAA',          votes: '4.8M', rank: 4 },
  { id: 5, name: 'L2BEAT',        votes: '4.5M', rank: 5 },
  { id: 6, name: 'dan-kakrot',    votes: '4.5M', rank: 6 },
];

const TopDelegationsCard: React.FC<TopDelegationsCardProps> = ({
  delegates = DEFAULT_DELEGATES,
}) => {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>Top 10 delegates</h3>
      </header>

      <div className={styles.list}>
        {delegates.map((d) => (
          <div key={d.id} className={styles.row}>
            <div className={styles.left}>
              <div className={styles.avatar}>
                {/* Replace src with your real avatar if needed */}
                <img
                  src={d.avatarUrl || '/delegate-avatar.png'}
                  alt={d.name}
                />
              </div>

              <div className={styles.meta}>
                <div className={styles.name}>{d.name}</div>
                <div className={styles.subtext}>
                  {d.votes} DELEGATED VOTES
                </div>
              </div>
            </div>

            <div
              className={`${styles.rankBubble} ${
                d.rank === 1 ? styles.rankBubbleTop : ''
              }`}
            >
              #{d.rank}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopDelegationsCard;
