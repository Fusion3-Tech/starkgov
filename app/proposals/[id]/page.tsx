"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./ProposalPage.module.scss";
import dashboardStyles from "../../Dashboard.module.scss";
import { useProposals } from "@/hooks/useProposals";
import type { TransformedProposal } from "@/hooks/helpers";
import { getBlockieDataUrl } from "@/lib/blockies";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import ProposalTimeline from "@/components/ProposalTimeline";
import ProposalQuorum from "@/components/ProposalQuorum";
import ProposalExecutionInfo from "@/components/ProposalExecutionInfo";
import ProposalChoices from "@/components/ProposalChoices";
import {
  type ProposalComment,
  useProposalComments,
} from "@/hooks/useProposalComments";

const formatDate = (timestamp?: number) =>
  timestamp
    ? new Date(timestamp * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

const formatRelativeTime = (value?: string) => {
  if (!value) return "—";
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return "—";
  const diffMs = Date.now() - target;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Today";
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  const diffMonths = Math.floor(diffWeeks / 4);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}y ago`;
};

const commentAuthorLabel = (
  author: ProposalComment["author"] | undefined,
): string => {
  if (!author) return "Unknown author";
  if (typeof author === "string") return author;

  return (
    author.name ||
    author.username ||
    author.walletName ||
    author.publicIdentifier ||
    author.address ||
    author.ethAddress ||
    author.starknetAddress ||
    author.id ||
    "Unknown author"
  );
};

const shortenIdentifier = (value?: string) => {
  if (!value) return "";
  if (value.length <= 12) return value;
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
};

const avatarColorFromString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 82%)`;
};

const toPercent = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const StateBadge: React.FC<{ state?: string }> = ({ state }) => {
  const label = state || "unknown";
  return (
    <span className={`${styles.badge} ${styles[`state-${label}`] || ""}`}>
      {label}
    </span>
  );
};

const ProposalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, error, refetch } = useProposals();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [commentList, setCommentList] = useState<ProposalComment[]>([]);
  const [commentSort, setCommentSort] = useState<"date" | "upvotes">("date");

  const proposal = useMemo(() => {
    if (!Array.isArray(data)) return null;
    return data.find((p) => p.id === id);
  }, [data, id]);

  const scores = (proposal?.scores || []).map((s) => Number(s) || 0);
  const [forVotes, againstVotes, abstainVotes] = [
    scores[0] || 0,
    scores[1] || 0,
    scores[2] || 0,
  ];
  const totalVotes = forVotes + againstVotes + abstainVotes;
  const percentages = {
    for: toPercent(forVotes, totalVotes),
    against: toPercent(againstVotes, totalVotes),
    abstain: toPercent(abstainVotes, totalVotes),
  };

  const authorBlockie = getBlockieDataUrl(proposal?.author || proposal?.id);
  const markdownComponents: Components = {
    img: ({ node, src, alt, ...props }) =>
      src ? <img src={src} alt={alt ?? ""} {...props} /> : null,
  };
  const commentMarkdownComponents: Components = {
    h1: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <p>{children}</p>,
    h3: ({ children }) => <p>{children}</p>,
    h4: ({ children }) => <p>{children}</p>,
    img: () => null,
  };

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    moreCommentsAvailable,
    refetch: refetchComments,
  } = useProposalComments({
    proposalId: proposal?.id,
    sort: commentSort,
    limit: 10,
    offset: commentPage,
  });

  useEffect(() => {
    setCommentPage(1);
    setCommentList([]);
  }, [proposal?.id, commentSort]);

  useEffect(() => {
    if (!comments) return;
    setCommentList((prev) => {
      if (commentPage === 1) {
        return comments;
      }
      const existingIds = new Set(prev.map((c) => c.id));
      const newOnes = comments.filter((c) => !existingIds.has(c.id));
      return [...prev, ...newOnes];
    });
  }, [comments, commentPage]);

  const handleLoadMoreComments = () => {
    if (commentsLoading) return;
    setCommentPage((prev) => prev + 1);
  };

  const handleRefreshComments = () => {
    setCommentPage(1);
    setCommentList([]);
    void refetchComments();
  };

  const renderComment = (comment: ProposalComment, depth = 0) => {
    const displayName = commentAuthorLabel(comment.author);
    const shortId =
      typeof comment.author === "string"
        ? shortenIdentifier(comment.author)
        : shortenIdentifier(
            comment.author?.publicIdentifier ||
              comment.author?.address ||
              comment.author?.ethAddress ||
              comment.author?.starknetAddress ||
              displayName,
          );

    const voteTotal =
      typeof comment.netVotes === "number"
        ? comment.netVotes
        : (comment.upvotes || 0) - (comment.downvotes || 0);

    return (
      <li
        key={`${comment.id}-${depth}`}
        className={`${styles.commentItem} ${depth > 0 ? styles.replyItem : ""}`}
      >
        <div
          className={styles.commentAvatar}
          style={{ backgroundColor: avatarColorFromString(displayName) }}
        >
          {displayName.slice(0, 1).toUpperCase()}
        </div>
        <div className={styles.commentBody}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>{displayName}</span>
            {shortId ? (
              <span className={styles.commentHandle}>{shortId}</span>
            ) : null}
            <span className={styles.commentDot}>•</span>
            <span className={styles.commentTimestamp}>
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <div className={styles.commentContent}>
            {comment.isDeleted ? (
              "Comment deleted"
            ) : (
              <ReactMarkdown components={commentMarkdownComponents}>
                {comment.content || "No content provided."}
              </ReactMarkdown>
            )}
          </div>
          <div className={styles.commentActions}>
            <span className={styles.voteButton}>↑</span>
            <span className={styles.voteButton}>↓</span>
            <span className={styles.voteCount}>{voteTotal}</span>
            <span className={styles.commentMenu}>•••</span>
          </div>
          {comment.replies && comment.replies.length ? (
            <ul className={styles.replyList}>
              {comment.replies.map((reply) => renderComment(reply, depth + 1))}
            </ul>
          ) : null}
        </div>
      </li>
    );
  };

  return (
    <div className={dashboardStyles.shell}>
      <Sidebar
        isMobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={dashboardStyles.main}>
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <section className={styles.page}>
          <header className={styles.header}>
            <div className={styles.breadcrumbs}>
              <button
                onClick={() => router.push("/")}
                className={styles.backButton}
              >
                ← Dashboard
              </button>
              <span className={styles.crumbDivider}>/</span>
              <span className={styles.crumbCurrent}>
                {proposal?.title || "Proposal"}
              </span>
            </div>
            <button onClick={() => refetch()} className={styles.refreshButton}>
              ⟳ Refresh
            </button>
          </header>

          {loading && !proposal ? (
            <div className={styles.status}>Loading proposal...</div>
          ) : null}
          {error && (
            <div className={styles.error}>
              Failed to load proposal: {error.message}
            </div>
          )}
          {!loading && !proposal && !error ? (
            <div className={styles.status}>Proposal not found.</div>
          ) : null}

          {proposal ? (
            <div className={styles.contentGrid}>
              <div className={styles.main}>
                <h1 className={styles.title}>
                  {proposal.title || proposal.id}
                </h1>
                <div className={styles.metaRow}>
                  <div className={styles.author}>
                    {authorBlockie ? (
                      <img src={authorBlockie} alt={proposal.author} />
                    ) : null}
                    <div className={styles.authorText}>
                      <span className={styles.authorLabel}>Author</span>
                      <span className={styles.authorValue}>
                        {proposal.author}
                      </span>
                    </div>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Created</span>
                    <span className={styles.metaValue}>
                      {formatDate(proposal.created)}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>State</span>
                    <StateBadge state={proposal.state} />
                  </div>
                </div>

                <article className={styles.body}>
                  {proposal.body ? (
                    <ReactMarkdown components={markdownComponents}>
                      {proposal.body}
                    </ReactMarkdown>
                  ) : (
                    "No description provided."
                  )}
                </article>

                <div className={styles.commentsSection}>
                  <div className={styles.commentsHeader}>
                    <h2>Discussion</h2>
                    <div className={styles.sortRow}>
                      <span className={styles.sortLabel}>Sort by</span>
                      <select
                        className={styles.sortSelect}
                        value={commentSort}
                        onChange={(e) =>
                          setCommentSort(e.target.value as "date" | "upvotes")
                        }
                      >
                        <option value="date">Date</option>
                        <option value="upvotes">Upvotes</option>
                      </select>
                    </div>
                  </div>

                  {proposal.state !== "active" && proposal.state !== "pending" ? (
                    <div className={styles.closedBanner}>
                      <span className={styles.closedIcon}>ℹ</span>
                      Comments are now closed.
                    </div>
                  ) : null}

                  {commentsError ? (
                    <div className={styles.error}>
                      Failed to load comments: {commentsError}
                    </div>
                  ) : null}

                  {commentsLoading && commentList.length === 0 ? (
                    <div className={styles.status}>Loading comments...</div>
                  ) : null}

                  {!commentsLoading && commentList.length === 0 ? (
                    <div className={styles.status}>No comments yet.</div>
                  ) : null}

                  {commentList.length > 0 ? (
                    <ul className={styles.commentList}>
                      {commentList.map((comment) => renderComment(comment))}
                    </ul>
                  ) : null}

                  {commentsLoading && commentList.length > 0 ? (
                    <div className={styles.status}>Loading more...</div>
                  ) : null}

                  {moreCommentsAvailable ? (
                    <button
                      className={styles.loadMoreButton}
                      onClick={handleLoadMoreComments}
                      disabled={commentsLoading}
                    >
                      Load more comments
                    </button>
                  ) : null}
                  <div className={styles.commentsFooter}>
                    <button
                      className={styles.refreshButton}
                      onClick={handleRefreshComments}
                      disabled={commentsLoading}
                    >
                      ⟳ Refresh comments
                    </button>
                  </div>
                </div>
              </div>

              <aside className={styles.sidebar}>
                <div className={styles.card}>
                  <ProposalTimeline start={proposal.start} end={proposal.end} />
                </div>

                <div className={styles.card}>
                  <ProposalQuorum quorum={proposal.quorum} scoresTotal={proposal.scores_total} />
                </div>

                <ProposalChoices
                  choices={proposal.choices || []}
                  scores={(proposal.scores || []).map((s) => Number(s) || 0)}
                  totalVotes={totalVotes}
                />

                <div className={styles.card}>
                  <ProposalExecutionInfo
                    executed={proposal.executed}
                    executedAt={proposal.execution_time}
                    executionData={proposal.execution_strategy}
                    strategy={proposal.execution_strategy}
                    strategyType={proposal.execution_strategy_type}
                    destination={proposal.execution_destination}
                    txHash={proposal.execution_tx}
                  />
                </div>
              </aside>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default ProposalPage;
