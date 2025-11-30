"use client";

import React, { useMemo, useState } from "react";
import styles from "./PollsTable.module.scss";
import { usePolls, type PollSimple } from "@/hooks/usePolls";
import { getBlockieDataUrl } from "@/lib/blockies";
import { useRouter } from "next/navigation";

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
  if (account.length <= 8) return account;
  return `${account.slice(0, 4)}...${account.slice(-4)}`;
};

const PollsTable: React.FC<PollsTableProps> = ({
  polls: pollsFromProps,
  title = "Snapshot Polls",
}) => {
  const { polls, loading, error } = usePolls();
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [search, setSearch] = useState("");

  const list = useMemo<PollSimple[]>(() => {
    const base = pollsFromProps ?? polls ?? [];
    const term = search.toLowerCase().trim();
    const filtered = base.filter((p) => {
      if (!term) return true;
      return (
        (p.title || "").toLowerCase().includes(term) ||
        (p.author || "").toLowerCase().includes(term) ||
        (p.state || "").toLowerCase().includes(term)
      );
    });
    return filtered.sort((a, b) =>
      sortOrder === "newest"
        ? (b.start || 0) - (a.start || 0)
        : (a.start || 0) - (b.start || 0),
    );
  }, [polls, pollsFromProps, search, sortOrder]);

  const router = useRouter();

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.headerControls}>
          <div className={styles.sortWrapper}>
            <span className={styles.sortLabel}>Sort</span>
            <button
              type="button"
              className={styles.sortButton}
              onClick={() =>
                setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
              }
            >
              {sortOrder === "newest" ? "Newest" : "Oldest"}
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
              <div
                key={poll.id}
                className={styles.row}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/polls/${poll.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/polls/${poll.id}`);
                  }
                }}
              >
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
