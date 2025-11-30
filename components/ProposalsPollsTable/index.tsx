"use client";

import React, { useState } from "react";
import ActiveProposalsTable from "@/components/ActiveProposalsTable";
import PollsTable from "@/components/PollsTable";
import styles from "./ProposalsPollsTable.module.scss";

type TabKey = "proposals" | "polls";

const ProposalsPollsTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("proposals");

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
      </div>

      <div className={activeTab === "proposals" ? "" : styles.hidden}>
        <ActiveProposalsTable title="Recent Proposals" />
      </div>

      <div className={activeTab === "polls" ? "" : styles.hidden}>
        <PollsTable title="Snapshot Polls" />
      </div>
    </div>
  );
};

export default ProposalsPollsTable;
