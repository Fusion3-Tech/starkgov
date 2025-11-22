'use client';

import React from 'react';
import styles from './RecentProposalsCard.module.scss';

export type ProposalStatus = 'passed' | 'rejected';

export interface RecentProposal {
  id: number;
  title: string;
  createdAt: string; // ISO date string
}

interface RecentProposalsCardProps {
  title: string; // e.g. "Recently Passed"
  status: ProposalStatus;
  proposals?: RecentProposal[];
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
  proposals = [
    { id: 1, title: 'Proposal #10', createdAt: '2024-11-22' },
    { id: 2, title: 'Proposal #10', createdAt: '2024-11-22' },
    { id: 3, title: 'Proposal #10', createdAt: '2024-11-22' },
    { id: 4, title: 'Proposal #10', createdAt: '2024-11-22' },
    { id: 5, title: 'Proposal #10', createdAt: '2024-11-22' },
  ],
}) => {
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
                <div className={styles.avatarInner}>
                  <span className={styles.avatarArrow} />
                </div>
              </div>

              <div className={styles.meta}>
                <div className={styles.proposalTitle}>{p.title}</div>
                <div className={styles.date}>{formatDate(p.createdAt)}</div>
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
