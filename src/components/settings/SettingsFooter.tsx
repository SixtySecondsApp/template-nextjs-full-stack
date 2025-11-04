"use client";

interface SettingsFooterProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onSkip: () => void;
  saveLabel?: string;
  skipLabel?: string;
}

export function SettingsFooter({
  hasUnsavedChanges,
  isSaving,
  onSave,
  onSkip,
  saveLabel = "Save Changes",
  skipLabel = "Skip for Now",
}: SettingsFooterProps) {
  return (
    <div
      className="sticky bottom-0 border-t p-6 -mx-6 -mb-6 mt-8"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border)",
        boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div>
          {hasUnsavedChanges && (
            <p className="text-sm font-medium" style={{ color: "var(--warning)" }}>
              You have unsaved changes
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-2.5 rounded-lg font-medium border transition-colors"
            style={{
              background: "transparent",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          >
            {skipLabel}
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "var(--primary-color)",
              color: "white",
            }}
          >
            {isSaving ? "Saving..." : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
