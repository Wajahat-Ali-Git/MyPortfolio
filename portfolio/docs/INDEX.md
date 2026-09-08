# Frontend Documentation Index

Complete documentation for the Portfolio Frontend (Next.js).

---

## 📚 Documentation Structure

### Core Documentation
1. **[README.md](./README.md)** 📘 Main Reference
   - Complete frontend documentation
   - Component structure
   - Routing & pages
   - Styling guide
   - State management
   - API integration

2. **[AGENTS.md](./AGENTS.md)** 🤖 Development Guidelines
   - Next.js 16 specific rules
   - Security best practices
   - Component guidelines
   - TypeScript patterns
   - Coding standards
   - Testing guidelines

---

## 🎯 Quick Navigation

### I want to...

#### Get Started
- **Run the frontend** → [README.md](./README.md#-quick-start)
- **Configure environment** → [README.md](./README.md#-environment-variables)
- **Understand project structure** → [README.md](./README.md#-project-structure)

#### Learn About
- **Next.js 16 App Router** → [AGENTS.md](./AGENTS.md#-nextjs-16-specifics)
- **Component patterns** → [AGENTS.md](./AGENTS.md#-component-guidelines)
- **TypeScript usage** → [AGENTS.md](./AGENTS.md#typescript)
- **Styling with Tailwind** → [AGENTS.md](./AGENTS.md#-styling-guidelines)

#### Development
- **Coding standards** → [AGENTS.md](./AGENTS.md#-component-guidelines)
- **Form handling** → [AGENTS.md](./AGENTS.md#-form-handling)
- **State management** → [AGENTS.md](./AGENTS.md#-state-management)
- **Performance tips** → [AGENTS.md](./AGENTS.md#-performance)

#### Security & Best Practices
- **Environment variables** → [AGENTS.md](./AGENTS.md#-security-rules)
- **API integration** → [README.md](./README.md#-api-integration)
- **Error handling** → [AGENTS.md](./AGENTS.md#-common-mistakes-to-avoid)
- **Accessibility** → [AGENTS.md](./AGENTS.md#-accessibility)

---

## 📖 Reading Order

### For New Developers
1. Start with [README.md](./README.md) - Overview & setup
2. Read [AGENTS.md](./AGENTS.md) - Development guidelines
3. Review Next.js 16 documentation in node_modules

### For Contributing
1. Review [AGENTS.md](./AGENTS.md) - Coding standards
2. Check [README.md](./README.md) - Project structure
3. Follow the pre-commit checklist in AGENTS.md

---

## 🔍 Quick Reference

### File Locations

```
portfolio/
├── docs/                        # You are here
│   ├── INDEX.md                # This file
│   ├── README.md               # Frontend docs
│   └── AGENTS.md               # Dev guidelines
│
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Home
│   │   ├── layout.tsx         # Root layout
│   │   ├── contact/           # Contact page
│   │   └── experience/        # Experience page
│   │
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities
│   ├── types/                 # TypeScript types
│   └── constants/             # Constants
│
├── public/                    # Static assets
├── .env.local.example        # Env template
└── next.config.ts            # Next.js config
```

### Quick Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Start production
npm run start

# Lint code
npm run lint
```

### Environment Setup

```bash
# Copy template
cp .env.local.example .env.local

# Edit with your values
nano .env.local

# Start dev server
npm run dev
```

---

## 🎨 Key Concepts

### Next.js 16 App Router
- File-based routing
- Server components by default
- `'use client'` for interactivity
- Server-side data fetching

### Component Structure
```typescript
'use client';  // If using hooks/events

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
# Public (browser)
NEXT_PUBLIC_API_URL=...

# Private (server only)
API_SECRET=...  # No NEXT_PUBLIC_ prefix!
```

---

## 🆘 Getting Help

1. **Check documentation:**
   - [README.md](./README.md) for features & setup
   - [AGENTS.md](./AGENTS.md) for coding guidelines
   - Next.js docs in `node_modules/next/dist/docs/`

2. **Common issues:**
   - Build errors → Check TypeScript errors
   - Style issues → Review Tailwind classes
   - API errors → Check environment variables
   - Routing issues → Review App Router structure

3. **Development tips:**
   - Use TypeScript strict mode
   - Follow component patterns in AGENTS.md
   - Test responsive design
   - Check accessibility

---

## 📝 Documentation Updates

When updating documentation:
- Keep this index current
- Update relevant sections
- Follow guidelines in AGENTS.md
- Link related documents
- Add examples where helpful

---

**Last Updated:** 2026-09-08  
**Maintainer:** Wajahat Ali (@Wajahat-Ali-Git)
