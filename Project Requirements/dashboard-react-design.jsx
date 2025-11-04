import React, { useState } from 'react';
import { Home, BarChart3, Users, MessageSquare, BookOpen, DollarSign, Ticket, CreditCard, Palette, Settings, Lightbulb, HelpCircle, ChevronDown, Bell, Moon, Sun, Download, Plus, TrendingUp, TrendingDown, Check, X, Calendar, Video, FileText, Award, Clock, AlertCircle, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';

export default function CommunityDashboard() {
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('home');
  const [timeFilter, setTimeFilter] = useState('30d');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-white text-gray-900'}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar theme={theme} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar theme={theme} toggleTheme={toggleTheme} />

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'home' && <HomeTab theme={theme} timeFilter={timeFilter} setTimeFilter={setTimeFilter} />}
              {activeTab === 'analytics' && <AnalyticsTab theme={theme} />}
              {activeTab === 'members' && <MembersTab theme={theme} />}
              {activeTab === 'content' && <ContentTab theme={theme} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ theme, activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'content', icon: MessageSquare, label: 'Content' },
    { id: 'courses', icon: BookOpen, label: 'Courses' },
  ];

  const monetizationItems = [
    { id: 'pricing', icon: DollarSign, label: 'Plans & Pricing' },
    { id: 'coupons', icon: Ticket, label: 'Coupons' },
    { id: 'transactions', icon: CreditCard, label: 'Transactions' },
  ];

  const settingsItems = [
    { id: 'customize', icon: Palette, label: 'Customize' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'ai', icon: Lightbulb, label: 'AI Assistant', badge: 2 },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <aside className={`w-60 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'} border-r flex flex-col`}>
      {/* Sidebar Header */}
      <div className={`p-5 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} border-b`}>
        <div className={`flex items-center gap-3 p-3 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'} border rounded-lg cursor-pointer hover:bg-opacity-80 transition-all`}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            CO
          </div>
          <div className="flex-1">
            <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-100' : 'text-gray-900'}`}>
              Community OS
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
              View live →
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <NavSection title="Main" items={navItems} activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
        <NavSection title="Monetization" items={monetizationItems} activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
        <NavSection title="Settings" items={settingsItems} activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
      </div>

      {/* Sidebar Footer */}
      <div className={`p-4 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} border-t`}>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg mb-3 flex items-center justify-between text-sm font-semibold">
          <span>Growth Plan</span>
          <span>✨</span>
        </div>
        <div className="mb-3">
          <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} flex justify-between mb-2`}>
            <span>Storage</span>
            <span>12 GB / 50 GB</span>
          </div>
          <div className={`h-1.5 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <div className="h-full bg-green-500 rounded-full" style={{ width: '24%' }}></div>
          </div>
        </div>
        <button className={`w-full py-2 px-3 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg text-sm font-semibold hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all`}>
          Upgrade Plan
        </button>
      </div>
    </aside>
  );
}

