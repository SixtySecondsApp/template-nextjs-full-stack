"use client";

import { useState } from "react";
import { Paperclip, Image, BarChart2, Video } from "lucide-react";
import { useAutosave } from "@/hooks/useAutosave";
import { useRouter } from "next/navigation";

interface PostComposerProps {
  communityId: string;
  postId?: string | null;
}

export function PostComposer({ communityId, postId }: PostComposerProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Auto-save draft every 5 seconds
  const { isSaving, lastSaved, saveStatus } = useAutosave(
    { title, body },
    {
      delay: 5000,
      postId: postId,
      onSaveSuccess: () => {
        console.log("[PostComposer] Draft saved successfully");
      },
      onSaveError: (error) => {
        console.error("[PostComposer] Failed to save draft:", error);
      },
    }
  );

  const handlePublish = async () => {
    if (!title.trim() || !body.trim()) {
      alert("Please provide both title and content");
      return;
    }

    setIsPublishing(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          communityId,
          title: title.trim(),
          content: body.trim(),
          category: null, // Can add category selector later
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to publish post");
      }

      const result = await response.json();

      // Clear form and redirect to post
      setTitle("");
      setBody("");
      router.push(`/posts/${result.data.id}`);
    } catch (error) {
      console.error("[PostComposer] Publish error:", error);
      alert(error instanceof Error ? error.message : "Failed to publish post");
    } finally {
      setIsPublishing(false);
    }
  };

  const tools = [
    { icon: Paperclip, label: "Attach" },
    { icon: Image, label: "Image" },
    { icon: BarChart2, label: "Poll" },
    { icon: Video, label: "Video" },
  ];

  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return null;
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diff < 60) return "Saved just now";
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
    return `Saved ${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="post-composer">
      {/* Draft status indicator */}
      <div className="draft-status" style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.5rem" }}>
        {isSaving && <span>💾 Saving draft...</span>}
        {saveStatus === "saved" && lastSaved && <span>✓ {getLastSavedText()}</span>}
        {saveStatus === "error" && <span style={{ color: "#ef4444" }}>⚠️ Failed to save (saved locally)</span>}
      </div>

      {/* Title input */}
      <input
        type="text"
        className="composer-input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "0.75rem",
          marginBottom: "0.5rem",
          border: "1px solid #e5e7eb",
          borderRadius: "0.375rem",
          fontSize: "1rem",
          fontWeight: 600,
        }}
      />

      {/* Body textarea */}
      <textarea
        className="composer-input"
        placeholder="What's on your mind?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
      />

      <div className="composer-actions">
        <div className="composer-tools">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <button
                key={idx}
                className="tool-button"
                onClick={() => console.log(`[PostComposer] ${tool.label} clicked - not yet implemented`)}
              >
                <Icon size={16} />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
        <button
          className="btn btn-primary"
          onClick={handlePublish}
          disabled={isPublishing || !title.trim() || !body.trim()}
        >
          {isPublishing ? "Publishing..." : "Post"}
        </button>
      </div>
    </div>
  );
}
