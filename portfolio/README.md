# Portfolio Frontend

Modern portfolio website built with Next.js 16, React 19, and TypeScript.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**Open:** http://localhost:3001

---

## 📚 Documentation

All documentation is organized in the `docs/` folder:

- **[README.md](./docs/README.md)** - Complete frontend documentation
- **[AGENTS.md](./docs/AGENTS.md)** - Development guidelines & rules

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16.x (App Router)
- **React:** v19.2.4
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React, React Icons

---

## 📁 Project Structure

```
portfolio/
├── docs/                     # 📚 All documentation
│   ├── README.md            # Complete docs
│   └── AGENTS.md            # Dev guidelines
│
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout
│   │   ├── contact/        # Contact page
│   │   ├── experience/     # Experience page
│   │   └── components/     # Page components
│   │
│   ├── lib/                # Utilities
│   │   └── supabase.ts    # API client
│   │
│   ├── types/              # TypeScript types
│   └── constants/          # Constants
│
├── public/                  # Static assets
├── .env.local.example      # Environment template
└── next.config.ts          # Next.js config
```

---

## 🔐 Environment Variables

Create `.env.local`:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# GitHub (optional)
GITHUB_TOKEN=xxx
```

See [.env.local.example](./.env.local.example) for complete template.

---

## 🎯 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🌐 Pages

- `/` - Home page with portfolio showcase
- `/contact` - Contact form
- `/experience` - Work experience

---

## 🎨 Styling

Using Tailwind CSS v4 with custom configuration:

- Responsive design (mobile-first)
- Dark theme
- Custom color palette
- Smooth animations with Framer Motion

---

## 📦 Key Dependencies

```json
{
  "next": "16.2.9",
  "react": "19.2.4",
  "framer-motion": "^11.18.2",
  "lucide-react": "^1.18.0",
  "@supabase/supabase-js": "^2.39.3"
}
```

---

## 🧪 Testing

```bash
# Test pages
- Visit http://localhost:3001
- Test /contact form
- Check responsive design
- Test API integration
```

---

## 🚀 Deployment

Recommended platforms:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**

```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

---

## 📄 License

MIT License - See LICENSE file for details

---

**For complete documentation, see the [docs/](./docs/) folder.**
