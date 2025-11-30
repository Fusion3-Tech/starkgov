"use client";

import React, { useMemo } from "react";
import styles from "./PollsTable.module.scss";
import { usePolls, type PollSimple } from "@/hooks/usePolls";
import { getBlockieDataUrl } from "@/lib/blockies";

interface PollsTableProps {
  polls?: PollSimple[];
  title?: string;
}

const formatDate = (timestamp?: number) =>
  timestamp
    ? new Date(timestamp * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

const formatAccount = (account?: string) => {
  if (!account) return "—";
  if (account.length <= 10) return account;
  return `${account.slice(0, 6)}...${account.slice(-4)}`;
};

const PollsTable: React.FC<PollsTableProps> = ({
  polls: pollsFromProps,
  title = "Snapshot Polls",
}) => {
  const { polls, loading, error, refetch } = usePolls();

  const list = useMemo<PollSimple[]>(() => {
    if (pollsFromProps) return pollsFromProps;
    if (Array.isArray(polls)) return polls;
    return [];
  }, [polls, pollsFromProps]);

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.refresh} onClick={() => void refetch()}>
          ⟳ Refresh
        </button>
      </header>

      {error ? <div className={styles.empty}>Failed to load polls.</div> : null}
      {loading && !list.length ? (
        <div className={styles.empty}>Loading polls…</div>
      ) : null}

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Account</span>
          <span>Poll Title</span>
          <span>Start</span>
          <span>End</span>
          <span>Status</span>
        </div>

        <div className={styles.tableBody}>
          {list.length === 0 ? (
            <div className={styles.empty}>No polls found.</div>
          ) : (
            list.map((poll) => (
              <div key={poll.id} className={styles.row}>
                <div className={styles.accountCell}>
                  <div className={styles.avatar}>
                    {(() => {
                      const blockie = getBlockieDataUrl(poll.author);
                      if (blockie) {
                        return <img src={blockie} alt={poll.author} />;
                      }
                      return (
                        <span className={styles.avatarFallback}>
                          {formatAccount(poll.author)}
                        </span>
                      );
                    })()}
                  </div>
                  <div className={styles.accountText}>
                    <span className={styles.accountName}>
                      {formatAccount(poll.author)}
                    </span>
                  </div>
                </div>

                <div className={styles.titleCell}>{poll.title || poll.id}</div>
                <div className={styles.dateCell}>{formatDate(poll.start)}</div>
                <div className={styles.dateCell}>{formatDate(poll.end)}</div>
                <div className={styles.stateCell}>
                  <span className={styles.stateBadge}>{poll.state || "—"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PollsTable;
