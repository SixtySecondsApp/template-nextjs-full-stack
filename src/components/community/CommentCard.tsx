"use client";

import { useState } from "react";
import { Heart, Reply } from "lucide-react";
import { useLikeComment } from "@/hooks/useLikeComment";
import type { CommentDTO } from "@/hooks/usePost";

interface CommentCardProps {
  comment: CommentDTO;
  postId: string;
  onReply?: (commentId: string) => void;
  depth?: number;
}

export function CommentCard({ comment, postId, onReply, depth = 0 }: CommentCardProps) {
  const { mutate: likeComment, isPending: isLikePending } = useLikeComment();
  const [showReplies, setShowReplies] = useState(true);

  const handleLike = () => {
    likeComment({ commentId: comment.id, postId });
  };

  const handleReply = () => {
    onReply?.(comment.id);
  };

  // Format date to relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div
      className="comment-card"
      style={{
        marginLeft: depth > 0 ? "2rem" : "0",
        borderLeft: depth > 0 ? "2px solid #e5e7eb" : "none",
        paddingLeft: depth > 0 ? "1rem" : "0",
      }}
    >
      <div className="comment-header" style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <div
          className="comment-avatar"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {comment.author.avatarUrl ? (
            <img
              src={comment.author.avatarUrl}
              alt={comment.author.name}
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            getInitials(comment.author.name)
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{comment.author.name}</span>
            <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>
              {formatDate(comment.createdAt)}
            </span>
          </div>

          <div className="comment-body" style={{ fontSize: "0.875rem", lineHeight: "1.5", marginBottom: "0.5rem" }}>
            {comment.body}
          </div>

          <div className="comment-actions" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              className="comment-action-btn"
              onClick={handleLike}
              disabled={isLikePending}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.25rem 0.5rem",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.75rem",
                color: comment.isLiked ? "#ef4444" : "#6b7280",
                fontWeight: comment.isLiked ? 600 : 400,
              }}
            >
              <Heart size={14} fill={comment.isLiked ? "currentColor" : "none"} />
              {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
            </button>

            {depth < 1 && ( // Only allow replies at depth 0 (2-level threading)
              <button
                className="comment-action-btn"
                onClick={handleReply}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.25rem 0.5rem",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  color: "#6b7280",
                }}
              >
                <Reply size={14} />
                <span>Reply</span>
              </button>
            )}

            {hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                style={{
                  padding: "0.25rem 0.5rem",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  color: "#3b82f6",
                  fontWeight: 500,
                }}
              >
                {showReplies ? "Hide" : "Show"} {comment.replies!.length}{" "}
                {comment.replies!.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {hasReplies && showReplies && (
        <div className="comment-replies" style={{ marginTop: "0.75rem" }}>
          {comment.replies!.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
