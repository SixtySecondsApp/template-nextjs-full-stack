# Product Development Roadmap: Community OS

## 5-Stage Version Breakdown

### 🚀 MVP (Version 1.0)

- **Timeline:** Months 1-4  
- **Launch Target:** March 2026  
- **Theme:** _"Reliable Foundations & Core Community"_

---

## Core Philosophy

> Ship the essential community platform with bulletproof reliability. Focus on forums, basic courses, and single-payment monetization. Prove we can beat competitors on stability and ease of use.

---

## Features Included

### Community Structure & Navigation

- ✅ **Single-feed layout only** (multi-space in V2)
- ✅ Left sidebar: Home, Members, Courses
- ✅ Top nav: Community tab only (Chat, Calendar, Leaderboard in V2+)
- ✅ Basic role system: _Owner, Admin, Member, Guest_
- ✅ Space/category tagging for organization
- ✅ Online member counter

### Forums & Discussions

- ✅ Post composer with rich text editor
- ✅ **Autosave every 5 seconds** _(competitive differentiator)_
- ✅ Version history (last 10 versions, 7-day retention)
- ✅ Post types: _Text, Question, Poll_
- ✅ Image uploads _(up to 5 per post, 10MB each)_
- ✅ File attachments _(PDFs, docs, up to 25MB)_
- ✅ Threaded comments _(2 levels deep)_
- ✅ Filtering: _All, New, Top_ (no Trending algorithm yet)
- ✅ Search: posts and members only _(basic keyword match)_
- ✅ @mentions with notifications
- ✅ #hashtags _(manual tagging)_
- ✅ Like and comment counts
- ✅ "Mark as Solved" for questions

### Basic Courses

- ✅ Course builder: sections + lessons
- ✅ Lesson types: _Text, Video (embed only: YouTube/Vimeo), PDF_
- ✅ Progress tracking: checkmarks on completion
- ✅ Drip content: unlock lessons by date
- ✅ Lesson comments _(no timestamps yet)_
- ✅ Simple certificates: auto-generated on course completion _(basic template, no customization)_

### Member Profiles

- ✅ Avatar upload
- ✅ Bio _(500 chars)_
- ✅ Member since date
- ✅ Post/comment count
- ✅ Basic profile page with recent activity

### Monetization (Simple)

- ✅ **Stripe only** _(PayPal in V2)_
- ✅ Two tiers max: _Free + Single Paid tier_
- ✅ Subscription: _monthly or annual_
- ✅ 7-day free trial
- ✅ Content gating: _Free vs. Paid_
- ✅ Basic coupon codes _(percentage or fixed discount, expiry date)_
- ✅ Auto-entitlement on payment

### Theming & Branding

- ✅ Dark mode _(system detection + manual toggle)_
- ✅ Custom colors: _primary color only (auto-generate variants)_
- ✅ Logo upload
- ✅ Community name
- ✅ Basic font size controls _(S, M, L)_

### Notifications

- ✅ Email notifications: mentions, replies, new posts in followed threads
- ✅ In-app notification bell with count
- ✅ Notification settings: toggle by type

### Reliability

- ✅ Autosave indicator _("Draft saved ✓")_
- ✅ Version history _(10 versions, 7 days)_
- ✅ Daily backups _(7-day retention)_
- ✅ Undelete _(7-day soft delete)_

### Analytics (Admin)

- ✅ Member count _(total, active this week)_
- ✅ Post count _(total, this week)_
- ✅ Top 10 contributors _(by post count)_
- ✅ Revenue: _MRR, total revenue_
- ✅ Trial-to-paid conversion rate

### Support

- ✅ Email support only
- ✅ Help center _(25 basic articles)_
- ✅ In-app tooltips (_?_ icons)

---

## Features Explicitly NOT Included (Coming in V2+)

- ❌ Real-time chat
- ❌ Live events/streaming
- ❌ Multi-space layout
- ❌ Calendar
- ❌ Gamification _(points, badges, leaderboards)_
- ❌ AI features _(moderation, summaries, assistant)_
- ❌ Advanced course features _(quizzes, interactive elements)_
- ❌ Multiple payment gateways
- ❌ Custom domain
- ❌ Advanced analytics
- ❌ Native video upload
- ❌ Mobile apps

---

## Success Metrics (MVP)

### Activation

- 50% of new communities publish first post within 24 hours
- 30% reach _"Day 7 activation"_ (5 members, 3 posts)

### Engagement

- 25% Weekly Active Members (WAM)
- 2.5 comments per post average
- <5% draft loss incidents _(target: 0%)_

### Reliability

- 99.5% uptime during beta
- <2s p95 page load time
- Zero data loss incidents

### Monetization

- 100 paying communities within 3 months of launch
- 15% trial-to-paid conversion
- <8% monthly churn

### Support

- 48hr average first response time
- 4.0+ CSAT score _(out of 5)_

---

## Pricing (MVP)

### Free Plan

- 100 members max
- 3 courses max
- Community branding _(no custom domain)_
- Email support _(72hr response)_

### Starter Plan: $39/month

- 500 members
- Unlimited courses
- Custom colors + logo
- Email support _(48hr response)_
- Stripe payments enabled

---

## Team for MVP

| Role                | Count         |
|---------------------|--------------|
| Product Manager     | 1            |
| Frontend Engineers  | 2            |
| Backend Engineers   | 2            |
| Designer            | 1            |
| QA Engineer         | 1 _(part-time)_ |
| Customer Success    | 1            |
| Support             | 1            |
| **Total**           | **9 people** |

---

## Launch Plan (MVP)

### Month 1-2: Core Development

- Forums, posts, comments, autosave
- User auth, profiles, roles
- Basic course builder
- Stripe integration

### Month 3: Beta _(50 Communities)_

- Private beta with design partners
- Focus: stability, autosave reliability, payment flows
- Weekly feedback calls

### Month 4: Public Launch

- **Launch date:** March 15, 2026
- Product Hunt launch
- Waitlist email _(target: 1,000 signups)_
- Blog post + social media campaign

### Post-Launch _(Months 5-6)_

- Bug fixes and stability
- Support ticket triage
- Gather feedback for V2 roadmap