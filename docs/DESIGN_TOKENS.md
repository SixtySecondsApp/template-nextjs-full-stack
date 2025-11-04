# Design Tokens Reference

**Sixty Community Design System** - Based on Community Example design language

This document provides a complete reference for all design tokens used in the Sixty Community application. Use these tokens via Tailwind utilities or CSS variables.

---

## Color System

### Primary Colors (Indigo)

Our primary brand color is Indigo (#6366f1), used for primary actions, links, and brand elements.

| Token | Hex Value | Tailwind Class | CSS Variable | Usage |
|-------|-----------|----------------|--------------|-------|
| primary-50 | `#eef2ff` | `bg-primary-50` | `--color-primary-50` | Lightest background |
| primary-100 | `#e0e7ff` | `bg-primary-100` | `--color-primary-100` | Light background |
| primary-200 | `#c7d2fe` | `bg-primary-200` | `--color-primary-200` | Hover states (light) |
| primary-300 | `#a5b4fc` | `bg-primary-300` | `--color-primary-300` | Borders (light) |
| primary-400 | `#818cf8` | `bg-primary-400` | `--color-primary-400` | Hover (dark mode) |
| **primary-500** | **`#6366f1`** | **`bg-primary`** | **`--color-primary-500`** | **Main brand color** |
| primary-600 | `#4f46e5` | `bg-primary-600` | `--color-primary-600` | Hover (light mode) |
| primary-700 | `#4338ca` | `bg-primary-700` | `--color-primary-700` | Active state |
| primary-800 | `#3730a3` | `bg-primary-800` | `--color-primary-800` | Dark background |
| primary-900 | `#312e81` | `bg-primary-900` | `--color-primary-900` | Darkest background |

**Examples:**
```tsx
// Tailwind usage
<button className="bg-primary hover:bg-primary-600 text-white">
  Primary Button
</button>

// CSS variable usage
.custom-element {
  background: var(--color-primary-500);
  border-color: var(--color-primary-600);
}
```

---

### Secondary Colors (Purple)

Used for secondary actions, accents, and gradients.

| Token | Hex Value | Tailwind Class | CSS Variable |
|-------|-----------|----------------|--------------|
| secondary-500 | `#8b5cf6` | `bg-secondary` | `--color-secondary-500` |
| secondary-600 | `#7c3aed` | `bg-secondary-600` | `--color-secondary-600` |

---

### Semantic Colors

#### Success (Green)
| Token | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| success-light | `#10b981` | `--color-success-light` | Light mode |
| success-dark | `#059669` | `--color-success-dark` | Dark mode |

**Tailwind:** `text-success`, `bg-success`, `border-success`

#### Warning (Amber)
| Token | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| warning-light | `#f59e0b` | `--color-warning-light` | Light mode |
| warning-dark | `#d97706` | `--color-warning-dark` | Dark mode |

**Tailwind:** `text-warning`, `bg-warning`, `border-warning`

#### Error (Red)
| Token | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| error-light | `#ef4444` | `--color-error-light` | Light mode |
| error-dark | `#dc2626` | `--color-error-dark` | Dark mode |

**Tailwind:** `text-error`, `bg-error`, `border-error`, `text-danger` (alias)

#### Info (Blue)
| Token | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| info-light | `#3b82f6` | `--color-info-light` | Light mode |
| info-dark | `#2563eb` | `--color-info-dark` | Dark mode |

**Tailwind:** `text-info`, `bg-info`, `border-info`

---

### Theme-Aware Colors

These colors automatically adapt based on light/dark mode via CSS variables.

#### Backgrounds
| Name | Light Mode | Dark Mode | Tailwind Class | CSS Variable |
|------|-----------|-----------|----------------|--------------|
| Background | `#ffffff` | `#0f172a` (slate-900) | `bg-background` | `--background` |
| Surface 1 | `#f9fafb` (gray-50) | `#1e293b` (slate-800) | `bg-surface` | `--surface-1` |
| Surface 2 | `#f3f4f6` (gray-100) | `#334155` (slate-700) | `bg-surface-2` | `--surface-2` |
| Surface 3 | `#e5e7eb` (gray-200) | `#475569` (slate-600) | `bg-surface-3` | `--surface-3` |

#### Text Colors
| Name | Light Mode | Dark Mode | Tailwind Class | CSS Variable |
|------|-----------|-----------|----------------|--------------|
| Primary | `#111827` (gray-900) | `#f1f5f9` (slate-100) | `text-text-primary` | `--text-primary` |
| Secondary | `#4b5563` (gray-600) | `#cbd5e1` (slate-300) | `text-text-secondary` | `--text-secondary` |
| Tertiary | `#6b7280` (gray-500) | `#94a3b8` (slate-400) | `text-text-tertiary` | `--text-tertiary` |
| Placeholder | `#9ca3af` (gray-400) | `#64748b` (slate-500) | `text-text-placeholder` | `--text-placeholder` |
| Disabled | `#d1d5db` (gray-300) | `#475569` (slate-600) | `text-text-disabled` | `--text-disabled` |

#### Borders
| Name | Light Mode | Dark Mode | Tailwind Class | CSS Variable |
|------|-----------|-----------|----------------|--------------|
| Default | `#e5e7eb` (gray-200) | `#334155` (slate-700) | `border-border` | `--border-color` |
| Subtle | `#f3f4f6` (gray-100) | `#1e293b` (slate-800) | `border-border-subtle` | `--border-subtle` |

---

## Typography

### Font Sizes

Based on a 1.250 Major Third scale for harmonious typography.

| Token | Size | Line Height | Weight | Tailwind Class | CSS Variable |
|-------|------|-------------|--------|----------------|--------------|
| Display | 48px | 1.1 | 700 | `text-display` | `--font-size-display` |
| H1 | 36px | 1.2 | 700 | `text-h1` | `--font-size-h1` |
| H2 | 28px | 1.3 | 700 | `text-h2` | `--font-size-h2` |
| H3 | 20px | 1.4 | 600 | `text-h3` | `--font-size-h3` |
| H4 | 18px | 1.4 | 600 | `text-h4` | `--font-size-h4` |
| Body Large | 16px | 1.6 | 400 | `text-body-lg` | `--font-size-body-lg` |
| **Body** | **15px** | **1.6** | **400** | **`text-body`** | **`--font-size-body`** (default) |
| Body Small | 14px | 1.6 | 400 | `text-body-sm` | `--font-size-body-sm` |
| Caption | 13px | 1.5 | 400 | `text-caption` | `--font-size-caption` |
| Overline | 11px | 1.5 | 600 | `text-overline` | `--font-size-overline` |

**Example:**
```tsx
<h1 className="text-h1">Page Heading</h1>
<p className="text-body">Default body text</p>
<span className="text-caption">Small caption text</span>
```

---

## Spacing

8px grid system for consistent spacing throughout the application.

| Token | Value | Tailwind Class | CSS Variable |
|-------|-------|----------------|--------------|
| 1 | 4px | `m-1`, `p-1`, `gap-1` | `--spacing-1` |
| 2 | 8px | `m-2`, `p-2`, `gap-2` | `--spacing-2` |
| 3 | 12px | `m-3`, `p-3`, `gap-3` | `--spacing-3` |
| 4 | 16px | `m-4`, `p-4`, `gap-4` | `--spacing-4` |
| 5 | 20px | `m-5`, `p-5`, `gap-5` | `--spacing-5` |
| 6 | 24px | `m-6`, `p-6`, `gap-6` | `--spacing-6` |
| 8 | 32px | `m-8`, `p-8`, `gap-8` | `--spacing-8` |
| 10 | 40px | `m-10`, `p-10`, `gap-10` | `--spacing-10` |
| 12 | 48px | `m-12`, `p-12`, `gap-12` | `--spacing-12` |
| 16 | 64px | `m-16`, `p-16`, `gap-16` | `--spacing-16` |
| 20 | 80px | `m-20`, `p-20`, `gap-20` | `--spacing-20` |
| 24 | 96px | `m-24`, `p-24`, `gap-24` | `--spacing-24` |

**Examples:**
```tsx
<div className="p-6 gap-4">       {/* 24px padding, 16px gap */}
<div className="mt-8 mb-12">      {/* 32px top, 48px bottom */}
<div className="space-y-6">       {/* 24px vertical spacing */}
```

---

## Border Radius

| Token | Value | Tailwind Class | CSS Variable | Usage |
|-------|-------|----------------|--------------|-------|
| Base | 8px | `rounded-base` | `--radius-base` | Default, cards, buttons |
| Medium | 12px | `rounded-md` | `--radius-md` | Larger cards, modals |
| Large | 16px | `rounded-lg` | `--radius-lg` | Hero sections, prominent elements |

**Examples:**
```tsx
<button className="rounded-base">      {/* 8px radius */}
<div className="rounded-md">           {/* 12px radius */}
<section className="rounded-lg">       {/* 16px radius */}
```

---

## Shadows

6-level shadow system with automatic dark mode adaptation.

| Level | Light Mode | Dark Mode | Tailwind Class | CSS Variable |
|-------|-----------|-----------|----------------|--------------|
| XS | `0 1px 2px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.3)` | `shadow-xs` | `--shadow-xs` |
| SM | `0 1px 3px rgba(0,0,0,0.1)` | `0 1px 3px rgba(0,0,0,0.3)` | `shadow-sm` | `--shadow-sm` |
| **MD** | **`0 4px 6px rgba(0,0,0,0.1)`** | **`0 4px 6px rgba(0,0,0,0.4)`** | **`shadow-md`** | **`--shadow-md`** (default) |
| LG | `0 10px 15px rgba(0,0,0,0.1)` | `0 10px 15px rgba(0,0,0,0.5)` | `shadow-lg` | `--shadow-lg` |
| XL | `0 20px 25px rgba(0,0,0,0.1)` | `0 20px 25px rgba(0,0,0,0.5)` | `shadow-xl` | `--shadow-xl` |
| 2XL | `0 25px 50px rgba(0,0,0,0.25)` | `0 25px 50px rgba(0,0,0,0.6)` | `shadow-2xl` | `--shadow-2xl` |
| Inner | `inset 0 2px 4px rgba(0,0,0,0.06)` | Same | `shadow-inner` | `--shadow-inner` |

**Usage by component:**
- **Cards:** `shadow-sm` (subtle) to `shadow-md` (default)
- **Modals:** `shadow-lg` to `shadow-xl`
- **Floating elements:** `shadow-xl` to `shadow-2xl`
- **Inputs (depressed):** `shadow-inner`

---

## Gradients

### Background Gradients

| Name | Value | Tailwind Class | CSS Variable |
|------|-------|----------------|--------------|
| Primary | `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)` | `bg-gradient-primary` | `--gradient-primary` |
| Hero | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` | `bg-gradient-hero` | `--gradient-hero` |

### Text Gradients

Use the `.text-gradient` utility class for gradient text:

```tsx
<h1 className="text-gradient">Gradient Text</h1>
```

CSS implementation:
```css
.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## Transitions

### Durations

| Name | Value | Tailwind Class | CSS Variable |
|------|-------|----------------|--------------|
| Fast | 100ms | `duration-fast` | `--duration-fast` |
| Base | 200ms | `duration-base` | `--duration-base` |
| Moderate | 300ms | `duration-moderate` | `--duration-moderate` |
| Slow | 500ms | `duration-slow` | `--duration-slow` |

### Timing Functions

| Name | Value | Tailwind Class | CSS Variable |
|------|-------|----------------|--------------|
| Ease In | `cubic-bezier(0.4, 0, 1, 1)` | `ease-in` | `--ease-in` |
| Ease Out | `cubic-bezier(0, 0, 0.2, 1)` | `ease-out` | `--ease-out` |
| Ease In-Out | `cubic-bezier(0.4, 0, 0.2, 1)` | `ease-in-out` | `--ease-in-out` |
| Bounce | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | `ease-bounce` | `--ease-bounce` |

**Example:**
```tsx
<button className="transition-all duration-base ease-out hover:scale-105">
  Smooth Button
</button>
```

---

## Container Widths

Utility classes for consistent content widths:

| Class | Max Width | Usage |
|-------|-----------|-------|
| `.container-max` | 1440px | Full application width |
| `.container-content` | 1200px | Main content area |
| `.container-reading` | 800px | Long-form text content |
| `.container-form` | 600px | Form layouts |

**Example:**
```tsx
<div className="container-content mx-auto px-6">
  {/* Content constrained to 1200px with auto margins */}
</div>
```

---

## Component Styling Patterns

### Buttons

**Primary Button:**
```tsx
<button className="
  bg-primary hover:bg-primary-600 active:bg-primary-700
  text-white font-semibold
  px-6 py-3 rounded-base
  shadow-sm hover:shadow-md
  transition-all duration-base
">
  Primary Action
</button>
```

**Secondary Button:**
```tsx
<button className="
  bg-surface-1 hover:bg-surface-2
  text-text-primary
  px-6 py-3 rounded-base
  border border-border
  transition-all duration-base
">
  Secondary Action
</button>
```

### Cards

**Default Card:**
```tsx
<div className="
  bg-surface-1 border border-border
  rounded-md shadow-sm
  p-6
">
  {/* Card content */}
</div>
```

**Elevated Card (with hover):**
```tsx
<div className="
  bg-surface-1 border border-border
  rounded-md shadow-md hover:shadow-lg
  p-6
  transition-shadow duration-base
">
  {/* Card content */}
</div>
```

### Inputs

**Text Input:**
```tsx
<input className="
  w-full px-4 py-3
  bg-background border border-border
  rounded-base
  text-text-primary placeholder:text-text-placeholder
  focus:border-primary focus:ring-2 focus:ring-primary/20
  transition-all duration-base
" />
```

---

## Theme Switching

The design system supports both `class` and `data-theme` attributes for dark mode:

**Via Class (Tailwind default):**
```tsx
<html className="dark">
```

**Via Data Attribute (recommended):**
```tsx
<html data-theme="dark">
```

**JavaScript Toggle:**
```typescript
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
}
```

---

## Accessibility

### Focus Styles

All interactive elements automatically receive accessible focus styles:

```css
:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--radius-base);
}
```

### Text Selection

Custom selection colors for better brand consistency:

```css
::selection {
  background-color: var(--color-primary-200); /* Light mode */
  color: var(--text-primary);
}

[data-theme="dark"] ::selection {
  background-color: var(--color-primary-800); /* Dark mode */
}
```

### Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Migration Guide

### From Dashboard-v2 to Unified System

| Old Token | New Token | Notes |
|-----------|-----------|-------|
| `--primary-color` | `--color-primary-500` or `bg-primary` | Use Tailwind class |
| `--surface` | `--surface-1` or `bg-surface` | Renamed for clarity |
| `--text-secondary` | `--text-secondary` | Same, now theme-aware |
| `--border` | `--border-color` or `border-border` | Renamed |
| `--shadow-md` | `--shadow-md` or `shadow-md` | Now theme-aware |

---

**Last Updated:** 2025-11-04
**Design System Version:** 1.0.0
**Based on:** Community Example Design Language
