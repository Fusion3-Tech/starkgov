"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./PollPage.module.scss";
import dashboardStyles from "../../Dashboard.module.scss";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePolls } from "@/hooks/usePolls";
import type { PollSimple } from "@/hooks/usePolls";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const formatDate = (timestamp?: number) =>
  timestamp
    ? new Date(timestamp * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

const PollPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { polls, loading, error, refetch } = usePolls();

  const poll = useMemo<PollSimple | null>(() => {
    if (!Array.isArray(polls)) return null;
    return polls.find((p) => p.id === id) || null;
  }, [polls, id]);

  const markdownComponents: Components = {
    img: ({ src, alt }) => (src ? <img src={src} alt={alt ?? ""} /> : null),
  };

  return (
    <div className={dashboardStyles.shell}>
      <Sidebar isMobileOpen={false} onClose={() => undefined} />

      <div className={dashboardStyles.main}>
        <Header onMenuClick={() => router.push("/")} />

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
            <div className={styles.content}>
              <h1 className={styles.title}>{poll.title || poll.id}</h1>

              <div className={styles.metaRow}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Author</span>
                  <span className={styles.metaValue}>{poll.author}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Start</span>
                  <span className={styles.metaValue}>{formatDate(poll.start)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>End</span>
                  <span className={styles.metaValue}>{formatDate(poll.end)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>State</span>
                  <span className={styles.badge}>{poll.state || "unknown"}</span>
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
                      <span className={styles.choiceLabel}>{choice}</span>
                      <span className={styles.choiceIndex}>#{idx + 1}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default PollPage;
