Community OS - React Implementation
I'll create a complete React implementation with proper component structure and state management.

jsx

// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import FeedContainer from './components/FeedContainer';
import RightSidebar from './components/RightSidebar';
import AIAssistant from './components/AIAssistant';
import AutosaveIndicator from './components/AutosaveIndicator';

function App() {
  const [theme, setTheme] = useState('light');
  const [showAutosave, setShowAutosave] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleAutosave = () => {
    setShowAutosave(true);
    setTimeout(() => setShowAutosave(false), 2000);
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <TopNav 
          toggleTheme={toggleTheme} 
          currentTheme={theme}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <div className="content-area">
          <FeedContainer onAutosave={handleAutosave} />
          <RightSidebar />
        </div>
      </main>

      <AIAssistant />
      <AutosaveIndicator show={showAutosave} />
    </div>
  );
}

export default App;
jsx

// components/Sidebar.jsx
import React from 'react';
import { 
  Home, Users, BookOpen, MessageSquare, Lightbulb, 
  Calendar, Video, FileText 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navSections = [
    {
      title: 'Main',
      items: [
        { icon: Home, label: 'Home', active: true },
        { icon: Users, label: 'Members' },
        { icon: BookOpen, label: 'Courses' },
      ]
    },
    {
      title: 'Spaces',
      items: [
        { icon: MessageSquare, label: 'General Discussion' },
        { icon: Lightbulb, label: 'Getting Started' },
        { icon: Calendar, label: 'Events' },
      ]
    },
    {
      title: 'Learning',
      items: [
        { icon: Video, label: 'Course Lessons' },
        { icon: FileText, label: 'Resources' },
      ]
    }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">CO</div>
          <span>Community OS</span>
        </div>
      </div>

      {navSections.map((section, idx) => (
        <nav key={idx} className="nav-section">
          <div className="nav-section-title">{section.title}</div>
          {section.items.map((item, itemIdx) => (
            <a
              key={itemIdx}
              href="#"
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              <item.icon className="nav-icon" size={20} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      ))}

      <div className="online-indicator">
        <div className="online-dot"></div>
        <span>420 members online</span>
      </div>
    </aside>
  );
};

export default Sidebar;
jsx

// components/TopNav.jsx
import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';

const TopNav = ({ toggleTheme, currentTheme, onMenuClick }) => {
  const [activeTab, setActiveTab] = useState('community');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'community', label: 'Community' },
    { id: 'chat', label: 'Chat' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

  return (
    <header className="top-nav">
      <div className="top-nav-left">
        <button className="icon-button mobile-menu" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <div className="nav-tabs">
          {tabs.map(tab => (
            <a
              key={tab.id}
              href="#"
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.id);
              }}
            >
              {tab.label}
            </a>
          ))}
        </div>
      </div>

      <div className="top-nav-actions">
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="icon-button" title="Notifications">
          <Bell size={20} />
        </button>

        <button 
          className="icon-button theme-toggle" 
          title="Toggle dark mode"
          onClick={toggleTheme}
        >
          {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="btn btn-primary">New Post</button>
      </div>
    </header>
  );
};

export default TopNav;
jsx

// components/FeedContainer.jsx
import React, { useState } from 'react';
import HeroBanner from './HeroBanner';
import PostComposer from './PostComposer';
import FilterBar from './FilterBar';
import PostCard from './PostCard';

const FeedContainer = ({ onAutosave }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const posts = [
    {
      id: 1,
      author: {
        name: 'Lisa Jones',
        avatar: 'LJ',
        badge: 'NEW'
      },
      date: 'Mar 31',
      readTime: '2 min read',
      title: 'Hey everyone! ✨ Excited to be a part of this awesome cycling community!',
      content: "My name is Serena, and I'm diving headfirst into the world of sports! 🚴 A proud newbie eager to embrace the thrill of competition and the camaraderie that comes with it. 💪 I've always been passionate about staying active, and recently, I decided to take it up a notch by joining this vibrant community. Whether it's cycling, running, or hitting the gym, count me in! 🚴‍♀️🏃‍♀️💪",
      tags: ['#NewBeginnings', '#ActiveLifestyle', '#CyclingCommunity'],
      likes: 35,
      comments: 7,
      likedBy: 'Jeroen and 34 others',
      isLiked: false
    },
    {
      id: 2,
      author: {
        name: 'Nate Herk',
        avatar: 'NH',
        badge: 'PINNED',
        badgeColor: '#f59e0b'
      },
      date: '3d',
      category: 'YouTube Resources 📺',
      title: '🚀 New Video: How I made $231,000 in 30 days (as an AI Consultant...)',
      content: "Today, I'll be showing you how I made $231,000 in 30 days as an AI Consultant. In this video I'll go over how I did it, how I'd do it if I started out again, and actionable steps to help you get started.",
      likes: 259,
      comments: 166,
      isLiked: true,
      newComment: '11m ago'
    },
    {
      id: 3,
      author: {
        name: 'Yash Chauhan 🔥',
        avatar: 'YC',
      },
      date: '3d',
      category: '💡 Wins 👏',
      title: '🏆 Weekly Wins Recap | Oct 25 – Oct 31',
      content: 'Every week inside AIS+, members are turning ideas into results - from high-ticket projects to breakthrough automations. Here are this week\'s highlights inside AIS+ 👇',
      likes: 53,
      comments: 35,
      isLiked: false,
      newComment: '2h ago'
    }
  ];

  return (
    <div className="feed-container">
      <HeroBanner />
      <PostComposer onAutosave={onAutosave} />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default FeedContainer;
jsx

// components/HeroBanner.jsx
import React from 'react';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <div className="hero-tag">New Member Hub</div>
        <h1 className="hero-title">
          INTRODUCE
          <br />
          YOURSELF
        </h1>
      </div>
    </div>
  );
};

export default HeroBanner;
jsx

// components/PostComposer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, Image, BarChart2, Video } from 'lucide-react';

const PostComposer = ({ onAutosave }) => {
  const [content, setContent] = useState('');
  const autosaveTimer = useRef(null);

  useEffect(() => {
    if (content) {
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => {
        onAutosave();
      }, 5000);
    }

    return () => clearTimeout(autosaveTimer.current);
  }, [content, onAutosave]);

  const tools = [
    { icon: Paperclip, label: 'Attach' },
    { icon: Image, label: 'Image' },
    { icon: BarChart2, label: 'Poll' },
    { icon: Video, label: 'Video' },
  ];

  return (
    <div className="post-composer">
      <textarea
        className="composer-input"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="composer-actions">
        <div className="composer-tools">
          {tools.map((tool, idx) => (
            <button key={idx} className="tool-button">
              <tool.icon size={16} />
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
        <button className="btn btn-primary">Post</button>
      </div>
    </div>
  );
};

export default PostComposer;
jsx

// components/FilterBar.jsx
import React from 'react';

const FilterBar = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'active', label: 'Active' },
    { id: 'top', label: 'Top' },
    { id: 'solved', label: 'Solved' },
    { id: 'trending', label: '🔥 Trending' },
  ];

  return (
    <div className="filter-bar">
      {filters.map(filter => (
        <div
          key={filter.id}
          className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
jsx

// components/PostCard.jsx
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-author">
          <div className="avatar">{post.author.avatar}</div>
          <div className="author-info">
            <div className="author-name">
              {post.author.name}
              {post.author.badge && (
                <span 
                  className="post-badge"
                  style={post.author.badgeColor ? { background: post.author.badgeColor } : {}}
                >
                  {post.author.badge}
                </span>
              )}
            </div>
            <div className="post-meta">
              {post.date}
              {post.category && ` · ${post.category}`}
              {post.readTime && ` · ${post.readTime}`}
            </div>
          </div>
        </div>
        <div className="post-options">
          <MoreHorizontal size={20} />
        </div>
      </div>

      <div className="post-content">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-body">{post.content}</div>
        {post.tags && (
          <div className="post-tags">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="post-footer">
        <div className="post-actions">
          <button 
            className={`action-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{isLiked ? likesCount : 'Like'}</span>
          </button>
          <button className="action-button">
            <MessageCircle size={18} />
            <span>Comment</span>
          </button>
          <button className="action-button">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
        <div className="post-stats">
          {post.likedBy && <span>Liked by {post.likedBy}</span>}
          {post.likedBy && <span>·</span>}
          <span>{post.comments} comments</span>
          {post.newComment && (
            <>
              <span>·</span>
              <span>New comment {post.newComment}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
jsx

// components/RightSidebar.jsx
import React from 'react';
import CommunityWidget from './CommunityWidget';
import LeaderboardWidget from './LeaderboardWidget';
import EventsWidget from './EventsWidget';

const RightSidebar = () => {
  return (
    <aside className="sidebar-right">
      <CommunityWidget />
      <LeaderboardWidget />
      <EventsWidget />
    </aside>
  );
};

export default RightSidebar;
jsx

// components/CommunityWidget.jsx
import React from 'react';

const CommunityWidget = () => {
  const stats = [
    { value: '1.2k', label: 'Members' },
    { value: '420', label: 'Online' },
    { value: '15', label: 'Admins' },
  ];

  return (
    <div className="widget community-info">
      <div className="community-logo">CO</div>
      <h3 className="community-name">Community OS</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
        The AI-first community platform
      </p>

      <div className="community-stats">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityWidget;
jsx

// components/LeaderboardWidget.jsx
import React from 'react';

const LeaderboardWidget = () => {
  const leaders = [
    { rank: 1, name: 'Titus Blair', points: 3052, isTop: true },
    { rank: 2, name: 'Muskan An. 🔥', points: 2538, isTop: true },
    { rank: 3, name: 'Christian Ri...', points: 2088, isTop: true },
    { rank: 4, name: 'Frank van B...', points: 1990, isTop: false },
    { rank: 5, name: 'Kevin troy Lum...', points: 1393, isTop: false },
  ];

  return (
    <div className="widget">
      <h3 className="widget-title">🏆 Leaderboard (30-day)</h3>
      <ul className="leaderboard-list">
        {leaders.map((leader) => (
          <li key={leader.rank} className="leaderboard-item">
            <div className={`rank ${leader.isTop ? 'top' : ''}`}>
              {leader.rank}
            </div>
            <div className="leaderboard-avatar"></div>
            <div className="leaderboard-info">
              <div className="leaderboard-name">{leader.name}</div>
              <div className="leaderboard-points">+{leader.points} pts</div>
            </div>
          </li>
        ))}
      </ul>
      <button 
        className="btn btn-primary" 
        style={{ 
          width: '100%', 
          marginTop: '12px', 
          background: 'var(--surface)', 
          color: 'var(--text-primary)' 
        }}
      >
        See all leaderboards
      </button>
    </div>
  );
};

export default LeaderboardWidget;
jsx

// components/EventsWidget.jsx
import React from 'react';

const EventsWidget = () => {
  const events = [
    { date: 'Tomorrow at 3:00 PM', title: 'Q&A with Nate - AI Automation', attendees: 142 },
    { date: 'Nov 5 at 2:00 PM', title: 'Weekly Wins Showcase', attendees: 89 },
    { date: 'Nov 8 at 10:00 AM', title: 'Community Office Hours', attendees: 56 },
  ];

  return (
    <div className="widget">
      <h3 className="widget-title">📅 Upcoming Events</h3>
      {events.map((event, idx) => (
        <div key={idx} className="event-card">
          <div className="event-date">{event.date}</div>
          <div className="event-title">{event.title}</div>
          <div className="event-attendees">{event.attendees} attending</div>
        </div>
      ))}
    </div>
  );
};

export default EventsWidget;
jsx

// components/AIAssistant.jsx
import React from 'react';

const AIAssistant = () => {
  return (
    <div className="ai-badge">
      <div className="ai-pulse"></div>
      <span>AI Assistant</span>
    </div>
  );
};

export default AIAssistant;
jsx

// components/AutosaveIndicator.jsx
import React from 'react';
import { Check } from 'lucide-react';

const AutosaveIndicator = ({ show }) => {
  return (
    <div className={`autosave-indicator ${show ? 'visible' : ''}`}>
      <Check className="save-icon" size={16} />
      <span>Draft saved</span>
    </div>
  );
};

export default AutosaveIndicator;
css

/* App.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Primary Colors */
  --primary-color: #6366f1;
  --primary-hover: #4f46e5;
  --primary-active: #4338ca;

  /* Backgrounds */
  --background: #ffffff;
  --surface: #f9fafb;
  --surface-elevated: #ffffff;

  /* Borders */
  --border: #e5e7eb;

  /* Text Colors */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;

  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;

  /* Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Transitions */
  --transition-fast: 100ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-moderate: 300ms ease-out;
}

[data-theme="dark"] {
  /* Backgrounds */
  --background: #0f172a;
  --surface: #1e293b;
  --surface-elevated: #334155;

  /* Borders */
  --border: #334155;

  /* Text Colors */
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;

  /* Shadows - Darker for dark mode */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--background);
  color: var(--text-primary);
  line-height: 1.6;
  transition: background var(--transition-moderate), color var(--transition-moderate);
}

.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: left 0.3s;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.nav-section {
  padding: 16px;
}

.nav-section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-tertiary);
  padding: 0 12px 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-base);
  margin-bottom: 2px;
}

.nav-item:hover {
  background: var(--surface-elevated);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--primary-color);
  color: white;
  font-weight: 500;
}

.nav-icon {
  opacity: 0.7;
}

.nav-item.active .nav-icon {
  opacity: 1;
}

.online-indicator {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.online-dot {
  width: 8px;
  height: 8px;
  background: var(--success);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Top Navigation */
.top-nav {
  background: var(--surface-elevated);
  border-bottom: 1px solid var(--border);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
}

.top-nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.mobile-menu {
  display: none;
}

.nav-tabs {
  display: flex;
  gap: 24px;
}

.nav-tab {
  padding: 8px 12px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-base);
  cursor: pointer;
}

.nav-tab:hover {
  color: var(--text-primary);
}

.nav-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.top-nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
}

.search-input {
  padding: 8px 16px 8px 40px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text-primary);
  width: 300px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
}

.icon-button {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all var(--transition-base);
}

.icon-button:hover {
  background: var(--surface);
  color: var(--text-primary);
}

/* Content Area */
.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.feed-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 60px 40px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  color: white;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 500px;
  height: 500px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-tag {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
}

/* Post Composer */
.post-composer {
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
}

.composer-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text-primary);
  font-size: 15px;
  resize: none;
  min-height: 60px;
  font-family: inherit;
}

.composer-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.composer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.composer-tools {
  display: flex;
  gap: 8px;
}

.tool-button {
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--transition-base);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tool-button:hover {
  background: var(--surface);
  color: var(--text-primary);
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: 14px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

.btn-primary:active {
  background: var(--primary-active);
  transform: translateY(0);
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--surface);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background: var(--surface);
  color: var(--text-primary);
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.filter-chip {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface-elevated);
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-base);
}

.filter-chip:hover {
  border-color: var(--primary-color);
  color: var(--text-primary);
}

.filter-chip.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

/* Post Card */
.post-card {
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.post-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.post-author {
  display: flex;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.post-meta {
  font-size: 13px;
  color: var(--text-tertiary);
}

.post-badge {
  display: inline-block;
  padding: 2px 8px;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 8px;
}

.post-options {
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 4px;
}

.post-content {
  margin-bottom: 16px;
}

.post-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.4;
}

.post-body {
  color: var(--text-secondary);
  line-height: 1.7;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.tag {
  padding: 4px 10px;
  background: var(--surface);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.post-actions {
  display: flex;
  gap: 16px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-base);
}

.action-button:hover {
  background: var(--surface);
  color: var(--text-primary);
}

.action-button.liked {
  color: var(--danger);
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-tertiary);
}

/* Right Sidebar */
.sidebar-right {
  width: 320px;
  background: var(--surface);
  border-left: 1px solid var(--border);
  overflow-y: auto;
  padding: 24px;
}

.widget {
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.widget-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.community-info {
  text-align: center;
}

.community-logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
  border-radius: 16px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: white;
}

.community-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.community-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.leaderboard-list {
  list-style: none;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.leaderboard-item:last-child {
  border-bottom: none;
}

.rank {
  width: 24px;
  height: 24px;
  background: var(--surface);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.rank.top {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.leaderboard-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  flex-shrink: 0;
}

.leaderboard-info {
  flex: 1;
}

.leaderboard-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.leaderboard-points {
  font-size: 13px;
  color: var(--success);
  font-weight: 600;
}

.event-card {
  padding: 12px;
  background: var(--surface);
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all var(--transition-base);
}

.event-card:hover {
  background: var(--surface-elevated);
}

.event-date {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 4px;
}

.event-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.event-attendees {
  font-size: 12px;
  color: var(--text-secondary);
}

/* AI Assistant */
.ai-badge {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
  color: white;
  padding: 12px 20px;
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  z-index: 1000;
  transition: all var(--transition-moderate);
}

.ai-badge:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}

.ai-pulse {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

/* Autosave Indicator */
.autosave-indicator {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-md);
  opacity: 0;
  transition: opacity var(--transition-moderate);
  z-index: 999;
}

.autosave-indicator.visible {
  opacity: 1;
}

.save-icon {
  color: var(--success);
}

/* Responsive */
@media (max-width: 1200px) {
  .sidebar-right {
    display: none;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    height: 100vh;
    z-index: 100;
    transition: left var(--transition-moderate);
  }

  .sidebar.open {
    left: 0;
  }

  .mobile-menu {
    display: flex;
  }

  .search-input {
    width: 200px;
  }

  .nav-tabs {
    gap: 12px;
  }

  .top-nav-actions {
    gap: 8px;
  }

  .hero-title {
    font-size: 32px;
  }
}
json

// package.json
{
  "name": "community-os",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}