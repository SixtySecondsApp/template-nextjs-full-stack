import Link from "next/link";
import {
  Home,
  Users,
  BookOpen,
  MessageSquare,
  Lightbulb,
  Calendar,
  Video,
  FileText,
} from "lucide-react";

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
}

const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { icon: Home, label: "Home", href: "/dashboard", active: true },
      { icon: Users, label: "Members", href: "/members" },
      { icon: BookOpen, label: "Courses", href: "/courses" },
    ],
  },
  {
    title: "Spaces",
    items: [
      { icon: MessageSquare, label: "General Discussion", href: "/spaces/general" },
      { icon: Lightbulb, label: "Getting Started", href: "/spaces/getting-started" },
      { icon: Calendar, label: "Events", href: "/events" },
    ],
  },
  {
    title: "Learning",
    items: [
      { icon: Video, label: "Course Lessons", href: "/lessons" },
      { icon: FileText, label: "Resources", href: "/resources" },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">CO</div>
          <span>Community OS</span>
        </div>
      </div>

      {navSections.map((section, idx) => (
        <nav key={idx} className="nav-section">
          <div className="nav-section-title">{section.title}</div>
          {section.items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${item.active ? "active" : ""}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      ))}

      <div className="online-indicator">
        <div className="online-dot"></div>
        <span>420 members online</span>
      </div>
    </aside>
  );
}
