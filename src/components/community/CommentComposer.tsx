"use client";

import { useState } from "react";
import { useCreateComment } from "@/hooks/useCreateComment";

interface CommentComposerProps {
  postId: string;
  parentId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export function CommentComposer({
  postId,
  parentId = null,
  onSuccess,
  onCancel,
  placeholder = "Write a comment...",
}: CommentComposerProps) {
  const [body, setBody] = useState("");
  const { mutate: createComment, isPending } = useCreateComment();

  const maxLength = 500;
  const remainingChars = maxLength - body.length;
  const isOverLimit = remainingChars < 0;

  const handleSubmit = () => {
    if (!body.trim() || isOverLimit || isPending) return;

    createComment(
      {
        postId,
        body: body.trim(),
        parentId,
      },
      {
        onSuccess: () => {
          setBody("");
          onSuccess?.();
        },
        onError: (error) => {
          console.error("[CommentComposer] Failed to create comment:", error);
          alert(error instanceof Error ? error.message : "Failed to post comment");
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="comment-composer"
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        padding: "0.75rem",
        background: "#fff",
      }}
    >
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        disabled={isPending}
        rows={3}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          resize: "vertical",
          fontSize: "0.875rem",
          fontFamily: "inherit",
          lineHeight: "1.5",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            color: isOverLimit ? "#ef4444" : "#6b7280",
          }}
        >
          {remainingChars} characters remaining
        </span>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isPending}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                background: "#fff",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={!body.trim() || isOverLimit || isPending}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.375rem",
              background: !body.trim() || isOverLimit || isPending ? "#e5e7eb" : "#3b82f6",
              color: !body.trim() || isOverLimit || isPending ? "#9ca3af" : "#fff",
              cursor: !body.trim() || isOverLimit || isPending ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {isPending ? "Posting..." : parentId ? "Reply" : "Comment"}
          </button>
        </div>
      </div>

      <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>
        Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to submit
      </div>
    </div>
  );
}
