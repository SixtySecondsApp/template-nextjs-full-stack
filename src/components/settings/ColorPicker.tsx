"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Teal", value: "#14b8a6" },
];

export function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customColor, setCustomColor] = useState(selectedColor);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {PRESET_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => {
              onChange(color.value);
              setShowCustomPicker(false);
            }}
            className="relative h-12 rounded-lg transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: color.value,
              focusVisibleRingColor: color.value,
            }}
            aria-label={`Select ${color.name}`}
          >
            {selectedColor === color.value && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </span>
            )}
            <span className="sr-only">{color.name}</span>
          </button>
        ))}
      </div>

      <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          type="button"
          onClick={() => setShowCustomPicker(!showCustomPicker)}
          className="text-sm font-medium hover:underline"
          style={{ color: "var(--primary-color)" }}
        >
          {showCustomPicker ? "Hide custom color" : "Choose custom color"}
        </button>

        {showCustomPicker && (
          <div className="mt-3 flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="h-10 w-20 rounded cursor-pointer border"
              style={{ borderColor: "var(--border)" }}
              aria-label="Custom color picker"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const value = e.target.value;
                setCustomColor(value);
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                  onChange(value);
                }
              }}
              placeholder="#000000"
              className="flex-1 px-3 py-2 text-sm rounded-lg border font-mono"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
              aria-label="Custom color hex code"
            />
          </div>
        )}
      </div>
    </div>
  );
}
