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
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.main}>
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className={pageStyles.content}>
          <div className={pageStyles.controls}>
            <button
              type="button"
              className={`${pageStyles.favToggle} ${
                showFavorites ? pageStyles.favToggleActive : ""
              }`}
              aria-pressed={showFavorites}
              onClick={() => setShowFavorites((prev) => !prev)}
            >
              <span aria-hidden="true" className={pageStyles.favIcon}>
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 21.35 10.55 20C6 15.85 3 13.04 3 9.5 3 7 5 5 7.5 5A5 5 0 0 1 12 7.09 5 5 0 0 1 16.5 5C19 5 21 7 21 9.5c0 3.54-3 6.35-7.55 10.5Z" />
                </svg>
              </span>
              Favorites
            </button>
          </div>
          <ActiveProposalsTable
            proposals={Array.isArray(data) ? data : undefined}
            title={showFavorites ? "Favorite Proposals" : "All Proposals"}
            showFavoritesOnly={showFavorites}
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
