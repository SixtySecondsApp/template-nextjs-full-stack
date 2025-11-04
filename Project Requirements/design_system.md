# Community OS Design System

**Version 1.0** | Last Updated: November 2025

---

## Table of Contents

1. [Introduction](#introduction)
2. [Design Principles](#design-principles)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Components](#components)
7. [Iconography](#iconography)
8. [Elevation & Shadows](#elevation--shadows)
9. [Animation & Motion](#animation--motion)
10. [Accessibility](#accessibility)
11. [Usage Guidelines](#usage-guidelines)

---

## Introduction

The Community OS Design System is a comprehensive guide for creating consistent, accessible, and beautiful user interfaces across the platform. This system ensures a cohesive experience whether users are on desktop, tablet, or mobile devices, and in light or dark mode.

### Design Philosophy

Community OS embraces a modern, clean aesthetic that prioritizes:
- **Clarity** - Clear visual hierarchy and intuitive interactions
- **Consistency** - Unified patterns across all touchpoints
- **Accessibility** - WCAG 2.1 AA compliance minimum
- **Delight** - Thoughtful animations and micro-interactions
- **Adaptability** - Seamless transitions between light and dark modes

---

## Design Principles

### 1. User-Centric Design
Every design decision should serve the user's needs first. Prioritize usability over aesthetics when conflicts arise.

### 2. Progressive Disclosure
Present information gradually. Don't overwhelm users with too many options at once.

### 3. Consistent Patterns
Use established patterns throughout the application. When users learn something once, they should be able to apply it everywhere.

### 4. Contextual Awareness
The interface should adapt to the user's context, whether that's their device, time of day, or current task.

### 5. Feedback & Responsiveness
Every user action should receive immediate visual feedback. The interface should feel alive and responsive.

---

## Color System

### Primary Colors

#### Light Mode

**Primary (Indigo)**
- `primary-50`: `#eef2ff` - Hover backgrounds
- `primary-100`: `#e0e7ff` - Light backgrounds
- `primary-200`: `#c7d2fe` - Disabled states
- `primary-300`: `#a5b4fc` - Borders
- `primary-400`: `#818cf8` - Hover states
- `primary-500`: `#6366f1` - **Main brand color**
- `primary-600`: `#4f46e5` - Active/pressed states
- `primary-700`: `#4338ca` - Dark accents
- `primary-800`: `#3730a3` - Text on light backgrounds
- `primary-900`: `#312e81` - Darkest accents

**Secondary (Purple)**
- `secondary-500`: `#8b5cf6` - Gradients, accents
- `secondary-600`: `#7c3aed` - Gradient endpoints

#### Dark Mode

Primary colors remain the same but usage contexts shift:
- Use lighter shades (400-500) for main interactive elements
- Use darker shades (600-700) for hover/active states
- Adjust opacity for better contrast against dark backgrounds

### Neutral Colors

#### Light Mode

**Grays**
- `gray-50`: `#f9fafb` - Subtle backgrounds
- `gray-100`: `#f3f4f6` - Surface backgrounds
- `gray-200`: `#e5e7eb` - Borders, dividers
- `gray-300`: `#d1d5db` - Disabled backgrounds
- `gray-400`: `#9ca3af` - Placeholder text
- `gray-500`: `#6b7280` - Secondary text
- `gray-600`: `#4b5563` - Body text
- `gray-700`: `#374151` - Headings
- `gray-800`: `#1f2937` - Strong headings
- `gray-900`: `#111827` - **Primary text**

**Pure Tones**
- `white`: `#ffffff` - Pure white
- `black`: `#000000` - Pure black (use sparingly)

#### Dark Mode

**Slate Palette**
- `slate-50`: `#f8fafc` - Lightest (rare use)
- `slate-100`: `#f1f5f9` - Very light text
- `slate-200`: `#e2e8f0` - Light text
- `slate-300`: `#cbd5e1` - Secondary text
- `slate-400`: `#94a3b8` - Tertiary text
- `slate-500`: `#64748b` - Muted text
- `slate-600`: `#475569` - Borders
- `slate-700`: `#334155` - Elevated surfaces
- `slate-800`: `#1e293b` - Surface backgrounds
- `slate-900`: `#0f172a` - **Main background**

### Semantic Colors

These colors communicate meaning and should be used consistently:

**Success (Green)**
- Light: `#10b981` (green-500)
- Dark: `#059669` (green-600)
- Usage: Success messages, confirmations, positive metrics

**Warning (Amber)**
- Light: `#f59e0b` (amber-500)
- Dark: `#d97706` (amber-600)
- Usage: Warnings, important notices, moderate alerts

**Error (Red)**
- Light: `#ef4444` (red-500)
- Dark: `#dc2626` (red-600)
- Usage: Errors, destructive actions, critical alerts

**Info (Blue)**
- Light: `#3b82f6` (blue-500)
- Dark: `#2563eb` (blue-600)
- Usage: Informational messages, tips, neutral notifications

### Color Usage Rules

1. **Text Contrast**
   - Light mode: Minimum 4.5:1 for body text, 3:1 for large text
   - Dark mode: Minimum 4.5:1 for body text, 3:1 for large text

2. **Background Hierarchy**
   - Light mode: `white` → `gray-50` → `gray-100` → `gray-200`
   - Dark mode: `slate-900` → `slate-800` → `slate-700` → `slate-600`

3. **Interactive Elements**
   - Always use primary colors for primary actions
   - Use neutral colors for secondary actions
   - Destructive actions should use error colors

4. **Gradients**
   - Primary gradient: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`
   - Hero gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
   - Use gradients sparingly for brand moments and hero sections

---

## Typography

### Font Family

**Primary Font Stack**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Helvetica Neue', Arial, sans-serif;
This system font stack ensures optimal rendering across all platforms while maintaining brand consistency.

Monospace Font Stack (for code)

css

font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 
             Consolas, 'Courier New', monospace;
Type Scale
Based on a 1.250 (Major Third) modular scale with 16px base:

Name	Size	Line Height	Weight	Usage
Display	48px (3rem)	1.1 (52.8px)	700	Hero headlines
Heading 1	36px (2.25rem)	1.2 (43.2px)	700	Page titles
Heading 2	28px (1.75rem)	1.3 (36.4px)	700	Section headers
Heading 3	20px (1.25rem)	1.4 (28px)	600	Subsection headers
Heading 4	18px (1.125rem)	1.4 (25.2px)	600	Card titles
Body Large	16px (1rem)	1.6 (25.6px)	400	Primary body text
Body	15px (0.9375rem)	1.6 (24px)	400	Standard body text
Body Small	14px (0.875rem)	1.5 (21px)	400	Secondary text
Caption	13px (0.8125rem)	1.5 (19.5px)	400	Metadata, labels
Overline	11px (0.6875rem)	1.5 (16.5px)	600	All-caps labels
Font Weights
Regular (400): Body text, descriptions
Medium (500): Emphasized text, navigation items
Semi-Bold (600): Subheadings, button text, strong emphasis
Bold (700): Headings, primary emphasis
Text Colors
Light Mode
Primary Text: gray-900 (#111827)
Secondary Text: gray-600 (#6b7280)
Tertiary Text: gray-500 (#9ca3af)
Placeholder: gray-400 (#9ca3af)
Disabled: gray-300 (#d1d5db)
Dark Mode
Primary Text: slate-100 (#f1f5f9)
Secondary Text: slate-300 (#cbd5e1)
Tertiary Text: slate-400 (#94a3b8)
Placeholder: slate-500 (#64748b)
Disabled: slate-600 (#475569)
Typography Guidelines
Hierarchy: Establish clear visual hierarchy using size, weight, and color
Line Length: Limit to 60-75 characters per line for optimal readability
Alignment: Left-align text in LTR languages; avoid justified text
Letter Spacing: Use default spacing; only adjust for all-caps labels (+0.5px)
Text Decoration: Use sparingly; prefer color/weight for emphasis
Spacing & Layout
Spacing Scale
Based on an 8px grid system for consistency and mathematical harmony:

Token	Value	Usage
space-0	0px	Reset spacing
space-1	4px	Tiny gaps, tight grouping
space-2	8px	Base unit - Small gaps
space-3	12px	Compact spacing
space-4	16px	Standard spacing
space-5	20px	Medium spacing
space-6	24px	Comfortable spacing
space-8	32px	Large spacing
space-10	40px	Extra large spacing
space-12	48px	Section spacing
space-16	64px	Major section spacing
space-20	80px	Hero section spacing
space-24	96px	Maximum spacing
Layout Grid
Desktop (1440px+)

12-column grid
Column width: Flexible
Gutter: 24px
Margin: 64px
Tablet (768px - 1439px)

8-column grid
Column width: Flexible
Gutter: 20px
Margin: 40px
Mobile (< 768px)

4-column grid
Column width: Flexible
Gutter: 16px
Margin: 20px
Container Widths
Max Container: 1440px
Content Container: 1200px
Reading Width: 800px (for long-form content)
Form Width: 600px (for forms and focused tasks)
Breakpoints
css

/* Mobile First Approach */
$breakpoint-sm: 640px;   /* Small devices */
$breakpoint-md: 768px;   /* Tablets */
$breakpoint-lg: 1024px;  /* Laptops */
$breakpoint-xl: 1280px;  /* Desktops */
$breakpoint-2xl: 1536px; /* Large screens */
Spacing Guidelines
Consistency: Use spacing tokens exclusively; avoid arbitrary values
Rhythm: Maintain consistent vertical rhythm using the 8px grid
Grouping: Related elements should have less space; unrelated more space
Breathing Room: Don't be afraid of whitespace; it improves readability
Touch Targets: Minimum 44x44px for interactive elements (mobile)
Components
Buttons
Primary Button
Light Mode

Background: primary-500 (#6366f1)
Text: white
Hover: primary-600 (#4f46e5)
Active: primary-700 (#4338ca)
Disabled: gray-300 background, gray-500 text
Dark Mode

Background: primary-500 (#6366f1)
Text: white
Hover: primary-400 (#818cf8)
Active: primary-600 (#4f46e5)
Disabled: slate-700 background, slate-500 text
Sizes

Small: Height 32px, Padding 8px 16px, Font 13px
Medium: Height 40px, Padding 10px 20px, Font 14px (default)
Large: Height 48px, Padding 12px 24px, Font 16px
Properties

Border radius: 8px
Font weight: 600
Transition: all 0.2s ease
Hover lift: translateY(-1px)
Shadow on hover: 0 4px 12px rgba(99, 102, 241, 0.25)
Secondary Button
Light Mode

Background: transparent
Border: 1px solid gray-300
Text: gray-700
Hover: gray-100 background
Active: gray-200 background
Dark Mode

Background: transparent
Border: 1px solid slate-600
Text: slate-200
Hover: slate-800 background
Active: slate-700 background
Ghost Button
Light Mode

Background: transparent
Text: gray-600
Hover: gray-100 background
Active: gray-200 background
Dark Mode

Background: transparent
Text: slate-400
Hover: slate-800 background
Active: slate-700 background
Icon Button
Size: 36x36px (touch-friendly 44x44px on mobile)
Border radius: 8px
Icon size: 20px
Same color treatments as ghost buttons
Form Inputs
Text Input
Light Mode

Background: white
Border: 1px solid gray-300
Text: gray-900
Placeholder: gray-400
Focus: Border primary-500, shadow 0 0 0 3px primary-100
Dark Mode

Background: slate-800
Border: 1px solid slate-600
Text: slate-100
Placeholder: slate-500
Focus: Border primary-500, shadow 0 0 0 3px primary-900
Properties

Height: 40px
Padding: 10px 16px
Border radius: 8px
Font size: 15px
Transition: border 0.2s, box-shadow 0.2s
States

Error: Border red-500, focus shadow red-100 (light) / red-900 (dark)
Success: Border green-500, focus shadow green-100 (light) / green-900 (dark)
Disabled: Background gray-100 (light) / slate-700 (dark), cursor not-allowed
Textarea
Same as text input but:

Min height: 80px
Resize: vertical
Padding: 12px 16px
Select Dropdown
Same styling as text input with:

Chevron icon on right
Dropdown panel: Shadow shadow-lg, border border-color
Checkbox & Radio
Size: 20x20px
Border: 2px solid gray-300 (light) / slate-600 (dark)
Checked: Background primary-500, border primary-500
Checkmark: White, 14px
Border radius: 4px (checkbox), 50% (radio)
Focus: Ring 3px primary-100 (light) / primary-900 (dark)
Cards
Standard Card
Light Mode

Background: white
Border: 1px solid gray-200
Shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
Hover shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
Dark Mode

Background: slate-800
Border: 1px solid slate-700
Shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3)
Hover shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5)
Properties

Border radius: 12px
Padding: 24px
Transition: all 0.2s ease
Hover: translateY(-2px)
Elevated Card
Same as standard card but:

Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
Hover shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
Interactive Card
Same as standard card but:

Cursor: pointer
Active state: translateY(0), reduced shadow
Focus ring: 3px primary-100 (light) / primary-900 (dark)
Navigation
Sidebar Navigation
Light Mode

Background: gray-50
Active item: primary-500 background, white text
Hover item: gray-100 background
Item text: gray-600
Dark Mode

Background: slate-800
Active item: primary-500 background, white text
Hover item: slate-700 background
Item text: slate-300
Properties

Item padding: 10px 12px
Item border radius: 8px
Icon size: 20px
Gap between icon and text: 12px
Section title: All caps, 11px, gray-400 (light) / slate-500 (dark)
Top Navigation Tabs
Light Mode

Active: primary-500 text, 2px bottom border primary-500
Hover: gray-900 text
Default: gray-600 text
Dark Mode

Active: primary-400 text, 2px bottom border primary-400
Hover: slate-100 text
Default: slate-300 text
Properties

Padding: 12px 16px
Font weight: 500
Transition: all 0.2s ease
Badges & Tags
Badge (Pill)
Light Mode

Background: primary-100
Text: primary-700
Border radius: 12px (fully rounded)
Dark Mode

Background: primary-900
Text: primary-300
Sizes

Small: Padding 2px 8px, Font 11px
Medium: Padding 4px 12px, Font 12px
Variants

Success: green-100/green-700 (light), green-900/green-300 (dark)
Warning: amber-100/amber-700 (light), amber-900/amber-300 (dark)
Error: red-100/red-700 (light), red-900/red-300 (dark)
Tag (Rectangular)
Light Mode

Background: gray-100
Text: gray-700
Border radius: 6px
Dark Mode

Background: slate-700
Text: slate-200
Properties

Padding: 4px 10px
Font size: 12px
Font weight: 500
Avatars
Sizes
XS: 24x24px
Small: 32x32px
Medium: 44px (default)
Large: 64x64px
XL: 96x96px
Properties

Border radius: 50% (circular)
Placeholder background: Linear gradient primary-500 to secondary-500
Placeholder text: White, bold, sized appropriately
Border: 2px solid white (light) / slate-800 (dark) when overlapping
Status Indicator

Size: 25% of avatar size
Position: Bottom right
Border: 2px solid background color
Online: green-500
Busy: red-500
Away: amber-500
Offline: gray-400 (light) / slate-600 (dark)
Modals & Dialogs
Light Mode

Overlay: rgba(0, 0, 0, 0.5)
Background: white
Border: None
Shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
Dark Mode

Overlay: rgba(0, 0, 0, 0.75)
Background: slate-800
Border: 1px solid slate-700
Shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5)
Properties

Border radius: 16px
Max width: 600px (standard), 900px (large), 400px (small)
Padding: 32px
Header font: Heading 3
Close button: Top right, ghost button style
Animation

Fade in: 0.2s ease
Scale: from 0.95 to 1
Backdrop blur: 4px
Tooltips
Light Mode

Background: gray-900
Text: white
Arrow: Matching background
Dark Mode

Background: slate-100
Text: slate-900
Arrow: Matching background
Properties

Padding: 6px 12px
Border radius: 6px
Font size: 13px
Max width: 250px
Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2)
Delay: 0.5s before showing
Animation: Fade in 0.15s
Notifications & Toasts
Light Mode

Background: white
Border left: 4px solid (variant color)
Shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
Dark Mode

Background: slate-700
Border left: 4px solid (variant color)
Shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5)
Variants

Success: Border green-500, icon green-500
Warning: Border amber-500, icon amber-500
Error: Border red-500, icon red-500
Info: Border blue-500, icon blue-500
Properties

Border radius: 12px
Padding: 16px
Max width: 400px
Position: Top right, 24px from edges
Auto-dismiss: 5s
Animation: Slide in from right, fade out
Loading States
Spinner
Light Mode

Color: primary-500
Background: gray-200 (partial circle)
Dark Mode

Color: primary-400
Background: slate-600 (partial circle)
Sizes

Small: 16px
Medium: 24px
Large: 40px
Animation

Rotation: 360deg, 0.8s linear infinite
Skeleton Loader
Light Mode

Background: gray-200
Shimmer: Linear gradient with gray-300
Dark Mode

Background: slate-700
Shimmer: Linear gradient with slate-600
Properties

Border radius: Matches component being loaded
Animation: 1.5s ease-in-out infinite
Progress Bar
Light Mode

Track: gray-200
Fill: primary-500
Dark Mode

Track: slate-700
Fill: primary-400
Properties

Height: 8px
Border radius: 4px (fully rounded)
Transition: width 0.3s ease
Dividers
Light Mode

Color: gray-200
Dark Mode

Color: slate-700
Types

Horizontal: 1px height, full width
Vertical: 1px width, full height
Section: 2px height with text (OR divider)
Iconography
Icon Library
Primary: Lucide React (https://lucide.dev)

Consistent stroke width
Open source
Tree-shakeable
Over 1000+ icons
Icon Sizes
Context	Size	Usage
Tiny	12px	Inline with small text
Small	16px	Buttons, inputs, inline
Medium	20px	Navigation, cards, default
Large	24px	Headers, prominent actions
XL	32px	Feature highlights
2XL	48px	Empty states, hero sections
Icon Usage Guidelines
Stroke Width: Use 2px for consistency
Color Inheritance: Icons should inherit text color
Alignment: Vertically center with adjacent text
Spacing: 8px gap between icon and text (medium icons)
Touch Targets: Wrap in 44x44px container for mobile
Common Icons
Navigation: Home, Users, Settings, Menu, X
Actions: Plus, Edit, Trash, Check, ChevronDown
Communication: MessageCircle, Send, Bell, Mail
Media: Image, Video, File, Download, Upload
Status: AlertCircle, CheckCircle, XCircle, Info
Social: Heart, Share, Bookmark, Star
Elevation & Shadows
Shadow Scale
Shadows create depth and hierarchy. Use consistently to indicate interactivity and importance.

Light Mode Shadows

css

--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
Dark Mode Shadows

css

--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
Usage Context
shadow-xs: Subtle hover states
shadow-sm: Cards, default elevation
shadow-md: Dropdowns, popovers
shadow-lg: Modals, important dialogs
shadow-xl: Bottom sheets, full-screen overlays
shadow-2xl: High-impact hero elements
Inner Shadows
Use for inset effects (inputs, pressed buttons):

css

--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
Animation & Motion
Timing Functions
css

--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
Duration Scale
Instant: 0ms - No animation
Fast: 100ms - Micro-interactions (hover states)
Base: 200ms - Standard transitions
Moderate: 300ms - Panel slides, fades
Slow: 500ms - Page transitions, complex animations
Slower: 700ms - Dramatic reveals
Common Animations
Fade In
css

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
/* Duration: 200ms, Easing: ease-out */
Slide In (from right)
css

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
/* Duration: 300ms, Easing: ease-out */
Scale In
css

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
/* Duration: 200ms, Easing: ease-out */
Pulse (for loading/attention)
css

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
/* Duration: 2000ms, Easing: ease-in-out, Iteration: infinite */
Shimmer (for skeletons)
css

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
/* Duration: 1500ms, Easing: ease-in-out, Iteration: infinite */
Motion Principles
Purposeful: Every animation should serve a function
Performant: Use transform and opacity for best performance
Subtle: Animations should enhance, not distract
Consistent: Use the same timing for similar interactions
Accessible: Respect prefers-reduced-motion settings
css

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
Hover Effects
Cards & Interactive Elements

Transform: translateY(-2px)
Shadow: Increase by one level
Transition: 200ms ease-out
Buttons

Transform: translateY(-1px)
Shadow: Add colored shadow
Brightness: 110%
Transition: 200ms ease-out
Icons

Transform: scale(1.1)
Transition: 150ms ease-out
Focus States
Keyboard Focus (not mouse)

Ring: 3px solid color with 2px offset
Color: primary-500 with 50% opacity
Border radius: Inherit from element + 2px
Transition: box-shadow 150ms ease-out
Accessibility
WCAG 2.1 Compliance
Community OS aims for WCAG 2.1 Level AA compliance minimum, with AAA targets where feasible.

Color Contrast
Minimum Requirements

Normal text (< 18px): 4.5:1
Large text (≥ 18px or ≥ 14px bold): 3:1
UI components and graphics: 3:1
Testing Tools

WebAIM Contrast Checker
Chrome DevTools Accessibility Panel
Axe DevTools
Focus Management
Visible Focus: All interactive elements must have visible focus indicators
Logical Order: Tab order should follow visual/logical flow
Skip Links: Provide "Skip to main content" for keyboard users
Focus Trapping: Modals and dialogs should trap focus while open
Return Focus: When closing modals, return focus to trigger element
Screen Reader Support
Semantic HTML

Use proper heading hierarchy (h1 → h2 → h3)
Use semantic elements (<nav>, <main>, <article>, etc.)
Use <button> for actions, <a> for navigation
ARIA Labels

Add aria-label for icon-only buttons
Use aria-describedby for additional context
Use aria-live for dynamic content updates
Mark decorative images with alt=""
Common Patterns

html

<!-- Icon button -->
<button aria-label="Close modal">
  <XIcon />
</button>

<!-- Loading state -->
<div role="status" aria-live="polite" aria-label="Loading content">
  <Spinner />
</div>

<!-- Navigation -->
<nav aria-label="Main navigation">
  <!-- nav items -->
</nav>
Keyboard Navigation
Essential Shortcuts

Tab: Move to next focusable element
Shift + Tab: Move to previous focusable element
Enter: Activate buttons/links
Space: Activate buttons, toggle checkboxes
Escape: Close modals/dropdowns
Arrow keys: Navigate within components (tabs, menus)
Custom Components

Dropdowns: Arrow up/down to navigate, Enter to select
Modals: Escape to close, Tab to cycle through elements
Tabs: Arrow left/right to switch tabs
Motion & Animations
Reduced Motion
Always respect user preferences:

css

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
Touch Targets
Minimum Size: 44x44px for all interactive elements on mobile

Buttons should have adequate padding
Add invisible padding to small icons
Ensure adequate spacing between touch targets (8px minimum)
Forms
Accessibility Requirements

All inputs must have associated labels
Use aria-describedby for help text
Use aria-invalid and aria-errormessage for errors
Group related inputs with <fieldset> and <legend>
Provide clear, specific error messages
html

<div>
  <label for="email">Email Address</label>
  <input 
    id="email" 
    type="email" 
    aria-describedby="email-help"
    aria-invalid="true"
    aria-errormessage="email-error"
  />
  <small id="email-help">We'll never share your email</small>
  <span id="email-error" role="alert">Please enter a valid email</span>
</div>
Usage Guidelines
Dark Mode Best Practices
Not Just Inverted Colors: Dark mode requires thoughtful color adjustments
Reduce Eye Strain: Use true grays, avoid pure black (#000000)
Maintain Contrast: Ensure all text meets WCAG standards
Test Thoroughly: Colors that work in light may fail in dark
Respect Preferences: Honor system preferences by default
Responsive Design
Mobile First

Design for mobile screens first
Progressively enhance for larger screens
Test on actual devices, not just browser tools
Breakpoint Strategy

Don't design for specific devices
Design for content natural breakpoints
Use relative units (rem, em) over pixels where possible
Touch Considerations

Minimum 44x44px touch targets
Adequate spacing between interactive elements
Consider thumb zones on mobile devices
Test with actual fingers, not mouse cursors
Performance Guidelines
Critical CSS

Inline critical CSS for above-the-fold content
Load additional styles asynchronously
Image Optimization

Use modern formats (WebP, AVIF)
Provide appropriate sizes with srcset
Lazy load below-the-fold images
Animation Performance

Use transform and opacity for animations
Avoid animating layout properties (width, height, margin)
Use will-change sparingly and remove when done
Component Composition
Atomic Design Principles

Atoms: Basic building blocks (buttons, inputs, labels)
Molecules: Simple combinations (form fields, search box)
Organisms: Complex components (navigation, cards with multiple elements)
Templates: Page layouts
Pages: Specific instances with real content
Design Tokens
All design values should be defined as tokens for consistency:

css

:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-text-primary: #111827;
  
  /* Spacing */
  --space-base: 8px;
  --space-4: 16px;
  
  /* Typography */
  --font-size-base: 15px;
  --font-weight-medium: 500;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  
  /* Borders */
  --border-radius-base: 8px;
  --border-width: 1px;
  
  /* Transitions */
  --transition-base: 200ms ease-out;
}
Documentation Requirements
When creating new components:

Visual Examples: Show all states (default, hover, active, disabled)
Code Samples: Provide copy-paste ready code
Usage Guidelines: When to use (and not use) the component
Accessibility Notes: Required ARIA attributes, keyboard behavior
Responsive Behavior: How component adapts to different screens
Version History
v1.0 (November 2025) - Initial design system release
Complete color system with light/dark modes
Typography scale and guidelines
Comprehensive component library
Accessibility standards
Animation principles
Contributing
This design system is a living document. As Community OS evolves, so will these guidelines.

Proposing Changes

Identify the gap or improvement
Research best practices
Create visual mockups
Test with users
Document thoroughly
Submit for review
Questions or Feedback?
Contact the design team or open a discussion in the Community OS design channel.

