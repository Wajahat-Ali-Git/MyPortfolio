# Next.js Developer Portfolio — Frontend Documentation

## Overview
This is a modern, responsive, and interactive personal developer portfolio built with **Next.js 16 (App Router)**, **React 19**, and **TypeScript**, backed by **Supabase** (PostgreSQL + Storage). It serves as a digital resume and showcases technical projects, professional experience, skills, certifications, and real-time GitHub activity.

The portfolio includes a built-in **Admin Dashboard** for managing all content without touching code, multi-language support, dark mode, and smooth animations powered by Framer Motion.

## Table of Contents
- [Architecture & Structure](#architecture--structure)
- [Main Features](#main-features)
- [Prerequisites & Setup](#prerequisites--setup)
- [Environment Variables](#environment-variables)
- [Admin Dashboard](#admin-dashboard)
- [API Routes](#api-routes)
- [API Integrations (GitHub)](#api-integrations-github)
- [Adding/Modifying Content](#addingmodifying-content)
- [Development Guidelines](#development-guidelines)
- [Testing & Build](#testing--build)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Architecture & Structure

The project uses the **Next.js 16 App Router** with **Supabase** as the sole backend — there is no separate Express server.

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
│                                                             │
│   Public Pages         Admin Dashboard                      │
│   (Server + Client)    (Client, auth-guarded)               │
│        │                      │                             │
│        ▼                      ▼                             │
│   portfolioData.ts      Server Actions (lib/admin/)         │
│   (anon Supabase)       (service role key, server-only)     │
└──────────────┬────────────────┬────────────────────────────-┘
               │                │
         Public reads     Admin mutations
         (RLS: anon)      (RLS: authenticated)
               │                │
               ▼                ▼
        ┌──────────────────────────────┐
        │     Supabase (PostgreSQL)    │
        │  + Storage (resume files)    │
        └──────────────────────────────┘
```

```text
portfolio/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx                # Home page
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   ├── contact/                # Contact form page & Server Action
│   │   ├── experience/             # Experience & resume page
│   │   ├── admin/                  # Admin Dashboard (auth-protected)
│   │   │   ├── page.tsx            # Main admin panel (all sections)
│   │   │   ├── layout.tsx          # Auth guard layout
│   │   │   ├── AdminAuthContext.tsx # Auth state context
│   │   │   ├── login/              # Login page
│   │   │   └── components/         # Admin-only UI
│   │   │       ├── ItemFormModal.tsx        # Add/edit content modal
│   │   │       └── ResumeManagementPanel.tsx # Resume upload/manage
│   │   ├── api/                    # Next.js API routes
│   │   │   ├── admin/[resource]/   # Generic admin CRUD handler
│   │   │   ├── admin/resume/       # Resume file upload & delete
│   │   │   └── github/             # GitHub activity proxy
│   │   └── components/             # Shared public components
│   │       ├── GitHubActivity.tsx
│   │       ├── GitHubRepos.tsx
│   │       ├── SectionHeading.tsx
│   │       ├── SkillBar.tsx
│   │       └── WorkflowAnimation.tsx
│   │
│   ├── lib/                        # Utilities & integrations
│   │   ├── supabase.ts             # Supabase client (anon key)
│   │   ├── portfolioData.ts        # Data-fetching helpers
│   │   └── admin/                  # Admin-only server-side utils
│   │       ├── actions.ts          # Server Actions for mutations
│   │       ├── auth.ts             # Session auth helpers
│   │       └── types.ts            # Admin TypeScript types
│   │
│   ├── constants/                  # Translations & static data
│   └── types/                      # Shared TypeScript types
│
├── public/                         # Static assets
├── docs/                           # This documentation folder
├── .env.local.example              # Environment variable template
└── next.config.ts                  # Next.js config
```

---

## Main Features

- **Admin Dashboard**: Session-authenticated admin panel to create, edit, reorder (`display_order`), and toggle visibility of all portfolio sections. Content is stored in and fetched from Supabase.
- **Resume Management**: Drag-and-drop PDF upload to Supabase Storage, with the active resume shown as a download CTA on the portfolio.
- **Project Filtering**: Dynamic tech/framework filter pills on the projects section — auto-generated from project data.
- **Multi-language Support**: Fully translated content (English, Urdu, Hindi, Arabic, French, German) with LTR and RTL support.
- **Dynamic Theming**: Seamless dark/light mode toggle.
- **Recent GitHub Activity**: Live feed of GitHub commits, pull requests, and repository events via the GitHub REST API.
- **GitHub Repos Section**: Shows 6 most recently committed-to repos with dual view modes (card grid / compact list), commit info, language colours, and star/fork counts.
- **Animated UI**: Smooth scroll animations, staggered entry animations, and micro-interactions via Framer Motion.
- **Responsive Design**: Mobile-first architecture — optimized layouts for mobile (320px+), tablet, and desktop, including the admin panel.
- **Contact Form**: Submissions saved directly to Supabase via a Next.js Server Action.

---

## Prerequisites & Setup

### Prerequisites
- Node.js v18.17.0 or higher (v20 LTS recommended)
- npm (or yarn / pnpm)
- A Supabase project ([supabase.com](https://supabase.com))

### Local Development Setup

1. **Install dependencies**
   ```bash
   cd portfolio
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and fill in your Supabase credentials (see [Environment Variables](#environment-variables)).

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   - Portfolio: [http://localhost:3001](http://localhost:3001)
   - Admin panel: [http://localhost:3001/admin](http://localhost:3001/admin)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes (admin) | Service role key — server-side only, never `NEXT_PUBLIC_`! |
| `GITHUB_TOKEN` | Optional | GitHub personal access token — increases rate limit from 60 to 5,000 req/hr |

Get your Supabase credentials from:  
`https://supabase.com/dashboard/project/_/settings/api`

---

## Admin Dashboard

The admin dashboard (`/admin`) provides a full content management interface:

- **Login**: Session-based authentication with your Supabase admin credentials.
- **Sections managed**: Projects, Experiences, Skills, Tools, Certifications, Spoken Languages, Personal Info, Site Settings.
- **Actions per item**: Edit, toggle visibility, reorder (drag or arrow buttons), delete.
- **Resume Management**: Upload a PDF via drag-and-drop or file picker → stored in Supabase Storage → available as a download button on the public portfolio.

All mutations go through **Next.js Server Actions** (`lib/admin/actions.ts`) using the service role key, ensuring they never expose admin credentials to the browser.

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/admin/[resource]` | GET, POST, PUT, DELETE | Generic CRUD for all content types |
| `/api/admin/resume` | POST, DELETE | Upload / delete resume PDF in Supabase Storage |
| `/api/github` | GET | Proxies GitHub REST API to avoid CORS + add auth |

---

## API Integrations (GitHub)

The portfolio includes two GitHub integration components:

### `GitHubRepos` (`src/app/components/GitHubRepos.tsx`)
Fetches the 6 most recently committed-to public repositories.

- **Endpoints used:**
  - `GET /users/{username}/repos` — fetches all public repos
  - `GET /repos/{username}/{repo}/commits` — gets last commit per repo
- **Dual view modes:** Card grid ↔ compact list (toggle in top-right)
- **Loading/error/empty states** handled gracefully

### `GitHubActivity` (`src/app/components/GitHubActivity.tsx`)
Fetches recent public GitHub events (pushes, PRs, issues, releases).

- **Endpoint:** `GET /users/{username}/events/public`
- Displays event type with icon, repo name, and relative time

Both components use `GITHUB_TOKEN` (if set) to raise the API rate limit.

---

## Adding/Modifying Content

### Via the Admin Dashboard (Recommended)
The easiest way to manage content. Navigate to `/admin`, log in, and use the UI to add, edit, reorder, or hide items.

### Via `src/constants/` (Static/Translation Data)
For **translations** and **static data** not stored in Supabase, edit `src/constants/contants.ts`:

```typescript
// Add a new language translation key
TRANSLATIONS.en.my_new_key = "English text";
TRANSLATIONS.ur.my_new_key = "اردو متن";
```

---

## Development Guidelines

- **Components**: Keep components modular. Use `src/app/components/` for public reusable pieces; `src/app/admin/components/` for admin-only UI.
- **Styling**: Use Tailwind CSS v4 for all styling. Avoid custom CSS unless strictly needed (e.g. base variables in `globals.css`).
- **Animations**: Use `framer-motion` for complex animations. For standard hover/focus states, prefer Tailwind utilities (`transition-all duration-300`).
- **Type Safety**: Always define TypeScript interfaces for new props, API responses, or data structures.
- **Server vs Client**: Admin mutations use Server Actions (`'use server'`). Public data fetching uses the Supabase anon client on the server or in `useEffect`.

See [AGENTS.md](./AGENTS.md) for full coding standards and patterns.

---

## Testing & Build

### Linting
```bash
npm run lint
```

### Manual Testing Checklist

**Frontend:**
- Visit all pages: `/`, `/contact`, `/experience`, `/admin`
- Test contact form with valid and invalid data
- Test admin CRUD operations (add, edit, delete, reorder, toggle visibility)
- Test resume upload, download CTA, and delete
- Verify responsive layouts at 320px, 768px, and 1280px viewport widths
- Test multi-language toggle
- Check accessibility (keyboard navigation, screen reader labels)

**Backend connectivity:**
```bash
# From Backend/ directory:
npm run verify-tables    # Verify all DB tables exist
npm run test-db          # Test Supabase connection
```

### Build for Production
```bash
npm run build    # Compiles into .next/
npm run start    # Starts the production server
```

---

## Deployment

The application is optimized for deployment on **Vercel**.

### Deploying to Vercel
1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and import the repository.
3. Set the **root directory** to `portfolio/`.
4. Add your environment variables in the Vercel project settings.
5. Click **Deploy** — Vercel auto-detects Next.js and configures the build.

### CI/CD
Vercel provides automatic CI/CD on every push to `main`. No custom GitHub Actions are required for basic hosting.

---

## Troubleshooting

- **GitHub Repos not loading**: You may have hit the unauthenticated GitHub API rate limit (60 req/hr). Add a `GITHUB_TOKEN` to `.env.local` to raise it to 5,000 req/hr, or wait an hour.
- **Admin panel shows 401/403**: Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local` (not `NEXT_PUBLIC_`). It is a server-side-only secret.
- **Contact form fails**: Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct and the `contact_messages` table exists with proper RLS.
- **Styles not applying**: Ensure Tailwind class names are correctly spelled. If you added files outside `src/`, add them to the Tailwind `content` array in the config.
- **Hydration Errors**: Usually caused by browser extensions or `window` object usage without `typeof window !== 'undefined'` guard or `useEffect`.
- **Resume upload fails**: Verify `SUPABASE_SERVICE_ROLE_KEY` is set and the `resume_files` bucket exists in Supabase Storage.

---

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Follow the coding standards in [AGENTS.md](./AGENTS.md).
4. Commit your changes using Conventional Commits: `git commit -m 'feat(scope): description'`
5. Push to your branch and open a pull request.

When contributing new text content, ensure you update all translation dictionaries in `src/constants/` to maintain multi-language support.
