'use client';

import React from 'react';
import styles from './TopDelegatesCard.module.scss';
import { useDelegates } from '@/hooks/useDelegates';
import { getBlockieDataUrl } from '@/lib/blockies';
import type { SyntheticEvent } from 'react';

export interface DelegateItem {
  id: string | number;
  name: string;
  votes: string; // formatted string, e.g. "7M"
  rank: number;
  avatarUrl?: string;
}

interface TopDelegatesCardProps {
  delegates?: DelegateItem[];
}

const TopDelegatesCard: React.FC<TopDelegatesCardProps> = ({
  delegates,
}) => {

  const {
    delegates: fetchedDelegates,
    loading,
    error,
  } = useDelegates({ limit: 10, sortBy: 'votingPower' });

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

      const getSocialAvatar = () => {
        const twitterHandle = author?.twitter || extra?.twitter;
        if (twitterHandle) {
          return `https://unavatar.io/twitter/${twitterHandle}`;
        }
        return undefined;
      };

      const toNumber = (value: unknown) => {
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
      };

      const displayName = author?.username || shortenAddress(address);

      const votesValueRaw = toNumber(
        votingInfo?.votingPower ?? d.votingPower ?? 0
      );

      return {
        id: extra?.id || author?.id || address || idx,
        name: displayName,
        votes: formatVotes(votesValueRaw),
        rank: idx + 1,
        // Prefer user-provided avatars; otherwise use blockies for the address.
        avatarUrl:
          extra?.avatarUrl ||
          extra?.avatar ||
          extra?.profilePictureUrl ||
          extra?.imageUrl ||
          author?.profileImage ||
          author?.ensAvatar ||
          getSocialAvatar() ||
          getBlockieDataUrl(address || extra?.id || String(idx)),
      };
    });

  const displayDelegates = mappedDelegates ?? delegates ?? [];

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>Top 10 delegates</h3>
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
                <img
                  src={d.avatarUrl || getBlockieDataUrl(String(d.id))}
                  alt={d.name}
                  onError={(e: SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getBlockieDataUrl(String(d.id));
                  }}
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

export default TopDelegatesCard;
