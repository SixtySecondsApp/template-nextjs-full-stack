"use client";

import { SettingsCard } from "../SettingsCard";
import { SettingRow } from "../SettingRow";
import { ToggleSwitch } from "../ToggleSwitch";

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

interface GeneralSettingsTabProps {
  settings: GeneralSettings;
  onChange: (settings: GeneralSettings) => void;
}

export function GeneralSettingsTab({ settings, onChange }: GeneralSettingsTabProps) {
  const updateSetting = <K extends keyof GeneralSettings>(
    key: K,
    value: GeneralSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div>
      <SettingsCard
        title="Member Settings"
        description="Control how members join and interact with your community"
      >
        <SettingRow
          label="Allow member invitations"
          description="Let members invite others to join"
        >
          <ToggleSwitch
            id="allowMemberInvitations"
            enabled={settings.allowMemberInvitations}
            onChange={(value) => updateSetting("allowMemberInvitations", value)}
          />
        </SettingRow>

        <SettingRow
          label="Require approval for new members"
          description="Manually approve each join request"
        >
          <ToggleSwitch
            id="requireApproval"
            enabled={settings.requireApproval}
            onChange={(value) => updateSetting("requireApproval", value)}
          />
        </SettingRow>

        <SettingRow
          label="Allow profile customization"
          description="Members can personalize their profiles"
        >
          <ToggleSwitch
            id="allowProfileCustomization"
            enabled={settings.allowProfileCustomization}
            onChange={(value) => updateSetting("allowProfileCustomization", value)}
          />
        </SettingRow>

        <SettingRow
          label="Show member directory"
          description="Display a searchable member list"
        >
          <ToggleSwitch
            id="showMemberDirectory"
            enabled={settings.showMemberDirectory}
            onChange={(value) => updateSetting("showMemberDirectory", value)}
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Content Settings"
        description="Manage how content is created and shared"
      >
        <SettingRow
          label="Enable comments"
          description="Allow members to comment on posts"
        >
          <ToggleSwitch
            id="enableComments"
            enabled={settings.enableComments}
            onChange={(value) => updateSetting("enableComments", value)}
          />
        </SettingRow>

        <SettingRow
          label="Moderate posts before publishing"
          description="Review all posts before they go live"
        >
          <ToggleSwitch
            id="moderatePosts"
            enabled={settings.moderatePosts}
            onChange={(value) => updateSetting("moderatePosts", value)}
          />
        </SettingRow>

        <SettingRow
          label="Allow file uploads"
          description="Members can attach files to posts"
        >
          <ToggleSwitch
            id="allowFileUploads"
            enabled={settings.allowFileUploads}
            onChange={(value) => updateSetting("allowFileUploads", value)}
          />
        </SettingRow>

        <SettingRow
          label="Default post visibility"
          description="Who can see posts by default"
        >
          <select
            value={settings.defaultPostVisibility}
            onChange={(e) =>
              updateSetting(
                "defaultPostVisibility",
                e.target.value as GeneralSettings["defaultPostVisibility"]
              )
            }
            className="px-3 py-2 rounded-lg border text-sm font-medium"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <option value="PUBLIC">Public</option>
            <option value="MEMBERS_ONLY">Members Only</option>
            <option value="ADMINS_ONLY">Admins Only</option>
          </select>
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Community Guidelines"
        description="Set rules and expectations for your community"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="communityGuidelines"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Community rules/guidelines
            </label>
            <textarea
              id="communityGuidelines"
              value={settings.communityGuidelines}
              onChange={(e) => updateSetting("communityGuidelines", e.target.value)}
              rows={6}
              placeholder="Enter your community guidelines..."
              className="w-full px-4 py-3 rounded-lg border resize-none text-sm"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
            <a
              href="#"
              className="inline-block mt-2 text-sm font-medium hover:underline"
              style={{ color: "var(--primary-color)" }}
            >
              View guidelines template →
            </a>
          </div>

          <SettingRow
            label="Require members to accept guidelines"
            description="Members must agree to guidelines before joining"
          >
            <ToggleSwitch
              id="requireGuidelinesAcceptance"
              enabled={settings.requireGuidelinesAcceptance}
              onChange={(value) => updateSetting("requireGuidelinesAcceptance", value)}
            />
          </SettingRow>
        </div>
      </SettingsCard>
    </div>
  );
}
