"use client";

import { useState } from "react";
import { SettingsCard } from "../SettingsCard";
import { ColorPicker } from "../ColorPicker";
import { FileUploadArea } from "../FileUploadArea";
import { ToggleSwitch } from "../ToggleSwitch";

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

interface BrandingTabProps {
  settings: BrandingSettings;
  onChange: (settings: BrandingSettings) => void;
}

const FONT_OPTIONS = [
  { value: "system", label: "System Default" },
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "poppins", label: "Poppins" },
  { value: "open-sans", label: "Open Sans" },
  { value: "lato", label: "Lato" },
  { value: "montserrat", label: "Montserrat" },
];

export function BrandingTab({ settings, onChange }: BrandingTabProps) {
  const updateSetting = <K extends keyof BrandingSettings>(
    key: K,
    value: BrandingSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div>
      <SettingsCard
        title="Primary Color"
        description="Choose your community's primary brand color"
      >
        <ColorPicker
          selectedColor={settings.primaryColor}
          onChange={(color) => updateSetting("primaryColor", color)}
        />
      </SettingsCard>

      <SettingsCard
        title="Logo & Images"
        description="Upload your community branding assets"
      >
        <FileUploadArea
          id="logo"
          label="Logo"
          accept=".png,.svg,.jpg,.jpeg"
          maxSize={2}
          currentFile={null}
          onFileChange={(file) => updateSetting("logo", file)}
          recommendedSize="200x200px, PNG or SVG"
        />

        <FileUploadArea
          id="coverImage"
          label="Cover Image"
          accept=".png,.jpg,.jpeg"
          maxSize={5}
          currentFile={null}
          onFileChange={(file) => updateSetting("coverImage", file)}
          recommendedSize="1200x400px, JPG or PNG"
        />

        <FileUploadArea
          id="favicon"
          label="Favicon"
          accept=".ico,.png"
          maxSize={1}
          currentFile={null}
          onFileChange={(file) => updateSetting("favicon", file)}
          recommendedSize="32x32px, ICO or PNG"
        />
      </SettingsCard>

      <SettingsCard
        title="Typography"
        description="Customize your community's fonts"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="headingFont"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Heading font
            </label>
            <select
              id="headingFont"
              value={settings.headingFont}
              onChange={(e) => updateSetting("headingFont", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="bodyFont"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Body font
            </label>
            <select
              id="bodyFont"
              value={settings.bodyFont}
              onChange={(e) => updateSetting("bodyFont", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Custom CSS (Advanced)">
        <div className="space-y-4">
          <div
            className="flex items-start gap-2 p-4 rounded-lg"
            style={{
              background: "rgba(245, 158, 11, 0.1)",
            }}
          >
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--warning)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              <p className="font-semibold mb-1">Advanced users only</p>
              <p>Custom CSS can override your theme. Use with caution.</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="enableCustomCss"
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Enable custom CSS
              </label>
            </div>
            <ToggleSwitch
              id="enableCustomCss"
              enabled={settings.enableCustomCss}
              onChange={(value) => updateSetting("enableCustomCss", value)}
            />
          </div>

          {settings.enableCustomCss && (
            <div>
              <label
                htmlFor="customCss"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                CSS code
              </label>
              <textarea
                id="customCss"
                value={settings.customCss}
                onChange={(e) => updateSetting("customCss", e.target.value)}
                rows={12}
                placeholder="/* Enter your custom CSS here */"
                className="w-full px-4 py-3 rounded-lg border resize-none font-mono text-sm"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          )}
        </div>
      </SettingsCard>
    </div>
  );
}
