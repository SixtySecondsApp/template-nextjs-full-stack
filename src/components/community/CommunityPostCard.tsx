"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { useLikePost } from "@/hooks/useLikePost";
import Link from "next/link";

interface Author {
  id: string;
  name: string;
  avatarUrl: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  communityId: string;
  category: string | null;
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CommunityPostCardProps {
  post: Post;
}

export function CommunityPostCard({ post }: CommunityPostCardProps) {
  const { mutate: likePost, isPending: isLikePending } = useLikePost();

  const handleLike = () => {
    likePost({ postId: post.id });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${post.id}`;

    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
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

  // Calculate read time (rough estimate: 200 words per minute)
  const calculateReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
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

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-author">
          <div className="avatar">
            {post.author.avatarUrl ? (
              <img src={post.author.avatarUrl} alt={post.author.name} />
            ) : (
              getInitials(post.author.name)
            )}
          </div>
          <div className="author-info">
            <div className="author-name">
              {post.author.name}
              {post.isPinned && (
                <span className="post-badge" style={{ background: "#10b981" }}>
                  Pinned
                </span>
              )}
            </div>
            <div className="post-meta">
              {formatDate(post.createdAt)}
              {post.category && ` · ${post.category}`}
              {` · ${calculateReadTime(post.content)}`}
            </div>
          </div>
        </div>
        <div className="post-options">
          <MoreHorizontal size={20} />
        </div>
      </div>

      <Link href={`/posts/${post.id}`} className="post-content">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-body">
          {post.content.length > 200
            ? `${post.content.substring(0, 200)}...`
            : post.content}
        </div>
      </Link>

      <div className="post-footer">
        <div className="post-actions">
          <button
            className={`action-button ${post.isLiked ? "liked" : ""}`}
            onClick={handleLike}
            disabled={isLikePending}
          >
            <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
            <span>
              {post.likeCount > 0 ? post.likeCount : "Like"}
            </span>
          </button>
          <Link href={`/posts/${post.id}#comments`} className="action-button">
            <MessageCircle size={18} />
            <span>Comment</span>
          </Link>
          <button className="action-button" onClick={handleShare}>
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
        <div className="post-stats">
          {post.likeCount > 0 && (
            <>
              <span>{post.likeCount} {post.likeCount === 1 ? "like" : "likes"}</span>
              <span>·</span>
            </>
          )}
          <span>{post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}</span>
          {post.viewCount > 0 && (
            <>
              <span>·</span>
              <span>{post.viewCount} {post.viewCount === 1 ? "view" : "views"}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
