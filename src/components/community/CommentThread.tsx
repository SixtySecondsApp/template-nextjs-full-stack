"use client";

import { useState } from "react";
import { CommentCard } from "./CommentCard";
import { CommentComposer } from "./CommentComposer";
import type { CommentDTO } from "@/hooks/usePost";

interface CommentThreadProps {
  postId: string;
  comments: CommentDTO[];
}

export function CommentThread({ postId, comments }: CommentThreadProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleReplySuccess = () => {
    setReplyingTo(null);
  };

  const handleReplyCancel = () => {
    setReplyingTo(null);
  };

  return (
    <div className="comment-thread" id="comments">
      <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
        Comments ({comments.length})
      </h3>

      {/* Main comment composer */}
      <div style={{ marginBottom: "1.5rem" }}>
        <CommentComposer postId={postId} placeholder="Join the discussion..." />
      </div>

      {/* Comment list */}
      {comments.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#6b7280",
            fontSize: "0.875rem",
          }}
        >
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentCard
                comment={comment}
                postId={postId}
                onReply={handleReply}
              />

              {/* Inline reply composer */}
              {replyingTo === comment.id && (
                <div style={{ marginTop: "0.75rem", marginLeft: "2.75rem" }}>
                  <CommentComposer
                    postId={postId}
                    parentId={comment.id}
                    onSuccess={handleReplySuccess}
                    onCancel={handleReplyCancel}
                    placeholder={`Reply to ${comment.author.name}...`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
