'use client';

import React from 'react';
import styles from './TopDelegationsCard.module.scss';
import { useDelegates } from '@/hooks/useDelegates';

export interface DelegateItem {
  id: string | number;
  name: string;
  votes: string; // formatted string, e.g. "7M"
  rank: number;
  avatarUrl?: string;
}

interface TopDelegationsCardProps {
  delegates?: DelegateItem[];
}

const TopDelegationsCard: React.FC<TopDelegationsCardProps> = ({
  delegates,
}) => {
  const {
    delegates: fetchedDelegates,
    loading,
    error,
  } = useDelegates({ limit: 10, sortBy: 'delegatedVotingPower' });

  const formatVotes = (votes: number) => {
    if (votes >= 1_000_000) return `${(votes / 1_000_000).toFixed(1)}M`;
    if (votes >= 1_000) return `${(votes / 1_000).toFixed(1)}K`;
    return `${votes}`;
  };

  const shortenAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : 'Unknown';

  const mappedDelegates: DelegateItem[] | undefined = (fetchedDelegates ?? [])
    .slice(0, 10)
    .map((d, idx) => {
      const extra = d as Record<string, any>;
      const author = (extra?.author ?? {}) as Record<string, any>;
      const votingInfo = (extra?.votingInfo ?? {}) as Record<string, any>;
      const address =
        author?.publicIdentifier || author?.address || d.address || '';

      const displayName =
        author?.name ||
        author?.username ||
        extra?.name ||
        extra?.username ||
        extra?.displayName ||
        shortenAddress(address);

      const votesValueRaw =
        typeof votingInfo?.votingPower === 'number'
          ? votingInfo.votingPower
          : typeof d.votingPower === 'number'
          ? d.votingPower
          : Number(
              (d as Record<string, any>)?.votingPower ??
                votingInfo?.votingPower ??
                0
            );

      return {
        id: extra?.id || author?.id || address || idx,
        name: displayName,
        votes: formatVotes(votesValueRaw),
        rank: idx + 1,
        avatarUrl:
          extra?.avatarUrl ||
          extra?.avatar ||
          extra?.profilePictureUrl ||
          extra?.imageUrl ||
          author?.profileImage ||
          author?.ensAvatar,
      };
    });

  const displayDelegates = mappedDelegates ?? delegates ?? [];

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>Top 10 delegations</h3>
        {error && <div className={styles.error}>Failed to load latest data</div>}
      </header>

      <div className={styles.list}>
        {loading && !mappedDelegates?.length ? (
          <div className={styles.subtext}>Loading...</div>
        ) : null}
        {displayDelegates.map((d) => (
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
