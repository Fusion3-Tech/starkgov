'use client';

import React from 'react';
import styles from './RecentProposalsCard.module.scss';
import type { TransformedProposal } from '@/hooks/helpers';
import { getBlockieDataUrl } from '@/lib/blockies';

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
  const badgeText = status === 'passed' ? 'Passed' : 'Rejected';
  const emptyText =
    status === 'passed'
      ? 'No passed proposals yet.'
      : 'No rejected proposals yet.';

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </header>

      <div className={styles.list}>
        {proposals.length === 0 ? (
          <div className={styles.empty}>{emptyText}</div>
        ) : (
          proposals.map((p) => (
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
                <div className={styles.proposalTitle}>
                  <a href={`/proposals/${p.id}`} className={styles.link}>
                    {p.title || p.id}
                  </a>
                </div>
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
          ))
        )}
      </div>
    </section>
  );
};

export default RecentProposalsCard;
