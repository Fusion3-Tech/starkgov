'use client';

import styles from './Dashboard.module.scss';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TotalVstrkChart from '@/components/TotalVstrkChart';
import TopDelegatesCard from '@/components/TopDelegatesCard';
import ParticipationRateCard from '@/components/ParticipationRateCard';
import DelegatesCountCard from '@/components/DelegatesCountCard';
import RecentlyPassedCard from '@/components/RecentlyPassedCard';
import RecentlyRejectedCard from '@/components/RecentlyRejectedCard';
import ActiveProposalsTable from '@/components/ActiveProposalsTable';

export default function DashboardPage() {
  return (
    <div className={styles.shell}>
      <Sidebar />

      <div className={styles.main}>
        <Header />

        <div className={styles.grid}>
          {/* Row 1 */}
          <div className={styles.chartArea}>
            <TotalVstrkChart />
          </div>

          <div className={styles.delegationsArea}>
            <TopDelegatesCard />
          </div>

          <div className={styles.statsArea}>
            <ParticipationRateCard />
            <DelegatesCountCard />
          </div>

          {/* Row 2 */}
          <div className={styles.activeProposalsArea}>
            <ActiveProposalsTable />
          </div>

          <div className={styles.recentArea}>
            <RecentlyPassedCard />
            <RecentlyRejectedCard />
          </div>
        </div>
      </div>
    </div>
  );
}
