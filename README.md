# Personal Developer Portfolio

## Overview
A modern, responsive, and interactive personal developer portfolio built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Supabase**. It serves as a digital resume and showcases technical projects, professional experience, skills, certifications, real-time GitHub activity, and a direct Supabase-integrated contact form.

The portfolio features a secure **Admin Dashboard** for managing all content, multi-language support, dynamic theme toggle, and smooth animations powered by Framer Motion.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (Vercel)                │
│   • App Router (React 19 + Turbopack)                       │
│   • Multi-language Support & Framer Motion Animations        │
│   • Server Actions & API Routes for secure data mutations   │
│   • Admin Dashboard with Session-based Auth                 │
│   • Resume/CV upload & download management                  │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       Direct Queries                    Server Actions & API
 (Public reads via anon key)        (Admin mutations & Contact)
               │                               │
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend (Cloud)                 │
│   • PostgreSQL Database with Row Level Security (RLS)       │
│   • contact_messages, projects, experiences, skills, etc.   │
│   • Storage bucket for resume/CV files                      │
│   • Database migrations in Backend/supabase/migrations/     │
└─────────────────────────────────────────────────────────────┘
```

**Cost:** $0/month (Vercel Free Tier + Supabase Free Tier)

---

## 📁 Repository Structure

```text
MyPortfolio/
├── portfolio/                    # Next.js 16 frontend application
│   ├── public/                   # Static assets (images, icons)
│   ├── src/
│   │   ├── app/                  # App Router (pages, layout, globals.css)
│   │   │   ├── page.tsx          # Home page (portfolio showcase)
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── contact/          # Contact page + Server Action
│   │   │   ├── experience/       # Experience & resume route
│   │   │   ├── admin/            # Admin Dashboard (auth-protected)
│   │   │   │   ├── page.tsx      # Main admin panel
│   │   │   │   ├── layout.tsx    # Admin layout (auth guard)
│   │   │   │   ├── login/        # Admin login page
│   │   │   │   └── components/   # Admin-specific UI components
│   │   │   ├── api/              # Next.js API routes
│   │   │   │   ├── admin/        # Admin CRUD API ([resource] + resume)
│   │   │   │   └── github/       # GitHub activity proxy
│   │   │   └── components/       # Shared public-facing components
│   │   ├── lib/                  # Utilities & integrations
│   │   │   ├── supabase.ts       # Supabase client (public anon)
│   │   │   ├── portfolioData.ts  # Data-fetching helpers
│   │   │   └── admin/            # Admin-only utilities
│   │   │       ├── actions.ts    # Server Actions for admin mutations
│   │   │       ├── auth.ts       # Session-based auth helpers
│   │   │       └── types.ts      # Admin TypeScript types
│   │   ├── constants/            # Static data & translations
│   │   └── types/                # Shared TypeScript definitions
│   ├── docs/                     # Frontend documentation
│   ├── .env.local.example        # Frontend environment template
│   ├── next.config.ts            # Next.js configuration
│   └── package.json              # Frontend dependencies & scripts
│
├── Backend/                      # Supabase configuration & migrations
│   ├── supabase/
│   │   ├── config.toml           # Supabase CLI project configuration
│   │   └── migrations/           # SQL schema migrations (applied in order)
│   ├── tests/                    # Manual test & verification scripts
│   │   ├── test-db-connection.js # Tests Supabase & PostgreSQL connections
│   │   ├── test-api-endpoints.js # Smoke-tests backend API endpoints
│   │   ├── verify-tables.js      # Verifies all DB tables exist
│   │   └── README.md             # How to run the test scripts
│   ├── docs/                     # Extended backend documentation
│   └── README.md                 # Supabase CLI & database guide
│
├── AGENTS.md                     # AI Agent rules and coding guidelines
└── README.md                     # Root documentation (this file)
```

---

## 🚀 Quick Start & Commands Reference

### 1. Supabase Backend Setup & Migrations

The database migrations and configuration are in `Backend/supabase/`.

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase account
supabase login

# Navigate to Backend folder and link your cloud project
cd Backend
supabase link --project-ref <your-project-ref>

# Push all migrations to remote Supabase database
supabase db push
```

#### Local Supabase Testing (Requires Docker)
```bash
# Start local Supabase instance (database, studio, auth, storage)
cd Backend
supabase start

# Apply/reset migrations to local database
supabase db reset

# View local Supabase Studio
# Open http://localhost:54323 in your browser

# Stop local Supabase instance
supabase stop
```

---

### 2. Frontend Development

```bash
# Navigate to frontend directory
cd portfolio

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Fill in your NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# and SUPABASE_SERVICE_ROLE_KEY in .env.local

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

#### Production Build
```bash
cd portfolio
npm run build
npm run start
```

---

## 🔐 Environment Variables

Create `portfolio/.env.local` using the provided template:

```env
# ── Supabase (Required) ──────────────────────────────────────────────────────
# Get from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# ── Admin Dashboard (Required for admin panel) ───────────────────────────────
# Service role key — NEVER use NEXT_PUBLIC_ prefix for this!
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ── GitHub API (Optional) ────────────────────────────────────────────────────
# Increases GitHub API rate limit from 60 → 5000 requests/hour
GITHUB_TOKEN=your-github-token-here
```

See [`portfolio/.env.local.example`](./portfolio/.env.local.example) for the full template with comments.

---

## 🛠️ Main Features

- **Admin Dashboard**: Secure, session-authenticated admin panel to manage all portfolio content — toggle visibility, edit items, reorder entries (`display_order`), and upload/delete the resume/CV file.
- **Resume Management**: Dedicated resume section with drag-and-drop PDF upload to Supabase Storage, with a public download CTA on the portfolio.
- **Project Filtering**: Dynamic tech/framework filter bar on the projects section — auto-generated from project data, with animated transitions.
- **GitHub API Resilience**: Optimized API polling with concurrent request limits, `Authorization` headers, and static fallbacks to prevent rate-limit errors.
- **Direct Supabase Integration**: Contact submissions sent through Next.js Server Actions with Row Level Security.
- **Multi-language Support**: Fully translated content (English, Urdu, Hindi, Arabic, French, German) with LTR and RTL support.
- **Dynamic Theming**: Seamless dark/light mode integration.
- **Real-time GitHub Activity**: Live feed of recent GitHub commits, pull requests, and repository events.
- **Animated UI**: Smooth scroll animations, staggered entry animations, and micro-interactions powered by Framer Motion.
- **Fully Responsive**: Mobile-first design with optimized layouts for mobile, tablet, and desktop — including the admin panel.

---

## 📄 License

MIT License — See LICENSE file for details.
