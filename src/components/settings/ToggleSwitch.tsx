"use client";

interface ToggleSwitchProps {
  id: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export function ToggleSwitch({
  id,
  enabled,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        background: enabled
          ? "var(--primary-color)"
          : "var(--border)",
        focusVisibleRingColor: "var(--primary-color)",
      }}
    >
      <span className="sr-only">Toggle setting</span>
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        style={{
          transform: enabled ? "translateX(1.75rem)" : "translateX(0.25rem)",
        }}
      />
    </button>
  );
}
