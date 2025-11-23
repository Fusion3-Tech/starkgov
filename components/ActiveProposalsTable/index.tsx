'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './ActiveProposalsTable.module.scss';
import { useProposals } from '@/hooks/useProposals';

export type ProposalCategory = 'Protocol' | 'Security' | 'Other';

export interface Proposal {
  id: string;
  title: string;
  created: number; // timestamp
  end: number; // timestamp
  commentsCount: number;
  ayeValue: number; // in tokens
  nayValue: number; // in tokens
  abstainValue: number; // in tokens
  totalVotes: number; // in tokens
  category: ProposalCategory;
  accountName: string;
}

interface ActiveProposalsTableProps {
  proposals?: Proposal[];
}

/*
const DEFAULT_PROPOSALS: Proposal[] = [
  {
    id: 10,
    title: 'Proposal #10',
    createdAt: '2025-11-22',
    commentsCount: 365,
    yesPercent: 86,
    noPercent: 14,
    category: 'Protocol',
    accountName: 'Starknet',
  },
];
*/

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

const ActiveProposalsTable: React.FC<ActiveProposalsTableProps> = () => {
  const { data, error, loading } = useProposals();
  // TODO: handle error

  const proposals = (data ?? []) as Proposal[];
  console.log(proposals && proposals[0]);

  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [search, setSearch] = useState('');

  const filteredProposals = useMemo(() => {
    const term = search.toLowerCase().trim();

    let items = proposals.filter((p) => {
      if (!term) return true;
      return (
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.accountName.toLowerCase().includes(term)
      );
    });

    items = items.sort((a, b) => a.created - b.created)
    return items;
  }, [proposals, search, sortOrder]);

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>Active Proposals</h2>

        <div className={styles.headerControls}>
          <div className={styles.sortWrapper}>
            <span className={styles.sortLabel}>Sort</span>
            <button
              type="button"
              className={styles.sortButton}
              onClick={() =>
                setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))
              }
            >
              {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
              <span className={styles.sortChevron}>▾</span>
            </button>
          </div>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className={styles.searchIcon}>
              {/* simple magnifying glass icon */}
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
                className={styles.searchSvg}
              >
                <circle cx="11" cy="11" r="6" />
                <line x1="16" y1="16" x2="21" y2="21" />
              </svg>
            </span>
          </div>
        </div>
      </header>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Account</span>
          <span>Proposal Title</span>
          <span>Created</span>
          <span>Comments</span>
          <span>Proposal Vote Progress</span>
          <span>Category</span>
        </div>

        <div className={styles.tableBody}>
          {filteredProposals.map((p) => (
            <div key={p.id} className={styles.row}>
              <div className={styles.accountCell}>
                <div className={styles.avatar}>
                  <div className={styles.avatarInner}>
                    <span className={styles.avatarArrow} />
                  </div>
                </div>
                <div className={styles.accountText}>
                  <span className={styles.accountName}>{p.accountName}</span>
                </div>
              </div>

              <div className={styles.titleCell}>{p.title}</div>
              <div className={styles.createdCell}>{formatDate(p.createdAt)}</div>
              <div className={styles.commentsCell}>{p.commentsCount}</div>

              <div className={styles.progressCell}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressYes}
                    style={{ width: `${p.ayeValue / p.totalVotes * 100}%` }}
                  />
                  <div
                    className={styles.progressNo}
                    style={{ width: `${p.nayValue / p.totalVotes * 100}%` }}
                  />
                </div>
              </div>

              <div className={styles.categoryCell}>
                <span
                  className={`${styles.categoryBadge} ${
                    p.category === 'Protocol'
                      ? styles.categoryProtocol
                      : p.category === 'Security'
                      ? styles.categorySecurity
                      : styles.categoryOther
                  }`}
                >
                  {p.category}
                </span>
              </div>
            </div>
          ))}

          {filteredProposals.length === 0 && (
            <div className={styles.emptyState}>No proposals found.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ActiveProposalsTable;
