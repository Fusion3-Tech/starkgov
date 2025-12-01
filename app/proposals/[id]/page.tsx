"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./ProposalPage.module.scss";
import dashboardStyles from "../../Dashboard.module.scss";
import { useProposals } from "@/hooks/useProposals";
import type { TransformedProposal } from "@/hooks/helpers";
import { getBlockieDataUrl } from "@/lib/blockies";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import ProposalTimeline from "@/components/ProposalTimeline";
import ProposalQuorum from "@/components/ProposalQuorum";
import ProposalExecutionInfo from "@/components/ProposalExecutionInfo";
import ProposalChoices from "@/components/ProposalChoices";
import DiscussionSection from "./Discussion";

const formatDate = (timestamp?: number) =>
  timestamp
    ? new Date(timestamp * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

const toPercent = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const formatAuthor = (value?: string) => {
  if (!value) return "—";
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const StateBadge: React.FC<{ state?: string }> = ({ state }) => {
  const label = state || "unknown";
  return (
    <span className={`${styles.badge} ${styles[`state-${label}`] || ""}`}>
      {label}
    </span>
  );
};

const ProposalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, error, refetch } = useProposals();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const proposal = useMemo(() => {
    if (!Array.isArray(data)) return null;
    return data.find((p) => p.id === id);
  }, [data, id]);

  const scores = (proposal?.scores || []).map((s) => Number(s) || 0);
  const [forVotes, againstVotes, abstainVotes] = [
    scores[0] || 0,
    scores[1] || 0,
    scores[2] || 0,
  ];
  const totalVotes = forVotes + againstVotes + abstainVotes;
  const percentages = {
    for: toPercent(forVotes, totalVotes),
    against: toPercent(againstVotes, totalVotes),
    abstain: toPercent(abstainVotes, totalVotes),
  };

  const authorBlockie = getBlockieDataUrl(proposal?.author || proposal?.id);
  const markdownComponents: Components = {
    img: ({ node, src, alt, ...props }) =>
      src ? <img src={src} alt={alt ?? ""} {...props} /> : null,
  };

  return (
    <div className={dashboardStyles.shell}>
      <Sidebar
        isMobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={dashboardStyles.main}>
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <section className={styles.page}>
          <header className={styles.header}>
            <div className={styles.breadcrumbs}>
              <button
                onClick={() => router.push("/")}
                className={styles.backButton}
              >
                ← Dashboard
              </button>
              <span className={styles.crumbDivider}>/</span>
              <span className={styles.crumbCurrent}>
                {proposal?.title || "Proposal"}
              </span>
            </div>
            <button onClick={() => refetch()} className={styles.refreshButton}>
              ⟳ Refresh
            </button>
          </header>

          {loading && !proposal ? (
            <div className={styles.status}>Loading proposal...</div>
          ) : null}
          {error && (
            <div className={styles.error}>
              Failed to load proposal: {error.message}
            </div>
          )}
          {!loading && !proposal && !error ? (
            <div className={styles.status}>Proposal not found.</div>
          ) : null}

          {proposal ? (
            <div className={styles.contentGrid}>
              <div className={styles.main}>
                <h1 className={styles.title}>
                  {proposal.title || proposal.id}
                </h1>
                <div className={styles.metaRow}>
                  <div className={styles.author}>
                    {authorBlockie ? (
                      <img src={authorBlockie} alt={proposal.author} />
                    ) : null}
                    <div className={styles.authorText}>
                      <span className={styles.authorLabel}>Author</span>
                      <span
                        className={styles.authorValue}
                        title={proposal.author || undefined}
                      >
                        {formatAuthor(proposal.author)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Created</span>
                    <span className={styles.metaValue}>
                      {formatDate(proposal.created)}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>State</span>
                    <StateBadge state={proposal.state} />
                  </div>
                </div>

                <article className={styles.body}>
                  {proposal.body ? (
                    <ReactMarkdown components={markdownComponents}>
                      {proposal.body}
                    </ReactMarkdown>
                  ) : (
                    "No description provided."
                  )}
                </article>

                <DiscussionSection
                  proposalId={proposal?.id}
                  proposalState={proposal.state}
                />
              </div>

              <aside className={styles.sidebar}>
                <div className={styles.card}>
                  <ProposalTimeline start={proposal.start} end={proposal.end} />
                </div>

                <div className={styles.card}>
                  <ProposalQuorum quorum={proposal.quorum} scoresTotal={proposal.scores_total} />
                </div>

                <ProposalChoices
                  choices={proposal.choices || []}
                  scores={(proposal.scores || []).map((s) => Number(s) || 0)}
                  totalVotes={totalVotes}
                />

                <div className={styles.card}>
                  <ProposalExecutionInfo
                    executed={proposal.executed}
                    executedAt={proposal.execution_time}
                    executionData={proposal.execution_strategy}
                    strategy={proposal.execution_strategy}
                    strategyType={proposal.execution_strategy_type}
                    destination={proposal.execution_destination}
                    txHash={proposal.execution_tx}
                  />
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