function NavSection({ title, items, activeTab, setActiveTab, theme }) {
  return (
    <div className="mb-6">
      <div className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'} px-3 mb-2`}>
        {title}
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${
              isActive
                ? 'bg-indigo-500 text-white'
                : theme === 'dark'
                ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'
                : 'text-gray-600 hover:bg-white hover:text-gray-900'
            }`}
          >
            <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function TopBar({ theme, toggleTheme }) {
  return (
    <header className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between shadow-sm`}>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Home size={24} />
          Home
        </h1>
        <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
          Overview of your community performance
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-all`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className={`px-4 py-2 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all flex items-center gap-2`}>
          <Download size={16} />
          Export Report
        </button>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
          <Plus size={16} />
          New Post
        </button>
      </div>
    </header>
  );
}

function HomeTab({ theme, timeFilter, setTimeFilter }) {
  return (
    <div>
      {/* Welcome Banner */}
      <WelcomeBanner theme={theme} />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <MetricCard
          icon="👥"
          label="Members"
          value="1,247"
          change="+12%"
          changeType="positive"
          theme={theme}
          bgColor="bg-blue-50"
        />
        <MetricCard
          icon="📝"
          label="Posts"
          value="342"
          change="+8%"
          changeType="positive"
          theme={theme}
          bgColor="bg-green-50"
        />
        <MetricCard
          icon="💬"
          label="Comments"
          value="1,856"
          change="+23%"
          changeType="positive"
          theme={theme}
          bgColor="bg-orange-50"
        />
        <MetricCard
          icon="💰"
          label="MRR"
          value="$4,890"
          change="+$340"
          changeType="positive"
          theme={theme}
          bgColor="bg-purple-50"
        />
      </div>

      {/* Activity Graph */}
      <ActivityGraph theme={theme} timeFilter={timeFilter} setTimeFilter={setTimeFilter} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RecentActivity theme={theme} />
        </div>
        <div>
          <PendingTasks theme={theme} />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions theme={theme} />

      {/* Recommended Resources */}
      <RecommendedResources theme={theme} />
    </div>
  );
}

function WelcomeBanner({ theme }) {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
      <h2 className="text-xl font-bold mb-3">👋 Welcome to Community OS!</h2>
      <p className="mb-4">Let's get your community set up in 4 steps:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span>✅</span>
          <span>Customize your branding</span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-70">
          <span>⬜</span>
          <span>Create your first post</span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-70">
          <span>⬜</span>
          <span>Invite 5 members</span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-70">
          <span>⬜</span>
          <span>Set up pricing</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all">
          Continue Setup →
        </button>
        <button
          onClick={() => setShow(false)}
          className="px-4 py-2 bg-transparent border border-white border-opacity-30 rounded-lg font-semibold text-sm hover:bg-white hover:bg-opacity-10 transition-all"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, change, changeType, theme, bgColor }) {
  return (
    <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-slate-700' : bgColor} rounded-lg flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
          {label}
        </div>
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className={`text-sm flex items-center gap-1 ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
        {changeType === 'positive' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{change} vs last 30 days</span>
      </div>
    </div>
  );
}

