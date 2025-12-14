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
  const label = (state || "unknown").toLowerCase();
  const displayLabel = `${label.slice(0, 1).toUpperCase()}${label.slice(1)}`;
  return (
    <span className={`${styles.badge} ${styles[`state-${label}`] || ""}`}>
      {displayLabel}
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

  const totalVotesLabel = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(totalVotes || 0);

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
                <div className={styles.heroCard}>
                  <div className={styles.heroTop}>
                    <div className={styles.pills}>
                      <span className={styles.eyelet}>Governance proposal</span>
                      <StateBadge state={proposal.state} />
                    </div>
                    <button
                      onClick={() => refetch()}
                      className={`${styles.refreshButton} ${styles.refreshGhost}`}
                    >
                      ⟳ Sync latest
                    </button>
                  </div>

                  <h1 className={styles.title}>
                    {proposal.title || proposal.id}
                  </h1>
                  <p className={styles.subtitle}>
                    Voting window {formatDate(proposal.start)} –{" "}
                    {formatDate(proposal.end)} • {proposal.choices?.length || 0}{" "}
                    voting options
                  </p>

                  <div className={styles.metaGrid}>
                    <div className={styles.metaCard}>
                      <span className={styles.metaLabel}>Author</span>
                      <div className={styles.authorMeta}>
                        {authorBlockie ? (
                          <img src={authorBlockie} alt={proposal.author} />
                        ) : null}
                        <div className={styles.authorText}>
                          <span
                            className={styles.authorValue}
                            title={proposal.author || undefined}
                          >
                            {formatAuthor(proposal.author)}
                          </span>
                          <span className={styles.metaHint}>
                            Proposal ID {formatAuthor(proposal.id)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.metaCard}>
                      <span className={styles.metaLabel}>Created</span>
                      <span className={styles.metaValue}>
                        {formatDate(proposal.created)}
                      </span>
                      <span className={styles.metaHint}>
                        Opens {formatDate(proposal.start)}
                      </span>
                    </div>

                    <div className={styles.metaCard}>
                      <span className={styles.metaLabel}>Total votes</span>
                      <span className={styles.metaValue}>{totalVotesLabel}</span>
                      <span className={styles.metaHint}>
                        For {percentages.for}% • Against {percentages.against}% •
                        Abstain {percentages.abstain}%
                      </span>
                    </div>

                    <div className={styles.metaCard}>
                      <span className={styles.metaLabel}>State</span>
                      <span className={styles.metaValue}>
                        {proposal.state || "Unknown"}
                      </span>
                      <span className={styles.metaHint}>
                        Ends {formatDate(proposal.end)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>Proposal overview</p>
                      <h2 className={styles.sectionTitle}>Context & details</h2>
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
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>Community signals</p>
                      <h2 className={styles.sectionTitle}>Discussion</h2>
                    </div>
                  </div>
                  <DiscussionSection
                    proposalId={proposal?.id}
                    proposalState={proposal.state}
                  />
                </div>
              </div>

              <aside className={styles.sidebar}>
                <ProposalTimeline start={proposal.start} end={proposal.end} />

                <ProposalQuorum
                  quorum={proposal.quorum}
                  scoresTotal={proposal.scores_total}
                />

                <ProposalChoices
                  choices={proposal.choices || []}
                  scores={(proposal.scores || []).map((s) => Number(s) || 0)}
                  totalVotes={totalVotes}
                />

                <ProposalExecutionInfo
                  executed={proposal.executed}
                  executedAt={proposal.execution_time}
                  executionData={proposal.execution_strategy}
                  strategy={proposal.execution_strategy}
                  strategyType={proposal.execution_strategy_type}
                  destination={proposal.execution_destination}
                  txHash={proposal.execution_tx}
                />
              </aside>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default ProposalPage;
