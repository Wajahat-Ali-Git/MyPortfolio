# Frontend Documentation Index

Complete documentation for the Portfolio Frontend (Next.js 16 + Supabase).

---

## 📚 Documentation Structure

### Core Documentation

1. **[README.md](./README.md)** 📘 Main Reference
   - Architecture & project structure
   - Main features overview
   - Prerequisites & setup
   - Environment variables
   - Admin Dashboard guide
   - API routes reference
   - GitHub API integration
   - Adding/modifying content
   - Testing & build
   - Deployment guide
   - Troubleshooting

2. **[AGENTS.md](./AGENTS.md)** 🤖 Development Guidelines
   - Security rules (environment variables, secrets)
   - Next.js 16 specifics (App Router, server vs. client)
   - Component guidelines & TypeScript patterns
   - Styling guidelines (Tailwind CSS v4)
   - State management patterns
   - Form handling examples
   - Performance tips
   - Accessibility standards
   - Server Actions pattern
   - Pre-commit checklist

---

## 🎯 Quick Navigation

### I want to...

#### Get Started
- **Run the frontend** → [README.md](./README.md#prerequisites--setup)
- **Configure environment** → [README.md](./README.md#environment-variables)
- **Understand project structure** → [README.md](./README.md#architecture--structure)

#### Manage Content
- **Use the Admin Dashboard** → [README.md](./README.md#admin-dashboard)
- **Add a project/experience/skill** → [README.md](./README.md#addingmodifying-content)
- **Upload a resume/CV** → [README.md](./README.md#admin-dashboard)

#### Learn About
- **Next.js 16 App Router** → [AGENTS.md](./AGENTS.md#-nextjs-16-specifics)
- **Component patterns** → [AGENTS.md](./AGENTS.md#-component-guidelines)
- **TypeScript usage** → [AGENTS.md](./AGENTS.md#typescript)
- **Styling with Tailwind** → [AGENTS.md](./AGENTS.md#-styling-guidelines)
- **Server Actions (admin)** → [AGENTS.md](./AGENTS.md#server-actions-pattern)
- **API routes** → [README.md](./README.md#api-routes)

#### Development
- **Coding standards** → [AGENTS.md](./AGENTS.md#-component-guidelines)
- **Form handling** → [AGENTS.md](./AGENTS.md#-form-handling)
- **State management** → [AGENTS.md](./AGENTS.md#-state-management)
- **Performance tips** → [AGENTS.md](./AGENTS.md#-performance)

#### Security & Best Practices
- **Environment variables** → [AGENTS.md](./AGENTS.md#-security-rules)
- **API integration** → [README.md](./README.md#api-routes)
- **Error handling** → [AGENTS.md](./AGENTS.md#-common-mistakes-to-avoid)
- **Accessibility** → [AGENTS.md](./AGENTS.md#-accessibility)

---

## 📖 Reading Order

### For New Developers
1. Start with [README.md](./README.md) — Overview, setup & environment vars
2. Read [AGENTS.md](./AGENTS.md) — Coding standards & patterns
3. Open the admin panel at `/admin` to understand content management

### For Contributing
1. Review [AGENTS.md](./AGENTS.md) — Coding standards & pre-commit checklist
2. Check [README.md](./README.md) — Project structure & architecture
3. Follow Conventional Commits for commit messages

---

## 🔍 Quick Reference

### File Locations

```
portfolio/
├── docs/                               # You are here
│   ├── INDEX.md                        # This file
│   ├── README.md                       # Full frontend docs
│   └── AGENTS.md                       # Dev guidelines
│
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── contact/                    # Contact page
│   │   ├── experience/                 # Experience page
│   │   ├── admin/                      # Admin Dashboard
│   │   │   ├── page.tsx                # Admin main panel
│   │   │   ├── login/                  # Admin login
│   │   │   └── components/             # Admin UI components
│   │   ├── api/admin/                  # Admin CRUD API routes
│   │   ├── api/github/                 # GitHub proxy API route
│   │   └── components/                 # Shared public components
│   │
│   ├── lib/
│   │   ├── supabase.ts                 # Supabase client
│   │   ├── portfolioData.ts            # Public data helpers
│   │   └── admin/                      # Admin server-side utils
│   │       ├── actions.ts              # Server Actions
│   │       ├── auth.ts                 # Auth helpers
│   │       └── types.ts                # Admin types
│   │
│   ├── constants/                      # Translations & static data
│   └── types/                          # Shared TypeScript types
│
├── public/                             # Static assets
├── .env.local.example                  # Env template
└── next.config.ts                      # Next.js config
```

### Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev             # http://localhost:3001

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Environment Setup

```bash
# Copy template
cp .env.local.example .env.local

# Required variables:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...     (admin only — never NEXT_PUBLIC_!)
# GITHUB_TOKEN=...                   (optional)

# Start dev server
npm run dev
```

---

## 🎨 Key Concepts

### Next.js 16 App Router
- File-based routing under `src/app/`
- Server components by default
- `'use client'` for interactive components
- `'use server'` for Server Actions (admin mutations)

### Supabase Integration
- **Public pages** use the anon client (`lib/supabase.ts`) — safe to expose
- **Admin mutations** use the service role client inside Server Actions — server-only
- **RLS policies** enforce access rules at the database level

### Component Structure
```typescript
'use client';  // Only if using hooks/events

import { useState } from 'react';

interface Props {
  // TypeScript props
}

export default function Component({ }: Props) {
  // Component logic
  return (/* JSX */);
}
```

### Environment Variables
```env
# Public (browser-safe)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Private (server only — NEVER add NEXT_PUBLIC_ prefix!)
SUPABASE_SERVICE_ROLE_KEY=...
GITHUB_TOKEN=...
```

---

## 🆘 Getting Help

1. **Check documentation:**
   - [README.md](./README.md) for features, setup & API
   - [AGENTS.md](./AGENTS.md) for coding guidelines

2. **Common issues:**
   - Build errors → Check TypeScript errors (`npm run build`)
   - Style issues → Review Tailwind class names
   - Admin 401/403 → Check `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
   - GitHub repos not loading → Add `GITHUB_TOKEN` to `.env.local`
   - Routing issues → Review App Router file structure

3. **Development tips:**
   - Use TypeScript strict mode
   - Follow component patterns in AGENTS.md
   - Always test on mobile (320px), tablet (768px), and desktop (1280px)
   - Check accessibility with keyboard navigation

---

## 📝 Documentation Updates

When updating documentation:
- Keep this index current with accurate section links
- Update `README.md` when adding new features, pages, or API routes
- Update `AGENTS.md` when adding new patterns or coding standards
- Update the "Last Updated" date below

---

**Last Updated:** 2026-09-22
**Maintainer:** Wajahat Ali (@Wajahat-Ali-Git)
