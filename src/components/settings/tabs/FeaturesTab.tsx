"use client";

import { Calendar, Book, Trophy, Award, Folder, MessageCircle, DollarSign, Star } from "lucide-react";
import { SettingsCard } from "../SettingsCard";
import { SettingRow } from "../SettingRow";
import { ToggleSwitch } from "../ToggleSwitch";

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

interface FeaturesTabProps {
  settings: FeatureSettings;
  onChange: (settings: FeatureSettings) => void;
}

export function FeaturesTab({ settings, onChange }: FeaturesTabProps) {
  const updateSetting = <K extends keyof FeatureSettings>(
    key: K,
    value: FeatureSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div>
      <SettingsCard
        title="Community Features"
        description="Enable or disable major features for your community"
      >
        <SettingRow
          label="Events"
          description="Create and manage community events"
          icon={<Calendar className="w-5 h-5" />}
        >
          <ToggleSwitch
            id="events"
            enabled={settings.events}
            onChange={(value) => updateSetting("events", value)}
          />
        </SettingRow>

        <SettingRow
          label="Courses"
          description="Offer educational content and courses"
          icon={<Book className="w-5 h-5" />}
        >
          <ToggleSwitch
            id="courses"
            enabled={settings.courses}
            onChange={(value) => updateSetting("courses", value)}
          />
        </SettingRow>

        <SettingRow
          label="Challenges"
          description="Engage members with challenges and goals"
          icon={<Trophy className="w-5 h-5" />}
        >
          <ToggleSwitch
            id="challenges"
            enabled={settings.challenges}
            onChange={(value) => updateSetting("challenges", value)}
          />
        </SettingRow>

        <SettingRow
          label="Leaderboards"
          description="Show top contributors and active members"
          icon={<Award className="w-5 h-5" />}
        >
          <ToggleSwitch
            id="leaderboards"
            enabled={settings.leaderboards}
            onChange={(value) => updateSetting("leaderboards", value)}
          />
        </SettingRow>

        <SettingRow
          label="Resources Library"
          description="Share downloadable resources with members"
          icon={<Folder className="w-5 h-5" />}
        >
          <ToggleSwitch
            id="resourcesLibrary"
            enabled={settings.resourcesLibrary}
            onChange={(value) => updateSetting("resourcesLibrary", value)}
          />
        </SettingRow>

        <SettingRow
          label="Direct Messaging"
          description="Allow members to message each other"
          icon={<MessageCircle className="w-5 h-5" />}
        >
          <ToggleSwitch
            id="directMessaging"
            enabled={settings.directMessaging}
            onChange={(value) => updateSetting("directMessaging", value)}
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Monetization">
        <SettingRow
          label="Paid memberships"
          description="Charge members to join or access content"
          icon={<DollarSign className="w-5 h-5" />}
        >
          <ToggleSwitch
            id="paidMemberships"
            enabled={settings.paidMemberships}
            onChange={(value) => updateSetting("paidMemberships", value)}
          />
        </SettingRow>

        {settings.paidMemberships && (
          <div
            className="px-4 py-3 rounded-lg text-sm"
            style={{
              background: "rgba(99, 102, 241, 0.1)",
              color: "var(--text-secondary)",
            }}
          >
            Note: Requires payment setup
          </div>
        )}

        <SettingRow
          label="Premium content"
          description="Offer exclusive content to paying members"
        >
          <ToggleSwitch
            id="premiumContent"
            enabled={settings.premiumContent}
            onChange={(value) => updateSetting("premiumContent", value)}
          />
        </SettingRow>

        <SettingRow
          label="Donations/Tips"
          description="Accept one-time contributions from members"
        >
          <ToggleSwitch
            id="donations"
            enabled={settings.donations}
            onChange={(value) => updateSetting("donations", value)}
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Gamification"
        description="Add game-like elements to increase engagement"
      >
        <SettingRow
          label="Achievement badges"
          description="Reward members with badges for milestones"
          icon={<Star className="w-5 h-5" />}
        >
          <ToggleSwitch
            id="achievementBadges"
            enabled={settings.achievementBadges}
            onChange={(value) => updateSetting("achievementBadges", value)}
          />
        </SettingRow>

        <SettingRow
          label="Points system"
          description="Award points for participation and activity"
        >
          <ToggleSwitch
            id="pointsSystem"
            enabled={settings.pointsSystem}
            onChange={(value) => updateSetting("pointsSystem", value)}
          />
        </SettingRow>

        <SettingRow
          label="Member levels/tiers"
          description="Create membership tiers with different perks"
        >
          <ToggleSwitch
            id="memberLevels"
            enabled={settings.memberLevels}
            onChange={(value) => updateSetting("memberLevels", value)}
          />
        </SettingRow>
      </SettingsCard>
    </div>
  );
}
