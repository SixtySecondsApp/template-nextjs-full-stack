# Quick Start Guide - Forum System

Get the forum system up and running in minutes.

---

## 🚀 Installation Complete

All dependencies are already installed. You're ready to go!

---

## 📁 File Structure

```
src/
├── components/
│   ├── editor/
│   │   └── RichTextEditor.tsx        # Rich text editor
│   └── forum/
│       ├── PostComposer.tsx          # Post creation form
│       ├── PostCard.tsx              # Post summary card
│       └── Comment.tsx               # Comment with threading
├── app/(protected)/
│   ├── forum/
│   │   ├── page.tsx                  # Forum feed
│   │   └── new/
│   │       └── page.tsx              # New post page
│   └── posts/
│       └── [id]/
│           └── page.tsx              # Post detail page
└── lib/utils/
    └── formatters.ts                 # Utility functions
```

---

## 🎯 Quick Test

### 1. Start Development Server

```bash
npm run dev
```

### 2. Navigate to Forum

Open your browser to:
- **Forum Feed**: `http://localhost:3000/forum`
- **New Post**: `http://localhost:3000/forum/new`
- **Post Detail**: `http://localhost:3000/posts/1`

### 3. Try It Out

**Forum Feed** (`/forum`):
- ✅ See mock posts
- ✅ Use search bar
- ✅ Try filters (All, New, Top, Solved, Trending)
- ✅ Change sort (Recent, Popular, Helpful)
- ✅ Click "New Post" button

**New Post** (`/forum/new`):
- ✅ Type a title
- ✅ Use rich text editor (try bold, lists, etc.)
- ✅ Try markdown shortcuts: `**bold**`, `# heading`, `- list`
- ✅ Watch autosave in action
- ✅ Click "Save Draft" or "Publish Post"

**Post Detail** (`/posts/1`):
- ✅ See full post content
- ✅ View nested comments
- ✅ Click "Reply" on a comment
- ✅ Try editing/deleting (if you're the author)

---

## 🎨 Test Dark Mode

Toggle dark mode using your existing ThemeProvider:

```typescript
// Dark mode automatically supported
// All components use CSS variables
```

---

## 🔧 Customize

### Change Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary-color: #6366f1;  /* Change primary color */
  --success: #10b981;         /* Change success color */
}
```

### Adjust Editor Height

```typescript
<RichTextEditor
  minHeight="400px"  // Change from default 200px
  onChange={setContent}
/>
```

### Change Max Comment Depth

```typescript
<Comment
  comment={comment}
  maxDepth={3}  // Change from default 2
/>
```

---

## 🔗 Connect to Your API

### Step 1: Update Forum Feed

**File**: `src/app/(protected)/forum/page.tsx`

Replace mock data:

```typescript
// Change this:
const [posts, setPosts] = useState(mockPosts);

// To this:
const [posts, setPosts] = useState([]);

useEffect(() => {
  async function fetchPosts() {
    const response = await fetch('/api/posts');
    const data = await response.json();
    setPosts(data.posts);
  }
  fetchPosts();
}, []);
```

### Step 2: Update Post Detail

**File**: `src/app/(protected)/posts/[id]/page.tsx`

Replace mock fetch:

```typescript
async function getPost(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
  if (!response.ok) return null;
  return response.json();
}
```

### Step 3: Connect PostComposer

**File**: `src/app/(protected)/forum/new/page.tsx`

Update handlers:

```typescript
const handlePublish = async (data) => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const post = await response.json();

  await fetch(`/api/posts/${post.id}/publish`, {
    method: 'POST'
  });

  router.push('/forum');
};
```

---

## 🧪 Test with Mock Data

Current mock data includes:
- 5 sample posts
- Various badges (Pinned, Solved)
- Nested comments (up to 2 levels)
- Different metrics (likes, views, etc.)

Perfect for testing without a backend!

---

## ✅ Verify Everything Works

### Checklist

- [ ] Forum feed loads and displays posts
- [ ] Search filters posts correctly
- [ ] Filter tabs work (All, New, Top, etc.)
- [ ] Sort dropdown changes order
- [ ] "New Post" button navigates correctly
- [ ] PostComposer form validates input
- [ ] Rich text editor toolbar works
- [ ] Markdown shortcuts work (`**bold**`)
- [ ] Autosave persists to localStorage
- [ ] Post detail page displays content
- [ ] Comments render with proper nesting
- [ ] Reply forms work
- [ ] Dark mode switches correctly
- [ ] Mobile responsive layouts work

---

## 🐛 Troubleshooting

### Editor Not Loading

**Issue**: "Loading editor..." never disappears

**Fix**: Clear localStorage and refresh:
```javascript
localStorage.clear();
location.reload();
```

### Styles Not Applying

**Issue**: Components look unstyled

**Fix**: Ensure Tailwind is configured correctly:
```bash
npm run dev
```

### Mock Data Not Showing

**Issue**: Forum page is empty

**Fix**: Check console for errors, verify imports:
```typescript
import { PostCard } from '@/components/forum/PostCard';
```

---

## 📚 Learn More

- **Detailed Docs**: See `PHASE_2.6-2.7_IMPLEMENTATION_REPORT.md`
- **Component APIs**: Check individual file comments
- **Tiptap Docs**: https://tiptap.dev/docs

---

## 🎉 You're All Set!

The forum system is ready to use. Start by exploring the mock data, then integrate with your backend API when ready.

**Need help?** Check the comprehensive report in `PHASE_2.6-2.7_IMPLEMENTATION_REPORT.md`
