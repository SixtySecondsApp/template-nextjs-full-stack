"use client";

import { useState, useEffect } from "react";
import { Settings, Users, Palette, Bell, Shield } from "lucide-react";
import { SettingsTabNav, type TabItem } from "@/components/settings/SettingsTabNav";
import { SettingsFooter } from "@/components/settings/SettingsFooter";
import { GeneralSettingsTab } from "@/components/settings/tabs/GeneralSettingsTab";
import { FeaturesTab } from "@/components/settings/tabs/FeaturesTab";
import { BrandingTab } from "@/components/settings/tabs/BrandingTab";
import { NotificationsTab } from "@/components/settings/tabs/NotificationsTab";
import { PrivacySecurityTab } from "@/components/settings/tabs/PrivacySecurityTab";

// Types for all settings
interface GeneralSettings {
  allowMemberInvitations: boolean;
  requireApproval: boolean;
  allowProfileCustomization: boolean;
  showMemberDirectory: boolean;
  enableComments: boolean;
  moderatePosts: boolean;
  allowFileUploads: boolean;
  defaultPostVisibility: "PUBLIC" | "MEMBERS_ONLY" | "ADMINS_ONLY";
  communityGuidelines: string;
  requireGuidelinesAcceptance: boolean;
}

interface FeatureSettings {
  events: boolean;
  courses: boolean;
  challenges: boolean;
  leaderboards: boolean;
  resourcesLibrary: boolean;
  directMessaging: boolean;
  paidMemberships: boolean;
  premiumContent: boolean;
  donations: boolean;
  achievementBadges: boolean;
  pointsSystem: boolean;
  memberLevels: boolean;
}

interface BrandingSettings {
  primaryColor: string;
  logo?: File | null;
  coverImage?: File | null;
  favicon?: File | null;
  headingFont: string;
  bodyFont: string;
  customCss: string;
  enableCustomCss: boolean;
}

interface NotificationSettings {
  welcomeEmail: boolean;
  weeklyDigest: boolean;
  newContentNotifications: boolean;
  commentNotifications: boolean;
  eventReminders: boolean;
  pushNotifications: boolean;
  newMemberAlerts: boolean;
  flaggedContentAlerts: boolean;
  paymentNotifications: boolean;
}

interface PrivacySecuritySettings {
  communityVisibility: "PUBLIC" | "PRIVATE" | "SECRET";
  allowSearchIndexing: boolean;
  showMemberListToNonMembers: boolean;
  requireEmailVerification: boolean;
  twoFactorAuth: boolean;
  autoBanSpam: boolean;
}

interface AllSettings {
  general: GeneralSettings;
  features: FeatureSettings;
  branding: BrandingSettings;
  notifications: NotificationSettings;
  privacySecurity: PrivacySecuritySettings;
}

// Default settings
const DEFAULT_SETTINGS: AllSettings = {
  general: {
    allowMemberInvitations: true,
    requireApproval: false,
    allowProfileCustomization: true,
    showMemberDirectory: true,
    enableComments: true,
    moderatePosts: false,
    allowFileUploads: true,
    defaultPostVisibility: "PUBLIC",
    communityGuidelines: "",
    requireGuidelinesAcceptance: false,
  },
  features: {
    events: true,
    courses: false,
    challenges: true,
    leaderboards: false,
    resourcesLibrary: true,
    directMessaging: true,
    paidMemberships: false,
    premiumContent: false,
    donations: false,
    achievementBadges: false,
    pointsSystem: false,
    memberLevels: false,
  },
  branding: {
    primaryColor: "#6366f1",
    logo: null,
    coverImage: null,
    favicon: null,
    headingFont: "system",
    bodyFont: "system",
    customCss: "",
    enableCustomCss: false,
  },
  notifications: {
    welcomeEmail: true,
    weeklyDigest: false,
    newContentNotifications: true,
    commentNotifications: true,
    eventReminders: true,
    pushNotifications: false,
    newMemberAlerts: true,
    flaggedContentAlerts: true,
    paymentNotifications: true,
  },
  privacySecurity: {
    communityVisibility: "PUBLIC",
    allowSearchIndexing: true,
    showMemberListToNonMembers: false,
    requireEmailVerification: true,
    twoFactorAuth: false,
    autoBanSpam: true,
  },
};

const TABS: TabItem[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "features", label: "Features", icon: Users },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
];

export default function CommunitySetupPage() {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [settings, setSettings] = useState<AllSettings>(DEFAULT_SETTINGS);
  const [initialSettings, setInitialSettings] = useState<AllSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Check for unsaved changes
  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // TODO: Implement actual API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setInitialSettings(settings);
      showSuccessToast("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      showSuccessToast("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    // TODO: Navigate to dashboard or next step
    window.location.href = "/dashboard";
  };

  const handleExportMembers = () => {
    // TODO: Implement member export
    showSuccessToast("Exporting member data...");
  };

  const handleExportContent = () => {
    // TODO: Implement content export
    showSuccessToast("Exporting content archive...");
  };

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Header */}
      <header
        className="border-b sticky top-0 z-10"
        style={{
          background: "var(--surface-elevated)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Configure Your Community
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Customize the settings to match your vision
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <SettingsTabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="pb-24">
          {activeTab === "general" && (
            <GeneralSettingsTab
              settings={settings.general}
              onChange={(general) => setSettings({ ...settings, general })}
            />
          )}

          {activeTab === "features" && (
            <FeaturesTab
              settings={settings.features}
              onChange={(features) => setSettings({ ...settings, features })}
            />
          )}

          {activeTab === "branding" && (
            <BrandingTab
              settings={settings.branding}
              onChange={(branding) => setSettings({ ...settings, branding })}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsTab
              settings={settings.notifications}
              onChange={(notifications) => setSettings({ ...settings, notifications })}
            />
          )}

          {activeTab === "privacy" && (
            <PrivacySecurityTab
              settings={settings.privacySecurity}
              onChange={(privacySecurity) => setSettings({ ...settings, privacySecurity })}
              onExportMembers={handleExportMembers}
              onExportContent={handleExportContent}
            />
          )}
        </div>

        <SettingsFooter
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          onSave={handleSave}
          onSkip={handleSkip}
        />
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div
          className="fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg transition-opacity z-50"
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <p className="font-medium" style={{ color: "var(--text-primary)" }}>
            {toastMessage}
          </p>
        </div>
      )}
    </div>
  );
}
