"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./PollPage.module.scss";
import dashboardStyles from "../../Dashboard.module.scss";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePolls } from "@/hooks/usePolls";
import type { PollSimple } from "@/hooks/usePolls";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { getBlockieDataUrl } from "@/lib/blockies";
import { formatCompactNumber } from "@/lib/format";
import ProposalQuorum from "@/components/ProposalQuorum";
import ProposalTimeline from "@/components/ProposalTimeline";

const formatDate = (timestamp?: number) =>
  timestamp
    ? new Date(timestamp * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

const formatAuthor = (value?: string) => {
  if (!value) return "—";
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const PollPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { polls, loading, error, refetch } = usePolls();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const poll = useMemo<PollSimple | null>(() => {
    if (!Array.isArray(polls)) return null;
    return polls.find((p) => p.id === id) || null;
  }, [polls, id]);

  const markdownComponents: Components = {
    img: ({ src, alt }) => (src ? <img src={src} alt={alt ?? ""} /> : null),
  };

  const totalScore = poll?.scores?.reduce((sum, val) => sum + (val || 0), 0) || 0;

  return (
    <div className={dashboardStyles.shell}>
      <Sidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
                {poll?.title || "Poll"}
              </span>
            </div>
            <button onClick={() => refetch()} className={styles.refreshButton}>
              ⟳ Refresh
            </button>
          </header>

          {loading && !poll ? (
            <div className={styles.status}>Loading poll...</div>
          ) : null}
          {error && (
            <div className={styles.error}>Failed to load poll: {error}</div>
          )}
          {!loading && !poll && !error ? (
            <div className={styles.status}>Poll not found.</div>
          ) : null}

          {poll ? (
            <div className={styles.contentGrid}>
              <div className={styles.mainColumn}>
                <div className={styles.content}>
                  <h1 className={styles.title}>{poll.title || poll.id}</h1>

                  <div className={styles.metaRow}>
                    <div className={styles.authorBlock}>
                      <div className={styles.avatar}>
                        {(() => {
                          const blockie = getBlockieDataUrl(poll.author);
                          if (blockie) {
                            return <img src={blockie} alt={poll.author} />;
                          }
                          return (
                            <span className={styles.avatarFallback}>
                              {poll.author?.slice(0, 6) || "??"}
                            </span>
                          );
                        })()}
                      </div>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Author</span>
                        <span
                          className={styles.metaValue}
                          title={poll.author || undefined}
                        >
                          {formatAuthor(poll.author)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Created</span>
                      <span className={styles.metaValueStrong}>
                        {formatDate(poll.start)}
                      </span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>State</span>
                      <span className={styles.badge}>
                        {poll.state || "unknown"}
                      </span>
                    </div>
                  </div>

                  <article className={styles.body}>
                    {poll.body ? (
                      <ReactMarkdown components={markdownComponents}>
                        {poll.body}
                      </ReactMarkdown>
                    ) : (
                      "No description provided."
                    )}
                  </article>

                  {poll.choices && poll.choices.length ? (
                    <div className={styles.choices}>
                      {poll.choices.map((choice, idx) => (
                        <div key={idx} className={styles.choiceRow}>
                          <div className={styles.choiceText}>
                            <span className={styles.choiceLabel}>{choice}</span>
                            <span className={styles.choiceIndex}>#{idx + 1}</span>
                          </div>
                          <div className={styles.choiceValue}>
                            <span className={styles.choiceScore}>
                              {poll.scores?.[idx] !== undefined
                                ? formatCompactNumber(poll.scores[idx])
                                : "—"}
                            </span>
                            <div className={styles.choiceBar}>
                              <div
                                className={styles.choiceBarFill}
                                style={{
                                  width: `${
                                    totalScore > 0 && poll.scores?.[idx]
                                      ? Math.min(
                                          100,
                                          (poll.scores[idx] / totalScore) * 100,
                                        )
                                      : 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <aside className={styles.sidebar}>
                <ProposalTimeline start={poll.start} end={poll.end} />
                <ProposalQuorum quorum={poll.quorum} scoresTotal={totalScore} />
              </aside>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default PollPage;
