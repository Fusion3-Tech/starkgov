'use client';

import React from 'react';
import styles from './RecentProposalsCard.module.scss';
import type { TransformedProposal } from '@/hooks/helpers';
import blockies from 'ethereum-blockies';

export type ProposalStatus = 'passed' | 'rejected';

interface RecentProposalsCardProps {
  title: string; // e.g. "Recently Passed"
  status: ProposalStatus;
  proposals?: TransformedProposal[];
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

const RecentProposalsCard: React.FC<RecentProposalsCardProps> = ({
  title,
  status,
  proposals = [],
}) => {
  const getBlockieDataUrl = (seed?: string) => {
    if (!seed) return '';
    try {
      const icon = blockies.create({
        seed: seed.toLowerCase(),
        size: 8,
        scale: 8,
      });
      return icon?.toDataURL?.() ?? '';
    } catch (err) {
      console.error('Blockies generation failed', err);
      return '';
    }
  };

  const badgeText = status === 'passed' ? 'Passed' : 'Rejected';

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </header>

      <div className={styles.list}>
        {proposals.map((p) => (
          <div key={p.id} className={styles.row}>
            <div className={styles.left}>
              <div className={styles.avatar}>
                {(() => {
                  const blockie = getBlockieDataUrl(p.author);
                  return blockie ? (
                    <img src={blockie} alt={p.author} />
                  ) : (
                    <span className={styles.avatarFallback}>
                      {p.author}
                    </span>
                  );
                })()}
              </div>

              <div className={styles.meta}>
                <div className={styles.proposalTitle}>{p.title || p.id}</div>
                <div className={styles.date}>
                  {p.created
                    ? formatDate(new Date(p.created * 1000).toISOString())
                    : '—'}
                </div>
              </div>
            </div>

            <span
              className={`${styles.badge} ${
                status === 'passed' ? styles.badgePassed : styles.badgeRejected
              }`}
            >
              {badgeText}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentProposalsCard;
