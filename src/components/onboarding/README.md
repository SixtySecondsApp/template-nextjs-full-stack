# Onboarding Components

Welcome/Getting Started components for the Sixty Community platform.

## Components

### ProgressOverviewCard

Displays a circular progress indicator with completion percentage.

**Props:**
- `completedTasks`: number - Number of completed tasks
- `totalTasks`: number - Total number of tasks

**Features:**
- Animated circular progress bar with SVG
- Dynamic progress messages based on completion percentage
- Responsive design (stacks on mobile)
- Purple gradient background matching design system

### TaskCard

Individual task card with status indicators and action buttons.

**Props:**
- `icon`: LucideIcon - Icon component from lucide-react
- `title`: string - Task title
- `description`: string - Task description
- `status`: 'completed' | 'active' | 'incomplete' - Current task status
- `estimatedTime`: string (optional) - Estimated completion time
- `actionLabel`: string (optional) - Button label
- `onAction`: () => void (optional) - Click handler for action button

**Features:**
- Three visual states (completed, active, incomplete)
- Smooth hover animations
- Color-coded status badges
- Completion checkmark animation
- Estimated time display

### TaskChecklist

Container component that manages all 8 onboarding tasks.

**Props:**
- `initialCompletedTasks`: string[] (optional) - Array of completed task IDs
- `onProgressChange`: (completed: number, total: number) => void (optional) - Progress callback

**Features:**
- 8 pre-defined tasks with auto-detection logic
- LocalStorage persistence for progress
- Automatic progress tracking
- Task navigation to relevant pages
- First 2 tasks (create community, configure settings) always completed

**Tasks:**
1. ✅ Create community (completed)
2. ✅ Configure settings (completed)
3. Create first post
4. Invite members
5. Customize branding
6. Schedule event
7. Add resources
8. Set up member roles

### ResourceCard

Clickable card for helpful resources and documentation.

**Props:**
- `icon`: LucideIcon - Icon component from lucide-react
- `title`: string - Resource title
- `description`: string - Resource description
- `href`: string (optional) - External link
- `onClick`: () => void (optional) - Click handler

**Features:**
- Hover animations (lift effect)
- Support for both links and click handlers
- Icon with primary color accent
- Responsive grid layout

## Usage

### Basic Example

```tsx
import {
  ProgressOverviewCard,
  TaskChecklist,
  ResourceCard,
} from '@/components/onboarding';
import { BookOpen } from 'lucide-react';

function GettingStarted() {
  const [completed, setCompleted] = useState(2);

  return (
    <div>
      <ProgressOverviewCard completedTasks={completed} totalTasks={8} />

      <TaskChecklist
        onProgressChange={(completed, total) => setCompleted(completed)}
      />

      <ResourceCard
        icon={BookOpen}
        title="Quick Start Guide"
        description="Learn the basics"
        href="/help/guide"
      />
    </div>
  );
}
```

## Design System

### Colors
- **Success Green**: `#10b981` - Completed tasks
- **Primary Indigo**: `var(--primary-color)` - Active tasks, buttons
- **Gray**: `var(--text-tertiary)` - Inactive states

### Animations
- **Progress Bar**: 0.6s ease-in-out for circular progress
- **Task Completion**: 0.3s color transition + checkmark fade-in
- **Hover Effects**: 0.2s transforms and shadows
- **Card Lift**: translateY(-2px to -4px) on hover

### Typography
- **Task Titles**: 18px, semibold
- **Descriptions**: 14px, regular, secondary color
- **Status Badges**: 11px, uppercase, bold
- **Hero Title**: 48px/36px (desktop/mobile), bold

### Responsive Breakpoints
- **Mobile**: < 768px - Single column, stacked layout
- **Desktop**: ≥ 768px - Two column grid for resources

## Accessibility

All components follow WCAG 2.1 AA standards:

- ✅ Semantic HTML elements
- ✅ ARIA labels where appropriate
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Color contrast ratios
- ✅ Screen reader friendly
- ✅ Reduced motion support (via CSS)

## State Management

### LocalStorage Keys
- `onboarding-progress`: JSON array of completed task IDs

### Auto-Detection Logic

Tasks are automatically marked complete when:
- Post created → Task 3 complete
- 5+ members invited → Task 4 complete
- Logo uploaded → Task 5 complete
- Event created → Task 6 complete
- Resource added → Task 7 complete
- Roles configured → Task 8 complete

(Note: Auto-detection requires backend integration)

## Performance

- ✅ Memoized components for re-render optimization
- ✅ CSS transitions instead of JavaScript animations
- ✅ Lazy loading for icon components
- ✅ Optimized SVG rendering for progress circle
- ✅ LocalStorage caching for progress state

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Confetti animation on task completion
- [ ] Backend API integration for progress persistence
- [ ] Email notifications on milestone completion
- [ ] Gamification elements (badges, points)
- [ ] Tutorial tooltips/walkthroughs
- [ ] Progress export/sharing
