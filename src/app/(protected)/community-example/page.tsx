"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import {
  HeroBanner,
  PostComposer,
  FilterBar,
  CommunityPostCard,
  RightSidebar,
} from "@/components/community";

export default function CommunityExamplePage() {
  const [showAutosave, setShowAutosave] = useState(false);

  const handleAutosave = () => {
    setShowAutosave(true);
    setTimeout(() => setShowAutosave(false), 2000);
  };

  const posts = [
    {
      id: 1,
      author: {
        name: "Lisa Jones",
        avatar: "LJ",
        badge: "NEW",
      },
      date: "Mar 31",
      readTime: "2 min read",
      title: "Hey everyone! ✨ Excited to be a part of this awesome cycling community!",
      content:
        "My name is Serena, and I'm diving headfirst into the world of sports! 🚴 A proud newbie eager to embrace the thrill of competition and the camaraderie that comes with it. 💪 I've always been passionate about staying active, and recently, I decided to take it up a notch by joining this vibrant community. Whether it's cycling, running, or hitting the gym, count me in! 🚴‍♀️🏃‍♀️💪",
      tags: ["#NewBeginnings", "#ActiveLifestyle", "#CyclingCommunity"],
      likes: 35,
      comments: 7,
      likedBy: "Jeroen and 34 others",
      isLiked: false,
    },
    {
      id: 2,
      author: {
        name: "Nate Herk",
        avatar: "NH",
        badge: "PINNED",
        badgeColor: "#f59e0b",
      },
      date: "3d",
      category: "YouTube Resources 📺",
      title: "🚀 New Video: How I made $231,000 in 30 days (as an AI Consultant...)",
      content:
        "Today, I'll be showing you how I made $231,000 in 30 days as an AI Consultant. In this video I'll go over how I did it, how I'd do it if I started out again, and actionable steps to help you get started.",
      likes: 259,
      comments: 166,
      isLiked: true,
      newComment: "11m ago",
    },
    {
      id: 3,
      author: {
        name: "Yash Chauhan 🔥",
        avatar: "YC",
      },
      date: "3d",
      category: "💡 Wins 👏",
      title: "🏆 Weekly Wins Recap | Oct 25 – Oct 31",
      content:
        "Every week inside AIS+, members are turning ideas into results - from high-ticket projects to breakthrough automations. Here are this week's highlights inside AIS+ 👇",
      likes: 53,
      comments: 35,
      isLiked: false,
      newComment: "2h ago",
    },
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <TopNav />
        <div className="content-area">
          <div className="feed-container">
            <HeroBanner />
            <PostComposer onAutosave={handleAutosave} />
            <FilterBar />
            {posts.map((post) => (
              <CommunityPostCard key={post.id} post={post} />
            ))}
          </div>
          <RightSidebar />
        </div>
      </main>

      {/* AI Assistant Badge */}
      <div className="ai-badge">
        <div className="ai-pulse"></div>
        <span>AI Assistant</span>
      </div>

      {/* Autosave Indicator */}
      <div className={`autosave-indicator ${showAutosave ? "visible" : ""}`}>
        <svg
          className="save-icon"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Draft saved</span>
      </div>
    </div>
  );
}
