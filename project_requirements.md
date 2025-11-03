# Product Requirements Document (PRD)
Product codename: Community OS
Version: 2.0
Last updated: November 03, 2025
Audience: Coaches, B2B learning communities, client portals, and cohort-based programmes.

**Target MVP Launch**: January 2026 (8-12 week sprint)

## 1) Problem Statement

Existing platforms either feel too rigid or too complex. Teams want Skool-level simplicity, Circle-style structure, and Heartbeat breadth, without losing work to glitches, getting stuck with one layout, or being boxed into a single payment gateway. They also want AI to reduce moderation and admin workload, and dark mode plus better branding for comfort and identity.

## 2) MVP Goals

Ship an AI-first community platform that is simple by default and structured on demand:

- Default to single-feed layout with optional multi-space organization
- AI assistant accessible via floating badge, persistent across all views
- Provide reliable creation workflows with autosave and version history
- Offer both threaded forums and real-time chat
- Deliver dark mode and neurodivergent-friendly UX from day one
- Support Stripe + PayPal monetization

## 3) MVP Scope (January 2026)

### Core Features (Must-Have):

**Community Structure**:
- Single-feed and multi-space layouts
- Role-based permissions (Owner, Admin, Moderator, Member, Guest)
- Left sidebar + top navigation
- Dark mode with system detection

**Forums & Discussions**:
- Rich text posts with media, polls, video embeds
- Autosave every 5 seconds
- Version history (30 versions, 30-day retention)
- Threaded comments (3 levels deep)
- Post filtering (New, Active, Top, Solved, Trending)
- Search (<500ms p95)

**Real-Time Chat**:
- Channels + DMs
- Typing indicators + read receipts
- Chat ↔ Forum integration

**Course Builder**:
- Sections + lessons (video, text, quiz, assignment)
- Quiz builder with auto-grading
- Auto-generated certificates
- Progress tracking

**Events**:
- Calendar with RSVP
- Native live sessions (Mux/Cloudflare Stream)
- Auto-recording + replay

**Monetization**:
- Stripe + PayPal
- Free tier, subscription, one-off, trial
- Content gating by tier
- Coupon codes

**AI Features**:
- Moderation assist (spam/toxicity flagging)
- @Assistant FAQ bot
- Thread summaries

**Gamification**:
- Points system
- Levels + badges
- Leaderboards

**Payment Gateways**: Stripe + PayPal only (MVP)

## 4) Post-MVP Features (Deferred)

- Additional payment gateways (Razorpay, Mercado Pago, Paddle)
- Advanced email marketing
- White-label mobile apps
- Enterprise SSO (SAML)
- SOC 2 compliance
- Voice messages in chat
- Breakout rooms in live sessions

## 5) Success Metrics

- Day 7 Activation Rate: 60%
- Weekly Active Members: 40%
- Post-to-Reply Ratio: 3.5 comments/post
- Uptime: 99.9%
- Draft Loss Incidents: 0/month

## 6) Tech Stack

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL (Railway)
- **Auth**: Clerk.com
- **Payments**: Stripe + PayPal
- **Live Sessions**: Mux or Cloudflare Stream
- **Deployment**: Railway
- **Architecture**: Hexagonal (Domain → Application → Infrastructure → Presentation)

**Source**: Full PRD available at `Project Requirements/full_project_requirements.md`
