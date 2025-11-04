# Community Setup/Configuration Components

Comprehensive settings page components for the Sixty Community dashboard.

## Overview

This directory contains all components needed for the Community Setup/Configuration page, including:

- **Base Components**: Reusable UI elements (toggles, color pickers, file uploads)
- **Tab Components**: Individual settings category pages
- **Layout Components**: Navigation and footer

## Components

### Base Components

#### `ToggleSwitch`
Animated on/off toggle switch with accessibility support.

```tsx
<ToggleSwitch
  id="settingName"
  enabled={value}
  onChange={(enabled) => handleChange(enabled)}
  disabled={false}
/>
```

#### `ColorPicker`
Color selection with 8 preset colors and custom hex input.

```tsx
<ColorPicker
  selectedColor="#6366f1"
  onChange={(color) => handleColorChange(color)}
/>
```

#### `FileUploadArea`
Drag-and-drop file upload with preview and validation.

```tsx
<FileUploadArea
  id="logo"
  label="Upload Logo"
  accept=".png,.svg,.jpg"
  maxSize={2}
  currentFile={null}
  onFileChange={(file) => handleFileChange(file)}
  recommendedSize="200x200px, PNG or SVG"
/>
```

#### `SettingsCard`
Container for grouped settings.

```tsx
<SettingsCard
  title="Card Title"
  description="Optional description"
>
  {children}
</SettingsCard>
```

#### `SettingRow`
Individual setting row with label, description, and control.

```tsx
<SettingRow
  label="Setting Name"
  description="Setting description"
  icon={<Icon className="w-5 h-5" />}
>
  <ToggleSwitch {...props} />
</SettingRow>
```

### Layout Components

#### `SettingsTabNav`
Responsive tab navigation (horizontal on desktop, accordion on mobile).

```tsx
<SettingsTabNav
  tabs={TABS}
  activeTab="general"
  onTabChange={(tabId) => setActiveTab(tabId)}
/>
```

#### `SettingsFooter`
Sticky footer with save/skip buttons and unsaved changes indicator.

```tsx
<SettingsFooter
  hasUnsavedChanges={true}
  isSaving={false}
  onSave={handleSave}
  onSkip={handleSkip}
  saveLabel="Save Changes"
  skipLabel="Skip for Now"
/>
```

### Tab Components

#### `GeneralSettingsTab`
Member settings, content settings, and community guidelines.

#### `FeaturesTab`
Community features, monetization, and gamification toggles.

#### `BrandingTab`
Primary color, logo/images, typography, and custom CSS.

#### `NotificationsTab`
Email notifications, push notifications, and admin alerts.

#### `PrivacySecurityTab`
Privacy settings, security, and data export options.

## Usage

### Basic Implementation

```tsx
"use client";

import { useState } from "react";
import { Settings, Users, Palette, Bell, Shield } from "lucide-react";
import {
  SettingsTabNav,
  SettingsFooter,
  GeneralSettingsTab,
  FeaturesTab,
  BrandingTab,
  NotificationsTab,
  PrivacySecurityTab,
  type TabItem,
} from "@/components/settings";
import { DEFAULT_COMMUNITY_SETTINGS } from "@/types/settings";

const TABS: TabItem[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "features", label: "Features", icon: Users },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
];

export default function SetupPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(DEFAULT_COMMUNITY_SETTINGS);

  return (
    <div>
      <SettingsTabNav
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "general" && (
        <GeneralSettingsTab
          settings={settings.general}
          onChange={(general) => setSettings({ ...settings, general })}
        />
      )}

      {/* Other tabs... */}

      <SettingsFooter
        hasUnsavedChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSave}
        onSkip={handleSkip}
      />
    </div>
  );
}
```

## Features

### ✅ Responsive Design
- Horizontal tabs on desktop (≥768px)
- Vertical accordion on mobile (<768px)
- Touch-friendly controls
- Adaptive layouts

### ✅ Accessibility
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- Semantic HTML

### ✅ Form Handling
- TypeScript strict types
- Unsaved changes tracking
- Form validation
- Error handling
- Loading states

### ✅ File Upload
- Drag-and-drop support
- File type validation
- Size limit validation
- Image preview
- Error messages

### ✅ User Experience
- Auto-save indicators
- Toast notifications
- Smooth animations
- Clear visual feedback
- Intuitive controls

## TypeScript Types

All settings types are defined in `/src/types/settings.ts`:

```typescript
import type {
  GeneralSettings,
  FeatureSettings,
  BrandingSettings,
  NotificationSettings,
  PrivacySecuritySettings,
  CommunitySettings,
} from "@/types/settings";
```

## Styling

Components use CSS variables from `/src/app/globals.css`:

- `--primary-color`: Primary brand color
- `--surface-elevated`: Card backgrounds
- `--border`: Border colors
- `--text-primary`: Primary text
- `--text-secondary`: Secondary text
- `--text-tertiary`: Tertiary text
- `--shadow-sm/md/lg`: Box shadows

## Integration

### API Integration (TODO)

Replace the placeholder save function with actual API calls:

```typescript
const handleSave = async () => {
  setIsSaving(true);

  try {
    const response = await fetch("/api/community/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (!response.ok) throw new Error("Failed to save");

    setInitialSettings(settings);
    showSuccessToast("Settings saved successfully!");
  } catch (error) {
    showErrorToast("Failed to save settings");
  } finally {
    setIsSaving(false);
  }
};
```

### Database Schema (TODO)

Add settings columns to your Community model or create a separate CommunitySettings table.

### File Upload (TODO)

Implement file upload to S3 or your storage solution:

```typescript
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const { url } = await response.json();
  return url;
};
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Latest

## Performance

- Code splitting: Each tab component is lazy-loadable
- Optimized re-renders: Uses React.memo where appropriate
- Efficient state updates: Minimal re-renders on changes
- File validation: Client-side before upload

## Testing

### Unit Tests (TODO)

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { ToggleSwitch } from "./ToggleSwitch";

test("toggles state on click", () => {
  const handleChange = jest.fn();
  render(<ToggleSwitch id="test" enabled={false} onChange={handleChange} />);

  const toggle = screen.getByRole("switch");
  fireEvent.click(toggle);

  expect(handleChange).toHaveBeenCalledWith(true);
});
```

### E2E Tests (TODO)

```typescript
import { test, expect } from "@playwright/test";

test("saves settings successfully", async ({ page }) => {
  await page.goto("/community/setup");

  await page.click('[id="allowMemberInvitations"]');
  await page.click("button:has-text('Save Changes')");

  await expect(page.locator("text=Settings saved")).toBeVisible();
});
```

## License

Part of the Sixty Community project.
