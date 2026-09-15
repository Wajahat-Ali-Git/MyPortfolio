# Personal Developer Portfolio

## Overview
A modern, responsive, and interactive personal developer portfolio built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Supabase**. It serves as a digital resume and showcases technical projects, professional experience, skills, certifications, real-time GitHub activity, and a direct Supabase-integrated contact form.

The portfolio features a multi-language support system, dynamic theme toggle, and smooth animations powered by Framer Motion.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (Vercel)                │
│   • App Router (React 19 + Turbopack)                       │
│   • Multi-language Support & Framer Motion Animations        │
│   • Server Actions & API Routes for secure data mutations   │
│   • Admin Dashboard with Session-based Auth                 │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       Direct Queries                    Server Actions & API
 (Public reads via anon key)        (Admin mutations & Contact)
               │                               │
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend (Cloud)                 │
│   • PostgreSQL Database with Row Level Security (RLS)       │
│   • `contact_messages` table with anon-insert policies      │
│   • Database migrations in `Backend/supabase/migrations/`   │
└─────────────────────────────────────────────────────────────┘
```

**Cost:** $0/month (Vercel Free Tier + Supabase Free Tier)

---

## 📁 Repository Structure

```text
MyPortfolio/
├── portfolio/              # Next.js 16 frontend application
│   ├── public/             # Static assets (images, icons)
│   ├── src/
│   │   ├── app/            # App Router (pages, layout, globals.css)
│   │   │   ├── contact/    # Contact page + Server Action
│   │   │   ├── experience/ # Experience & resume route
│   │   │   └── components/ # Reusable React components
│   │   ├── constants/      # Data layer (projects, experience, translations)
│   │   ├── lib/            # Utilities (Supabase client)
│   │   └── types/          # TypeScript definitions
│   ├── .env.local.example  # Frontend environment template
│   ├── next.config.ts      # Next.js configuration
│   └── package.json        # Frontend dependencies & scripts
│
├── Backend/                # Supabase configuration & migrations
│   ├── supabase/
│   │   ├── config.toml     # Supabase project configuration
│   │   └── migrations/     # SQL schema migrations
│   └── README.md           # Supabase CLI & database guide
│
├── AGENTS.md               # AI Agent rules and coding guidelines
└── README.md               # Root documentation (this file)
```

---

## 🚀 Quick Start & Commands Reference

### 1. Supabase Backend Setup & Migrations

The database migrations and configuration are located in `Backend/supabase/`.

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase account
supabase login

# Navigate to Backend folder and link your cloud project
cd Backend
supabase link --project-ref <your-project-ref>

# Push migrations to remote Supabase database
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
# Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or http://localhost:3001) in your browser.

#### Production Build
```bash
cd portfolio
npm run build
npm run start
```

---

## 🔐 Environment Variables

Create `portfolio/.env.local` using the template below:

```env
# Supabase Configuration (Required for contact form)
# Get from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# GitHub Personal Access Token (Optional - increases GitHub API rate limit)
GITHUB_TOKEN=your-github-token-here
```

---

## 🛠️ Main Features

- **Admin Dashboard**: Secure, session-authenticated admin panel to toggle content visibility, edit content, and manually reorder items (`display_order`). Uses targeted partial updates to respect strict database constraints.
- **GitHub API Resilience**: Optimized API polling with concurrent request limits, `Authorization` headers, and static fallbacks to prevent rate-limit errors.
- **Direct Supabase Integration**: Contact submissions sent directly through secure Next.js Server Actions with Row Level Security.
- **Multi-language Support**: Fully translated content (English, Urdu, Hindi, Arabic, French, German) with LTR and RTL support.
- **Dynamic Theming**: Seamless dark/light mode integration.
- **Real-time GitHub Activity**: Live feed of recent GitHub commits, pull requests, and repository events.
- **Animated UI**: Smooth scroll animations, staggering elements, and micro-interactions powered by Framer Motion.
- **Content-Driven**: Easy to update projects, experience, and skills via a centralized constants file.
- **Responsive Design**: Mobile-first architecture using Tailwind CSS.

---

## 📄 License

MIT License - See LICENSE file for details.
