'use client';
'use client';

import React, { useMemo } from 'react';
import styles from './ProposalVotesBubbles.module.scss';
import { useProposalVotes } from '@/hooks/useProposalVotes';

interface Bubble {
  id: string;
  radius: number;
  x: number;
  y: number;
  variant: 'for' | 'against' | 'abstain';
  label?: string;
}

interface Props {
  proposalId?: string;
}

const clampPct = (v: number) => Math.max(0, Math.min(100, v || 0));

const ProposalVotesBubbles: React.FC<Props> = ({ proposalId }) => {
  const { votes, loading } = useProposalVotes(proposalId);

  console.log(votes);

  const { bubbles } = useMemo(() => {
    const votesList = votes || [];
    const totalPower = votesList.reduce((sum, v) => sum + (v.votingPower || 0), 0) || 1;

    const forPct = clampPct(
      (votesList.filter((v) => v.choice === 'for').reduce((s, v) => s + v.votingPower, 0) /
        totalPower) *
        100
    );
    const againstPct = clampPct(
      (votesList.filter((v) => v.choice === 'against').reduce((s, v) => s + v.votingPower, 0) /
        totalPower) *
        100
    );
    const abstainPct = clampPct(
      (votesList.filter((v) => v.choice === 'abstain').reduce((s, v) => s + v.votingPower, 0) /
        totalPower) *
        100
    );

    const weights: { variant: Bubble['variant']; pct: number }[] = [
      { variant: 'for', pct: forPct },
      { variant: 'against', pct: againstPct },
      { variant: 'abstain', pct: abstainPct },
    ];

    const total = weights.reduce((sum, w) => sum + w.pct, 0) || 1;

    const baseRadius = 110;
    const smallRadius = 12;
    const mediumRadius = 20;

    const bigBubbles: Bubble[] = weights.map((w, idx) => ({
      id: `${w.variant}-big-${idx}`,
      variant: w.variant,
      radius: Math.max(50, (w.pct / total) * baseRadius),
      x: 80 + idx * 80,
      y: 120 + (idx % 2) * 40,
      label: w.variant === 'for' ? 'delegate #1' : w.variant === 'against' ? 'delegate #2' : 'delegate #3',
    }));

    const smalls: Bubble[] = Array.from({ length: 18 }).map((_, i) => {
      const variant = weights[i % weights.length]?.variant || 'for';
      const radius = i % 3 === 0 ? mediumRadius : smallRadius;
      return {
        id: `s-${i}`,
        variant,
        radius,
        x: 60 + (i % 6) * 28,
        y: 60 + Math.floor(i / 6) * 26 + (i % 2 === 0 ? 6 : 0),
      };
    });

    return { bubbles: [...bigBubbles, ...smalls] };
  }, [votes]);

  return (
    <div className={styles.container}>
      <div className={styles.cardTitle}>Votes</div>
      <div className={styles.canvas}>
        {loading && !votes?.length ? (
          <div className={styles.loading}>Loading votes...</div>
        ) : null}
        {(!votes || votes.length === 0) && !loading ? (
          <div className={styles.loading}>No votes yet.</div>
        ) : null}
        {bubbles.map((b) => (
          <div
            key={b.id}
            className={`${styles.bubble} ${styles[b.variant]}`}
            style={{
              width: b.radius * 2,
              height: b.radius * 2,
              transform: `translate(${b.x}px, ${b.y}px)`,
            }}
          >
            {b.label ? <span className={styles.label}>{b.label}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalVotesBubbles;
