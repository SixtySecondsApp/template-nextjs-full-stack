"use client";

import { Download, FileText } from "lucide-react";
import { SettingsCard } from "../SettingsCard";
import { SettingRow } from "../SettingRow";
import { ToggleSwitch } from "../ToggleSwitch";

interface PrivacySecuritySettings {
  communityVisibility: "PUBLIC" | "PRIVATE" | "SECRET";
  allowSearchIndexing: boolean;
  showMemberListToNonMembers: boolean;
  requireEmailVerification: boolean;
  twoFactorAuth: boolean;
  autoBanSpam: boolean;
}

interface PrivacySecurityTabProps {
  settings: PrivacySecuritySettings;
  onChange: (settings: PrivacySecuritySettings) => void;
  onExportMembers: () => void;
  onExportContent: () => void;
}

export function PrivacySecurityTab({
  settings,
  onChange,
  onExportMembers,
  onExportContent,
}: PrivacySecurityTabProps) {
  const updateSetting = <K extends keyof PrivacySecuritySettings>(
    key: K,
    value: PrivacySecuritySettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  const isPublic = settings.communityVisibility === "PUBLIC";

  return (
    <div>
      <SettingsCard
        title="Privacy Settings"
        description="Control who can see your community and its content"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="communityVisibility"
              className="block text-sm font-medium mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Community visibility
            </label>

            <div className="space-y-3">
              <label
                className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors"
                style={{
                  borderColor:
                    settings.communityVisibility === "PUBLIC"
                      ? "var(--primary-color)"
                      : "var(--border)",
                  background:
                    settings.communityVisibility === "PUBLIC"
                      ? "rgba(99, 102, 241, 0.05)"
                      : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="communityVisibility"
                  value="PUBLIC"
                  checked={settings.communityVisibility === "PUBLIC"}
                  onChange={(e) =>
                    updateSetting(
                      "communityVisibility",
                      e.target.value as PrivacySecuritySettings["communityVisibility"]
                    )
                  }
                  className="mt-0.5"
                  style={{ accentColor: "var(--primary-color)" }}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                    Public
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Anyone can find and view your community
                  </div>
                </div>
              </label>

              <label
                className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors"
                style={{
                  borderColor:
                    settings.communityVisibility === "PRIVATE"
                      ? "var(--primary-color)"
                      : "var(--border)",
                  background:
                    settings.communityVisibility === "PRIVATE"
                      ? "rgba(99, 102, 241, 0.05)"
                      : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="communityVisibility"
                  value="PRIVATE"
                  checked={settings.communityVisibility === "PRIVATE"}
                  onChange={(e) =>
                    updateSetting(
                      "communityVisibility",
                      e.target.value as PrivacySecuritySettings["communityVisibility"]
                    )
                  }
                  className="mt-0.5"
                  style={{ accentColor: "var(--primary-color)" }}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                    Private
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Anyone can find it, but only members can see content
                  </div>
                </div>
              </label>

              <label
                className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors"
                style={{
                  borderColor:
                    settings.communityVisibility === "SECRET"
                      ? "var(--primary-color)"
                      : "var(--border)",
                  background:
                    settings.communityVisibility === "SECRET"
                      ? "rgba(99, 102, 241, 0.05)"
                      : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="communityVisibility"
                  value="SECRET"
                  checked={settings.communityVisibility === "SECRET"}
                  onChange={(e) =>
                    updateSetting(
                      "communityVisibility",
                      e.target.value as PrivacySecuritySettings["communityVisibility"]
                    )
                  }
                  className="mt-0.5"
                  style={{ accentColor: "var(--primary-color)" }}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                    Secret
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Only invited members can find and join
                  </div>
                </div>
              </label>
            </div>
          </div>

          <SettingRow
            label="Allow search engine indexing"
            description="Let Google and other search engines index your community"
          >
            <ToggleSwitch
              id="allowSearchIndexing"
              enabled={settings.allowSearchIndexing}
              onChange={(value) => updateSetting("allowSearchIndexing", value)}
              disabled={!isPublic}
            />
          </SettingRow>

          <SettingRow
            label="Show member list to non-members"
            description="Let visitors see your community members"
          >
            <ToggleSwitch
              id="showMemberListToNonMembers"
              enabled={settings.showMemberListToNonMembers}
              onChange={(value) => updateSetting("showMemberListToNonMembers", value)}
            />
          </SettingRow>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Security"
        description="Protect your community from spam and unauthorized access"
      >
        <SettingRow
          label="Require email verification"
          description="Members must verify their email before joining"
        >
          <ToggleSwitch
            id="requireEmailVerification"
            enabled={settings.requireEmailVerification}
            onChange={(value) => updateSetting("requireEmailVerification", value)}
          />
        </SettingRow>

        <SettingRow
          label="Two-factor authentication available"
          description="Allow members to enable 2FA for their accounts"
        >
          <ToggleSwitch
            id="twoFactorAuth"
            enabled={settings.twoFactorAuth}
            onChange={(value) => updateSetting("twoFactorAuth", value)}
          />
        </SettingRow>

        <SettingRow
          label="Auto-ban spam accounts"
          description="Automatically block suspicious accounts"
        >
          <ToggleSwitch
            id="autoBanSpam"
            enabled={settings.autoBanSpam}
            onChange={(value) => updateSetting("autoBanSpam", value)}
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Data & Export"
        description="Manage your community data"
      >
        <div className="space-y-3">
          <button
            type="button"
            onClick={onExportMembers}
            className="w-full flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-opacity-50"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" style={{ color: "var(--primary-color)" }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                  Export member data
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Download member list as CSV
                </div>
              </div>
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--primary-color)" }}>
              Download →
            </span>
          </button>

          <button
            type="button"
            onClick={onExportContent}
            className="w-full flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-opacity-50"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" style={{ color: "var(--primary-color)" }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                  Export content archive
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Download all posts and content
                </div>
              </div>
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--primary-color)" }}>
              Download →
            </span>
          </button>

          <a
            href="#"
            className="flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-opacity-50"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" style={{ color: "var(--primary-color)" }} />
              <div className="text-left">
                <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                  Privacy policy
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  View our privacy policy
                </div>
              </div>
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--primary-color)" }}>
              View →
            </span>
          </a>
        </div>
      </SettingsCard>
    </div>
  );
}
