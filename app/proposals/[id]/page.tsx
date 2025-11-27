'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './ProposalPage.module.scss';
import dashboardStyles from '../../Dashboard.module.scss';
import { useProposals } from '@/hooks/useProposals';
import type { TransformedProposal } from '@/hooks/helpers';
import { getBlockieDataUrl } from '@/lib/blockies';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const formatDate = (timestamp?: number) =>
  timestamp
    ? new Date(timestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    : '—';

const toPercent = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const StateBadge: React.FC<{ state?: string }> = ({ state }) => {
  const label = state || 'unknown';
  return <span className={`${styles.badge} ${styles[`state-${label}`] || ''}`}>{label}</span>;
};

const ProposalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, error, refetch } = useProposals();

  const proposal = useMemo(() => {
    if (!Array.isArray(data)) return null;
    return data.find((p) => p.id === id || p.proposal_id === id);
  }, [data, id]);

  const scores = (proposal?.scores || []).map((s) => Number(s) || 0);
  const [forVotes, againstVotes, abstainVotes] = [scores[0] || 0, scores[1] || 0, scores[2] || 0];
  const totalVotes = forVotes + againstVotes + abstainVotes;
  const percentages = {
    for: toPercent(forVotes, totalVotes),
    against: toPercent(againstVotes, totalVotes),
    abstain: toPercent(abstainVotes, totalVotes),
  };

  const authorBlockie = getBlockieDataUrl(proposal?.author || proposal?.id);

  return (
    <div className={dashboardStyles.shell}>
      <Sidebar />

      <div className={dashboardStyles.main}>
        <Header />

        <section className={styles.page}>
          <header className={styles.header}>
            <div className={styles.breadcrumbs}>
              <button onClick={() => router.push('/')} className={styles.backButton}>
                ← Dashboard
              </button>
              <span className={styles.crumbDivider}>/</span>
              <span className={styles.crumbCurrent}>{proposal?.title || 'Proposal'}</span>
            </div>
            <button onClick={() => refetch()} className={styles.refreshButton}>
              ⟳ Refresh
            </button>
          </header>

          {loading && !proposal ? <div className={styles.status}>Loading proposal...</div> : null}
          {error && <div className={styles.error}>Failed to load proposal: {error}</div>}
          {!loading && !proposal && !error ? (
            <div className={styles.status}>Proposal not found.</div>
          ) : null}

          {proposal ? (
            <div className={styles.contentGrid}>
              <div className={styles.main}>
                <h1 className={styles.title}>{proposal.title || proposal.id}</h1>
                <div className={styles.metaRow}>
                  <div className={styles.author}>
                    {authorBlockie ? <img src={authorBlockie} alt={proposal.author} /> : null}
                    <div className={styles.authorText}>
                      <span className={styles.authorLabel}>Author</span>
                      <span className={styles.authorValue}>{proposal.author}</span>
                    </div>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Created</span>
                    <span className={styles.metaValue}>{formatDate(proposal.created)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>State</span>
                    <StateBadge state={proposal.state} />
                  </div>
                </div>

                <article className={styles.body}>
                  {proposal.body ? proposal.body : 'No description provided.'}
                </article>
              </div>

              <aside className={styles.sidebar}>
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>Summary</h3>
                  <div className={styles.summaryRow}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>For</span>
                      <span className={styles.summaryValue}>{percentages.for}%</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Against</span>
                      <span className={styles.summaryValue}>{percentages.against}%</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Abstain</span>
                      <span className={styles.summaryValue}>{percentages.abstain}%</span>
                    </div>
                  </div>
                  <div className={styles.voteTotals}>
                    <div>
                      <span className={styles.metaLabel}>Total votes</span>
                      <span className={styles.metaValue}>
                        {totalVotes.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className={styles.metaLabel}>Scores total</span>
                      <span className={styles.metaValue}>
                        {proposal.scores_total?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>Choices</h3>
                  <ul className={styles.choiceList}>
                    {(proposal.choices || []).map((choice, idx) => (
                      <li key={choice} className={styles.choiceRow}>
                        <span className={styles.choiceName}>{choice}</span>
                        <span className={styles.choiceValue}>
                          {(scores[idx] || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default ProposalPage;