function ActivityGraph({ theme, timeFilter, setTimeFilter }) {
  const timeOptions = ['7d', '30d', '90d', '1y'];

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6 mb-6`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BarChart3 size={20} />
          Activity Trends
        </h3>
        <div className="flex gap-2">
          {timeOptions.map((option) => (
            <button
              key={option}
              onClick={() => setTimeFilter(option)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeFilter === option
                  ? 'bg-indigo-500 text-white'
                  : theme === 'dark'
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className={`h-72 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'} rounded-lg flex items-end gap-2 p-5`}>
        {[45, 60, 35, 70, 55, 80, 65, 50, 75, 85, 70, 60].map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t hover:opacity-100 opacity-80 transition-all cursor-pointer"
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity({ theme }) {
  const activities = [
    { icon: '👤', text: 'Sarah Chen joined as paid member', time: '2 min ago', badge: null },
    { icon: '📝', text: 'Alex posted "New feature ideas" in General', time: '15 min ago', badge: null },
    { icon: '💬', text: 'Maria commented on "Getting Started"', time: '1 hour ago', badge: null },
    { icon: '⭐', text: 'Community reached 1,000 members!', time: '3 hours ago', badge: 'Milestone' },
    { icon: '💰', text: 'Payment of $49 received from Tom', time: '5 hours ago', badge: null },
  ];

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Clock size={20} />
          Recent Activity
        </h3>
        <button className="text-indigo-500 text-sm font-semibold hover:text-indigo-600">
          View All →
        </button>
      </div>
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 ${theme === 'dark' ? 'bg-slate-900 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg transition-all`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0">
              {activity.icon}
            </div>
            <div className="flex-1">
              <div className={`text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-gray-900'}`}>
                {activity.text}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                {activity.time}
              </div>
            </div>
            {activity.badge && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded font-semibold">
                {activity.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PendingTasks({ theme }) {
  const tasks = [
    { text: '2 flagged posts awaiting review', urgent: true },
    { text: '5 member applications pending approval', urgent: false },
    { text: 'Trial ending in 3 days (add payment method)', urgent: true },
  ];

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
      <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
        <Check size={20} />
        Pending Tasks (3)
      </h3>
      <div className="space-y-3">
        {tasks.map((task, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'} rounded-lg border-l-4 ${
              task.urgent ? 'border-red-500' : 'border-orange-500'
            }`}
          >
            <div className={`w-4 h-4 border-2 ${theme === 'dark' ? 'border-slate-600' : 'border-gray-300'} rounded cursor-pointer hover:border-indigo-500 transition-all`}></div>
            <div className={`text-sm ${theme === 'dark' ? 'text-slate-200' : 'text-gray-800'}`}>
              {task.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions({ theme }) {
  const actions = [
    { icon: '📝', label: 'Create Post' },
    { icon: '📧', label: 'Invite Members' },
    { icon: '🎨', label: 'Customize' },
    { icon: '📚', label: 'Add Course' },
    { icon: '📅', label: 'Schedule Event' },
    { icon: '💰', label: 'View Revenue' },
  ];

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6 mb-6`}>
      <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
        ⚡ Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action, i) => (
          <button
            key={i}
            className={`p-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 hover:bg-slate-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} border rounded-lg flex items-center gap-3 font-medium text-sm transition-all hover:shadow-md hover:-translate-y-1`}
          >
            <span className="text-xl">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RecommendedResources({ theme }) {
  const resources = [
    { icon: '📖', title: 'How to boost engagement in your community', meta: '5 min read • Guide' },
    { icon: '🎥', title: 'Webinar: Monetization strategies', meta: 'Tomorrow at 2pm EST • Live Event' },
    { icon: '💡', title: 'Case study: From 0 to 1k members in 60 days', meta: '12 min read • Success Story' },
  ];

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
      <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
        📚 Recommended for You
      </h3>
      <div className="space-y-3">
        {resources.map((resource, i) => (
          <div
            key={i}
            className={`p-3 ${theme === 'dark' ? 'bg-slate-900 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg cursor-pointer transition-all`}
          >
            <div className="text-xl mb-2">{resource.icon}</div>
            <div className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-slate-100' : 'text-gray-900'}`}>
              {resource.title}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
              {resource.meta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab({ theme }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📊 Analytics</h2>
      <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-12 text-center`}>
        <BarChart3 size={48} className={`mx-auto mb-4 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`} />
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Analytics page coming soon...</p>
      </div>
    </div>
  );
}

function MembersTab({ theme }) {
  const members = [
    { name: 'Sarah Chen', email: 'sarah@email.com', plan: 'Growth', amount: '$199/mo', joined: 'Jan 15, 2026', lastActive: '2 min ago', posts: 42 },
    { name: 'Alex Morgan', email: 'alex@email.com', plan: 'Starter', amount: '$49/mo', joined: 'Feb 3, 2026', lastActive: '1 hour ago', posts: 38 },
    { name: 'Maria Santos', email: 'maria@email.com', plan: 'Free', amount: '', joined: 'Mar 12, 2026', lastActive: '3 days ago', posts: 29 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">👥 Members</h2>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-all flex items-center gap-2">
          <Plus size={16} />
          Invite Members
        </button>
      </div>

      <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden`}>
        <table className="w-full">
          <thead className={theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}>
            <tr>
              <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>Member</th>
              <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>Plan</th>
              <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>Joined</th>
              <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>Last Active</th>
              <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>Posts</th>
              <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, i) => (
              <tr key={i} className={`${theme === 'dark' ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'} border-t transition-all`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className={`font-semibold ${theme === 'dark' ? 'text-slate-100' : 'text-gray-900'}`}>{member.name}</div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-gray-800'}`}>{member.plan}</div>
                  {member.amount && <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{member.amount}</div>}
                </td>
                <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>{member.joined}</td>
                <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>{member.lastActive}</td>
                <td className={`px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-gray-800'}`}>{member.posts}</td>
                <td className="px-6 py-4">
                  <button className={`p-1 rounded hover:bg-gray-200 ${theme === 'dark' ? 'hover:bg-slate-600' : ''} transition-all`}>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContentTab({ theme }) {
  const posts = [
    { title: 'Welcome new members!', author: 'Sarah Chen', space: 'General', likes: 45, comments: 23, views: 234 },
    { title: 'Feature request: Dark mode', author: 'Alex Morgan', space: 'Feature Requests', likes: 67, comments: 34, views: 456 },
    { title: 'Getting Started Guide', author: 'You', space: 'Resources', likes: 89, comments: 12, views: 678 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📝 Content</h2>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-all flex items-center gap-2">
          <Plus size={16} />
          New Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post, i) => (
          <div key={i} className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-all`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-slate-100' : 'text-gray-900'}`}>{post.title}</h3>
                <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  by {post.author} • in {post.space}
                </div>
              </div>
              <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-all`}>
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                👍 {post.likes}
              </span>
              <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                💬 {post.comments}
              </span>
              <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                👁 {post.views}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}