"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsTabNavProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function SettingsTabNav({ tabs, activeTab, onTabChange }: SettingsTabNavProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const activeTabItem = tabs.find((tab) => tab.id === activeTab);

  if (isMobile) {
    return (
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="w-full flex items-center justify-between p-4 rounded-lg border"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            {activeTabItem && (
              <>
                <activeTabItem.icon className="w-5 h-5" style={{ color: "var(--primary-color)" }} />
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                  {activeTabItem.label}
                </span>
              </>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isAccordionOpen ? "rotate-180" : ""}`}
            style={{ color: "var(--text-secondary)" }}
          />
        </button>

        {isAccordionOpen && (
          <div
            className="mt-2 rounded-lg border overflow-hidden"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border)",
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsAccordionOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 border-b last:border-b-0 transition-colors"
                  style={{
                    background: isActive
                      ? "rgba(99, 102, 241, 0.1)"
                      : "transparent",
                    borderColor: "var(--border)",
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
                    }}
                  />
                  <span
                    className="font-medium"
                    style={{
                      color: isActive ? "var(--primary-color)" : "var(--text-primary)",
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="border-b mb-8 -mx-6 px-6"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap"
              style={{
                color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
                borderBottom: isActive ? "2px solid var(--primary-color)" : "2px solid transparent",
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
