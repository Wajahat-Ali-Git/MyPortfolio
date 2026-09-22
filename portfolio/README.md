# Portfolio Frontend

Modern portfolio website built with Next.js 16, React 19, and TypeScript.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment template and fill in your values
cp .env.local.example .env.local

# Start development server
npm run dev
```

**Open:** http://localhost:3001

---

## 📚 Documentation

All detailed documentation is in the `docs/` folder:

- **[docs/README.md](./docs/README.md)** — Complete frontend documentation (architecture, features, API, deployment)
- **[docs/AGENTS.md](./docs/AGENTS.md)** — Development guidelines & coding standards for AI agents and contributors
- **[docs/INDEX.md](./docs/INDEX.md)** — Documentation index with quick navigation

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.x (App Router) | Framework & SSR |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | v4 | Styling |
| Framer Motion | 11.x | Animations |
| Supabase JS | 2.x | Database & Storage client |
| Lucide React | 1.x | Icons |
| React Icons | 5.x | Additional icon sets |

---

## 📁 Project Structure

```
portfolio/
├── docs/                           # 📚 All documentation
│   ├── INDEX.md                   # Documentation index
│   ├── README.md                  # Complete frontend docs
│   └── AGENTS.md                  # Dev guidelines & rules
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── page.tsx               # Home page (portfolio showcase)
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css            # Global styles
│   │   ├── contact/               # Contact form page
│   │   ├── experience/            # Experience page
│   │   ├── admin/                 # Admin Dashboard (auth-protected)
│   │   │   ├── page.tsx           # Main admin panel
│   │   │   ├── layout.tsx         # Admin layout with auth guard
│   │   │   ├── AdminAuthContext.tsx # Auth context provider
│   │   │   ├── login/             # Admin login page
│   │   │   └── components/        # Admin UI components
│   │   │       ├── ItemFormModal.tsx        # Add/edit item form
│   │   │       └── ResumeManagementPanel.tsx # Resume upload/manage
│   │   ├── api/                   # Next.js API routes
│   │   │   ├── admin/             # Admin CRUD endpoints
│   │   │   │   ├── [resource]/    # Generic resource handler
│   │   │   │   └── resume/        # Resume file upload/delete
│   │   │   └── github/            # GitHub activity proxy
│   │   └── components/            # Shared public-facing components
│   │       ├── GitHubActivity.tsx
│   │       ├── GitHubRepos.tsx
│   │       ├── SectionHeading.tsx
│   │       ├── SkillBar.tsx
│   │       ├── WorkflowAnimation.tsx
│   │       └── shared.ts
│   │
│   ├── lib/                       # Utilities & integrations
│   │   ├── supabase.ts            # Supabase client (public anon key)
│   │   ├── portfolioData.ts       # Data-fetching helpers for public pages
│   │   └── admin/                 # Admin-only server-side utilities
│   │       ├── actions.ts         # Server Actions for admin mutations
│   │       ├── auth.ts            # Session-based auth helpers
│   │       └── types.ts           # Admin TypeScript type definitions
│   │
│   ├── constants/                 # Static data & translations
│   └── types/                     # Shared TypeScript definitions
│
├── public/                        # Static assets (images, icons)
├── .env.local                     # Local secrets — NOT committed to git
├── .env.local.example             # Environment template — safe to commit
├── next.config.ts                 # Next.js configuration
└── package.json                   # Dependencies & scripts
```

---

## 🔐 Environment Variables

Create `portfolio/.env.local` from the template:

```env
# Supabase (Required for all data fetching)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Admin panel (Required — server-side only, never NEXT_PUBLIC_!)
SUPABASE_SERVICE_ROLE_KEY=xxx

# GitHub API (Optional — increases rate limit to 5000/hr)
GITHUB_TOKEN=xxx
```

See [.env.local.example](./.env.local.example) for the complete annotated template.

---

## 🎯 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3001)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🌐 Pages & Routes

| Route | Description |
|---|---|
| `/` | Home page — hero, projects, skills, experience, certifications, GitHub activity |
| `/contact` | Contact form (submissions saved to Supabase) |
| `/experience` | Detailed experience & resume page |
| `/admin` | Admin dashboard (requires authentication) |
| `/admin/login` | Admin login page |

---

## 🎨 Styling

Uses **Tailwind CSS v4** with a custom dark-mode first design system:
- Fully responsive — mobile-first layouts optimized for all screen sizes
- Dark theme with glassmorphism effects
- Smooth animations via Framer Motion
- Custom color palette and typography

---

## 🧪 Testing

Manual test scripts for backend connectivity are in the `Backend/tests/` folder:

```bash
# From the Backend/ directory:
npm run verify-tables    # Check all DB tables exist
npm run test-db          # Test Supabase & PostgreSQL connections
npm run test-api         # Smoke-test API endpoints
```

For frontend testing:
1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3001` and test all pages
3. Test the contact form with valid/invalid data
4. Test the admin dashboard at `/admin`
5. Verify responsive layouts on mobile and tablet screen sizes

---

## 🚀 Deployment

Recommended platform: **Vercel** (optimized for Next.js)

```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

For Vercel deployment, set the environment variables in the Vercel project settings dashboard.

---

## 📄 License

MIT License — See LICENSE file for details.

---

**For complete documentation, see the [docs/](./docs/) folder.**
