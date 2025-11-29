"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import styles from "./ProposalPage.module.scss";
import {
  type ProposalComment,
  useProposalComments,
} from "@/hooks/useProposalComments";

const commentMarkdownComponents: Components = {
  h1: ({ children }) => <p>{children}</p>,
  h2: ({ children }) => <p>{children}</p>,
  h3: ({ children }) => <p>{children}</p>,
  h4: ({ children }) => <p>{children}</p>,
  img: () => null,
};

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

interface DiscussionSectionProps {
  proposalId?: string;
  proposalState?: string;
}

const DiscussionSection: React.FC<DiscussionSectionProps> = ({
  proposalId,
  proposalState,
}) => {
  const [commentPage, setCommentPage] = useState(1);
  const [commentList, setCommentList] = useState<ProposalComment[]>([]);
  const [commentSort, setCommentSort] = useState<"date" | "upvotes">("date");

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    moreCommentsAvailable,
    refetch: refetchComments,
  } = useProposalComments({
    proposalId,
    sort: commentSort,
    limit: 10,
    offset: commentPage,
  });

  useEffect(() => {
    setCommentPage(1);
    setCommentList([]);
  }, [proposalId, commentSort]);

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
    <div className={styles.commentsSection}>
      <div className={styles.commentsHeader}>
        <h2>Discussion</h2>
        <div className={styles.sortRow}>
          <span className={styles.sortLabel}>Sort by</span>
          <select
            className={styles.sortSelect}
            value={commentSort}
            onChange={(e) => setCommentSort(e.target.value as "date" | "upvotes")}
          >
            <option value="date">Date</option>
            <option value="upvotes">Upvotes</option>
          </select>
        </div>
      </div>

      {proposalState !== "active" && proposalState !== "pending" ? (
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
  );
};

export default DiscussionSection;
