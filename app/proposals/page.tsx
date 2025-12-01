'use client';

import { useState } from "react";
import styles from "../Dashboard.module.scss";
import pageStyles from "./ProposalsPage.module.scss";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ActiveProposalsTable from "@/components/ActiveProposalsTable";
import { useProposals } from "@/hooks/useProposals";

export default function ProposalsPage() {
  const { data, error } = useProposals();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.main}>
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className={pageStyles.content}>
          <ActiveProposalsTable
            proposals={Array.isArray(data) ? data : undefined}
            title="All Proposals"
          />
          {error ? (
            <div className={pageStyles.error}>
              Failed to load proposals: {error.message}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
