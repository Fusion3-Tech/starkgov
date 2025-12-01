"use client";

import React, { useState } from "react";
import ActiveProposalsTable from "@/components/ActiveProposalsTable";
import PollsTable from "@/components/PollsTable";
import styles from "./ProposalsPollsTable.module.scss";

type TabKey = "proposals" | "polls";

const ProposalsPollsTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("proposals");
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabsBar}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "proposals" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab("proposals")}
          >
            Proposals
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "polls" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab("polls")}
          >
            Polls
          </button>
        </div>
        <button
          type="button"
          className={`${styles.actionButton} ${showFavorites ? styles.actionActive : ""}`}
          aria-pressed={showFavorites}
          onClick={() => setShowFavorites((prev) => !prev)}
        >
          <span className={styles.actionIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 21.35 10.55 20C6 15.85 3 13.04 3 9.5 3 7 5 5 7.5 5A5 5 0 0 1 12 7.09 5 5 0 0 1 16.5 5C19 5 21 7 21 9.5c0 3.54-3 6.35-7.55 10.5Z" />
            </svg>
          </span>
          Favorites
        </button>
      </div>

      <div className={activeTab === "proposals" ? "" : styles.hidden}>
        <ActiveProposalsTable
          title={showFavorites ? "Favorite Proposals" : "Recent Proposals"}
          showFavoritesOnly={showFavorites}
        />
      </div>

      <div className={activeTab === "polls" ? "" : styles.hidden}>
        <PollsTable
          title={showFavorites ? "Favorite Polls" : "Snapshot Polls"}
          showFavoritesOnly={showFavorites}
        />
      </div>
    </div>
  );
};

export default ProposalsPollsTable;
