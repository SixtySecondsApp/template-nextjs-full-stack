"use client";

import { SettingsCard } from "../SettingsCard";
import { SettingRow } from "../SettingRow";
import { ToggleSwitch } from "../ToggleSwitch";
import { Mail, Bell, Shield } from "lucide-react";

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

interface NotificationsTabProps {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
}

export function NotificationsTab({ settings, onChange }: NotificationsTabProps) {
  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div>
      <SettingsCard
        title="Email Notifications"
        description="Configure automated emails sent to members"
      >
        <SettingRow
          label="Welcome email"
          description="Send new members a welcome email"
        >
          <div className="flex items-center gap-3">
            <ToggleSwitch
              id="welcomeEmail"
              enabled={settings.welcomeEmail}
              onChange={(value) => updateSetting("welcomeEmail", value)}
            />
            {settings.welcomeEmail && (
              <a
                href="#"
                className="text-sm font-medium hover:underline whitespace-nowrap"
                style={{ color: "var(--primary-color)" }}
              >
                Preview →
              </a>
            )}
          </div>
        </SettingRow>

        <SettingRow
          label="Weekly digest"
          description="Send members a weekly summary of activity"
        >
          <ToggleSwitch
            id="weeklyDigest"
            enabled={settings.weeklyDigest}
            onChange={(value) => updateSetting("weeklyDigest", value)}
          />
        </SettingRow>

        <SettingRow
          label="New content notifications"
          description="Notify members of new posts and updates"
        >
          <ToggleSwitch
            id="newContentNotifications"
            enabled={settings.newContentNotifications}
            onChange={(value) => updateSetting("newContentNotifications", value)}
          />
        </SettingRow>

        <SettingRow
          label="Comment notifications"
          description="Notify when someone responds to their content"
        >
          <ToggleSwitch
            id="commentNotifications"
            enabled={settings.commentNotifications}
            onChange={(value) => updateSetting("commentNotifications", value)}
          />
        </SettingRow>

        <SettingRow
          label="Event reminders"
          description="Send reminders before scheduled events"
        >
          <ToggleSwitch
            id="eventReminders"
            enabled={settings.eventReminders}
            onChange={(value) => updateSetting("eventReminders", value)}
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Push Notifications"
        description="Real-time browser notifications"
      >
        <SettingRow
          label="Enable push notifications"
          description="Send real-time notifications to members"
        >
          <ToggleSwitch
            id="pushNotifications"
            enabled={settings.pushNotifications}
            onChange={(value) => updateSetting("pushNotifications", value)}
          />
        </SettingRow>

        {settings.pushNotifications && (
          <div
            className="px-4 py-3 rounded-lg text-sm"
            style={{
              background: "rgba(99, 102, 241, 0.1)",
              color: "var(--text-secondary)",
            }}
          >
            Note: Requires browser permission from each member
          </div>
        )}
      </SettingsCard>

      <SettingsCard
        title="Admin Notifications"
        description="Alerts for community administrators"
      >
        <SettingRow
          label="New member alerts"
          description="Get notified when someone joins your community"
        >
          <ToggleSwitch
            id="newMemberAlerts"
            enabled={settings.newMemberAlerts}
            onChange={(value) => updateSetting("newMemberAlerts", value)}
          />
        </SettingRow>

        <SettingRow
          label="Flagged content alerts"
          description="Receive alerts when content is reported"
        >
          <ToggleSwitch
            id="flaggedContentAlerts"
            enabled={settings.flaggedContentAlerts}
            onChange={(value) => updateSetting("flaggedContentAlerts", value)}
          />
        </SettingRow>

        <SettingRow
          label="Payment notifications"
          description="Get notified of successful payments and refunds"
        >
          <ToggleSwitch
            id="paymentNotifications"
            enabled={settings.paymentNotifications}
            onChange={(value) => updateSetting("paymentNotifications", value)}
          />
        </SettingRow>
      </SettingsCard>
    </div>
  );
}
