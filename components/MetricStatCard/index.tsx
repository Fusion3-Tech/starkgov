'use client';

import React from 'react';
import styles from './MetricStatCard.module.scss';

type Trend = 'up' | 'down';

export interface MetricStatCardProps {
  title: string;
  value: string | number;
  valueSuffix?: string; // e.g. "%"
  trend: Trend;
  deltaLabel: string; // e.g. "8.5%"
  description: string; // e.g. "Up from yesterday"
}

const MetricStatCard: React.FC<MetricStatCardProps> = ({
  title,
  value,
  valueSuffix,
  trend,
  deltaLabel,
  description,
}) => {
  const isUp = trend === 'up';

  return (
    <section
      className={`${styles.card}`}
    >
      <div className={styles.header}>{title}</div>

      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {valueSuffix && <span className={styles.valueSuffix}>{valueSuffix}</span>}
      </div>

      <div className={styles.deltaRow}>
        <span
          className={`${styles.iconWrapper} ${
            isUp ? styles.iconUp : styles.iconDown
          }`}
        >
          <svg
            viewBox="0 0 16 16"
            className={styles.icon}
            aria-hidden="true"
            focusable="false"
          >
            {isUp ? (
              <path d="M3 9.5 8 4.5l5 5h-3v3H6.5v-3z" />
            ) : (
              <path d="M3 6.5 8 11.5l5-5h-3v-3H6.5v3z" />
            )}
          </svg>
        </span>

        <span
          className={`${styles.deltaLabel} ${
            isUp ? styles.deltaUp : styles.deltaDown
          }`}
        >
          {deltaLabel}
        </span>

        <span className={styles.description}>{description}</span>
      </div>
    </section>
  );
};

export default MetricStatCard;
