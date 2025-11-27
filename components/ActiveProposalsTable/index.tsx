'use client';

import React, { useMemo, useState } from 'react';
import styles from './ActiveProposalsTable.module.scss';
import { useProposals } from '@/hooks/useProposals';
import { TransformedProposal } from '@/hooks/helpers';
import { getBlockieDataUrl } from '@/lib/blockies';
import { formatCompactNumber } from '@/lib/format';
import { useRouter } from 'next/navigation';

interface ActiveProposalsTableProps {
  proposals?: TransformedProposal[];
}

const formatDate = (timestamp?: number) =>
  timestamp
    ? new Date(timestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    : '—';

const formatAccount = (account?: string) => {
  if (!account) return '—';
  if (account.length <= 8) return account;
  return `${account.slice(0, 4)}...${account.slice(-4)}`;
};

const ActiveProposalsTable: React.FC<ActiveProposalsTableProps> = ({
  proposals: proposalsFromProps,
}) => {
  const { data, error } = useProposals();
  const router = useRouter();

  const proposals = useMemo<TransformedProposal[]>(() => {
    if (proposalsFromProps) return proposalsFromProps;
    if (Array.isArray(data)) return data;

    return [];
  }, [data, proposalsFromProps]);

  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [search, setSearch] = useState('');

  const filteredProposals = useMemo(() => {
    const term = search.toLowerCase().trim();

    const items = proposals.filter((p) => {
      if (!term) return true;
      return (
        p.title?.toLowerCase().includes(term) ||
        p.author.toLowerCase().includes(term) ||
        p.state.toLowerCase().includes(term)
      );
    });

    return items.sort((a, b) =>
      sortOrder === 'newest'
        ? (b.created || 0) - (a.created || 0)
        : (a.created || 0) - (b.created || 0)
    );
  }, [proposals, search, sortOrder]);

  if (error) {
    return (
      <section className={styles.card}>
        <header className={styles.header}>
          <h2 className={styles.title}>Active Proposals</h2>
        </header>
        <div className={styles.emptyState}>Unable to load proposals.</div>
      </section>
    );
  }

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
          <span>Votes</span>
          <span>Proposal Vote Progress</span>
          <span>Status</span>
        </div>

        <div className={styles.tableBody}>
          {filteredProposals.map((p) => (
            <div
              key={p.id}
              className={styles.rowLink}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/proposals/${p.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(`/proposals/${p.id}`);
                }
              }}
            >
              <div className={styles.accountCell}>
                <div className={styles.avatar}>
                  {(() => {
                    const blockie = getBlockieDataUrl(p.author);
                    if (blockie) {
                      return <img src={blockie} alt={p.author} />;
                    }
                    return (
                      <span className={styles.avatarFallback}>
                        {formatAccount(p.author)}
                      </span>
                    );
                  })()}
                </div>
                <div className={styles.accountText}>
                  <span className={styles.accountName}>
                    {formatAccount(p.author)}
                  </span>
                </div>
              </div>

              <div className={styles.titleCell}>{p.title || p.id}</div>
              <div className={styles.createdCell}>{formatDate(p.created)}</div>
              <div className={styles.commentsCell}>
                {formatCompactNumber(p.scores_total)}
              </div>

              <div className={styles.progressCell}>
                <div className={styles.progressBar}>
                  {(() => {
                    const [forVotes, againstVotes, abstainVotes] = (
                      p.scores || []
                    ).map((score) => Number(score) || 0);
                    const totalVotes =
                      forVotes + againstVotes + abstainVotes || 1;

                    return (
                      <>
                        <div
                          className={styles.progressYes}
                          style={{
                            width: `${(forVotes / totalVotes) * 100}%`,
                          }}
                        />
                        <div
                          className={styles.progressNo}
                          style={{
                            width: `${(againstVotes / totalVotes) * 100}%`,
                          }}
                        />
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className={styles.categoryCell}>
                <span
                  className={`${styles.categoryBadge} ${
                    p.state === 'executed'
                      ? styles.categoryProtocol
                      : p.state === 'active'
                      ? styles.categorySecurity
                      : styles.categoryOther
                  }`}
                >
                  {p.state}
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
