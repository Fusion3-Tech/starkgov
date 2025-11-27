'use client';

import React, { useMemo, useState } from 'react';
import styles from './ProposalSearchModal.module.scss';
import { useProposals } from '@/hooks/useProposals';
import type { TransformedProposal } from '@/hooks/helpers';
import { formatDate } from '@/lib/format';
import { getBlockieDataUrl } from '@/lib/blockies';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ProposalSearchModal: React.FC<Props> = ({ open, onClose }) => {
  const { data } = useProposals();
  const [term, setTerm] = useState('');

  const proposals = Array.isArray(data) ? (data as TransformedProposal[]) : [];

  const results = useMemo(() => {
    const t = term.toLowerCase().trim();
    if (!t) return proposals.slice(0, 20);
    return proposals.filter(
      (p) =>
        p.title?.toLowerCase().includes(t) ||
        p.id?.toLowerCase().includes(t) ||
        p.author?.toLowerCase().includes(t)
    );
  }, [proposals, term]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Search proposals</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <input
          autoFocus
          className={styles.input}
          placeholder="Search by title, id, or author"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <div className={styles.results}>
          {results.length === 0 ? (
            <div className={styles.empty}>No proposals found.</div>
          ) : (
            results.map((p) => (
              <a key={p.id} href={`/proposals/${p.id}`} className={styles.result}>
                <div className={styles.resultRow}>
                  <div className={styles.resultAvatar}>
                    {(() => {
                      const blockie = getBlockieDataUrl(p.author || p.id);
                      return blockie ? <img src={blockie} alt={p.author} /> : null;
                    })()}
                  </div>
                  <div className={styles.resultText}>
                    <div className={styles.resultTitle}>{p.title || p.id}</div>
                    <div className={styles.resultMeta}>
                      <span className={styles.metaItem}>{p.author}</span>
                      <span className={styles.metaDot}>•</span>
                      <span className={styles.metaItem}>{formatDate(p.created)}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalSearchModal;
